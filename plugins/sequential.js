const debug = require("debug")("firehook:plugins:sequential");

const { runAction } = require("../plugins");

class SequentialPlugin {
  async run(...actions) {
    for (const action of actions) {
      await runAction(action);
    }
  }
}

module.exports = SequentialPlugin;
