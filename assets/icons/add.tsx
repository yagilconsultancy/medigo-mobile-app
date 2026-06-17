import { AntDesign } from "@expo/vector-icons";

type AddProps = {
  color: string;
};

export default function Add({ color }: AddProps) {
  return <AntDesign name="plus" size={12} color={color} />;
}
