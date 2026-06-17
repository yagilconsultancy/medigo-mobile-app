import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DriverPersonalInformationScreen from "../screens/Driver/Profile/driverPersonalInformation";
import EditDriverPersonalInfo from "../screens/Driver/Profile/editDriverPersonalInformation";
import VehicleDetails from "../screens/Driver/Profile/vehicleDetails";
import EditVehicleDetails from "../screens/Driver/Profile/editVehicleDetails";
import DocumentsScreen from "../screens/Driver/Profile/documents";
import PayoutMethods from "../screens/Driver/Profile/payoutMethods";
import HelpCenter from "../screens/Driver/Profile/helpCenter";
import ContactSupport from "../screens/Driver/Profile/contactSupport";
import SafetyCenter from "../screens/Driver/Profile/safetyCenter";
import NotificationsScreen from "../screens/Driver/Profile/notifications";
import PrivacySecurityScreen from "../screens/Driver/Profile/privacy";
import AppSettings from "../screens/Driver/Profile/appSettings";
import ChangePassword from "../screens/Driver/Profile/changePassword";

const Stack = createNativeStackNavigator();

const DriverProfileContentsStack: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen
        name="DriverPersonalInformationScreen"
        component={DriverPersonalInformationScreen}
      />
      <Stack.Screen
        name="EditDriverPersonalInfo"
        component={EditDriverPersonalInfo}
      />
      <Stack.Screen name="VehicleDetails" component={VehicleDetails} />
      <Stack.Screen name="EditVehicleDetails" component={EditVehicleDetails} />
      <Stack.Screen name="DocumentsScreen" component={DocumentsScreen} />
      <Stack.Screen name="PayoutMethods" component={PayoutMethods} />
      <Stack.Screen name="HelpCenter" component={HelpCenter} />
      <Stack.Screen name="ContactSupport" component={ContactSupport} />
      <Stack.Screen name="SafetyCenter" component={SafetyCenter} />
      <Stack.Screen
        name="NotificationsScreen"
        component={NotificationsScreen}
      />
      <Stack.Screen
        name="PrivacySecurityScreen"
        component={PrivacySecurityScreen}
      />
      <Stack.Screen name="AppSettings" component={AppSettings} />
      <Stack.Screen name="ChangePassword" component={ChangePassword} />
    </Stack.Navigator>
  );
};

export default DriverProfileContentsStack;
