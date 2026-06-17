import Svg, { Path } from "react-native-svg";
import useTheme from "../../src/hooks/useThemes";

function LogoutIcon() {
  const { colors } = useTheme();
  return (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Path
        d="M20 14L21.2929 12.7071C21.6834 12.3166 21.6834 11.6834 21.2929 11.2929L20 10"
        stroke={colors.inputText}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <Path
        d="M21 12H13M6 20C3.79086 20 2 18.2091 2 16V8C2 5.79086 3.79086 4 6 4M6 20C8.20914 20 10 18.2091 10 16V8C10 5.79086 8.20914 4 6 4M6 20H14C16.2091 20 18 18.2091 18 16M6 4H14C16.2091 4 18 5.79086 18 8"
        stroke={colors.inputText}
        stroke-width="1.5"
        stroke-linecap="round"
      />
    </Svg>
  );
}

export default LogoutIcon;
