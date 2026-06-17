import React from "react";
import Svg, { Path } from "react-native-svg";
import useTheme from "../../src/hooks/useThemes";

interface DocumentProps {
  color?: string;
  width?: number;
  height?: number;
}

const Phone: React.FC<DocumentProps> = ({ width = 16, height = 16, color }) => {
  const { colors } = useTheme();

  return (
    <Svg width={width} height={height} viewBox="0 0 20 20" fill="none">
      <Path
        d="M18.75 16.75V15.1041C18.75 14.2863 18.2521 13.5508 17.4928 13.2471L15.4586 12.4335C14.4929 12.0471 13.3922 12.4656 12.927 13.396L12.75 13.75C12.75 13.75 10.25 13.25 8.25 11.25C6.25 9.25 5.75 6.75 5.75 6.75L6.10402 6.57299C7.03438 6.10781 7.45285 5.00714 7.06654 4.04136L6.25289 2.00722C5.94916 1.2479 5.21374 0.75 4.39593 0.75H2.75C1.64543 0.75 0.75 1.64543 0.75 2.75C0.75 11.5866 7.91344 18.75 16.75 18.75C17.8546 18.75 18.75 17.8546 18.75 16.75Z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default Phone;
