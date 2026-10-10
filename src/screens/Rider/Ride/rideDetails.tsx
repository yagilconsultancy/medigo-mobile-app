import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Image,
  ActivityIndicator,
} from "react-native";
import {
  X,
  Clock,
  Star,
  AlertCircle,
  Headphones,
  Phone,
  Share2,
  Info,
  CheckCircle,
} from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import useTheme from "../../../hooks/useThemes";
import { commonStyles } from "../../../styles/commonStyles";
import { FONT_SIZES } from "../../../constants/sizes";
import { useRideDetail } from "../../../hooks/queries/useRideDetails";
import { formatHumanReadableDate } from "../../../utils/formatHumanReadableDate";
import { RideDetailsSkeleton } from "../../../components/skelentonAnimation/rideDetailsSkelenton";
import OverlayBottomSheet, {
  OverlayBottomSheetRef,
} from "../../../components/modals/overlayBottomSheet";
import { useCancelRide, useShareRide } from "../../../hooks/mutations/useRide";
import { formatDuration } from "../../../utils/formatDuration";
import { formatPrice } from "../../../utils/formatPrice";
import { useGetFareEstimateMutation } from "../../../hooks/queries/useGetBaseFareEstimate";
import RideRouteCard from "../../../components/map/rideRouteCard";
import { formatDisplayText } from "../../../utils/formatText";

