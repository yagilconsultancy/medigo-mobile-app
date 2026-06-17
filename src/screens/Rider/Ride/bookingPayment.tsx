import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import useTheme from "../../../hooks/useThemes";
import { commonStyles } from "../../../styles/commonStyles";
import React from "react";
import { ChevronRight, CreditCard, Plus } from "lucide-react-native";

function BookingPayment({ isLoading, paymentMethods, vehicle, fare }: any) {
  const { colors } = useTheme();
  const commonStyling = commonStyles(colors);

  const getBrandDetails = (brand: string) => {
    const b = brand?.toLowerCase();
    if (b === "visa") return { label: "Visa", color: "#1A1F71" };
    if (b === "mastercard") return { label: "Mastercard", color: "#EB001B" };
    return { label: brand, color: "#64748B" };
  };

  return (
    <View>
      <View>
        <Text
          style={[
            styles.mainTitle,
            commonStyling.title,
            {
              fontSize: 24,
              fontFamily: "Bold",
            },
          ]}
        >
          Payment
        </Text>

        {/* Booking Summary Card */}
        <View
          style={[
            styles.summaryCard,
            {
              borderColor: colors.lightPrimaryBlueBorder,
              borderWidth: 1,
              marginTop: 16,
            },
          ]}
        >
          <Text
            style={[
              styles.summaryTitle,
              commonStyling.title,
              {
                fontSize: 13,
                fontFamily: "Bold",
              },
            ]}
          >
            BOOKING SUMMARY
          </Text>
          <View style={styles.summaryRow}>
            <Text
              style={[
                commonStyling.subtitle,
                {
                  fontSize: 14,
                },
              ]}
            >
              {vehicle}
            </Text>
            <Text
              style={[
                commonStyling.title,
                {
                  fontFamily: "SemiBold",
                  fontSize: 15,
                },
              ]}
            >
              ${fare}
            </Text>
          </View>
          {/* <View style={styles.summaryRow}>
                  <Text
                    style={[
                      commonStyling.subtitle,
                      {
                        fontSize: 14,
                      },
                    ]}
                  >
                    Service fee
                  </Text>
                  <Text
                    style={[
                      commonStyling.title,
                      {
                        fontFamily: "SemiBold",
                        fontSize: 15,
                      },
                    ]}
                  >
                    $3.50
                  </Text>
                </View> */}
          <View style={styles.summaryDivider} />
          <View style={styles.totalRow}>
            <Text
              style={[
                commonStyling.title,
                {
                  fontSize: 18,
                  fontFamily: "Bold",
                },
              ]}
            >
              Total
            </Text>
            <Text
              style={{
                fontSize: 28,
                fontFamily: "Bold",
                color: colors.primaryColor,
              }}
            >
              ${fare}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingVertical: 10 },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 100 },
  mainTitle: {
    marginTop: 32,
  },
  stepIndicator: { marginTop: 4 },
  progressContainer: { flexDirection: "row", marginTop: 16, marginBottom: 32 },
  progressStep: { flex: 1, height: 4, borderRadius: 2, marginRight: 6 },
  sectionSubtitle: {
    marginTop: 4,
    marginBottom: 20,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainerSelected: { backgroundColor: "#2E66E7" },
  cardDesc: { marginTop: 4 },
  badge: {
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 8,
  },
  badgeText: { color: "#15803D", fontSize: 10, fontWeight: "700" },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: -150,
  },
  gridCard: {
    width: "48%",
    aspectRatio: 1,
    borderRadius: 16,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  gridIcon: { marginBottom: 12 },
  vehicleThumb: {
    width: 60,
    height: 40,
    backgroundColor: "#E2E8F0",
    borderRadius: 8,
  },
  priceText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#2E66E7",
    marginTop: 8,
  },

  continueButton: {
    backgroundColor: "#2E66E7",
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#2E66E7",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  continueText: { color: "#FFF", fontSize: 16, fontWeight: "700" },
  row: { flexDirection: "row", alignItems: "center" },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  placeholder: { height: 300, alignItems: "center", justifyContent: "center" },
  reviewCard: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#F8FAFC",
    marginBottom: 16,
  },
  reviewHeader: { fontWeight: "700", fontSize: 16 },

  title: { fontSize: 24, fontWeight: "800", color: "#0F172A" },

  progressBar: { flexDirection: "row", gap: 6, marginBottom: 32 },
  progressSegment: { height: 4, flex: 1, borderRadius: 2 },
  activeSegment: { backgroundColor: "#2563EB" },
  inactiveSegment: { backgroundColor: "#E2E8F0" },

  subLabel: { marginTop: 4, marginBottom: 20 },

  choiceCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  activeIconBox: { backgroundColor: "#2563EB" },
  choiceTextContainer: { flex: 1 },
  choiceDesc: { marginTop: 2 },
  routePill: {
    paddingVertical: 4,
    borderRadius: 10,
    alignSelf: "flex-start",
    marginTop: 8,
  },
  checkCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
  },

  inputGroup: { marginBottom: 24 },
  inputLabel: { marginBottom: 8 },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, fontSize: 14, fontWeight: "600", color: "#1E293B" },

  primaryContinueBtn: {
    height: 56,
    backgroundColor: "#2563EB",
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  primaryContinueText: { color: "#FFF", fontSize: 16, fontWeight: "700" },

  dateTimeRow: { flexDirection: "row", gap: 12 },
  dateTimeInput: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
  },

  toggleCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 32,
  },
  toggleInfo: { flexDirection: "row", alignItems: "center", gap: 12 },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
  },
  toggleSub: { marginTop: 2 },

  frequencyGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 24,
  },
  gridItem: {
    width: "48%",
    height: 52,
    borderRadius: 16,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  datePickerInput: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 56,
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 24,
  },

  tabContainer: {
    flexDirection: "row",
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  activeTab: {
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    borderWidth: 1,
  },

  infoCard: {
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  recurringBorder: { borderColor: "#2563EB", borderWidth: 1 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  editBtn: { flexDirection: "row", alignItems: "center", gap: 4 },

  detailRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  detailLabel: { marginLeft: 8, flex: 1 },
  placeholderIcon: { width: 16 },

  routeItem: { flexDirection: "row", marginBottom: 16 },
  routeTextContainer: { marginLeft: 12 },
  routeLabel: {
    textTransform: "uppercase",
  },
  addressText: {
    marginTop: 2,
  },
  divider: { height: 1, marginVertical: 12 },
  dateValue: {
    marginTop: 2,
  },

  passengerHeader: { flexDirection: "row", alignItems: "center", gap: 12 },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
  },
  reviewBadge: {
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 8,
  },
  reviewBadgeText: { fontSize: 10, fontWeight: "700", color: "#92400E" },
  pillRow: { flexDirection: "row", gap: 6, marginTop: 6 },
  grayPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  notesLabel: {
    marginTop: 16,
  },
  notesText: { marginTop: 4 },

  disclaimer: {
    textAlign: "center",
    marginTop: 4,
    marginBottom: 24,
  },

  approvalNotice: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  approvalTitle: {
    marginBottom: 4,
  },
  approvalText: { lineHeight: 18 },

  paymentCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 16,
    position: "relative",
  },
  defaultBadge: {
    position: "absolute",
    top: -10,
    left: 20,
    backgroundColor: "#FFF",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  cardInfo: { flexDirection: "row", alignItems: "center", gap: 16 },
  logoContainer: {
    width: 60,
    height: 40,
    backgroundColor: "#F8FAFC",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  cardTypeLogo: { fontSize: 14, fontWeight: "900", fontStyle: "italic" },
  mcCircle: { width: 20, height: 20, borderRadius: 10, opacity: 0.8 },
  expiry: { marginTop: 2 },

  addNewBtn: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderRadius: 20,
    borderWidth: 2,
    borderStyle: "dashed",
    gap: 16,
    marginBottom: 32,
  },
  plusIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
  },
  addNewSub: { fontSize: 13, color: "#94A3B8", marginTop: 2 },

  summaryCard: { borderRadius: 24, padding: 24 },
  summaryTitle: {
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  summaryDivider: { height: 1, backgroundColor: "#E2E8F0", marginVertical: 16 },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  payBtn: {
    height: 64,
    backgroundColor: "#2563EB",
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  payBtnText: { color: "#FFF", fontSize: 18, fontWeight: "700" },

  iconGlow: {
    width: 106,
    height: 106,
    borderRadius: 60,
    backgroundColor: "rgba(16, 185, 129, 0.1)", // Light emerald glow
    justifyContent: "center",
    alignItems: "center",
  },
  checkmarkCircle: {
    width: 96,
    height: 96,
    borderRadius: 50,
    backgroundColor: "#10B981", // Emerald 500
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },

  statusInfo: {
    textAlign: "center",
    lineHeight: 24,
  },
  statusDetail: {
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 16,
  },

  amountCard: {
    width: "100%",
    borderRadius: 24,
    paddingVertical: 32,
    alignItems: "center",
    marginBottom: 24,
  },
  amountLabel: {
    letterSpacing: 1,
    marginBottom: 8,
  },

  statusBtn: {
    width: "100%",
    height: 64,
    backgroundColor: "#2563EB",
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  statusBtnText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "700",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  cardGroup: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: "hidden",
  },

  paymentRow: { flexDirection: "row", alignItems: "center", padding: 16 },

  textContent: { flex: 1, marginLeft: 12 },
  titleRow: { flexDirection: "row", alignItems: "center" },
  defaultText: { color: "#22C55E", fontSize: 10, fontWeight: "800" },
});

export default BookingPayment;
