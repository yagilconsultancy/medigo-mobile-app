const { withAndroidManifest } = require("@expo/config-plugins");

const SUPPORTS_SCREENS = {
  "android:smallScreens": "true",
  "android:normalScreens": "true",
  "android:largeScreens": "false",
  "android:xlargeScreens": "false",
};

module.exports = function withAndroidPhoneOnly(config) {
  return withAndroidManifest(config, (config) => {
    const manifest = config.modResults.manifest;
    manifest["supports-screens"] = [{ $: SUPPORTS_SCREENS }];

    return config;
  });
};
