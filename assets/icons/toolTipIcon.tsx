import AntDesign from "@expo/vector-icons/AntDesign";

interface TooltipProps {
  color: string;
}

const TooltipIcon: React.FC<TooltipProps> = ({ color }) => {
  return <AntDesign name="info-circle" size={15} color={color} />;
};

export default TooltipIcon;
