const { AccessoryTypes, TradfriClient } = require("node-tradfri-client");

class TradfriPlugin {
  constructor({ host, securityCode }) {
    this.host = host;
    this.securityCode = securityCode;
  }

  async run(arg) {
    try {
      const tradfri = new TradfriClient(this.host);
      const { identity, psk } = await tradfri.authenticate(this.securityCode);
      await tradfri.connect(identity, psk);
      tradfri.on("device updated", async (device) => {
        if (device.type === AccessoryTypes[arg.type]) {
          const duration = 1000 + (arg.duration ? arg.duration * 1000 : 0);
          await tradfri.operateLight(device, arg.operation);
          setTimeout(() => tradfri.destroy(), duration);
        }
      }).observeDevices();
    } catch (e) {
      console.error(e);
    }
  }
}

module.exports = TradfriPlugin;
