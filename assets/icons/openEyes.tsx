import Svg, { Path } from "react-native-svg";
import useTheme from "../../src/hooks/useThemes";

function OpenEyes() {
  const { colors } = useTheme();
  return (
    <Svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <Path
        d="M10.75 0.75V2.75M19.75 3.75L18.25 5.25M1.74997 3.75L3.24997 5.25M10.75 20.75C14.3542 20.75 17.5634 18.4045 19.6272 16.4289C21.1243 14.9958 21.1243 12.5042 19.6272 11.0711C17.5634 9.09551 14.3542 6.75 10.75 6.75C7.1458 6.75 3.93661 9.09551 1.87281 11.0711C0.375731 12.5042 0.375732 14.9958 1.87281 16.4289C3.93661 18.4045 7.1458 20.75 10.75 20.75ZM13.75 13.75C13.75 15.4069 12.4068 16.75 10.75 16.75C9.09312 16.75 7.74997 15.4069 7.74997 13.75C7.74997 12.0931 9.09312 10.75 10.75 10.75C12.4068 10.75 13.75 12.0931 13.75 13.75Z"
        stroke={colors.grayIcon}
        stroke-width="1.5"
        stroke-linecap="round"
      />
    </Svg>
  );
}

export default OpenEyes;
