import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import NotificationsScreen from "../screens/Rider/Notifications/notificationScreen";
import RideCompletedDetails from "../screens/Rider/Notifications/rideCompleted";
import PaymentSuccessfulNotificationDetail from "../screens/Rider/Notifications/paymentSuccessfulNotificationDetail";
import ReceiptScreen from "../screens/Rider/Notifications/receipt";

const Stack = createNativeStackNavigator();

const RiderNotificationStack: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen
        name="NotificationsScreen"
        component={NotificationsScreen}
      />
      <Stack.Screen
        name="RideCompletedDetails"
        component={RideCompletedDetails}
      />
      <Stack.Screen
        name="PaymentSuccessfulNotificationDetail"
        component={PaymentSuccessfulNotificationDetail}
      />
      <Stack.Screen name="ReceiptScreen" component={ReceiptScreen} />
    </Stack.Navigator>
  );
};

export default RiderNotificationStack;
