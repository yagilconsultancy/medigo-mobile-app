import { Animated, StyleSheet, View, Easing, Image } from "react-native";
import useTheme from "../../hooks/useThemes";
import { useEffect, useRef } from "react";

interface MarkerProps {
  location: string;
}

const LocationMarker: React.FC<MarkerProps> = ({ location }) => {
  const { colors } = useTheme();
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 3,
          duration: 2000,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const pulseOpacity = pulseAnim.interpolate({
    inputRange: [1, 3],
    outputRange: [0.6, 0],
  });

  return (
    <View style={styles.wrapper}>
      {/* Pulse: Centered exactly at the middle of 100x100 */}
      <Animated.View
        style={[
          styles.pulse,
          {
            backgroundColor:
              location === "pickup" ? colors.krGreen : colors.red,
            transform: [{ scale: pulseAnim }],
            opacity: pulseOpacity,
          },
        ]}
      />
      <Image
        source={
          location === "pickup"
            ? require("../../../assets/images/3dLocation.png")
            : require("../../../assets/images/red3dLocation.png")
        }
        style={{
          width: 40,
          height: 40,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  pulse: {
    position: "absolute",
    width: 10,
    height: 10,
    borderRadius: 15,
    top: 30,
  },
});

export default LocationMarker;
