import React from "react";
import Svg, { Path } from "react-native-svg";

interface EditIconProps {
  color?: string;
}

const EditIcon: React.FC<EditIconProps> = ({ color = "#BFBFBF" }) => {
  return (
    <Svg width={17} height={20} viewBox="0 0 17 20" fill="none">
      <Path
        d="M5.50252 18.75H15.7502M8.53459 3.06171C8.53459 3.06171 8.53459 4.69634 10.1692 6.33096C11.8038 7.96559 13.4385 7.96559 13.4385 7.96559M2.06981 15.7381L5.50252 15.2477C5.99768 15.1769 6.45654 14.9475 6.81022 14.5938L15.0731 6.33096C15.9759 5.42818 15.9759 3.96449 15.0731 3.06171L13.4385 1.42708C12.5357 0.524305 11.072 0.524305 10.1692 1.42708L1.90635 9.68996C1.55266 10.0436 1.32323 10.5025 1.2525 10.9977L0.762109 14.4304C0.653134 15.1932 1.30698 15.847 2.06981 15.7381Z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </Svg>
  );
};

export default EditIcon;
