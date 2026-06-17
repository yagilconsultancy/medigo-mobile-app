import React from "react";
import { View, Text, StyleSheet } from "react-native";
import useTheme from "../../hooks/useThemes";
import { FONT_SIZES } from "../../constants/sizes";

interface PinDisplayProps {
  pin?: string;
}

const PinDisplay: React.FC<PinDisplayProps> = ({ pin = "" }) => {
  const { colors } = useTheme();
  const digits = pin.split("");

  return (
    <View style={styles.wrapper}>
      {digits.map((digit, index) => (
        <View
          key={index}
          style={[
            styles.box,
            {
              borderColor: colors.buttonPrimary,
              backgroundColor: colors.surfacePrimary,
            },
          ]}
        >
          <Text style={[styles.digit, { color: colors.titleText }]}>
            {digit}
          </Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginTop: 16,
  },
  box: {
    width: 45,
    height: 45,
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  digit: {
    fontSize: FONT_SIZES.SUBTITLE,
    fontFamily: "Regular",
  },
});

export default PinDisplay;
