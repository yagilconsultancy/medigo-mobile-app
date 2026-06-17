import React from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
import { Users, Clock, CheckCircle2 } from "lucide-react-native";
import useTheme from "../../hooks/useThemes";
import { commonStyles } from "../../styles/commonStyles";
import { formatPrice } from "../../utils/formatPrice";

const VehicleTypeCard = ({
  features = [],
  title,
  category,
  description,
  passengers,
  bestFor,
  fare,
  selected,
  onPress,
}: any) => {
  const { colors } = useTheme();
  const commonStyling = commonStyles(colors);
  const featureList = Array.isArray(features) ? features.filter(Boolean) : [];

  return (
    <TouchableOpacity
      style={[
        styles.cardContainer,
        {
          borderColor: selected
            ? colors.primaryColor
            : colors.lightPrimaryBlueBorder,
          marginBottom: 16,
        },
      ]}
      onPress={onPress}
    >
      {/* Header Section */}
      <View style={styles.headerRow}>
        <View style={styles.imageWrapper}>
          <Image
            source={require("../../../assets/images/vehicleType.png")}
            style={styles.carImage}
            resizeMode="contain"
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: "75%",
          }}
        >
          <View>
            <Text
              style={[
                commonStyling.title,
                {
                  fontFamily: "Bold",
                  fontSize: 15,
                  width: 200,
                },
              ]}
            >
              {title}
            </Text>
            <Text
              style={[
                styles.serviceCategory,
                commonStyling.subtitle,
                {
                  fontSize: 12,
                  fontFamily: "Medium",
                },
              ]}
            >
              {category}
            </Text>
          </View>

          {selected && <CheckCircle2 color="#2E66E7" size={20} />}
        </View>
      </View>

      {/* Description */}
      <Text
        style={[
          styles.description,
          commonStyling.subtitle,
          {
            fontSize: 12,
            fontFamily: "Medium",
          },
        ]}
      >
        {description}
      </Text>

      {/* Capacity & Time Info */}
      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <Users size={10} color="#94A3B8" />
          <Text
            style={[
              commonStyling.subtitle,
              {
                fontSize: 10,
                fontFamily: "Medium",
              },
            ]}
          >
            {passengers}
          </Text>
        </View>
        <View style={styles.dotSeparator} />
        <View style={styles.infoItem}>
          <Clock size={10} color="#94A3B8" />
          <Text
            style={[
              commonStyling.subtitle,
              {
                fontSize: 10,
                fontFamily: "Medium",
              },
            ]}
          >
            5 or more mins away
          </Text>
        </View>
      </View>

      <View
        style={[
          styles.divider,
          {
            backgroundColor: colors.lightPrimaryBlueBorder,
          },
        ]}
      />

      {/* Best For Section */}
      <Text
        style={[
          styles.bestForHeader,
          {
            color: colors.primaryColor,
            fontSize: 11,
            fontFamily: "SemiBold",
          },
        ]}
      >
        BEST FOR
      </Text>
      <Text
        style={[
          styles.bestForDesc,
          commonStyling.subtitle,
          {
            fontFamily: "Medium",
            fontSize: 11,
          },
        ]}
      >
        {bestFor}
      </Text>

      {/* Feature Pills */}
      <View style={styles.pillContainer}>
        {featureList.map((feature: string) => (
          <View
            key={feature}
            style={[
              styles.pill,
              {
                borderColor: colors.lightPrimaryBlueBorder,
              },
            ]}
          >
            <View style={styles.pillDot} />
            <Text
              style={[
                commonStyling.subtitle,
                {
                  fontFamily: "Medium",
                  fontSize: 11,
                },
              ]}
            >
              {feature}
            </Text>
          </View>
        ))}
      </View>

      <View
        style={[
          styles.divider,
          {
            backgroundColor: colors.lightPrimaryBlueBorder,
          },
        ]}
      />

      {/* Pricing Section */}
      <View style={styles.priceRow}>
        <Text
          style={[
            styles.fareLabel,
            commonStyling.subtitle,
            {
              fontFamily: "Medium",
              fontSize: 12,
            },
          ]}
        >
          Estimated fare
        </Text>
        <View style={styles.priceContainer}>
          <Text
            style={[
              commonStyling.title,
              {
                fontSize: 20,
                fontFamily: "Bold",
              },
            ]}
          >
            {formatPrice(fare)}
          </Text>
          <Text
            style={[
              styles.cents,
              commonStyling.subtitle,
              {
                fontSize: 13,
                fontFamily: "Medium",
              },
            ]}
          >
            .00
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
  },
  headerRow: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  imageWrapper: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  carImage: { width: 50, height: 40 },
  serviceCategory: { marginTop: 2 },
  description: {
    lineHeight: 24,
    marginBottom: 12,
  },
  infoRow: { flexDirection: "row", alignItems: "center" },
  infoItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  dotSeparator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#CBD5E1",
    marginHorizontal: 10,
  },
  divider: { height: 1, marginVertical: 20 },
  bestForHeader: {
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  bestForDesc: {
    marginBottom: 16,
  },
  pillContainer: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  pillDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#94A3B8",
    marginRight: 8,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  fareLabel: { paddingBottom: 4 },
  priceContainer: { flexDirection: "row", alignItems: "flex-start" },

  cents: { marginTop: 6 },
});

export default VehicleTypeCard;
