import React from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { ChevronLeft, Banknote } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Header from "../../../components/reuseables/header";
import useTheme from "../../../hooks/useThemes";
import { commonStyles } from "../../../styles/commonStyles";
import Buttons from "../../../components/buttons/buttons";

const PaymentSuccessfulNotificationDetail = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { colors, theme } = useTheme();
  const commonStyling = commonStyles(colors);

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: colors.surfacePrimary,
        },
      ]}
    >
      <StatusBar
        barStyle={theme === "light" ? "dark-content" : "light-content"}
      />
      <Header title="Payment successful" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Status Card */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.homelightPrimaryBlue50,
              borderColor: colors.lightPrimaryBlueBorder,
            },
          ]}
        >
          <View style={styles.iconCircleGreen}>
            <Banknote color="#10B981" size={28} />
          </View>
          <Text
            style={[
              commonStyling.title,
              {
                fontSize: 24,
                fontFamily: "Bold",
              },
            ]}
          >
            Payment Successful
          </Text>
          <Text
            style={[
              styles.statusDate,
              commonStyling.subtitle,
              {
                fontSize: 14,
              },
            ]}
          >
            March 3, 2026, 4:30 PM
          </Text>
        </View>

        {/* Message Card */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.homelightPrimaryBlue50,
              borderColor: colors.lightPrimaryBlueBorder,
            },
          ]}
        >
          <Text
            style={[
              styles.sectionLabel,
              commonStyling.subtitle,
              {
                fontFamily: "Bold",
                fontSize: 12,
                fontWeight: "700",
              },
            ]}
          >
            MESSAGE
          </Text>
          <Text
            style={[
              styles.messageText,
              commonStyling.title,
              {
                fontWeight: "400",
                fontFamily: "Regular",
                fontSize: 15,
              },
            ]}
          >
            Your payment of $28.50 for the ride on March 3 has been processed.
          </Text>
        </View>

        {/* Details Breakdown Card */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.homelightPrimaryBlue50,
              borderColor: colors.lightPrimaryBlueBorder,
            },
          ]}
        >
          <Text
            style={[
              styles.sectionLabel,
              commonStyling.subtitle,
              {
                fontFamily: "Bold",
                fontSize: 12,
                fontWeight: "700",
              },
            ]}
          >
            DETAILS
          </Text>

          {/* Highlighted Total Amount Box */}
          <View
            style={[
              styles.totalAmountBox,
              {
                backgroundColor: colors.surfaceElevated,
              },
            ]}
          >
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>$28.50</Text>
          </View>

          {/* Individual Fee Rows */}

          <View
            style={{
              borderBottomWidth: 1,
              borderColor: colors.lightPrimaryBlueBorder,
              paddingBottom: 8,
              marginBottom: 16,
            }}
          >
            <View style={styles.feeRow}>
              <Text
                style={[
                  commonStyling.subtitle,
                  {
                    fontSize: 14,
                  },
                ]}
              >
                Ride Fare
              </Text>
              <Text
                style={[
                  commonStyling.title,
                  {
                    fontSize: 14,
                    fontWeight: "600",
                  },
                ]}
              >
                $22.50
              </Text>
            </View>

            <View style={styles.feeRow}>
              <Text
                style={[
                  commonStyling.subtitle,
                  {
                    fontSize: 14,
                  },
                ]}
              >
                Tip
              </Text>
              <Text
                style={[
                  commonStyling.title,
                  {
                    fontSize: 14,
                    fontWeight: "600",
                  },
                ]}
              >
                $5.00
              </Text>
            </View>

            <View style={styles.feeRow}>
              <Text
                style={[
                  commonStyling.subtitle,
                  {
                    fontSize: 14,
                  },
                ]}
              >
                Service Fee
              </Text>
              <Text
                style={[
                  commonStyling.title,
                  {
                    fontSize: 14,
                    fontWeight: "600",
                  },
                ]}
              >
                $1.00
              </Text>
            </View>
          </View>

          <View style={styles.feeRow}>
            <Text
              style={[
                commonStyling.subtitle,
                {
                  fontSize: 14,
                },
              ]}
            >
              Payment Method
            </Text>
            <Text
              style={[
                commonStyling.title,
                {
                  fontSize: 14,
                  fontWeight: "600",
                },
              ]}
            >
              Visa •••• 4532
            </Text>
          </View>

          <View style={styles.feeRow}>
            <Text
              style={[
                commonStyling.subtitle,
                {
                  fontSize: 14,
                },
              ]}
            >
              Transaction ID
            </Text>
            <Text
              style={[
                commonStyling.title,
                {
                  fontSize: 14,
                  fontWeight: "600",
                },
              ]}
            >
              TXN-2026-03-03-4532
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Footer Button */}
      <View
        style={[
          styles.footer,
          {
            backgroundColor: colors.surfacePrimary,
          },
        ]}
      >
        <Buttons
          title="View Receipt"
          onPress={() => {
            navigation.navigate("ReceiptScreen");
          }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  headerTitle: { fontSize: 18, fontWeight: "800", color: "#1E293B" },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 100 },

  card: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
  },

  iconCircleGreen: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#ECFDF5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  statusDate: { marginTop: 8 },

  sectionLabel: {
    letterSpacing: 1,
    marginBottom: 12,
  },
  messageText: { lineHeight: 22 },

  totalAmountBox: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    marginTop: 8,
  },
  totalLabel: { fontSize: 13, color: "#059669", fontWeight: "600" },
  totalValue: {
    fontSize: 32,
    fontWeight: "800",
    color: "#10B981",
    marginTop: 4,
  },

  feeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  footer: {
    padding: 20,
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  primaryButton: {
    backgroundColor: "#3B82F6",
    paddingVertical: 18,
    borderRadius: 25,
    alignItems: "center",
  },
  buttonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
});

export default PaymentSuccessfulNotificationDetail;
