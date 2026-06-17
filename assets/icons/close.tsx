import React from "react";
import { AntDesign } from "@expo/vector-icons";

interface CloseIconProps {
  size?: number;
  color?: string;
}

const CloseIcon: React.FC<CloseIconProps> = ({
  size = 15,
  color = "#2d2d2d",
}) => {
  return <AntDesign name="close" size={size} color={color} />;
};

export default CloseIcon;
