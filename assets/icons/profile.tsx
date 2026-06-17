import React from "react";
import Svg, { Path } from "react-native-svg";

const Profile: React.FC = () => {
  return (
    <Svg width={28} height={28} viewBox="0 0 28 28" fill="none">
      <Path
        d="M14 16C7.34 16 5 20.125 5 22.875V27H9.5H14H18.5H23V22.875C23 20.125 20.66 16 14 16Z"
        fill="#959595"
      />
      <Path
        d="M14.3 13.9999C17.7794 13.9999 20.6 11.1793 20.6 7.6999C20.6 4.22051 17.7794 1.3999 14.3 1.3999C10.8206 1.3999 8 4.22051 8 7.6999C8 11.1793 10.8206 13.9999 14.3 13.9999Z"
        fill="#959595"
      />
    </Svg>
  );
};

export default Profile;
