import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
} from "react-native";
import Toast from "react-native-toast-message";
import {
  X,
  Car,
  Calendar,
  Clock,
  User,
  Check,
  Navigation2,
} from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useTheme from "../../../hooks/useThemes";
import { commonStyles } from "../../../styles/commonStyles";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Buttons from "../../../components/buttons/buttons";
import { useRideDetail } from "../../../hooks/queries/useRideDetails";
import { formatTripTime } from "../../../utils/formatTripTime";
import RideStatusSkeleton from "../../../components/skelentonAnimation/rideStatusSkelenton";
import { formatDateReadable } from "../../../utils/formatDate";
import { formatPrice } from "../../../utils/formatPrice";
import { formatDisplayText } from "../../../utils/formatText";
import RideRouteCard from "../../../components/map/rideRouteCard";
import { useCancelRide } from "../../../hooks/mutations/useRide";
import { useDriverContact } from "../../../hooks/queries/useDriverContact";
import { usePaymentReceipt } from "../../../hooks/queries/usePaymentReceipt";

// Backend RideStatus values (lowercase snake_case).
const DRIVER_STATUSES = [
  "driver_assigned",
  "driver_en_route",
  "driver_arrived",
  "in_progress",
];
const CANCELLABLE_STATUSES = [
  "pending",
  "requested",
  "pending_business_assignment",
  "confirmed",
  "driver_assigned",
  "driver_en_route",
  "driver_arrived",
];

