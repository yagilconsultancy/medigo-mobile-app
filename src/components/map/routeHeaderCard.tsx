import React, { useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CloseIcon from "../../../assets/icons/close";
import useTheme from "../../hooks/useThemes";
import { commonStyles } from "../../styles/commonStyles";
import { FONT_SIZES } from "../../constants/sizes";

interface RouteCardProps {
  isVisible: boolean;
  pickup: string;
  destination: string;
  onClose: () => void;
}

const RouteHeaderCard = ({
  isVisible,
  pickup,
  destination,
  onClose,
}: RouteCardProps) => {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const commonStyling = commonStyles(colors);
  // Animation value: -200 (hidden above screen) to 0 (visible)
  const translateY = useSharedValue(-200);

  useEffect(() => {
    translateY.value = withTiming(isVisible ? 0 : -200, {
      duration: 400,
      easing: Easing.out(Easing.exp),
    });
  }, [isVisible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  if (!isVisible && translateY.value === -200) return null;

  return (
    <Animated.View
      style={[styles.wrapper, { paddingTop: insets.top + 10 }, animatedStyle]}
    >
      <View style={styles.card}>
        <View style={styles.routeContainer}>
          <Text
            style={[
              styles.pickupText,
              commonStyling.subtitle,
              {
                color: colors.krGreen,
                fontSize: FONT_SIZES.BODY,
              },
            ]}
            numberOfLines={1}
          >
            {pickup}
          </Text>
          <Text style={styles.arrow}> → </Text>
          <Text
            style={[
              styles.destinationText,
              {
                fontSize: FONT_SIZES.BODY,
              },
            ]}
            numberOfLines={1}
          >
            {destination}
          </Text>
        </View>

        <TouchableOpacity onPress={onClose} hitSlop={10}>
          <CloseIcon size={15} color="#000" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

export default RouteHeaderCard;

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  routeContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  pickupText: {
    fontSize: 14,
    maxWidth: "45%",
  },
  arrow: {
    color: "#666",
    marginHorizontal: 4,
  },
  destinationText: {
    color: "#333",
    maxWidth: "45%",
  },
});
