import "react-native-get-random-values";
import React, { useEffect, useState } from "react";
import Toast from "react-native-toast-message";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import AuthStack from "./src/navigations/authStack";
import RiderMainStack from "./src/navigations/RiderMainStack";
import DriverMainStack from "./src/navigations/driverMainStack";
import RiderRideStack from "./src/navigations/riderRideStack";
import RiderHistoryStack from "./src/navigations/riderHistoryStack";
import DriverRideStack from "./src/navigations/driverRideStack";
import DriverChatStack from "./src/navigations/driverChatStack";
import DriverChatDetailsStack from "./src/navigations/driverChatDetailsStack";
import DriverWalletStack from "./src/navigations/driverWalletStack";
import DriverWalletDetailsStack from "./src/navigations/driverWalletDetailsStack";
import DriverTripsStack from "./src/navigations/driverTripsStack";
import RiderProfileStack from "./src/navigations/riderProfileStack";
import DriverProfileStack from "./src/navigations/driverProfileStack";
import RiderProfileContentsStack from "./src/navigations/riderProfileContentsStack";
import DriverProfileContentsStack from "./src/navigations/driverProfileContentsStack";
import RiderRideDetailsStack from "./src/navigations/riderRideDetailsStack";
import DriverRideDetailsStack from "./src/navigations/driverRideDetailsStack";
import RiderNotificationStack from "./src/navigations/riderNotificationStack";
import ThemeProvider from "./src/context/themeProvider";
import { AuthProvider } from "./src/context/authContext";
import { toastConfig } from "./src/components/toastConfig";
import NetInfo from "@react-native-community/netinfo";
import { enableScreens } from "react-native-screens";
import { SafeAreaProvider } from "react-native-safe-area-context";
import ModalComponent from "./src/components/modals/modal";
import { Text, TextInput } from "react-native";
import { QueryProvider } from "./src/providers/queryProvider";
import { useRouteStore } from "./src/store/useRouteStore";
import RouteHeaderCard from "./src/components/map/routeHeaderCard";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useOTAUpdate } from "./src/hooks/useOTAUpdates";
import { navigationRef } from "./src/utils/navigationRef";
import Navbar from "./src/components/navbar";
import DriverNavbar from "./src/components/driverNavbar";
import { storage } from "./src/utils/storage";
import { syncUserProfile } from "./src/utils/syncUserProfile";
import { useUserStore } from "./src/store/userStore";
import { StripeProvider } from "@stripe/stripe-react-native";
import Constants from "expo-constants";

enableScreens(true);

SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();

const Tab = createBottomTabNavigator();
const stripePublishableKey =
  Constants.expoConfig?.extra?.stripePublishableKey ?? "";

const RiderMainTabs = () => (
  <Tab.Navigator
    tabBar={(props) => <Navbar {...props} />}
    screenOptions={{ headerShown: false }}
  >
    <Tab.Screen name="Main" component={RiderMainStack} />
    <Tab.Screen name="RiderRideStack" component={RiderRideStack} />
    <Tab.Screen name="RiderHistoryStack" component={RiderHistoryStack} />
    <Tab.Screen name="RiderProfileStack" component={RiderProfileStack} />
  </Tab.Navigator>
);

const DriverMainTabs = () => (
  <Tab.Navigator
    tabBar={(props) => <DriverNavbar {...props} />}
    screenOptions={{ headerShown: false }}
  >
    <Tab.Screen name="DriverMain" component={DriverMainStack} />
    <Tab.Screen name="DriverRideStack" component={DriverRideStack} />
    <Tab.Screen name="DriverTripsStack" component={DriverTripsStack} />
    <Tab.Screen name="DriverChatStack" component={DriverChatStack} />
    <Tab.Screen name="DriverWalletStack" component={DriverWalletStack} />
    <Tab.Screen name="DriverProfileStack" component={DriverProfileStack} />
  </Tab.Navigator>
);

console.log("APP_ENV", stripePublishableKey);

const AppNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Auth" component={AuthStack} />
      <Stack.Screen name="RiderMainTabs" component={RiderMainTabs} />
      <Stack.Screen name="DriverMainTabs" component={DriverMainTabs} />
      <Stack.Screen
        name="RiderNotificationStack"
        component={RiderNotificationStack}
      />
      <Stack.Screen
        name="RiderRideDetailsStack"
        component={RiderRideDetailsStack}
      />
      <Stack.Screen
        name="DriverRideDetailsStack"
        component={DriverRideDetailsStack}
      />
      <Stack.Screen
        name="DriverWalletDetailsStack"
        component={DriverWalletDetailsStack}
      />
      <Tab.Screen
        name="DriverChatDetailsStack"
        component={DriverChatDetailsStack}
      />
      <Stack.Screen
        name="RiderProfileContentsStack"
        component={RiderProfileContentsStack}
      />
      <Stack.Screen
        name="DriverProfileContentsStack"
        component={DriverProfileContentsStack}
      />
    </Stack.Navigator>
  );
};

(Text as any).defaultProps = (Text as any).defaultProps || {};
(Text as any).defaultProps.allowFontScaling = false;

(TextInput as any).defaultProps = (TextInput as any).defaultProps || {};
(TextInput as any).defaultProps.allowFontScaling = false;

const App: React.FC = () => {
  useOTAUpdate();
  const [fontsLoaded] = useFonts({
    Regular: require("./assets/fonts/Inter_18pt-Regular.ttf"),
    Medium: require("./assets/fonts/Inter_18pt-Medium.ttf"),
    Bold: require("./assets/fonts/Inter_24pt-Bold.ttf"),
    SemiBold: require("./assets/fonts/Inter_18pt-SemiBold.ttf"),
  });
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isReady, setIsReady] = useState(false);
  const { isVisible, pickup, destination, hideRoute } = useRouteStore();
  const { user } = useUserStore();

  /** 🌐 INTERNET LISTENER */
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected ?? true);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync().catch(() => {});
      setIsReady(true);
    }
  }, [fontsLoaded]);

  useEffect(() => {
    const init = async () => {
      const token = await storage.getToken();
      if (token && user?.id) {
        syncUserProfile();
      }
    };

    init();
  }, [user?.user_id]);

  if (!isReady || !fontsLoaded) return null;

  return (
    <QueryProvider>
      <StripeProvider publishableKey={stripePublishableKey}>
        <AuthProvider>
          <SafeAreaProvider>
            <ThemeProvider>
              <GestureHandlerRootView style={{ flex: 1 }}>
                <NavigationContainer ref={navigationRef}>
                  {isConnected === false && (
                    <ModalComponent
                      visible
                      onClose={() => {}}
                      title="No internet connection"
                    >
                      <Text style={{ marginTop: 16 }}>
                        Please check your connection and try again.
                      </Text>
                    </ModalComponent>
                  )}

                  <AppNavigator />
                </NavigationContainer>
                <RouteHeaderCard
                  isVisible={isVisible}
                  pickup={pickup}
                  destination={destination}
                  onClose={hideRoute}
                />
                <Toast config={toastConfig} />
              </GestureHandlerRootView>
            </ThemeProvider>
          </SafeAreaProvider>
        </AuthProvider>
      </StripeProvider>
    </QueryProvider>
  );
};

export default App;
