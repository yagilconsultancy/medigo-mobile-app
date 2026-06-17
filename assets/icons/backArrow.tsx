import React from "react";
import Svg, { Path } from "react-native-svg";
import useTheme from "../../src/hooks/useThemes";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

const BackArrow: React.FC = () => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.goBack();
      }}
    >
      <Svg width={16} height={12} viewBox="0 0 16 12" fill="none">
        <Path
          d="M0.750183 5.74976L14.7502 5.74976"
          stroke={colors.titleText}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M5.12496 10.75C5.12496 10.75 0.75001 7.06756 0.75 5.74996C0.74999 4.43237 5.125 0.75 5.125 0.75"
          stroke={colors.titleText}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </TouchableOpacity>
  );
};

export default BackArrow;
