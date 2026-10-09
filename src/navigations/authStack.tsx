import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SplashScreen from "../screens/auth/splashScreen";
import RiderRegistrationFlow from "../screens/auth/riderRegistrationFlow";
import ReviewAndAccept from "../screens/auth/reviewAndAccept";
import PaymentMethod from "../screens/auth/paymentMethod";
import Login from "../screens/auth/login";
import AddInformation from "../screens/auth/addInformation";
import ForgotPassword from "../screens/auth/forgotPassword";
import ResetPasswordScreen from "../screens/auth/resetPassword";
import PrivacyPolicyScreen from "../screens/auth/privacyPolicyScreen";
import TermsOfServiceScreen from "../screens/auth/termsOfService";
import LocationConsentScreen from "../screens/auth/dataAndLocationConsent";
import WelcomeDriverScreen from "../screens/auth/welcomeDriver";
import DriverRegistrationFlow from "../screens/auth/driverRegistrationFlow";
import DriverActivation from "../screens/auth/driverActivation";

const Stack = createNativeStackNavigator();

const AuthStack: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen
        name="RiderRegistrationFlow"
        component={RiderRegistrationFlow}
      />
      <Stack.Screen name="ReviewAndAccept" component={ReviewAndAccept} />
      <Stack.Screen name="PaymentMethod" component={PaymentMethod} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="AddInformation" component={AddInformation} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen
        name="ResetPasswordScreen"
        component={ResetPasswordScreen}
      />
      <Stack.Screen
        name="PrivacyPolicyScreen"
        component={PrivacyPolicyScreen}
      />
      <Stack.Screen
        name="TermsOfServiceScreen"
        component={TermsOfServiceScreen}
      />
      <Stack.Screen
        name="LocationConsentScreen"
        component={LocationConsentScreen}
      />
      <Stack.Screen
        name="WelcomeDriverScreen"
        component={WelcomeDriverScreen}
      />
      <Stack.Screen
        name="DriverRegistrationFlow"
        component={DriverRegistrationFlow}
      />
      <Stack.Screen name="DriverActivation" component={DriverActivation} />
    </Stack.Navigator>
  );
};

export default AuthStack;
