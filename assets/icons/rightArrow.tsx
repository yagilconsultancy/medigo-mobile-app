import React from "react";
import Svg, { Path } from "react-native-svg";

interface SearchProps {
  color?: string;
}

const RightArrow: React.FC<SearchProps> = ({ color = "white" }) => {
  return (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Path
        d="M5 12H19"
        stroke={color}
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <Path
        d="M12 5L19 12L12 19"
        stroke={color}
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </Svg>
  );
};

export default RightArrow;
