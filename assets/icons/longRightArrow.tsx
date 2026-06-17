import Svg, { Path } from "react-native-svg";
import useTheme from "../../src/hooks/useThemes";

function LongRightArrow() {
  const { colors } = useTheme();

  return (
    <Svg width="12" height="8" viewBox="0 0 12 8" fill="none">
      <Path
        d="M11.1667 3.83301L0.5 3.83301"
        stroke={colors.titleText}
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <Path
        d="M7.8334 7.16667C7.8334 7.16667 11.1667 4.7117 11.1667 3.83331C11.1667 2.95491 7.83337 0.5 7.83337 0.5"
        stroke={colors.titleText}
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </Svg>
  );
}

export default LongRightArrow;
