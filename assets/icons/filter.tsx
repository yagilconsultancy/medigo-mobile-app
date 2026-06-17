import Svg, { Path } from "react-native-svg";
import useTheme from "../../src/hooks/useThemes";

function Filter() {
  const { colors } = useTheme();
  return (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 17H21M12 11H18M12 5H15M3 14.625L4.50518 16.3183C5.30076 17.2134 6.69924 17.2134 7.49482 16.3183L9 14.625M6 17V5"
        stroke={colors.titleText}
        stroke-width="1.5"
        stroke-linecap="round"
      />
    </Svg>
  );
}

export default Filter;
