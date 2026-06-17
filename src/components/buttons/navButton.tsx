import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { TouchableOpacity } from "react-native";
import Toast from "react-native-toast-message";
import { useUserStore } from "../../store/userStore";
import { ReactNode } from "react";

interface NavButtonProps {
  navLocation: string;
  content: ReactNode;
  currentRouteName: string; // Keep this for active styling logic if needed
}

const NavButton: React.FC<NavButtonProps> = ({ navLocation, content }) => {
  // Use the hook here instead of passing it as a prop
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { user } = useUserStore();

  const handlePress = () => {
    if (navLocation === "Profile" && !user?.email) {
      Toast.show({
        type: "setUpProfile",
        onPress: () => {
          Toast.hide();
          navigation.navigate("Profile", {
            screen: "ProfileSetupScreen",
            params: { onboarded: true, phone: user?.phone_number },
          });
        },
        autoHide: false,
      });
    } else {
      navigation.navigate(navLocation);
    }
  };

  return <TouchableOpacity onPress={handlePress}>{content}</TouchableOpacity>;
};

export default NavButton;
