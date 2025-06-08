const { getDefaultConfig } = require("expo/metro-config");
const exclusionList = require("metro-config/src/defaults/exclusionList");
const path = require("path");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

config.resolver = {
  ...config.resolver,
  blacklistRE: exclusionList([
    /node_modules[/\\]ws[/\\].*/,
    /node_modules[/\\]events[/\\].*/,
    /node_modules[/\\]stream[/\\].*/,
    /node_modules[/\\]crypto[/\\].*/,
  ]),
  extraNodeModules: {
    ...config.resolver.extraNodeModules,
    ws: path.resolve(__dirname, "shims/empty.js"),
    stream: path.resolve(__dirname, "shims/empty.js"),
    events: path.resolve(__dirname, "shims/empty.js"),
    crypto: path.resolve(__dirname, "shims/empty.js"),
    // DO NOT add 'buffer' here!
  },
};

module.exports = withNativeWind(config, { input: "./global.css" });