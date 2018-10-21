const debug = require("debug")("firehook:plugins:sleep");

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

class SleepPlugin {
  async run(arg) {
    debug("sleeping for %dms", arg);
    await sleep(arg);
  }
}

module.exports = SleepPlugin;
