import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  KeyboardTypeOptions,
  TouchableOpacity,
} from "react-native";
import { commonStyles } from "../../styles/commonStyles";
import useTheme from "../../hooks/useThemes";
import OpenEye from "../../../assets/icons/openEyes";

interface InputProps {
  title: string;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
  value: string;
  onChangeText: (text: string) => void;
  disabled?: boolean;
}

const PasswordInput: React.FC<InputProps> = ({
  title,
  placeholder,
  keyboardType = "default",
  value,
  onChangeText,
  disabled = false,
}) => {
  const { colors } = useTheme();
  const commonStyling = commonStyles(colors);
  const [secureEntry, setsecureEntry] = useState(false);
  return (
    <View>
      <Text style={commonStyling.inputTitle}>{title}</Text>

      <TextInput
        style={commonStyling.input}
        placeholder={placeholder}
        placeholderTextColor={colors.titleText}
        keyboardType={keyboardType}
        value={value}
        editable={!disabled}
        onChangeText={onChangeText}
        secureTextEntry={secureEntry}
      />

      <TouchableOpacity
        style={{
          position: "absolute",
          right: 12,
          top: 35,
        }}
        onPress={() => {
          setsecureEntry(!secureEntry);
        }}
      >
        <OpenEye />
      </TouchableOpacity>
    </View>
  );
};

export default PasswordInput;
