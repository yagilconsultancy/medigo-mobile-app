import React from "react";
import Svg, { Path, Rect } from "react-native-svg";
import useTheme from "../../src/hooks/useThemes";

const FilledCalender: React.FC = () => {
  const { colors } = useTheme();

  return (
    <Svg width={15} height={15} viewBox="0 0 12 12" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.375 1C4.375 0.792893 4.20711 0.625 4 0.625C3.79289 0.625 3.625 0.792893 3.625 1V1.75H3.5C2.39543 1.75 1.5 2.64543 1.5 3.75V4.125H10.5V3.75C10.5 2.64543 9.60457 1.75 8.5 1.75H8.375V1C8.375 0.792893 8.20711 0.625 8 0.625C7.79289 0.625 7.625 0.792893 7.625 1V1.75H4.375V1ZM1.5 4.875H10.5V9C10.5 10.1046 9.60457 11 8.5 11H3.5C2.39543 11 1.5 10.1046 1.5 9V4.875Z"
        stroke={colors.titleText}
      />
    </Svg>
  );
};

export default FilledCalender;
