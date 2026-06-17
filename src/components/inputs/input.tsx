import React from "react";
import { View, Text, TextInput, KeyboardTypeOptions } from "react-native";
import { commonStyles } from "../../styles/commonStyles";
import useTheme from "../../hooks/useThemes";
import { FONT_SIZES } from "../../constants/sizes";

interface InputProps {
  title: string;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
  value: string;
  onChangeText: (text: string) => void;
  disabled?: boolean;
  error?: any;
}

const Input: React.FC<InputProps> = ({
  title,
  placeholder,
  keyboardType = "default",
  value,
  onChangeText,
  disabled = false,
  error,
}) => {
  const { colors } = useTheme();
  const commonStyling = commonStyles(colors);

  return (
    <View>
      <Text
        style={[
          commonStyling.inputTitle,
          {
            fontFamily: "Bold",
            fontSize: 14,
          },
        ]}
      >
        {title}
      </Text>

      <TextInput
        style={commonStyling.input}
        placeholder={placeholder}
        placeholderTextColor={colors.gray}
        keyboardType={keyboardType}
        value={value}
        editable={!disabled}
        autoCapitalize={'none'}
        autoCorrect={false}
        onChangeText={onChangeText}
      />

      {error && (
        <Text
          style={{
            fontSize: FONT_SIZES.SMALL,
            fontFamily: "Regular",
            color: colors.red,
            marginTop: -12,
            marginBottom: 16,
          }}
        >
          {error}
        </Text>
      )}
    </View>
  );
};

export default Input;
