import { StyleSheet, View, Dimensions } from "react-native";
import { OtpInput } from "react-native-otp-entry";
import useTheme from "../../hooks/useThemes";
import React from "react";
import { FONT_SIZES } from "../../constants/sizes";

const { width } = Dimensions.get("window");

interface OtpInputFieldProps {
  onFilled: (value: string) => void;
  onTextChange?: (value: string) => void;
  disabled?: boolean;
}

const OtpInputField: React.FC<OtpInputFieldProps> = ({
  onFilled,
  onTextChange,
  disabled,
}) => {
  const { colors } = useTheme();

  return (
    <View style={styles.wrapper}>
      <OtpInput
        numberOfDigits={6}
        focusColor={colors.titleText}
        onTextChange={onTextChange}
        onFilled={onFilled}
        autoFocus={false}
        hideStick
        blurOnFilled
        disabled={disabled}
        type="numeric"
        secureTextEntry={false}
        focusStickBlinkingDuration={500}
        textInputProps={{
          accessibilityLabel: "One-Time Password",
        }}
        theme={{
          pinCodeContainerStyle: StyleSheet.flatten([
            styles.pinCodeContainer,
            { borderColor: colors.stroke },
          ]),

          pinCodeTextStyle: StyleSheet.flatten([
            styles.pinCodeText,
            { color: colors.titleText },
          ]),

          focusedPinCodeContainerStyle: {
            borderColor: colors.titleText,
          },
        }}
      />
    </View>
  );
};

export default OtpInputField;

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    width: "100%",
  },

  pinCodeContainer: {
    borderWidth: 1,
    borderRadius: 8,
    width: 45,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
  },
  pinCodeText: {
    fontSize: FONT_SIZES.SUBTITLE,
    fontFamily: "Regular",
  },
});
