const debug = require("debug")("firehook:plugins");

const { config } = require("../config");

const PLUGINS = {
  actors: {},
};

function loadActor(actorId) {
  if (actorId in PLUGINS.actors) {
    debug("using actor cache: %s", actorId);
    return PLUGINS.actors[actorId];
  }
  debug("loading actor plugin: %s", actorId);
  const ActorClass = require(`./${actorId}`);
  const actor = new ActorClass(config.plugins.actors[actorId]);
  debug("loaded actor plugin: %s", actorId);
  PLUGINS.actors[actorId] = actor;
  return actor;
}

async function runAction(action) {
  const { actor, args } = action;
  debug("running action: %o", action);
  const actorInstance = loadActor(actor);
  if (Array.isArray(args)) {
    return await actorInstance.run(...args);
  } else if (typeof args === "string" || typeof args === "number" || typeof args === "object") {
    return await actorInstance.run(args);
  } else {
    debug("unsupported type of args");
  }
}

module.exports = {
  runAction,
};
