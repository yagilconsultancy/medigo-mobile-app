import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ChatsScreen from "../screens/Driver/Chat/chats";
import ChatDetailScreen from "../screens/Driver/Chat/chatDetails";

const Stack = createNativeStackNavigator();

const DriverChatDetailsStack: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="ChatDetailScreen" component={ChatDetailScreen} />
    </Stack.Navigator>
  );
};

export default DriverChatDetailsStack;
