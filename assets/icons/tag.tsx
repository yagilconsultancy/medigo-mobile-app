import Svg, { Circle, Path } from "react-native-svg";

function Tag() {
  return (
    <Svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <Circle
        cx="1"
        cy="1"
        r="1"
        transform="matrix(1 0 0 -1 9.83331 4.5)"
        stroke="#17B42F"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <Path
        d="M1.01609 6.59595C0.347329 7.34286 0.332941 8.46973 0.946714 9.26245C2.16468 10.8355 3.49776 12.1686 5.07082 13.3866C5.86354 14.0003 6.99041 13.9859 7.73732 13.3172C9.7652 11.5015 11.6223 9.60392 13.4145 7.51863C13.5917 7.31247 13.7026 7.05979 13.7274 6.78909C13.8374 5.59199 14.0634 2.14311 13.1268 1.20649C12.1902 0.269874 8.74128 0.495844 7.54419 0.605843C7.27348 0.630717 7.0208 0.741554 6.81464 0.918743C4.72935 2.71097 2.83181 4.56807 1.01609 6.59595Z"
        stroke="#17B42F"
      />
      <Path
        d="M3.83331 8.5L5.83331 10.5"
        stroke="#17B42F"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </Svg>
  );
}

export default Tag;
