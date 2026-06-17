import Svg, { Path } from "react-native-svg";
import useTheme from "../../src/hooks/useThemes";

function Shield() {
  const { colors } = useTheme();
  return (
    <Svg width="21" height="22" viewBox="0 0 21 22" fill="none">
      <Path
        d="M10.2472 0.75C7.23945 0.75 5.28921 2.76899 2.98274 3.5049C2.04491 3.80413 1.57599 3.95374 1.38622 4.16465C1.19645 4.37556 1.14088 4.68375 1.02975 5.30013C-0.159542 11.896 2.43992 17.994 8.63932 20.3675C9.30541 20.6225 9.63845 20.75 10.2505 20.75C10.8626 20.75 11.1956 20.6225 11.8616 20.3675C18.0606 17.9939 20.6576 11.896 19.468 5.30013C19.3568 4.68364 19.3012 4.3754 19.1114 4.16449C18.9216 3.95358 18.4527 3.80405 17.5149 3.50499C15.2076 2.76915 13.2551 0.75 10.2472 0.75Z"
        stroke={colors.inputText}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <Path
        d="M8.24902 11.25C8.24902 11.25 8.74902 11.25 9.24902 12.25C9.24902 12.25 10.8373 9.75 12.249 9.25"
        stroke={colors.inputText}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <Path
        d="M15.249 10.75C15.249 13.5114 13.0104 15.75 10.249 15.75C7.4876 15.75 5.24902 13.5114 5.24902 10.75C5.24902 7.98858 7.4876 5.75 10.249 5.75C13.0104 5.75 15.249 7.98858 15.249 10.75Z"
        stroke={colors.inputText}
        stroke-width="1.5"
        stroke-linecap="round"
      />
    </Svg>
  );
}

export default Shield;
