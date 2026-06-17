import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, Easing } from "react-native";
import useTheme from "../../hooks/useThemes";

export const SkeletonBone = ({
  width,
  height,
  borderRadius = 8,
  style,
}: {
  width: number;
  height: number;
  borderRadius?: number;
  style?: any;
}) => {
  const { colors } = useTheme();
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
  }, []);

  const safeWidth = typeof width === "number" ? width : 0;

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-safeWidth, safeWidth],
  });

  return (
    <View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: colors.surfaceSecondary,
          overflow: "hidden",
        },
        style,
      ]}
    >
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: "rgba(255,255,255,0.2)",
            transform: [{ translateX }],
          },
        ]}
      />
    </View>
  );
};
