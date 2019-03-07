const { AccessoryTypes, TradfriClient } = require("node-tradfri-client");

class TradfriPlugin {
  constructor({ host, identity, psk }) {
    this.host = host;
    this.identity = identity;
    this.psk = psk;
  }

  async run(arg) {
    try {
      const tradfri = new TradfriClient(this.host);
      // const { identity, psk } = await tradfri.authenticate(this.securityCode);
      await tradfri.connect(this.identity, this.psk);
      tradfri.on("device updated", async (device) => {
        if (device.type === AccessoryTypes[arg.type]) {
          const duration = 1500 + (arg.transitionTime ? arg.transitionTime  * 1000 : 0);
          await tradfri.operateLight(device, arg.operation);
          setTimeout(() => tradfri.destroy(), duration);
          return;
        }
      }).observeDevices();
    } catch (e) {
      console.error(e);
    }
  }
}

module.exports = TradfriPlugin;
