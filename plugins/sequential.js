const debug = require("debug")("firehook:plugins:sequential");

const { runAction } = require("../plugins");

class SequentialPlugin {
  async run(...actions) {
    for (let i = 0; i < actions.length; i++) {
      const action = actions[i];
      debug("running sequence of actions: %d/%d", i + 1, actions.length);
      await runAction(action);
    }
  }
}

module.exports = SequentialPlugin;
