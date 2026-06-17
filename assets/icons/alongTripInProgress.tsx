import React from "react";
import Svg, { Path } from "react-native-svg";

interface TIPProps {
  width?: number | string;
  height?: number | string;
  color?: string;
}

const AlongTripInProgress: React.FC<TIPProps> = ({ color }) => {
  return (
    <Svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <Path
        d="M1 10.9992L1 5.99805"
        stroke={color}
        stroke-width="0.75"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <Path
        d="M11 10.9992L11 5.99805"
        stroke={color}
        stroke-width="0.75"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <Path
        d="M6 10.9989V10.499"
        stroke={color}
        stroke-width="0.75"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <Path
        d="M6 8.99789V8.49805"
        stroke={color}
        stroke-width="0.75"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <Path
        d="M2.86218 2.82725L3.27714 3.20674M3.27714 3.20674C3.35674 3.07257 3.49472 2.83753 3.54043 2.69048C3.93984 1.40553 3.97523 1.05155 4.59203 1.00098L7.40545 1.00098C8.02225 1.05155 8.05764 1.40553 8.45706 2.69048C8.50277 2.83753 8.6158 3.07257 8.6954 3.20674M3.27714 3.20674C2.97478 3.71637 2.57416 4.04991 2.51413 4.49025C2.50431 4.56227 2.51413 5.36594 2.51413 5.94906C2.51413 6.38718 2.93607 6.37379 3.34719 6.40789C3.60845 6.42955 3.87009 6.47697 4.13224 6.47965C5.58514 6.49446 6.54583 6.496 7.98304 6.48034C8.26097 6.47731 8.54103 6.42508 8.81799 6.40156C9.13078 6.375 9.45776 6.33977 9.48336 5.94906C9.52151 5.36657 9.49318 4.56227 9.48336 4.49025C9.42332 4.04991 8.99776 3.71637 8.6954 3.20674M3.27714 3.20674L8.6954 3.20674M8.6954 3.20674L9.1815 2.82725M2.60132 4.21474L3.20555 4.67463M5.27857 5.25566L6.74793 5.25566M8.80955 4.66324L9.4769 4.45045M3.54043 6.42754L3.50142 7.2494M8.4906 6.43783L8.4906 7.2494"
        stroke={color}
        stroke-width="0.75"
        stroke-linecap="round"
      />
    </Svg>
  );
};

export default AlongTripInProgress;
