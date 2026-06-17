import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import useTheme from "../../hooks/useThemes";
import { commonStyles } from "../../styles/commonStyles";
import { Calendar } from "lucide-react-native";
import formatScheduledDate from "../../utils/formatScheduleDate";
import formatTimeOnly from "../../utils/formatScheduledTime";
import { capitalizeFirstWord } from "../../utils/capitalizeFirstLetter";
import { FONT_SIZES } from "../../constants/sizes";
import { useState } from "react";
import { useCreatePaymentIntent } from "../../hooks/mutations/usePayments";
import { useStripe } from "@stripe/stripe-react-native";
import { useUserProfile } from "../../hooks/queries/useUserProfile";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useQueryClient } from "@tanstack/react-query";
import RideRouteCard from "../map/rideRouteCard";
import Toast from "react-native-toast-message";

const getErrorMessage = (error: any, fallback: string) => {
  const detail = error?.response?.data?.detail;

  if (Array.isArray(detail)) {
    return detail[0]?.msg || fallback;
  }

  return error?.response?.data?.message || detail || error?.message || fallback;
};

const getRidePaymentAmount = (ride: any) => {
  const amount = Number(ride?.final_fare ?? ride?.estimated_fare);

  return Number.isFinite(amount) && amount > 0 ? amount : null;
};

