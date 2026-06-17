import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity } from "react-native";

interface Props {
  bottomOffset?: number;
  isDark: boolean;
  handleRecenter: () => void;
}

export default function RecenterButton({
  bottomOffset = 300,
  isDark,
  handleRecenter,
}: Props) {
  return (
    <TouchableOpacity
      style={[
        styles.recenterButton,
        {
          bottom: bottomOffset + 30,
          backgroundColor: isDark ? "#2C2C2C" : "#FFFFFF",
        },
      ]}
      onPress={handleRecenter}
      activeOpacity={0.8}
    >
      <MaterialIcons
        name="my-location"
        size={24}
        color={isDark ? "#FFFFFF" : "#000000"}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  recenterButton: {
    position: "absolute",
    right: 20,
    width: 45,
    height: 45,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
});
