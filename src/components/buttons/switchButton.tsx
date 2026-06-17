import React, { useEffect, useRef } from "react";
import { TouchableOpacity, Animated, StyleSheet } from "react-native";
import useTheme from "../../hooks/useThemes";

interface CustomSwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;

  width?: number;
  height?: number;
  padding?: number;

  activeColor?: string;
  inactiveColor?: string;
  thumbColor?: string;
}

const SwitchButton: React.FC<CustomSwitchProps> = ({
  value,
  onValueChange,

  width = 52,
  height = 28,
  padding = 3,
}) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const { colors } = useTheme();
  const thumbSize = height - padding * 2;
  const maxTranslate = width - thumbSize - padding * 2;

  useEffect(() => {
    Animated.spring(translateX, {
      toValue: value ? maxTranslate : 0,
      useNativeDriver: true,
      damping: 18,
      stiffness: 180,
    }).start();
  }, [value]);

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => onValueChange(!value)}
      style={[
        styles.container,
        {
          width: 52,
          height: 26,
          padding: 4,
          borderRadius: 52 / 2,
          backgroundColor: value ? colors.krGreen : colors.stroke,
        },
      ]}
    >
      <Animated.View
        style={[
          {
            width: thumbSize,
            height: thumbSize,
            borderRadius: thumbSize / 2,
            backgroundColor: "#ffffff",
            transform: [{ translateX }],
          },
        ]}
      />
    </TouchableOpacity>
  );
};

export default SwitchButton;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
  },
});
