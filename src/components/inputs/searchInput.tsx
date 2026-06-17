import React from "react";
import { View, TextInput, KeyboardTypeOptions } from "react-native";
import { commonStyles } from "../../styles/commonStyles";
import useTheme from "../../hooks/useThemes";
import Search from "../../../assets/icons/search";

interface InputProps {
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
  value: string;
  onChangeText: (text: string) => void;
  disabled?: boolean;
}

const SearchInput: React.FC<InputProps> = ({
  placeholder,
  keyboardType = "default",
  value,
  onChangeText,
  disabled = false,
}) => {
  const { colors } = useTheme();
  const commonStyling = commonStyles(colors);

  return (
    <View>
      <View
        style={{
          position: "absolute",
          top: 17,
          left: 12,
        }}
      >
        <Search color={colors.inputText} />
      </View>
      <TextInput
        style={[commonStyling.input, { paddingLeft: 40, paddingRight: 12 }]}
        placeholder={placeholder}
        placeholderTextColor={colors.titleText}
        keyboardType={keyboardType}
        value={value}
        editable={!disabled}
        onChangeText={onChangeText}
      />
    </View>
  );
};

export default SearchInput;
