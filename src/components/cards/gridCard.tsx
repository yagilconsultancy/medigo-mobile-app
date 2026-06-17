import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import type { ReactNode } from "react";
import useTheme from "../../hooks/useThemes";
import { commonStyles } from "../../styles/commonStyles";

type GridCardProps = {
  title: string;
  icon: ReactNode;
  selected?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

const GridCard = ({ title, icon, selected, onPress, style }: GridCardProps) => {
  const { colors } = useTheme();
  const commonStyling = commonStyles(colors);
  return (
    <TouchableOpacity
      style={[
        styles.gridCard,
        {
          borderColor: selected
            ? colors.primaryColor
            : colors.lightPrimaryBlueBorder,
        },
        style,
      ]}
      onPress={onPress}
    >
      <View style={styles.gridIcon}>{icon}</View>
      <Text
        style={[
          styles.gridTitle,
          commonStyling.title,
          {
            fontSize: 14,
            fontFamily: "Bold",
          },
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: -150,
  },
  gridCard: {
    width: "48%",
    aspectRatio: 1,
    paddingHorizontal: 8,
    borderRadius: 16,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  gridIcon: { marginBottom: 12 },
  gridTitle: {
    textAlign: "center",
  },
});

export default GridCard;
