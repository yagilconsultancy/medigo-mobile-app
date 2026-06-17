import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from "react-native";
import CountdownTimer from "./countdownTimer";
import Buttons from "../buttons/buttons";
import useTheme from "../../hooks/useThemes";
import { commonStyles } from "../../styles/commonStyles";
import { FONT_SIZES } from "../../constants/sizes";
import LoadingSpinner from "./loadingSpinner";

const { width } = Dimensions.get("window");

interface DriverIsWaitingProps {
  onPressStartTrip: () => void;
  onPressEndTrip: () => void;
  title: string;
  subtitle: string;
  button1Title?: string;
  button2Title?: string;
  countdownMode: "down" | "up";
  minutes: number;
  onFinish?: () => void;
  loadingStart: boolean;
  loadingEnd: boolean;
}

const DriverIsWaiting: React.FC<DriverIsWaitingProps> = ({
  onPressStartTrip,
  onPressEndTrip,
  title,
  subtitle,
  button1Title,
  button2Title,
  countdownMode,
  minutes,
  onFinish,
  loadingStart,
  loadingEnd,
}) => {
  const { colors } = useTheme();
  const commonStyling = commonStyles(colors);

  return (
    <View>
      <Text
        style={[
          commonStyling.title,
          {
            marginBottom: 8,
          },
        ]}
      >
        {title}
      </Text>

      <Text
        style={[
          commonStyling.subtitle,
          {
            fontSize: FONT_SIZES.BODY,
            marginBottom: 20,
          },
        ]}
      >
        {subtitle}
      </Text>

      <CountdownTimer
        minutes={minutes}
        mode={countdownMode}
        onFinish={onFinish}
      />

      {button1Title && button2Title && (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 24,
            marginBottom: 12,
          }}
        >
          {/* Left Button */}
          <TouchableOpacity
            style={styles.endTripButton}
            onPress={onPressEndTrip}
          >
            <Text
              style={[
                styles.endTripText,
                {
                  color: colors.gray,
                },
              ]}
            >
              {loadingEnd ? (
                <LoadingSpinner color={colors.krGreen} />
              ) : (
                button1Title
              )}
            </Text>
          </TouchableOpacity>

          {/* Right Button */}
          <View
            style={{
              width: width * 0.6,
            }}
          >
            <Buttons
              type="primary"
              title={button2Title}
              onPress={onPressStartTrip}
              loading={loadingStart}
            />
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  endTripButton: {
    alignItems: "center",
    paddingVertical: 8,
  },
  endTripText: {
    textDecorationLine: "underline",
    fontSize: 16,
    textAlign: "center",
    marginTop: 12,
  },
});

export default DriverIsWaiting;
