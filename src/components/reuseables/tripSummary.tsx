import React from "react";
import { View, Text, StyleSheet } from "react-native";
import useTheme from "../../hooks/useThemes";
import { commonStyles } from "../../styles/commonStyles";
import { FONT_SIZES } from "../../constants/sizes";

type TripSummaryProps = {
  pickup: string;
  stop?: string | null;
  dropoff: string;
  fare: any;
  stopFare?: any;
  total: any;
  paymentMethod: string;
};

type RowProps = {
  label: string;
  value: string | number;
  bold?: boolean;
};

export default function TripSummary({
  pickup,
  stop,
  dropoff,
  fare,
  stopFare,
  total,
  paymentMethod,
}: TripSummaryProps) {
  const { colors } = useTheme();
  const commonStyling = commonStyles(colors);

  const Row = ({ label, value, bold }: RowProps) => (
    <View style={styles.row}>
      <Text style={[commonStyling.subtitle, styles.label]}>{label}</Text>
      <Text
        style={[
          commonStyling.title,
          styles.value,
          bold ? { fontFamily: "Bold", fontSize: FONT_SIZES.BUTTON } : {},
        ]}
      >
        {value}
      </Text>
    </View>
  );

  return (
    <View style={[styles.card, { backgroundColor: colors.surfacePrimary }]}>
      <Text style={[commonStyling.title, styles.heading]}>Trip summary</Text>

      <Row label="Pickup" value={pickup} />
      {stop && <Row label="Stop" value={stop} />}
      <Row label="Drop-off" value={dropoff} />
      <Row label="Fare" value={`${fare}`} />
      {stopFare && <Row label="Stop fare" value={`${stopFare}`} />}
      <Row label="Total" value={`${total}`} bold />
      <Row label="Payment method" value={paymentMethod} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 8,
    borderRadius: 16,
    marginBottom: 16,
  },

  heading: {
    fontSize: FONT_SIZES.BUTTON,
    marginBottom: 16,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  label: {
    fontSize: FONT_SIZES.SUBTITLE,
    maxWidth: "40%",
  },

  value: {
    fontSize: FONT_SIZES.SUBTITLE,
    maxWidth: "55%",
    textAlign: "right",
  },
});
