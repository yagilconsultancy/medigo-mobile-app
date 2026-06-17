import * as Updates from 'expo-updates';
import { useEffect } from 'react';
import { Alert } from 'react-native';

export const useOTAUpdate = () => {
  useEffect(() => {
    if (__DEV__) return; // Don't run in development

    const checkUpdates = async () => {
      try {
        const update = await Updates.checkForUpdateAsync();
        
        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          
          Alert.alert(
            "Update Available",
            "A new version of the app is ready. Restart now to apply?",
            [
              { text: "Later", style: "cancel" },
              { 
                text: "Restart", 
                onPress: async () => await Updates.reloadAsync() 
              }
            ]
          );
        }
      } catch (error) {
        // Log to Sentry/Bugsnag
        console.error("OTA Check failed:", error);
      }
    };

    checkUpdates();
  }, []);
};