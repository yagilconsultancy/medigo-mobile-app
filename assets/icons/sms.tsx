import React from "react";
import Svg, { Path } from "react-native-svg";

type SMSIconProps = {
  color?: string;
};

const SMSIcon: React.FC<SMSIconProps> = ({ color = "#000" }) => {
  return (
    <Svg width={22} height={20} viewBox="0 0 22 20" fill="none">
      <Path
        d="M6.75 7.75H14.75M6.75 11.75H10.75M9.75 0.75H11.75C16.7206 0.75 20.75 4.77944 20.75 9.75C20.75 14.7206 16.7206 18.75 11.75 18.75H4.75C2.54086 18.75 0.75 16.9591 0.75 14.75V9.75C0.75 4.77944 4.77944 0.75 9.75 0.75Z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </Svg>
  );
};

export default SMSIcon;
