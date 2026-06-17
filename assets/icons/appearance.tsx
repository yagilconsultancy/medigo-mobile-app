import Entypo from "@expo/vector-icons/Entypo";
import useTheme from "../../src/hooks/useThemes";

function ApperanceIcon() {
  const { colors } = useTheme();

  return <Entypo name="light-up" size={24} color={colors.inputText} />;
}

export default ApperanceIcon;
