import { Text, TextInput, View } from "react-native";
import useTheme from "../../hooks/useThemes";
import { commonStyles } from "../../styles/commonStyles";

interface InputProps {
  placeholder?: string;
  title?: string;
  value: string;
  onChangeText: (text: string) => void;
  disabled?: boolean;
}

const MultilineInput: React.FC<InputProps> = ({
  placeholder,
  value,
  onChangeText,
  disabled = false,
  title,
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
        placeholderTextColor={colors.gray}
        style={[
          {
            borderColor: colors.stroke,
            color: colors.titleText,
            backgroundColor: colors.surfacePrimary,
            borderWidth: 1,
            height: 107,
            textAlignVertical: "top",
            paddingVertical: 10,
            paddingHorizontal: 12,
            borderRadius: 8,
          },
        ]}
        placeholder={placeholder}
        multiline
        value={value}
        onChangeText={onChangeText}
        editable={!disabled}
      />
    </View>
  );
};

export default MultilineInput;
