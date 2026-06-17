import React from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import BackArrow from "../../../assets/icons/backArrow";
import useTheme from "../../hooks/useThemes";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { FONT_SIZES } from "../../constants/sizes";
import { ChevronLeft } from "lucide-react-native";

const BackButton: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={styles.backButton}
      onPress={() => navigation.goBack()}
      hitSlop={30}
    >
      <ChevronLeft color="#1A1C1E" size={24} />
    </TouchableOpacity>
  );
};

export default BackButton;

const styles = StyleSheet.create({
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF", // Required for shadows to show up
    justifyContent: "center",
    alignItems: "center",

    // Android Shadow
    elevation: 4,

    // iOS Shadow
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,

    // Border (from design)
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
});
