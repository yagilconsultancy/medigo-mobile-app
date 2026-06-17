import React from "react";
import Svg, { Circle, Path } from "react-native-svg";

interface AmbulanceProps {
  width?: number | string;
  height?: number | string;
  color?: string;
}

const Ambulance: React.FC<AmbulanceProps> = ({
  width = 24,
  height = 24,
  color = "#1969FE",
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M11 18H15M13.5 8H14.4429C15.7533 8 16.4086 8 16.9641 8.31452C17.5196 8.62904 17.89 9.20972 18.6308 10.3711C19.1502 11.1854 19.6955 11.7765 20.4622 12.3024C21.2341 12.8318 21.6012 13.0906 21.8049 13.506C22 13.9038 22 14.375 22 15.3173C22 16.5596 22 17.1808 21.651 17.5755C21.636 17.5925 21.6207 17.609 21.6049 17.625C21.2375 18 20.6594 18 19.503 18H19"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M5 18C3.58579 18 2.87868 18 2.43934 17.5607C2 17.1213 2 16.4142 2 15L2 8C2 6.58579 2 5.87868 2.43934 5.43934C2.87868 5 3.58579 5 5 5L10.5 5C11.9142 5 12.6213 5 13.0607 5.43934C13.5 5.87868 13.5 6.58579 13.5 8L13.5 18L9 18"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M22 15H21"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M8 9V13M10 11L6 11"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx="17" cy="18" r="2" stroke={color} strokeWidth={1.5} />
      <Circle cx="7" cy="18" r="2" stroke={color} strokeWidth={1.5} />
    </Svg>
  );
};

export default Ambulance;
