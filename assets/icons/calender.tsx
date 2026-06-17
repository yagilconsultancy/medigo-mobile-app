import React from "react";
import Svg, { Path } from "react-native-svg";

interface CalenderProps {
  width?: number;
  height?: number;
  color?: string;
}

const Calender: React.FC<CalenderProps> = ({
  width = 18,
  height = 18,
  color = "#2d2d2d",
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 20 22" fill="none">
      <Path
        d="M0.75 7.75V16.75C0.75 18.9591 2.54086 20.75 4.75 20.75H14.75C16.9591 20.75 18.75 18.9591 18.75 16.75V7.75M0.75 7.75V6.25C0.75 4.04086 2.54086 2.25 4.75 2.25H14.75C16.9591 2.25 18.75 4.04086 18.75 6.25V7.75M0.75 7.75H18.75M13.75 0.75V3.75M5.75 0.75V3.75"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </Svg>
  );
};

export default Calender;
