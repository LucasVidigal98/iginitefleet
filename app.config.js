import * as dotenv from 'dotenv';

dotenv.config();

module.exports = {
  "expo": {
    "name": "iginitefleet",
    "slug": "iginitefleet",
    "scheme": "iginitefleet",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "dark",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "cover",
      "backgroundColor": "#202024"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.lukasfvidigal.ignitefleet",
      "config": {
        "googleMapsApiKey": process.env.GOOGLE_MAPS_API_KEY
      },
      "infoPlist": {
        "UIBackgorundModes": ['location']
      }
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#202024"
      },
      "package": "com.lukasfvidigal.ignitefleet",
      "permissions": [
        'ACCESS_FINE_LOCATION',
        'ACCESS_COARSE_LOCATION',
        'ACCESS_BACKGROUD_LOCATION'
      ],
      "config": {
        "googleMaps": {
          "apiKey": process.env.GOOGLE_MAPS_API_KEY
        }
      }
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "plugins": [
      [
        "expo-location",
        {
          "locationAlwaysAndWhenInUsePermission": "Allow $(PRODUCT_NAME) to use your location."
        }
      ]
    ]
  }
}
