import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ChatsScreen from "../screens/Driver/Chat/chats";

const Stack = createNativeStackNavigator();

const DriverChatStack: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="ChatsScreen" component={ChatsScreen} />
    </Stack.Navigator>
  );
};

export default DriverChatStack;