const RideDetails = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { colors, theme } = useTheme();
  const commonStyling = commonStyles(colors);
  const route = useRoute<any>();
  const { id } = route.params || {};
  const cancelRef = useRef<OverlayBottomSheetRef>(null);
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const { mutate: shareTrip, isPending } = useShareRide();
  const { mutate: cancelRide, isPending: isCancelling } = useCancelRide(id);
  const { data, isLoading } = useRideDetail(id);

  const {
    mutate: fetchEstimates,
    isPending:isPendingBaseFareEstimate,
    data: estimateResults,
  } = useGetFareEstimateMutation();

  console.log(estimateResults);

  const handleCalculateFare = () => {
    fetchEstimates({
      pickup_address: data?.data.pickup_address,
      destination_address: data?.data.destination_address,
      pickup_latitude: data?.data.pickup_latitude,
      pickup_longitude: data?.data.pickup_longitude,
      destination_latitude: data?.data.destination_latitude,
      destination_longitude: data?.data.destination_longitude,
      ride_type: data?.data.ride_type ?? '',
      trip_type: data?.data.trip_type ?? '',
      trip_structure: data?.data.trip_structure ?? '',
    });
  };

  useEffect(() => {
    if (!data) {
      return;
    }
    handleCalculateFare();
  }, [data]);

  const reasons = [
    { id: "1", text: "Driver taking too long" },
    { id: "2", text: "Booked by mistake" },
  ];

  // 2. Add an early return if id is missing entirely
  if (!id) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.surfacePrimary }]}
      >
        <Text style={commonStyling.title}>Invalid Ride ID</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // 3. Keep your existing skeleton check
  if (isLoading || !data || isPendingBaseFareEstimate) {
    return <RideDetailsSkeleton />;
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

      {/* Modal Header */}
      <View style={styles.header}>
        <View>
          <Text
            style={[
              commonStyling.title,
              {
                fontSize: FONT_SIZES.TITLE2,
                fontFamily: "Bold",
              },
            ]}
          >
            Ride Details
          </Text>
          <View style={styles.headerSubRow}>
            <Clock size={14} color="#3B82F6" />
            <Text
              style={[
                styles.tripId,
                commonStyling.subtitle,
                {
                  color: colors.textSecondary,
                  fontSize: FONT_SIZES.BODY,
                },
              ]}
            >
              {formatHumanReadableDate(data.data.scheduled_at)}
            </Text>
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor:
                    data?.data.status === "cancelled"
                      ? colors.highlightRed
                      : "#DCFCE7",
                },
              ]}
            >
              <Text
                style={[
                  styles.statusBadgeText,
                  {
                    color:
                      data?.data.status === "cancelled"
                        ? colors.cancelledRed
                        : "#10B981",
                  },
                ]}
              >
                {formatDisplayText(data?.data.status)}
              </Text>
            </View>
          </View>
        </View>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => {
            navigation.goBack();
          }}
        >
          <X color={colors.textSecondary} size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Route Card */}
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
              commonStyling.title,
              {
                fontSize: 14,
                fontFamily: "Bold",
              },
            ]}
          >
            Route
          </Text>

          <RideRouteCard
            pickup={data?.data.pickup_address}
            destination={data?.data.destination_address}
          />
        </View>

        {/* Driver Card */}
        {data?.data.status === "confirmed" && (
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
                commonStyling.title,
                {
                  fontSize: 14,
                  fontFamily: "Bold",
                },
              ]}
            >
              Your Driver
            </Text>
            <View style={styles.driverProfileRow}>
              <Image
                source={require("../../../../assets/images/noProfileImage.jpg")}
                style={styles.driverAvatar}
              />
              <View style={styles.driverTextContainer}>
                <View style={styles.rowBetween}>
                  <View style={styles.rowCenter}>
                    <Text
                      style={[
                        commonStyling.title,
                        {
                          fontSize: 15,
                          fontFamily: "Bold",
                        },
                      ]}
                    >
                      John Smith
                    </Text>
                    <CheckCircle
                      size={14}
                      color="#3B82F6"
                      style={{ marginLeft: 4 }}
                    />
                  </View>
                  <View style={styles.rowCenter}>
                    <Text
                      style={[
                        commonStyling.subtitle,
                        {
                          fontSize: 18,
                          fontFamily: "Bold",
                        },
                      ]}
                    >
                      4.9
                    </Text>
                    <Star
                      size={14}
                      color="#F59E0B"
                      fill="#F59E0B"
                      style={{ marginLeft: 2 }}
                    />
                  </View>
                </View>
                <Text
                  style={[
                    commonStyling.subtitle,
                    {
                      fontSize: 14,
                      marginTop: 2,
                    },
                  ]}
                >
                  Verified Driver
                </Text>
              </View>
            </View>
            <View
              style={[
                styles.vehicleBox,
                {
                  backgroundColor: colors.cardBackground,
                },
              ]}
            >
              <Text
                style={[
                  commonStyling.subtitle,
                  {
                    fontSize: 14,
                    marginTop: 2,
                  },
                ]}
              >
                Vehicle
              </Text>
              <Text
                style={[
                  commonStyling.title,
                  {
                    fontSize: 14,
                    marginTop: 2,
                  },
                ]}
              >
                Toyota Camry • Blue
              </Text>
            </View>
          </View>
        )}
        {/* Estimated Pickup Card */}
        <View
          style={[
            styles.card,
            styles.rowBetween,
            {
              backgroundColor: colors.homelightPrimaryBlue50,
              borderColor: colors.lightPrimaryBlueBorder,
            },
          ]}
        >
          <View>
            <Text
              style={[
                commonStyling.subtitle,
                {
                  fontSize: 11,
                },
              ]}
            >
              Estimated duration
            </Text>
            <Text
              style={[
                styles.etaTextLarge,
                commonStyling.title,
                {
                  fontSize: 18,
                  fontFamily: "Bold",
                },
              ]}
            >
              {formatDuration(data?.data.estimated_duration_minutes)}
            </Text>
          </View>
          <View style={styles.iconCircleLightBlue}>
            <Clock size={24} color="#3B82F6" />
          </View>
        </View>

        {/* Fare Details Card */}
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
              commonStyling.title,
              {
                fontSize: 14,
                fontFamily: "Bold",
              },
            ]}
          >
            Fare Details
          </Text>
          <FareRow
            label="Base fare"
            value={formatPrice(estimateResults?.data.base_fare, true)}
          />
          <FareRow
            label="Distance charge"
            value={formatPrice(estimateResults?.data.distance_charge, true)}
          />

          <View style={styles.fareDivider} />
          <View style={styles.rowBetween}>
            <Text
              style={[
                commonStyling.title,
                {
                  fontSize: 15,
                  fontFamily: "Bold",
                },
              ]}
            >
              Total
            </Text>
            <Text
              style={[
                commonStyling.title,
                {
                  fontSize: 16,
                  fontFamily: "Bold",
                  color: colors.primaryColor,
                },
              ]}
            >
              {formatPrice(estimateResults?.data.total_fare, true)}
            </Text>
          </View>
        </View>

        {/* Cancellation Policy Warning */}
        <View style={styles.policyCard}>
          <AlertCircle size={20} color="#F59E0B" />
          <View style={styles.policyTextContainer}>
            <Text style={styles.policyTitle}>Cancellation Policy</Text>
            <Text style={styles.policySub}>
              Free cancellation up to 1 hour before pickup. Late cancellations
              may incur a $10 fee.
            </Text>
          </View>
        </View>

        {/* Need Assistance Card */}
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
              commonStyling.title,
              {
                fontSize: 14,
                fontFamily: "Bold",
              },
            ]}
          >
            Need Assistance?
          </Text>
          <AssistanceRow
            icon={<Headphones size={20} color="#3B82F6" />}
            title="24/7 Support"
            sub="Get help anytime"
          />
          {/* <AssistanceRow
            icon={<Info size={20} color="#3B82F6" />}
            title="Emergency Contact"
            sub="Share trip details"
          /> */}
        </View>

        {data.data.status === "confirmed" && (
          <TouchableOpacity style={styles.contactBtn}>
            <Phone size={20} color="#FFF" />
            <Text style={styles.contactBtnText}>Contact Driver</Text>
          </TouchableOpacity>
        )}

        {data?.data.status !== "cancelled" && (
          <TouchableOpacity
            style={styles.shareBtn}
            onPress={() => shareTrip(data?.data.id)}
          >
            {isPending ? (
              <ActivityIndicator />
            ) : (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <Share2 size={20} color="#3B82F6" />
                <Text style={styles.shareBtnText}>Share Trip</Text>
              </View>
            )}
          </TouchableOpacity>
        )}

        {data?.data.status !== "cancelled" && (
          <TouchableOpacity
            style={styles.cancelLink}
            onPress={() => {
              cancelRef.current?.open();
            }}
          >
            <Text style={styles.cancelLinkText}>Cancel Ride</Text>
          </TouchableOpacity>
        )}
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
                  Your driver has been assigned. Cancelling now may affect
                  driver allocation.
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

