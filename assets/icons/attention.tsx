import React from "react";
import Svg, { Path } from "react-native-svg";

interface AttentionProps {
  color?: string;
  width?: number | string;
  height?: number | string;
}

const Attention: React.FC<AttentionProps> = ({
  color = "#000",
  width = 20,
  height = 22,
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 20 18" fill="none">
      <Path
        d="M9.85728 6.18747V10.7708M2.82457 17.1875H16.8901C18.5148 17.1875 19.5418 15.4855 18.7528 14.1005L11.72 1.75626C10.9082 0.331245 8.80652 0.331248 7.99466 1.75626L0.961888 14.1005C0.172853 15.4855 1.19984 17.1875 2.82457 17.1875Z"
        stroke={color}
        stroke-width="1.375"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </Svg>
  );
};

export default Attention;
