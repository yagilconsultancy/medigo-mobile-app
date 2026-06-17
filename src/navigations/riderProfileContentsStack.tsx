import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import EmergencyContactsScreen from "../screens/Rider/Profile/emergencyContacts";
import NotificationSettingsScreen from "../screens/Rider/Profile/notificationSettings";
import PersonalInformationScreen from "../screens/Rider/Profile/personalInformation";
import EditProfileScreen from "../screens/Rider/Profile/editPersonalInformation";
import PaymentMethodsScreen from "../screens/Rider/Profile/paymentMethods";
import SavedLocationsScreen from "../screens/Rider/Profile/savedLocations";
import AddLocationScreen from "../screens/Rider/Profile/addLocation";
import LocationDetailsScreen from "../screens/Rider/Profile/locationDetails";
import SafetyCenterScreen from "../screens/Rider/Profile/safetyCenter";
import EditLocationScreen from "../screens/Rider/Profile/editSavedLocation";
import LiveChatScreen from "../screens/Rider/Profile/contactSupport";

const Stack = createNativeStackNavigator();

const RiderProfileContentsStack: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen
        name="EmergencyContactsScreen"
        component={EmergencyContactsScreen}
      />
      <Stack.Screen
        name="NotificationSettingsScreen"
        component={NotificationSettingsScreen}
      />
      <Stack.Screen
        name="PersonalInformationScreen"
        component={PersonalInformationScreen}
      />
      <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
      <Stack.Screen
        name="PaymentMethodsScreen"
        component={PaymentMethodsScreen}
      />
      <Stack.Screen
        name="SavedLocationsScreen"
        component={SavedLocationsScreen}
      />
      <Stack.Screen name="AddLocationScreen" component={AddLocationScreen} />
      <Stack.Screen name="EditLocationScreen" component={EditLocationScreen} />
      <Stack.Screen
        name="LocationDetailsScreen"
        component={LocationDetailsScreen}
      />
      <Stack.Screen name="SafetyCenterScreen" component={SafetyCenterScreen} />
      <Stack.Screen name="LiveChatScreen" component={LiveChatScreen} />
    </Stack.Navigator>
  );
};

export default RiderProfileContentsStack;
