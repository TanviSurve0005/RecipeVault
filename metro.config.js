const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Multiple fixes combined
config.resolver = {
  ...config.resolver,
  resolverMainFields: ['react-native', 'browser', 'main'],
  extraNodeModules: {
    ...config.resolver.extraNodeModules,
    './camelCaseProperty': require.resolve('css-in-js-utils/lib/camelCaseProperty')
  }
};

module.exports = config;