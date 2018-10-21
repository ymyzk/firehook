const fs = require("fs");

const debug = require("debug")("firehook:config");
const yaml = require("js-yaml");

const config = {};

function loadConfig(file) {
  debug("loading file from %s", file);
  Object.assign(config, yaml.safeLoad(fs.readFileSync(file, "utf8")));
  debug("loaded");
}

module.exports = {
  config,
  loadConfig,
};
