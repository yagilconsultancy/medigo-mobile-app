import React from "react";
import { Text, View, GestureResponderEvent, Pressable } from "react-native";
import useTheme from "../../hooks/useThemes";
import { commonStyles } from "../../styles/commonStyles";
import LoadingSpinner from "../reuseables/loadingSpinner";
import { FONT_SIZES } from "../../constants/sizes";

type ButtonType =
  | "primary"
  | "danger"
  | "inactive"
  | "onboarding"
  | "cancel"
  | "message"
  | "icon"
  | "outline";

interface ButtonsProps {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  type?: ButtonType;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  height?: number;
  loading?: boolean;
}

const Buttons: React.FC<ButtonsProps> = ({
  title,
  onPress,
  type = "primary",
  icon,
  height = 60,
  loading,
  rightIcon,
}) => {
  const { colors } = useTheme();
  const commonStyling = commonStyles(colors);

  const buttonTypes: Record<
    ButtonType,
    {
      backgroundColor: string;
      textColor: string;
      borderColor?: string;
      borderWidth?: number;
      borderRadius?: number;
    }
  > = {
    primary: {
      backgroundColor: colors.primaryColor,
      textColor: "#ffffff",
    },
    danger: {
      backgroundColor: colors.buttonDanger,
      textColor: colors.buttonDangerText,
    },
    inactive: {
      backgroundColor: colors.buttonPrimaryInactive,
      textColor: colors.inactiveButtonText,
    },
    outline: {
      backgroundColor: "transparent",
      textColor: colors.primaryColor,
      borderWidth: 1,
      borderColor: colors.primaryColor,
    },
    onboarding: {
      backgroundColor: colors.buttonPrimary,
      textColor: colors.buttonPrimaryText,
    },
    cancel: {
      backgroundColor: colors.surfacePrimary,
      textColor: colors.red,
      borderWidth: 1,
      borderColor: colors.stroke,
    },
    message: {
      backgroundColor: colors.lightGray,
      textColor: colors.subTitleText,
      borderRadius: 8,
    },
    icon: {
      backgroundColor: "transparent",
      textColor: colors.titleText,
      borderColor: colors.stroke,
      borderWidth: 1,
    },
  };

  const current = buttonTypes[type];

  return (
    <Pressable
      onPress={onPress}
      style={{
        backgroundColor: current.backgroundColor,
        borderColor: current.borderColor,
        paddingHorizontal: 12,
        borderRadius: current.borderRadius ? current.borderRadius : 50,
        borderWidth: current.borderWidth ?? 0,
        height: height,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View>
        {loading ? (
          <LoadingSpinner color={current.textColor} />
        ) : (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {icon && (
              <View
                style={{
                  marginRight: 6,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {icon}
              </View>
            )}

            <Text
              style={[
                commonStyling.title,
                {
                  color: current.textColor,
                  textAlign: "center",
                  fontSize: 16,
                  fontFamily: "SemiBold",
                },
              ]}
            >
              {title}
            </Text>

            {rightIcon && (
              <View
                style={{
                  marginLeft: 6,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {rightIcon}
              </View>
            )}
          </View>
        )}
      </View>
    </Pressable>
  );
};

export default Buttons;
