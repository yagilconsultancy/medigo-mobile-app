import React, { useContext } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import useTheme from "../../hooks/useThemes";
import { TripBookingContext } from "../../context/tripbookingContext";

interface FloatingBackButtonProps {
  top?: number;
  left?: number;
}

const FloatingBackButton: React.FC<FloatingBackButtonProps> = ({
  top = 60,
  left = 20,
}) => {
  const { colors } = useTheme();
  const { handleBack } = useContext(TripBookingContext);

  return (
    <TouchableOpacity
      onPress={handleBack}
      style={[
        styles.backButtonContainer,
        {
          top,
          left,
          backgroundColor: colors.surfacePrimary,
        },
      ]}
    >
      <MaterialIcons
        name="keyboard-backspace"
        size={22}
        color={colors.titleText}
      />
    </TouchableOpacity>
  );
};

export default FloatingBackButton;

const styles = StyleSheet.create({
  backButtonContainer: {
    position: "absolute",
    width: 32,
    height: 32,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});
