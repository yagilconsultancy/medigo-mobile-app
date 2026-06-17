import React from "react";
import { View, ActivityIndicator } from "react-native";

interface LoadingSpinnerItemProps {
  color: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerItemProps> = ({ color }) => {
  return (
    <View>
      <ActivityIndicator size="small" color={color ? color : "#ffffff"} />
    </View>
  );
};

export default React.memo(LoadingSpinner);
