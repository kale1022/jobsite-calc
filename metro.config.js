// Extends Expo's Metro config. Keep custom tweaks below the getDefaultConfig call.
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

module.exports = config;