const RideStatusScreen = () => {
  const { colors, theme } = useTheme();
  const route = useRoute<any>();
  const commonStyling = commonStyles(colors);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const rideId = route.params.rideId;

  const { data: rideDetails, isLoading: loadingRideDetail } =
    useRideDetail(rideId);
  const rideDetail: any = rideDetails?.data;
  const status: string = rideDetail?.status ?? "";

  const hasDriverCard = DRIVER_STATUSES.includes(status) && !!rideDetail?.driver_id;
  const canTrack = hasDriverCard;
  const canCancel = CANCELLABLE_STATUSES.includes(status);

  const { data: driverContact } = useDriverContact(rideId, hasDriverCard);
  const driver: any = driverContact?.data;
  const driverName = driver
    ? `${driver.first_name ?? ""} ${driver.last_name ?? ""}`.trim()
    : "";
  const vehicleText = driver
    ? [driver.vehicle_color, driver.vehicle_make, driver.vehicle_model]
        .filter(Boolean)
        .join(" ") + (driver.vehicle_plate ? ` - ${driver.vehicle_plate}` : "")
    : "";
  // Backend returns null for drivers with no ratings yet.
  const driverRating: number | null =
    typeof driver?.rating === "number" ? driver.rating : null;

  const { data: paymentReceipt } = usePaymentReceipt(rideId);
  const paymentStatus: string =
    paymentReceipt?.data?.payment_status ?? "not_recorded";
  const paymentBadges: Record<
    string,
    { label: string; bg: string; fg: string }
  > = {
    paid: { label: "Payment confirmed", bg: "#F0FDF4", fg: "#047857" },
    pending: { label: "Payment pending", bg: "#FEF3C7", fg: "#92400E" },
    failed: { label: "Payment failed", bg: "#FEE2E2", fg: "#B91C1C" },
    refunded: { label: "Payment refunded", bg: "#E0F2FE", fg: "#0369A1" },
  };
  const paymentBadge = paymentBadges[paymentStatus];
  const fareAmount: number | null =
    rideDetail?.final_fare ?? rideDetail?.estimated_fare ?? null;

  const banner = (() => {
    switch (status) {
      case "driver_assigned":
        return { label: "Driver assigned", bg: colors.lightGreen, fg: colors.darkGreen };
      case "driver_en_route":
        return { label: "Driver is on the way", bg: colors.lightGreen, fg: colors.darkGreen };
      case "driver_arrived":
        return { label: "Driver has arrived", bg: colors.lightGreen, fg: colors.darkGreen };
      case "in_progress":
        return { label: "Ride in progress", bg: colors.lightGreen, fg: colors.darkGreen };
      case "completed":
        return { label: "Ride completed", bg: colors.lightGreen, fg: colors.darkGreen };
      case "cancelled":
        return { label: "Ride cancelled", bg: colors.highlightRed, fg: colors.highlightRed150 };
      case "no_show":
        return { label: "Marked as no-show", bg: colors.highlightRed, fg: colors.highlightRed150 };
      case "confirmed":
        return { label: "Request confirmed. Finding your driver", bg: colors.lightYellow, fg: colors.darkYellow };
      default:
        return {
          label: "Awaiting request approval and confirmation",
          bg: colors.lightYellow,
          fg: colors.darkYellow,
        };
    }
  })();

  const { mutate: cancelRide, isPending: isCancelling } =
    useCancelRide(rideId);

  const handleCancelPress = () => {
    if (isCancelling) return;
    Alert.alert(
      "Cancel this ride?",
      "Are you sure you want to cancel this ride?",
      [
        { text: "Keep Ride", style: "cancel" },
        {
          text: "Cancel Ride",
          style: "destructive",
          onPress: () =>
            cancelRide(
              { reason: "Cancelled by rider" },
              {
                onSuccess: () => {
                  Toast.show({
                    type: "tripToast",
                    text1: "Ride cancelled",
                    text2: "Your ride has been cancelled.",
                  });
                  navigation.navigate("RiderMainTabs");
                },
                onError: (error: any) => {
                  const detail = error?.response?.data?.detail;
                  Toast.show({
                    type: "errorToast",
                    text1: "Could not cancel ride",
                    text2:
                      (typeof detail === "string"
                        ? detail
                        : detail?.[0]?.msg) ||
                      error?.response?.data?.message ||
                      "Please try again.",
                  });
                },
              },
            ),
        },
      ],
    );
  };

  const handleTrack = () => {
    if (!canTrack || !rideDetail?.id) {
      Alert.alert(
        "Tracking unavailable",
        "Live tracking is available once a driver is assigned.",
      );
      return;
    }
    navigation.navigate("RiderRideDetailsStack", {
      screen: "TripInProgress",
      params: {
        role: "rider",
        activeRide: {
          ...rideDetail,
          driver_name: driverName || null,
          driver_phone: driver?.phone ?? null,
          driver_avatar_url: driver?.avatar_url ?? null,
          driver_rating: driverRating,
          driver_vehicle_make: driver?.vehicle_make ?? null,
          driver_vehicle_type: driver?.vehicle_type ?? null,
          driver_vehicle_model: driver?.vehicle_model ?? null,
        },
      },
    });
  };

  if (loadingRideDetail) {
    return <RideStatusSkeleton />;
  }

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
      {/* Header */}
      <View style={styles.header}>
        <Text
          style={[
            commonStyling.title,
            {
              fontSize: 24,
              fontFamily: "Bold",
            },
          ]}
        >
          Your Ride
        </Text>
        <TouchableOpacity
          style={styles.closeBtn}
          onPress={() => {
            navigation.navigate("RiderMainTabs");
          }}
        >
          <X color="#0F172A" size={20} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Status Banner */}
        <View
          style={[
            styles.awaitingBanner,
            {
              backgroundColor: banner.bg,
              marginBottom: hasDriverCard ? 60 : 24,
            },
          ]}
        >
          <View style={[styles.orangeDot, { backgroundColor: banner.fg }]} />
          <Text
            style={{
              color: banner.fg,
              fontSize: 13,
              fontFamily: "SemiBold",
            }}
          >
            {banner.label}
          </Text>
        </View>

        {hasDriverCard && (
          <View
            style={[
              styles.trackingCard,
              {
                borderColor: colors.lightPrimaryBlueBorder,
              },
            ]}
          >
            {/* Driver status badge */}
            <View style={styles.arrivingBadge}>
              <Navigation2 size={16} color="#FFF" fill="#FFF" />
              <Text style={styles.arrivingText}>{banner.label}</Text>
              <View style={styles.whitePulseDot} />
            </View>

            {/* Driver Info */}
            <View
              style={[
                styles.driverFooter,
                {
                  backgroundColor: colors.cardBackground,
                  marginTop: 20,
                },
              ]}
            >
              <View style={{ flex: 1 }}>
                <View style={styles.driverNameRow}>
                  <View
                    style={[
                      styles.orangeDot,
                      { width: 8, height: 8, backgroundColor: colors.green },
                    ]}
                  />
                  <Text
                    style={[
                      commonStyling.title,
                      {
                        fontSize: 13,
                        fontFamily: "SemiBold",
                      },
                    ]}
                  >
                    {driverName
                      ? `${driverName} is your driver`
                      : "Your driver details are loading"}
                  </Text>
                </View>
                {vehicleText ? (
                  <Text
                    style={[
                      commonStyling.subtitle,
                      {
                        fontSize: 12,
                        marginTop: 4,
                      },
                    ]}
                  >
                    {vehicleText}
                  </Text>
                ) : null}
              </View>
              {driverRating != null && (
                <Text
                  style={[
                    commonStyling.title,
                    { fontSize: 13, fontFamily: "SemiBold" },
                  ]}
                >
                  {"\u2605 "}
                  {Number(driverRating).toFixed(1)}
                </Text>
              )}
            </View>
          </View>
        )}

        {/* Booking Details Card */}
        <View
          style={[
            styles.card,
            {
              borderColor: colors.lightPrimaryBlueBorder,
            },
          ]}
        >
          <Text
            style={[
              styles.cardHeading,
              commonStyling.title,
              {
                fontSize: 13,
                fontFamily: "Bold",
              },
            ]}
          >
            BOOKING DETAILS
          </Text>

          {/* Service Section */}
          <View style={styles.sectionRow}>
            <View style={styles.iconCircle}>
              <Car size={18} color="#64748B" />
            </View>
            <View>
              <Text
                style={[
                  styles.sectionLabel,
                  commonStyling.subtitle,
                  {
                    fontSize: 11,
                    fontFamily: "SemiBold",
                  },
                ]}
              >
                SERVICE
              </Text>
              <Text
                style={[
                  commonStyling.title,
                  {
                    fontSize: 13,
                    fontFamily: "SemiBold",
                  },
                ]}
              >
                {formatDisplayText(rideDetail?.ride_type)}
              </Text>
              <Text
                style={[
                  styles.subInfoText,
                  commonStyling.subtitle,
                  {
                    fontSize: 13,
                  },
                ]}
              >
                {formatDisplayText(rideDetail?.trip_type)}
              </Text>
            </View>
          </View>

          {/* Route Section */}
          <View style={styles.routeSection}>
            <Text
              style={[
                styles.sectionLabelSmall,
                commonStyling.subtitle,
                {
                  fontSize: 11,
                  fontFamily: "SemiBold",
                },
              ]}
            >
              ROUTE
            </Text>

            <RideRouteCard
              pickup={rideDetail?.pickup_address}
              destination={rideDetail?.destination_address}
            />
          </View>

          <View
            style={[
              styles.divider,
              {
                backgroundColor: colors.lightPrimaryBlueBorder,
              },
            ]}
          />

          {/* Date & Time Row */}
          <View style={styles.rowBetween}>
            <View style={styles.dateTimeItem}>
              <Text
                style={[
                  styles.sectionLabelSmall,
                  commonStyling.subtitle,
                  {
                    fontSize: 11,
                    fontFamily: "SemiBold",
                  },
                ]}
              >
                DATE
              </Text>
              <View style={styles.infoRowIcon}>
                <Calendar size={16} color="#64748B" />
                <Text
                  style={[
                    commonStyling.title,
                    {
                      fontSize: 13,
                      fontFamily: "SemiBold",
                    },
                  ]}
                >
                  {formatDateReadable(rideDetail?.scheduled_at)}
                </Text>
              </View>
            </View>
            <View style={styles.dateTimeItem}>
              <Text
                style={[
                  styles.sectionLabelSmall,
                  commonStyling.subtitle,
                  {
                    fontSize: 11,
                    fontFamily: "SemiBold",
                  },
                ]}
              >
                TIME
              </Text>
              <View style={styles.infoRowIcon}>
                <Clock size={16} color="#64748B" />
                <Text
                  style={[
                    commonStyling.title,
                    {
                      fontSize: 13,
                      fontFamily: "SemiBold",
                    },
                  ]}
                >
                  {formatTripTime(rideDetail?.appointment_time)}
                </Text>
              </View>
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

          {/* Passenger Section */}
          <View>
            <Text
              style={[
                styles.sectionLabelSmall,
                commonStyling.subtitle,
                {
                  fontSize: 11,
                  fontFamily: "SemiBold",
                },
              ]}
            >
              PASSENGER
            </Text>
            <View style={styles.infoRowIcon}>
              <User size={16} color="#64748B" />
              <Text
                style={[
                  commonStyling.title,
                  {
                    fontSize: 13,
                    fontFamily: "SemiBold",
                  },
                ]}
              >
                {rideDetail?.rider_name}
              </Text>
            </View>
          </View>
        </View>

        {/* Payment Summary Card */}
        <View
          style={[
            styles.card,
            {
              borderColor: colors.lightPrimaryBlueBorder,
            },
          ]}
        >
          <Text
            style={[
              styles.cardHeading,
              commonStyling.title,
              {
                fontSize: 13,
                fontFamily: "Bold",
              },
            ]}
          >
            PAYMENT SUMMARY
          </Text>
          <View style={styles.rowBetween}>
            <Text
              style={[
                commonStyling.subtitle,
                {
                  fontSize: 14,
                },
              ]}
            >
              {paymentStatus === "paid" ? "Total paid" : "Total fare"}
            </Text>
            <Text
              style={{
                color: paymentStatus === "paid" ? "#10B981" : colors.titleText,
                fontSize: 24,
                fontFamily: "Bold",
              }}
            >
              {fareAmount != null ? formatPrice(fareAmount) : "--"}
            </Text>
          </View>

          {paymentBadge && (
            <View
              style={[
                styles.paymentConfirmedBadge,
                { backgroundColor: paymentBadge.bg },
              ]}
            >
              {paymentStatus === "paid" && (
                <Check size={14} color={paymentBadge.fg} strokeWidth={3} />
              )}
              <Text style={[styles.confirmedText, { color: paymentBadge.fg }]}>
                {paymentBadge.label}
              </Text>
            </View>
          )}
        </View>

        {(canTrack || canCancel) && (
          <View
            style={{
              gap: 12,
            }}
          >
            {canTrack && (
              <Buttons title="Track Live Location" onPress={handleTrack} />
            )}
            {canCancel && (
              <Buttons
                type="cancel"
                title="Cancel Ride"
                loading={isCancelling}
                onPress={handleCancelPress}
              />
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },

  awaitingBanner: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 16,
    marginBottom: 24,
  },
  orangeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 10,
  },

  card: {
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    marginBottom: 16,
  },
  cardHeading: {
    marginBottom: 20,
  },

  sectionRow: { flexDirection: "row", gap: 12, marginBottom: 24 },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
  },
  sectionLabel: {
    marginBottom: 2,
  },
  sectionLabelSmall: {
    marginBottom: 8,
  },

  subInfoText: { marginTop: 2 },

  routeSection: { marginBottom: 20 },
  locationRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  locationIconBgBlue: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
  },
  locationIconBgYellow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FEFCE8",
    justifyContent: "center",
    alignItems: "center",
  },
  locationTextContainer: { flex: 1 },

  routeLine: {
    width: 1,
    height: 24,
    backgroundColor: "#E2E8F0",
    marginLeft: 16,
    marginVertical: 4,
  },

  divider: { height: 1, marginVertical: 16 },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dateTimeItem: { flex: 1 },
  infoRowIcon: { flexDirection: "row", alignItems: "center", gap: 8 },

  paymentConfirmedBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#F0FDF4",
    padding: 12,
    borderRadius: 16,
    marginTop: 16,
  },
  confirmedText: { fontSize: 13, fontWeight: "600", color: "#2563EB" },

  trackingCard: {
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    marginBottom: 24,
    alignItems: "center",
  },
  arrivingBadge: {
    flexDirection: "row",
    backgroundColor: "#2563EB",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    alignItems: "center",
    gap: 8,
    top: -50,
    position: "absolute",
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
  },
  arrivingText: { color: "#FFF", fontWeight: "800", fontSize: 15 },
  whitePulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#FFF",
  },

  trackingVisualContainer: { width: "100%", marginTop: 20, marginBottom: 30 },
  visualRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  progressBarBase: {
    flex: 1,
    height: 4,
    backgroundColor: "#E2E8F0",
    marginHorizontal: 10,
    position: "relative",
    borderRadius: 2,
  },
  progressBarActive: {
    position: "absolute",
    left: 0,
    width: "100%",
    height: 4,
    backgroundColor: "#3B82F6",
    borderRadius: 2,
    opacity: 0.5,
  },
  progressCenterDot: {
    position: "absolute",
    left: "50%",
    top: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FFF",
    borderWidth: 2,
    borderColor: "#3B82F6",
  },
  visualLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  visualSubLabel: { marginTop: 2 },

  driverFooter: {
    width: "100%",
    borderRadius: 20,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  driverNameRow: { flexDirection: "row", alignItems: "center", gap: 8 },
});

export default RideStatusScreen;
