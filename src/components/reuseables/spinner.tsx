import React from "react";
import { ActivityIndicator } from "react-native";
import useTheme from "../../hooks/useThemes";

const Spinner: React.FC = () => {
  const { colors } = useTheme();

  return <ActivityIndicator size="large" color={colors.krGreen} />;
};

export default Spinner;
