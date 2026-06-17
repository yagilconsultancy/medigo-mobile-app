import React from "react";
import Svg, { Path } from "react-native-svg";
import useTheme from "../../src/hooks/useThemes";

const ShareLink: React.FC = () => {
  const { colors } = useTheme();
  return (
    <Svg width="16" height="19" viewBox="0 0 16 19" fill="none">
      <Path
        d="M10.75 3.75L7.75 0.75M7.75 0.75L4.75 3.75M7.75 0.75L7.75 12.75M11.75 7.75H12.75C13.8546 7.75 14.75 8.64543 14.75 9.75L14.75 15.75C14.75 16.8546 13.8546 17.75 12.75 17.75H2.75C1.64543 17.75 0.75 16.8546 0.75 15.75L0.75 9.75C0.75 8.64543 1.64543 7.75 2.75 7.75H3.75"
        stroke={colors.titleText}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </Svg>
  );
};

export default ShareLink;
