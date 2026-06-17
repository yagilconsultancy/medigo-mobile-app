import React, { useState } from "react";
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  KeyboardTypeOptions,
} from "react-native";
import DownArrow from "../../../assets/icons/downArrow";
import { commonStyles } from "../../styles/commonStyles";
import useTheme from "../../hooks/useThemes";
import { FONT_SIZES } from "../../constants/sizes";

interface PhoneNumberInputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
  selectedCountry: string;
  setSelectedCountry: (value: string) => void;
  editable?: boolean;
}

const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({
  label,
  value,
  onChangeText,
  onBlur,
  placeholder,
  keyboardType = "phone-pad",
  selectedCountry,
  editable = true,
}) => {
  const [phoneNumber, setPhoneNumber] = useState<string>(value);
  const [showCountry, setShowCountry] = useState<boolean>(false);

  const { colors } = useTheme();
  const commonStyling = commonStyles(colors);

  const handlePhoneNumberChange = (text: string) => {
    setPhoneNumber(text);
    onChangeText(text);
  };

  return (
    <View>
      {label && <Text style={commonStyling.inputTitle}>{label}</Text>}

      <View>
        <TouchableOpacity
          onPress={() => setShowCountry(!showCountry)}
          style={[
            styles.countryButton,
            {
              borderRightWidth: 1,
              borderRightColor: colors.stroke,
            },
          ]}
        >
          {selectedCountry === "+234" && (
            <Image source={require("../../../assets/images/nigeriaFlag.png")} />
          )}

          <Text
            style={{ fontSize: FONT_SIZES.BODY, color: colors.subTitleText }}
          >
            {selectedCountry}
          </Text>

          <DownArrow />
        </TouchableOpacity>

        <TextInput
          style={[commonStyling.input, styles.input]}
          value={phoneNumber}
          onChangeText={handlePhoneNumberChange}
          onBlur={onBlur}
          placeholder={placeholder}
          placeholderTextColor={colors.subTitleText}
          keyboardType={keyboardType}
          editable={editable}
        />
      </View>
    </View>
  );
};

export default PhoneNumberInput;

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
  },
  input: {
    paddingLeft: 120,
    paddingRight: 12,
    borderLeftWidth: 1,
  },
  countryButton: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    left: 0,
    top: 0,
    height: 48,
    paddingHorizontal: 12,
  },
});
