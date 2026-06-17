import React, { useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Animated,
  Easing,
  Image,
  Dimensions,
  ColorValue,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import useTheme from "../../hooks/useThemes";
import LocationMarker from "./locationMarker";

const { width } = Dimensions.get("window");

const MapPlaceholder = () => {
  const { theme } = useTheme();
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    /* Shimmer */
    Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 1600,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const shimmerTranslate = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-width, width],
  });

  const shimmerColors: readonly [ColorValue, ColorValue, ColorValue] =
    theme === "dark"
      ? ["transparent", "rgba(255,255,255,0.06)", "transparent"]
      : ["transparent", "rgba(255,255,255,0.35)", "transparent"];

  return (
    <View style={styles.container}>
      {/* MAP BACKGROUND IMAGE */}
      <Image
        source={
          theme === "dark"
            ? require("../../../assets/images/mapPlaceholderDark.png")
            : require("../../../assets/images/mapPlaceholderWhite.png")
        }
        style={[
          StyleSheet.absoluteFill,
          {
            width: "100%",
            height: "100%",
          },
        ]}
      />

      {/* SHIMMER OVERLAY */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.shimmerContainer,
          {
            transform: [{ translateX: shimmerTranslate }, { rotate: "-15deg" }],
          },
        ]}
      >
        <LinearGradient
          colors={shimmerColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.shimmer}
        />
      </Animated.View>

      <View
        style={{
          margin: 32,
        }}
      >
        <LocationMarker location="pickup" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "hidden",
  },

  shimmerContainer: {
    position: "absolute",
    top: "-50%",
    left: "-50%",
    width: "200%",
    height: "200%",
  },

  shimmer: {
    width: "100%",
    height: "100%",
  },

  markerContainer: {
    position: "absolute",
    top: "40%",
    left: "25%",
    zIndex: 10,
  },

  pulse: {
    position: "absolute",
    width: 40,
    height: 40,
    borderRadius: 20,
  },

  marker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderBottomLeftRadius: 0,
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
  },

  markerInner: {
    width: 16,
    height: 16,
    backgroundColor: "white",
    borderRadius: 8,
  },

  markerShadow: {
    position: "absolute",
    bottom: -6,
    left: "50%",
    marginLeft: -15,
    width: 30,
    height: 8,
    borderRadius: 15,
    backgroundColor: "rgba(0,0,0,0.25)",
  },
});

export default MapPlaceholder;
