const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add support for additional file extensions
config.resolver.assetExts = [
  ...config.resolver.assetExts,
  'h5',
  'bin',
  'json'
];

// Add support for additional source extensions
config.resolver.sourceExts = [
  ...config.resolver.sourceExts,
  'tsx',
  'ts',
  'jsx',
  'js'
];

// Fix path resolution issues
config.resolver.platforms = ['native', 'web', 'android', 'ios'];

// Ensure proper path handling for Windows
if (process.platform === 'win32') {
  config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];
}

// Add project root and handle symlinks
config.watchFolders = [path.resolve(__dirname)];

module.exports = config; 