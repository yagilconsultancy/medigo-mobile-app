import Svg, { Line } from "react-native-svg";
import useTheme from "../../hooks/useThemes";
import React from "react";

const DashedLine = ({}) => {
  const { colors } = useTheme();
  return (
    <Svg height="1" width="100%">
      <Line
        x1="0"
        y1="1"
        x2="100%"
        y2="1"
        stroke={colors.inputText}
        strokeWidth="2"
        strokeDasharray="5, 5" // 5px dash, 5px gap
      />
    </Svg>
  );
};

export default DashedLine;
