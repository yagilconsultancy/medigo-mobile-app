import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Tooltip from "react-native-walkthrough-tooltip";
import TooltipIcon from "../../../assets/icons/toolTipIcon";
import useTheme from "../../hooks/useThemes";

interface TooltipProps {
  text: string;
}


export default function MyTooltipComponent({ text }: TooltipProps) {
  const [isTooltipVisible, setTooltipVisible] = useState(false);
  const { colors } = useTheme();
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Tooltip
        isVisible={isTooltipVisible}
        content={<Text style={{}}>{text}</Text>}
        placement="top" // Can be top, bottom, left, right, center
        onClose={() => setTooltipVisible(false)}
        // Optional: allow interaction with the child and still close tooltip
        closeOnChildInteraction={true}
      >
        <TouchableOpacity onPress={() => setTooltipVisible(true)}>
          <TooltipIcon color={colors.titleText} />
        </TouchableOpacity>
      </Tooltip>
    </View>
  );
}