// --- Reusable Sub-components ---
const FareRow = ({ label, value }: any) => {
  const { colors } = useTheme();
  const commonStyling = commonStyles(colors);

  return (
    <View style={[styles.rowBetween, { marginBottom: 10 }]}>
      <Text
        style={[
          commonStyling.subtitle,
          {
            fontSize: 13,
          },
        ]}
      >
        {label}
      </Text>
      <Text
        style={[
          commonStyling.title,
          {
            fontSize: 13,
            fontFamily: "Bold",
          },
        ]}
      >
        {value}
      </Text>
    </View>
  );
};

const AssistanceRow = ({ icon, title, sub }: any) => {
  const { colors } = useTheme();
  const commonStyling = commonStyles(colors);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  return (
    <TouchableOpacity
      style={[
        styles.assistanceItem,
        {
          backgroundColor: colors.cardBackground,
        },
      ]}
      onPress={() => {
        navigation.navigate("RiderProfileContentsStack", {
          screen: "LiveChatScreen",
        });
      }}
    >
      <View style={styles.iconCircleGray}>{icon}</View>
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text
          style={[
            commonStyling.title,
            {
              fontSize: 14,
            },
          ]}
        >
          {title}
        </Text>
        <Text
          style={[
            commonStyling.subtitle,
            {
              fontSize: 12,
              fontFamily: "Medium",
            },
          ]}
        >
          {sub}
        </Text>
      </View>
      <X
        size={16}
        color="#94A3B8"
        style={{ transform: [{ rotate: "45deg" }] }}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    alignItems: "center",
  },
  headerTitle: { fontSize: 20, fontWeight: "800", color: "#1E293B" },
  headerSubRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  headerTimeText: { fontSize: 13, color: "#64748B", marginLeft: 6 },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 10,
  },
  statusBadgeText: { fontSize: 11, fontWeight: "700" },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
  },

  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  card: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  sectionLabel: {
    marginBottom: 16,
  },

  routeContainer: { flexDirection: "row" },
  timeline: { width: 20, alignItems: "center", marginTop: 5 },
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
  line: { width: 1, flex: 1, backgroundColor: "#F1F5F9", marginVertical: 4 },
  addressContainer: { flex: 1, marginLeft: 12 },
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
  cancelLink: {
    marginTop: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#EF4444",
    height: 56,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
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
  cancelButtonText: { color: "#FFF", fontSize: 16, fontFamily: "SemiBold" },
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