const UpcomingRideCard = ({ onPress, ride }: any) => {
  const { colors } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const commonStyling = commonStyles(colors);
  const [loadingPayment, setloadingPayment] = useState(false);
  const { mutateAsync: getPaymentIntent } = useCreatePaymentIntent();
  const { data: user } = useUserProfile();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const queryClient = useQueryClient();
  const rideTypeLabel = capitalizeFirstWord(ride?.ride_type);
  const tripTypeLabel = capitalizeFirstWord(ride?.trip_type);
  const paymentAmount = getRidePaymentAmount(ride);

  const showPaymentErrorToast = (message: string) => {
    Toast.show({
      type: "errorToast",
      text1: "Payment failed",
      text2: message,
    });
  };

  const openStripePayment = async () => {
    setloadingPayment(true);

    if (!paymentAmount) {
      showPaymentErrorToast("We could not confirm this ride's fare.");
      setloadingPayment(false);
      return;
    }

    try {
      const response = await getPaymentIntent({
        amount: paymentAmount,
        currency: "cad",
        description: "Wallet Funding",
        order_id: ride?.id,
      });

      const { payment_intent, ephemeral_key, customer } = response.data;

      const { error } = await initPaymentSheet({
        merchantDisplayName: "MediGo",
        customerId: customer,
        customerEphemeralKeySecret: ephemeral_key,
        paymentIntentClientSecret: payment_intent,
        allowsDelayedPaymentMethods: true,
        defaultBillingDetails: {
          name: user?.data.first_name,
        },
      });

      if (error) {
        showPaymentErrorToast(
          error.message || "We could not initialize the payment sheet.",
        );
        return;
      }

      const { error: presentError } = await presentPaymentSheet();

      if (presentError) {
        const isCanceled =
          presentError.code === "Canceled" ||
          presentError.code === "CanceledError";

        showPaymentErrorToast(
          isCanceled
            ? "Payment was canceled. You can try again when ready."
            : presentError.message || "Payment could not be completed.",
        );
      } else {
        // Payment successful
        await queryClient.invalidateQueries({
          queryKey: ["my-rides"],
        });

        // optional immediate refetch
        await queryClient.refetchQueries({
          queryKey: ["my-rides"],
        });
      }
    } catch (e) {
      console.error(e);
      showPaymentErrorToast(
        getErrorMessage(
          e,
          "We could not start payment for this ride. Please try again.",
        ),
      );
    } finally {
      setloadingPayment(false);
    }
  };

  return (
    <View
      style={[
        styles.upcomingCard,
        {
          backgroundColor: colors.homelightPrimaryBlue50,
          borderColor: colors.lightPrimaryBlueBorder,
        },
      ]}
    >
      <View style={styles.upcomingHeader}>
        <View style={styles.upcomingDateRow}>
          <View
            style={[
              styles.iconBox,
              {
                backgroundColor: colors.surfaceElevated,
              },
            ]}
          >
            <Calendar color="#3B82F6" size={18} />
          </View>
          <View style={{ marginLeft: 10 }}>
            <Text
              style={[
                commonStyling.title,
                {
                  fontSize: 15,
                  fontWeight: "700",
                  fontFamily: "Bold",
                  marginBottom: 4,
                },
              ]}
            >
              {formatScheduledDate(ride.scheduled_at)}
            </Text>
            <Text
              style={[
                commonStyling.subtitle,
                {
                  fontSize: 12,
                },
              ]}
            >
              {formatTimeOnly(ride.scheduled_at)}
            </Text>
          </View>
        </View>
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor:
                ride.status === "cancelled"
                  ? colors.highlightRed
                  : colors.surfaceElevated,
            },
          ]}
        >
          <Text
            style={[
              styles.statusBadgeText,
              {
                color:
                  ride.status === "cancelled"
                    ? colors.cancelledRed
                    : colors.primaryColor,
              },
            ]}
          >
            {capitalizeFirstWord(ride.status)}
          </Text>
        </View>
      </View>

      <RideRouteCard
        pickup={ride?.pickup_address}
        destination={ride?.destination_address}
      />

      {ride.status !== "cancelled" && (
        <Text style={styles.driverAssignText}>
          {ride.assigned_by_admin_id ? (
            "Driver • John Smith"
          ) : (
            <>
              Medigo {rideTypeLabel}
              {tripTypeLabel ? (
                <Text style={styles.tripTypeText}> ({tripTypeLabel})</Text>
              ) : null}
            </>
          )}
        </Text>
      )}

      <View style={styles.upcomingActions}>
        <TouchableOpacity
          style={styles.detailsBtn}
          onPress={() => {
            ride.status === "pending"
              ? openStripePayment()
              : navigation.navigate("RiderRideDetailsStack", {
                  screen: "RideDetails",
                  params: { id: ride.id },
                });
          }}
        >
          {loadingPayment ? (
            <ActivityIndicator />
          ) : (
            <Text style={styles.detailsBtnText}>
              {ride.status === "pending" ? "Pay now" : "View Details"}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
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
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  headerTitle: { fontSize: 18, fontWeight: "800", color: "#1E293B" },
  notifButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  notifBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#EF4444",
    borderWidth: 1,
    borderColor: "#FFF",
  },

  scrollContent: { paddingHorizontal: 20, paddingBottom: 50 },
  description: { marginBottom: 20 },
  sectionTitle: {
    marginTop: 10,
    marginBottom: 16,
  },

  // Active Card Styles
  activeCard: {
    backgroundColor: "#3B82F6",
    borderRadius: 24,
    padding: 20,
    elevation: 8,
    shadowColor: "#3B82F6",
    shadowOpacity: 0.3,
    shadowRadius: 15,
  },
  activeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  statusRow: { flexDirection: "row", alignItems: "center" },
  pulseDot: {
    width: 9,
    height: 9,
    borderRadius: 4,
    backgroundColor: "#FFF",
    marginRight: 8,
  },
  activeStatusText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 15,
    fontFamily: "Bold",
  },
  etaBadge: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  etaText: { color: "#FFF", fontSize: 12, fontWeight: "700" },
  activeRoute: { flexDirection: "row" },
  timelineActive: { width: 10, alignItems: "center", marginTop: 5 },
  dotWhite: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#FFF" },
  lineDashed: {
    width: 1,
    height: 40,
    borderLeftWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
    borderStyle: "dashed",
    marginVertical: 4,
  },
  addressWrapper: { marginLeft: 15 },
  activeAddressLabel: { color: "rgba(255,255,255,0.7)", fontSize: 11 },
  activeAddressText: {
    marginTop: 4,
  },
  activeDivider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.15)",
    marginVertical: 20,
  },
  driverRow: { flexDirection: "row", alignItems: "center" },
  driverAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#FFF",
  },
  driverInfo: { marginLeft: 12 },
  driverName: { color: "#FFF", fontSize: 15, fontFamily: "Bold" },
  driverSub: { color: "rgba(255,255,255,0.7)", fontSize: 12, marginTop: 4 },
  driverStatusMsg: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 13,
    marginTop: 12,
    fontFamily: "Regular",
  },
  trackButton: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  trackButtonText: {
    color: "#3B82F6",
    fontWeight: "700",
    fontSize: 15,
    fontFamily: "Bold",
  },

  // Upcoming Card Styles
  upcomingCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
  },
  upcomingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  upcomingDateRow: { flexDirection: "row", alignItems: "center" },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusBadgeText: { fontSize: 11, fontFamily: "SemiBold" },
  upcomingRoute: { flexDirection: "row", marginBottom: 16 },
  timelineUpcoming: { width: 8, alignItems: "center", marginTop: 4 },
  dotSmallBlue: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#3B82F6",
  },
  dotSmallDark: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#1E293B",
  },
  lineSmall: {
    width: 1,
    height: 40,
    backgroundColor: "#F1F5F9",
    marginVertical: 2,
  },
  upcomingAddrLabel: { fontSize: 10, color: "#94A3B8", letterSpacing: 0.5 },
  upcomingAddrText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1E293B",
    marginTop: 2,
  },
  driverAssignText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#2563EB",
    marginVertical: 16,
  },
  tripTypeText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#475569",
  },
  upcomingActions: {
    marginTop: 16,
  },
  detailsBtn: {
    backgroundColor: "#3B82F6",
    paddingHorizontal: 24,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    width: "100%",
    alignItems: "center",
  },
  detailsBtnText: { color: "#FFF", fontWeight: "700", fontSize: 14 },
  cancelText: { color: "#EF4444", fontWeight: "700", fontSize: 14 },

  supportFloat: {
    position: "absolute",
    bottom: 100,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },

  routeContainer: { flexDirection: "row", marginBottom: 16 },
  timeline: { alignItems: "center", width: 20, marginTop: 5 },
  dotBlue: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#3B82F6" },
  dotRed: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#EF4444" },
  line: { width: 1, flex: 1, backgroundColor: "#E2E8F0", marginVertical: 4 },
  addressContainer: { flex: 1, marginLeft: 12 },
  addressText: {
    marginTop: 2,
  },
});

export default UpcomingRideCard;
