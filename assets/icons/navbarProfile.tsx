import React from "react";
import Svg, { Path } from "react-native-svg";

interface NavbarProfileProps {
  width: number | string;
  color: string;
  active?: boolean;
}

const NavbarProfile: React.FC<NavbarProfileProps> = ({
  width,
  color,
  active = false,
}) => {
  return (
    <Svg
      width={width}
      height={22}
      viewBox="0 0 20 22"
      fill={active ? color : "none"}
    >
      <Path
        d="M4.32782 14.2316C2.91305 15.074 -0.796391 16.7941 1.46291 18.9466C2.56655 19.998 3.79573 20.75 5.34111 20.75H14.1594C15.7048 20.75 16.9339 19.998 18.0376 18.9466C20.2969 16.7941 16.5874 15.074 15.1727 14.2316C11.8551 12.2561 7.64543 12.2561 4.32782 14.2316Z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M14.2502 5.25C14.2502 7.73528 12.2355 9.75 9.75024 9.75C7.26496 9.75 5.25024 7.73528 5.25024 5.25C5.25024 2.76472 7.26496 0.75 9.75024 0.75C12.2355 0.75 14.2502 2.76472 14.2502 5.25Z"
        stroke={color}
        strokeWidth={1.5}
      />
    </Svg>
  );
};

export default NavbarProfile;
