import React from "react";
import Svg, { Path } from "react-native-svg";
import useTheme from "../../src/hooks/useThemes";

const Options: React.FC = () => {
  const { colors } = useTheme();
  return (
    <Svg width={6} height={22} viewBox="0 0 6 22" fill="none">
      <Path
        d="M4.75 10.75C4.75 11.8546 3.85457 12.75 2.75 12.75C1.64543 12.75 0.75 11.8546 0.75 10.75C0.75 9.64543 1.64543 8.75 2.75 8.75C3.85457 8.75 4.75 9.64543 4.75 10.75Z"
        stroke={colors.buttonPrimary}
        strokeWidth={1.5}
      />
      <Path
        d="M4.75 2.75C4.75 3.85457 3.85457 4.75 2.75 4.75C1.64543 4.75 0.75 3.85457 0.75 2.75C0.75 1.64543 1.64543 0.75 2.75 0.75C3.85457 0.75 4.75 1.64543 4.75 2.75Z"
        stroke={colors.buttonPrimary}
        strokeWidth={1.5}
      />
      <Path
        d="M4.75 18.75C4.75 19.8546 3.85457 20.75 2.75 20.75C1.64543 20.75 0.75 19.8546 0.75 18.75C0.75 17.6454 1.64543 16.75 2.75 16.75C3.85457 16.75 4.75 17.6454 4.75 18.75Z"
        stroke={colors.buttonPrimary}
        strokeWidth={1.5}
      />
    </Svg>
  );
};

export default Options;
