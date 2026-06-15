const path = require("path");

const { getDefaultConfig } = require("expo/metro-config");
const exclusionList =
  require("metro-config/private/defaults/exclusionList").default;

const projectRoot = __dirname;

const config = getDefaultConfig(projectRoot);

const mobileNodeModules = path.join(projectRoot, "mobile", "node_modules");

config.resolver.blockList = exclusionList([
  /mobile\/node_modules\/.*/,
  new RegExp(`${mobileNodeModules.replace(/[/\\]/g, "[/\\\\]")}[/\\\\].*`),
]);

module.exports = config;
