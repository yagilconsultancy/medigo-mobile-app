import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import useTheme from "../../hooks/useThemes";
import { commonStyles } from "../../styles/commonStyles";
import { ChevronRight, Star } from "lucide-react-native";

const LocationCard = ({
  icon,
  bgColor,
  title,
  address,
  lastUsed,
  isFavorite,
  onPress,
}: any) => {
  const { colors } = useTheme();
  const commonStyling = commonStyles(colors);

  return (
    <TouchableOpacity
      style={[
        styles.locationCard,
        {
          backgroundColor: colors.homelightPrimaryBlue50,
          borderColor: colors.lightPrimaryBlueBorder,
        },
      ]}
      onPress={onPress}
    >
      <View style={[styles.iconWrapper, { backgroundColor: bgColor }]}>
        {icon}
      </View>
      <View style={styles.textContent}>
        <Text
          style={[
            commonStyling.title,
            {
              fontSize: 16,
              fontFamily: "Bold",
            },
          ]}
        >
          {title}
        </Text>
        <Text
          style={[
            styles.locationAddress,
            commonStyling.subtitle,
            {
              fontSize: 14,
              fontFamily: "Medium",
            },
          ]}
        >
          {address}
        </Text>
        <Text
          style={[
            styles.lastUsedText,
            commonStyling.subtitle,
            {
              fontSize: 14,
              fontFamily: "Medium",
            },
          ]}
        >
          {lastUsed}
        </Text>
      </View>
      {isFavorite && (
        <Star
          size={18}
          color="#F59E0B"
          fill="#F59E0B"
          style={{ marginRight: 12 }}
        />
      )}
      <ChevronRight size={18} color="#CBD5E1" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  textContent: { flex: 1, marginLeft: 16 },

  locationCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 12,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  locationAddress: { marginTop: 4 },
  lastUsedText: { marginTop: 4 },
});

export default LocationCard;
