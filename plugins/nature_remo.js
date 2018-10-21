const axios = require("axios");

// const ENDPOINT = config.natureRemo.endpoint || "https://api.nature.global";
const ENDPOINT = "https://api.nature.global";

class NatureRemoPlugin {
  constructor({ accessToken, signals }) {
    this.accessToken = accessToken;
    this.signals = signals;
  }

  async run(arg) {
    const signal = this.signals[arg];
    await axios({
      method: "post",
      url: `${ENDPOINT}/1/signals/${signal}/send`,
      headers: {
        authorization: `Bearer ${this.accessToken}`,
      },
    });
  }
}

module.exports = NatureRemoPlugin;
