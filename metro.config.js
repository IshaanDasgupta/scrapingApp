const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const exclusionList = require('metro-config/src/defaults/exclusionList');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */

const config = getDefaultConfig(__dirname);

// exclusionList is a function that takes an array of regexes and combines
// them with the default exclusions to return a single regex.

module.exports = {
  ...config,
  resolver: {
    ...config.resolver,
    blockList: exclusionList([/#current-cloud-backend\/.*/]),
  },
};
