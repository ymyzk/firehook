const debug = require("debug")("firehook:index");
const firebase = require("firebase");

const { config, loadConfig } = require("./config");
const { runAction } = require("./plugins");

function initialize(callback) {
  const BLANK_VALUE = "-----";
  firebase.initializeApp(config.firebase.api);
  const db = firebase.database();
  const dbValue = db.ref(config.firebase.path);
  let initial = true;

  // Move to plugin config
  const DRY_RUN = !!process.env.DRY_RUN;

  dbValue.on("value", async function(changedSnapshot) {
    if (initial) {
      initial = false;
      return;
    }

    const value = changedSnapshot.val();
    if (value === BLANK_VALUE) {
      return;
    }

    dbValue.set(BLANK_VALUE);

    let [createdAt, target, args] = value.split("/");
    args = args.split(" ");
    debug("requested: %s %s %o", createdAt, target, args);
    callback({ createdAt, target, args });
  });
}

function lookupAction({ target, args }) {
  const argActions = config.mapping[target];
  if (!argActions) {
    debug("cannot find target in the mapping: %s", target);
    return undefined;
  }
  const arg = args[0];
  const actionId = argActions[arg];
  if (!actionId) {
    debug("cannot find action id for the argument: %s", arg);
    return undefined;
  }
  const action = config.actions[actionId];
  if (!action) {
    debug("cannot find action for the id: %s", actionId);
    return undefined;
  }
  return action
}

function main() {
  debug("starting application");
  process.on("unhandledRejection", console.error);
  loadConfig("./config.yaml");
  initialize(function ({ target, args }) {
    const action = lookupAction({ target, args });
    if (!action) return;
    runAction(action);
  });
  debug("started");
}

main();
