import React, { useRef, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  Alert,
  Linking,
} from "react-native";
import {
  X,
  Phone,
  Calendar,
  MapPin,
  Navigation,
  Clock,
  CircleDot,
} from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useTheme from "../../../hooks/useThemes";
import { commonStyles } from "../../../styles/commonStyles";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Buttons from "../../../components/buttons/buttons";
import { useRideDetail } from "../../../hooks/queries/useRideDetails";
import { RideDetailsSkeleton } from "../../../components/skelentonAnimation/rideDetailsSkelenton";
import { formatHumanReadableDate } from "../../../utils/formatHumanReadableDate";
import OverlayBottomSheet, {
  OverlayBottomSheetRef,
} from "../../../components/modals/overlayBottomSheet";
import {
  useCancelRide,
  useUpdateRideStatus,
} from "../../../hooks/mutations/useRide";
import RideRouteCard from "../../../components/map/rideRouteCard";
import { milesToKm } from "../../../utils/milesToKilometer";
import { formatDuration } from "../../../utils/formatDuration";
import { formatPrice } from "../../../utils/formatPrice";

const RideDetails = () => {
  const { colors, theme } = useTheme();
  const commonStyling = commonStyles(colors);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const route = useRoute<any>();
  const { id } = route.params;
  const { data, isLoading } = useRideDetail(id);
  const cancelRef = useRef<OverlayBottomSheetRef>(null);
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const { mutate: updateStatus, isPending } = useUpdateRideStatus();
  const { mutate: cancelRide, isPending: isCancelling } = useCancelRide(id);

  const reasons = [
    { id: "1", text: "Rider taking too long" },
    { id: "2", text: "Currently not available" },
  ];

  if (isLoading || !data) {
    return <RideDetailsSkeleton />;
  }

  const activeRide = data?.data;

  console.log(activeRide);

  const callRider = async () => {
    const phoneNumber = activeRide?.rider_phone;

    if (!phoneNumber) {
      Alert.alert("Error", "Rider phone number not available");
      return;
    }

    const url = `tel:${phoneNumber}`;

    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert("Error", "Phone dialer is not supported");
    }
  };

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
      <View
        style={[
          styles.header,
          {
            borderBottomColor: colors.lightPrimaryBlueBorder,
          },
        ]}
      >
        <View>
          <Text
            style={[
              commonStyling.title,
              {
                fontSize: 20,
                fontFamily: "Bold",
              },
            ]}
          >
            Ride Details
          </Text>
          <View style={styles.statusRow}>
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor: colors.surfaceBrand,
                },
              ]}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: "Medium",
                  color: colors.primaryColor,
                }}
              >
                Scheduled
              </Text>
            </View>
            <Text
              style={[
                commonStyling.subtitle,
                {
                  fontSize: 12,
                },
              ]}
            >
              {" "}
              {formatHumanReadableDate(data?.data.scheduled_at)}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => {
            navigation.goBack();
          }}
        >
          <X color="#0F172A" size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Rider Information */}
        <Text
          style={[
            styles.sectionLabel,
            commonStyling.subtitle,
            {
              fontSize: 10,
              fontFamily: "Medium",
            },
          ]}
        >
          RIDER INFORMATION
        </Text>
        <View
          style={[
            styles.card,
            {
              borderColor: colors.lightPrimaryBlueBorder,
            },
          ]}
        >
          <View style={styles.riderRow}>
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarIcon}>👤</Text>
            </View>
            <View style={styles.riderInfo}>
              <Text
                style={[
                  commonStyling.title,
                  {
                    fontSize: 16,
                    fontFamily: "Bold",
                  },
                ]}
              >
                {data?.data.rider_name}
              </Text>
              <Text
                style={[
                  styles.riderStats,
                  commonStyling.subtitle,
                  {
                    fontSize: 12,
                  },
                ]}
              >
                ⭐ {data?.data.rider_rating} • {data?.data.rider_trip_count}{" "}
                rides
              </Text>
              <View style={[styles.medicalBadge]}>
                <CircleDot size={12} color={colors.primaryColor} />
                <Text
                  style={{
                    fontSize: 10,
                    fontFamily: "Medium",
                    color: colors.primaryColor,
                  }}
                >
                  {data?.data?.ride_type?.charAt(0).toUpperCase() +
                    data?.data?.ride_type?.slice(1)}
                </Text>
              </View>
            </View>
           {data?.data.rider_phone && (<TouchableOpacity style={styles.phoneButton} onPress={callRider}>
              <Phone size={20} color="#FFF" fill="#FFF" />
            </TouchableOpacity>)}
          </View>
        </View>

        {/* Schedule */}

        {data?.data.appointment_time && (
          <View>
            <Text
              style={[
                styles.sectionLabel,
                commonStyling.subtitle,
                {
                  fontSize: 10,
                  fontFamily: "Medium",
                },
              ]}
            >
              SCHEDULE
            </Text>
            <View
              style={[
                styles.card,
                {
                  borderColor: colors.lightPrimaryBlueBorder,
                },
              ]}
            >
              <View style={styles.scheduleRow}>
                <View style={styles.calendarIconBg}>
                  <Calendar size={22} color="#3B82F6" />
                </View>
                <View>
                  <Text
                    style={[
                      commonStyling.title,
                      {
                        fontSize: 16,
                        fontFamily: "Bold",
                      },
                    ]}
                  >
                    {formatHumanReadableDate(data?.data.appointment_time)}
                  </Text>
                  <Text
                    style={[
                      commonStyling.subtitle,
                      {
                        fontSize: 12,
                      },
                    ]}
                  >
                    Pickup time
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Route */}
        <Text
          style={[
            styles.sectionLabel,
            commonStyling.subtitle,
            {
              fontSize: 10,
              fontFamily: "Medium",
            },
          ]}
        >
          ROUTE
        </Text>
        <View
          style={[
            styles.card,
            {
              borderColor: colors.lightPrimaryBlueBorder,
            },
          ]}
        >
          <RideRouteCard
            pickup={data?.data.pickup_address}
            destination={data?.data.destination_address}
          />
        </View>

        {/* Trip Details Metrics */}
        <Text
          style={[
            styles.sectionLabel,
            commonStyling.subtitle,
            {
              fontSize: 10,
              fontFamily: "Medium",
            },
          ]}
        >
          TRIP DETAILS
        </Text>
        <View style={styles.metricsContainer}>
          <View
            style={[
              styles.metricItem,
              {
                borderColor: colors.lightPrimaryBlueBorder,
              },
            ]}
          >
            <View
              style={[
                styles.metricIconBg,
                {
                  backgroundColor: colors.surfaceSecondary,
                },
              ]}
            >
              <MapPin size={20} color="#64748B" />
            </View>
            <Text
              style={[
                styles.metricLabel,
                commonStyling.subtitle,
                {
                  fontSize: 10,
                },
              ]}
            >
              Distance
            </Text>
            <Text
              style={[
                commonStyling.title,
                {
                  fontSize: 14,
                  fontFamily: "Bold",
                },
              ]}
            >
              {milesToKm(
                data?.data.estimated_distance_miles ||
                 ( data?.data.actual_distance_miles ?? 0.0),
              )}
            </Text>
          </View>
          <View
            style={[
              styles.metricItem,
              {
                borderColor: colors.lightPrimaryBlueBorder,
              },
            ]}
          >
            <View
              style={[
                styles.metricIconBg,
                {
                  backgroundColor: colors.surfaceSecondary,
                },
              ]}
            >
              <Clock size={20} color="#64748B" />
            </View>
            <Text
              style={[
                styles.metricLabel,
                commonStyling.subtitle,
                {
                  fontSize: 10,
                },
              ]}
            >
              Duration
            </Text>
            <Text
              style={[
                commonStyling.title,
                {
                  fontSize: 14,
                  fontFamily: "Bold",
                },
              ]}
            >
              {formatDuration(
                data?.data.actual_duration_minutes ||
                  data?.data.estimated_duration_minutes,
              )}
            </Text>
          </View>
          <View
            style={[
              styles.metricItem,
              {
                borderColor: colors.lightPrimaryBlueBorder,
              },
            ]}
          >
            <View
              style={[
                styles.metricIconBg,
                {
                  backgroundColor: colors.surfaceSecondary,
                },
              ]}
            >
              <Text style={styles.fareIcon}>$</Text>
            </View>
            <Text
              style={[
                styles.metricLabel,
                commonStyling.subtitle,
                {
                  fontSize: 10,
                },
              ]}
            >
              Fare
            </Text>
            <Text
              style={[
                commonStyling.title,
                {
                  fontSize: 14,
                  fontFamily: "Bold",
                  color: "#10B981",
                },
              ]}
            >
              {formatPrice(data.data.estimated_fare, true)}
            </Text>
          </View>
        </View>

        <Buttons
          title="Navigate to Pickup"
          loading={isPending}
          onPress={() => {
            if (!data?.data?.id) return;
            if (
              activeRide?.timeline?.at(-1).to_status === "driver_en_route" ||
              activeRide?.timeline?.at(-1).to_status === "driver_arrived" ||
              activeRide?.timeline?.at(-1).to_status === "in_progress"
            ) {
              navigation.navigate("TripInProgress", {
                activeRide,
                role: "driver",
              });
              return;
            }
            updateStatus(
              {
                rideId: data.data.id,
                payload: {
                  status: "driver_en_route",
                  notes: "",
                },
              },
              {
                onSuccess: (responseData) => {
                  navigation.navigate("TripInProgress", {
                    activeRide,
                    role: "driver",
                  });
                },
              },
            );
          }}
        />

        <View
          style={{
            marginTop: 16,
          }}
        >
          <Buttons
            type="cancel"
            title="Cancel Ride"
            onPress={() => {
              cancelRef.current?.open();
            }}
          />
        </View>
      </ScrollView>

      <OverlayBottomSheet ref={cancelRef} height={600} overlay={true}>
        <View>
          <View
            style={[
              styles.contentCard,
              {
                backgroundColor: colors.surfacePrimary,
              },
            ]}
          >
            {/* Circular Close Icon (Matches design position) */}

            <View style={styles.innerContent}>
              <View
                style={{
                  alignItems: "center",
                }}
              >
                <TouchableOpacity>
                  <View style={styles.closeCircle}>
                    <X color="#EF4444" size={32} strokeWidth={3} />
                  </View>
                </TouchableOpacity>
                <Text
                  style={[
                    styles.titleText,
                    commonStyling.title,
                    {
                      fontSize: 26,
                      fontFamily: "Bold",
                    },
                  ]}
                >
                  Cancel Ride?
                </Text>
                <Text
                  style={[
                    styles.subtitleText,
                    commonStyling.subtitle,
                    {
                      fontSize: 15,
                      width: "100%",
                    },
                  ]}
                >
                  Your have been assigned. Cancelling now would notify rider of
                  changes.
                </Text>
              </View>
              <View
                style={[
                  styles.divider,
                  {
                    backgroundColor: colors.lightPrimaryBlueBorder,
                  },
                ]}
              />

              {/* Why are you cancelling? Section */}
              <Text
                style={[
                  styles.sectionTitle,
                  commonStyling.title,
                  {
                    fontSize: 18,
                  },
                ]}
              >
                Why are you cancelling?
              </Text>

              <View style={styles.reasonsList}>
                {reasons.map((reason) => (
                  <TouchableOpacity
                    key={reason.id}
                    style={styles.reasonItem}
                    onPress={() => setSelectedReason(reason.text)}
                  >
                    <View
                      style={[
                        styles.radioOutline,
                        selectedReason === reason.text && styles.radioActive,
                      ]}
                    >
                      {selectedReason === reason.text && (
                        <View style={styles.radioInner} />
                      )}
                    </View>
                    <Text
                      style={[
                        commonStyling.subtitle,
                        {
                          fontSize: 15,
                        },
                      ]}
                    >
                      {reason.text}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonFooter}>
              <TouchableOpacity
                style={[
                  styles.cancelRideButton,
                  { opacity: selectedReason ? 1 : 0.6 }, // Dim if no reason selected
                ]}
                onPress={
                  selectedReason
                    ? () =>
                        cancelRide(
                          { reason: selectedReason },
                          {
                            onSuccess: () => {
                              navigation.goBack();
                            },
                          },
                        )
                    : undefined
                }
                disabled={!selectedReason}
              >
                {isCancelling ? (
                  <ActivityIndicator />
                ) : (
                  <Text style={styles.cancelButtonText}>Cancel Ride</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.keepRideButton}
                onPress={() => {
                  cancelRef.current?.close();
                }}
              >
                <Text style={styles.keepButtonText}>Keep Ride</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </OverlayBottomSheet>
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
    borderBottomWidth: 1,
  },

  statusRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },

  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
  },

  scrollContent: { padding: 20 },
  sectionLabel: {
    letterSpacing: 1,
    marginBottom: 12,
    marginTop: 10,
  },

  card: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
  },
  riderRow: { flexDirection: "row", alignItems: "center" },
  avatarPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarIcon: { fontSize: 24 },
  riderInfo: { flex: 1, marginLeft: 16 },

  riderStats: { marginVertical: 2 },
  medicalBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  phoneButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#3B82F6",
    justifyContent: "center",
    alignItems: "center",
  },

  scheduleRow: { flexDirection: "row", alignItems: "center", gap: 16 },
  calendarIconBg: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
  },

  routeRow: { flexDirection: "row", gap: 16 },
  timeline: { alignItems: "center", width: 20, paddingTop: 6 },
  pickupDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#3B82F6",
  },
  line: { width: 2, flex: 1, backgroundColor: "#F1F5F9", marginVertical: 4 },
  destDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#EF4444",
  },
  addressContainer: { flex: 1 },
  addressLabel: { marginBottom: 2 },

  metricsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 32,
  },
  metricItem: {
    flex: 1,
    borderRadius: 20,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    marginHorizontal: 4,
  },
  metricIconBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  fareIcon: { fontSize: 18, fontWeight: "700", color: "#10B981" },
  metricLabel: { marginBottom: 4 },

  navigateButton: {
    backgroundColor: "#2563EB",
    height: 60,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  navigateButtonText: { color: "#FFF", fontSize: 16, fontWeight: "700" },
  cancelButton: {
    height: 60,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#FEE2E2",
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButtonText: { color: "#ffffff", fontSize: 16, fontWeight: "700" },

  headerTitle: { fontSize: 20, fontWeight: "800", color: "#1E293B" },
  headerSubRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  headerTimeText: { fontSize: 13, color: "#64748B", marginLeft: 6 },

  statusBadgeText: { color: "#10B981", fontSize: 11, fontWeight: "700" },

  routeContainer: { flexDirection: "row" },

  dotBlue: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#3B82F6",
  },
  dotBlueDark: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#1E293B",
  },

  addrText: { marginTop: 2 },

  driverProfileRow: { flexDirection: "row", alignItems: "center" },
  driverAvatar: { width: 50, height: 50, borderRadius: 25 },
  driverTextContainer: { flex: 1, marginLeft: 12 },

  vehicleBox: {
    padding: 12,
    borderRadius: 12,
    marginTop: 16,
  },
  vehicleLabel: { fontSize: 11, color: "#94A3B8" },
  vehicleText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1E293B",
    marginTop: 2,
  },

  etaTextLarge: {
    marginTop: 4,
  },
  iconCircleLightBlue: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
  },

  fareLabel: { fontSize: 14, color: "#64748B" },
  fareValue: { fontSize: 14, fontWeight: "700", color: "#1E293B" },
  fareDivider: { height: 1, backgroundColor: "#F1F5F9", marginVertical: 12 },
  totalLabel: { fontSize: 16, fontWeight: "800", color: "#1E293B" },
  totalValue: { fontSize: 20, fontWeight: "800", color: "#3B82F6" },
  paymentRow: { flexDirection: "row", alignItems: "center", marginTop: 16 },
  paymentIcon: { width: 32, height: 20, resizeMode: "contain" },
  paymentText: { fontSize: 14, color: "#64748B", marginLeft: 8 },

  policyCard: {
    flexDirection: "row",
    backgroundColor: "#FFFBEB",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    alignItems: "flex-start",
  },
  policyTextContainer: { flex: 1, marginLeft: 12 },
  policyTitle: { fontSize: 13, fontWeight: "800", color: "#92400E" },
  policySub: { fontSize: 12, color: "#B45309", marginTop: 4, lineHeight: 18 },

  assistanceItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 16,
    marginBottom: 8,
  },
  iconCircleGray: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },

  assistanceSub: { fontSize: 12, color: "#64748B" },

  contactBtn: {
    backgroundColor: "#3B82F6",
    height: 56,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    gap: 10,
  },
  contactBtnText: { color: "#FFF", fontSize: 16, fontWeight: "800" },
  shareBtn: {
    backgroundColor: "#EFF6FF",
    height: 56,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
    gap: 10,
  },
  shareBtnText: { color: "#3B82F6", fontSize: 16, fontWeight: "800" },
  cancelLink: { marginTop: 24, alignItems: "center", marginBottom: 20 },
  cancelLinkText: { color: "#EF4444", fontWeight: "800", fontSize: 15 },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rowCenter: { flexDirection: "row", alignItems: "center" },

  tripId: { marginTop: 2, marginLeft: 4 },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  contentCard: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    position: "relative", // needed for positioning the close modal icon
  },
  innerContent: {
    paddingHorizontal: 24,
    paddingBottom: 16,
  },

  // Positioning the circular "X" outside the main text area like the design

  closeCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#FEF2F2",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FCA5A5",
    marginTop: 16,
  },

  titleText: {
    textAlign: "center",
    marginTop: 16,
    marginBottom: 12,
  },
  subtitleText: {
    textAlign: "center",
    lineHeight: 24,
  },

  divider: {
    height: 1,
    marginTop: 32,
    marginBottom: 24,
    marginHorizontal: -24,
  },

  sectionTitle: {
    marginBottom: 20,
  },
  reasonsList: { gap: 16, marginBottom: 16 },
  reasonItem: { flexDirection: "row", alignItems: "center", gap: 12 },
  radioOutline: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
    justifyContent: "center",
    alignItems: "center",
  },
  radioActive: { borderColor: "#EF4444" },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#EF4444",
  },

  buttonFooter: { padding: 24, borderTopWidth: 1, borderTopColor: "#F8FAFC" },
  cancelRideButton: {
    height: 56,
    backgroundColor: "#EF4444",
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  keepRideButton: {
    height: 56,
    backgroundColor: "#F8FAFC",
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
  },
  keepButtonText: { color: "#64748B", fontSize: 16, fontWeight: "700" },
});

export default RideDetails;
