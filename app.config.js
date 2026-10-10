require("dotenv/config");

const buildProfile = process.env.APP_ENV ?? "development";
const isProductionBuild = buildProfile === "production";
const stripePublishableKeyEnvName = isProductionBuild
  ? "STRIPE_LIVE_PUBLISHABLE_KEY"
  : "STRIPE_TEST_PUBLISHABLE_KEY";
const stripePublishableKey = process.env[stripePublishableKeyEnvName];

if (!stripePublishableKey) {
  throw new Error(
    `Missing ${stripePublishableKeyEnvName} for ${buildProfile ?? "development"} build.`,
  );
}

module.exports = ({ config }) => ({
  ...config,
  name: "Medigo",
  slug: "medigo",
  version: "1.1.0",
  orientation: "portrait",
  icon: "./assets/med.png",
  userInterfaceStyle: "light",
  newArchEnabled: true,

  splash: {
    image: "./assets/splashMed.png",
    resizeMode: "cover",
    backgroundColor: "#1A3B8E",
  },

  ios: {
    bundleIdentifier: "com.abctransportationhealthinc.medigo",
    supportsTablet: false,
    infoPlist: {
      NSLocationWhenInUseUsageDescription:
        "This app uses your location to show your position on the map and calculate routes.",
      ITSAppUsesNonExemptEncryption: false,
    },
    
  },

  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/med.png",
      backgroundColor: "#1A3B8E",
    },

    config: {
      googleMaps: {
        apiKey: process.env.EXPO_PUBLIC_GOOGLE_KEY,
      },
    },

    edgeToEdgeEnabled: true,

    permissions: [
      "ACCESS_COARSE_LOCATION",
      "ACCESS_FINE_LOCATION",
    ],
    blockedPermissions: [
      "android.permission.CAMERA",
      "android.permission.RECORD_AUDIO",
      "android.permission.ACCESS_BACKGROUND_LOCATION",
    ],

    package: "com.abctransportationhealthinc.medigo",
  },

  web: {
    favicon: "./assets/favicon.png",
  },

  plugins: [
    [
      "expo-image-picker",
      {
        photosPermission:
          "MediGo uses your photos so you can add a profile picture or upload documents.",
        cameraPermission:
          "MediGo uses the camera so you can take a profile picture or a photo of a document.",
        microphonePermission: false,
      },
    ],
    [
      "expo-location",
      {
        locationAlwaysAndWhenInUsePermission: false,
        locationAlwaysPermission: false,
        isAndroidBackgroundLocationEnabled: false,
      },
    ],
    ["expo-secure-store"],
    "expo-maps",
    "expo-font",
    "./plugins/withAndroidPhoneOnly",
  ],

  extra: {
    apiBaseUrl: "https://prod-api.getmedigo.com/api/v1",
    expoPublicGoogleKey: process.env.EXPO_PUBLIC_GOOGLE_KEY,
    stripePublishableKey,
    buildProfile,
    eas: {
      projectId: "de6dbdef-a60e-485e-9f27-dee65e56b3dd",
    },
  },

  runtimeVersion: {
    policy: "appVersion",
  },

  updates: {
    url: "https://u.expo.dev/de6dbdef-a60e-485e-9f27-dee65e56b3dd",
    checkAutomatically: "ON_LOAD",
    fallbackToCacheTimeout: 30000,
  },
});
