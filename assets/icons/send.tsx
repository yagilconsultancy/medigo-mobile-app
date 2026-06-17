import Svg, { Path } from "react-native-svg";

interface IconProps {
  color?: string;
}

const SendIcon = ({ color = "#BFBFBF" }: IconProps) => {
  return (
    <Svg width="21" height="21" viewBox="0 0 21 21" fill="none">
      <Path
        d="M19.2977 1.30293C17.1197 -1.04264 0.736483 4.7032 0.750008 6.801C0.765346 9.17987 7.14809 9.91171 8.91722 10.4081C9.98109 10.7065 10.266 11.0125 10.5113 12.1281C11.6223 17.1805 12.1801 19.6935 13.4514 19.7496C15.4778 19.8392 21.4233 3.592 19.2977 1.30293Z"
        stroke={color}
        stroke-width="1.5"
      />
    </Svg>
  );
};

export default SendIcon;
