const crypto = require("crypto");
const https = require("https");

const axios = require("axios");
const debug = require("debug")("firehook:plugins:regza");

class RegzaPlugin {
  constructor({ host, user, pass }) {
    this.host = host;
    this.user = user;
    this.pass = pass;
  }

  md5sum(str) {
    return crypto.createHash('md5').update(str, 'binary').digest('hex');
  }

  async run(arg) {
    switch (arg) {
      case "power": {
        const url = "/remote/remote.htm?key=40BF12";
        const fullUrl = `http://${this.host}${url}`;
        await this.sendRequest(url, fullUrl);
        break;
      }
      case "power_on": {
        const status = await this.getPowerStatus();
        if (status) {
          debug("power is already on. skipping.");
          break;
        };
        const url = "/remote/remote.htm?key=40BF12";
        const fullUrl = `http://${this.host}${url}`;
        await this.sendRequest(url, fullUrl);
        break;
      }
      case "power_off": {
        const status = await this.getPowerStatus();
        if (!status) {
          debug("power is already off. skipping.");
          break;
        };
        const url = "/remote/remote.htm?key=40BF12";
        const fullUrl = `http://${this.host}${url}`;
        await this.sendRequest(url, fullUrl);
        break;
      }
    }
  }

  async getPowerStatus() {
    const url = "/v2/remote/play/status";
    const fullUrl = `https://${this.host}:4430${url}`;
    const res = await this.sendRequest(url, fullUrl);
    const contentType = res.data.content_type;
    if (!contentType) return false;
    return contentType !== "other";
  }

  async sendRequest(url, fullUrl) {
    const httpsAgent = new https.Agent({
      rejectUnauthorized: false,
    });
    const res = await axios({
      url: fullUrl,
      httpsAgent,
      validateStatus: function (status) {
        return status === 401;
      },
    });
    const digestHeader = res.headers["www-authenticate"];
    const realm = digestHeader.match(/realm="([^"]+)"/)[1];
    const nonce = digestHeader.match(/nonce="([^"]+)"/)[1];
    const a1 = this.md5sum(`${this.user}:${realm}:${this.pass}`);
    const a2 = this.md5sum(`GET:${url}`);
    const nc = "00000001";
    const cnonce = "abc27321496dfe31"
    const response = this.md5sum(`${a1}:${nonce}:${nc}:${cnonce}:auth:${a2}`);
    return axios({
      url: fullUrl,
      httpsAgent,
      headers: {
        authorization: `Digest username="${this.user}", realm="${realm}", nonce="${nonce}", uri="${url}", qop=auth, nc=${nc}, cnonce="${cnonce}", response="${response}"`,
      },
    });
  }
}

module.exports = RegzaPlugin;
