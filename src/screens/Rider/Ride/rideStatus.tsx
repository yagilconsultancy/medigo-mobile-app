import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";
import {
  X,
  Car,
  MapPin,
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

const RideStatusScreen = () => {
  const { colors, theme } = useTheme();
  const route = useRoute<any>();
  const commonStyling = commonStyles(colors);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const rideId = route.params.rideId;

  const { data: rideDetails, isLoading: loadingRideDetail } =
    useRideDetail(rideId);
  const rideDetail = rideDetails?.data;

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
        {/* Awaiting Approval Banner */}

        {rideDetail?.status === "driver assigned" ? (
          <View
            style={[
              styles.awaitingBanner,
              {
                backgroundColor: colors.lightGreen,
                marginBottom: 60,
              },
            ]}
          >
            <View
              style={[
                styles.orangeDot,
                {
                  backgroundColor: colors.darkGreen,
                },
              ]}
            />
            <Text
              style={{
                color: colors.darkGreen,
                fontSize: 13,
                fontFamily: "SemiBold",
              }}
            >
              Driver assigned
            </Text>
          </View>
        ) : (
          <View
            style={[
              styles.awaitingBanner,
              {
                backgroundColor: colors.lightYellow,
              },
            ]}
          >
            <View
              style={[
                styles.orangeDot,
                {
                  backgroundColor: colors.darkYellow,
                },
              ]}
            />
            <Text
              style={{
                color: colors.darkYellow,
                fontSize: 13,
                fontFamily: "SemiBold",
              }}
            >
              Awaiting request approval and confirmation
            </Text>
          </View>
        )}

        {rideDetail?.status === "driver assigned" && (
          <View
            style={[
              styles.trackingCard,
              {
                borderColor: colors.lightPrimaryBlueBorder,
              },
            ]}
          >
            {/* Arriving Floating Badge */}
            <View style={styles.arrivingBadge}>
              <Navigation2 size={16} color="#FFF" fill="#FFF" />
              <Text style={styles.arrivingText}>Arriving in 0 min</Text>
              <View style={styles.whitePulseDot} />
            </View>

            {/* Tracking Progress Visual */}
            <View style={styles.trackingVisualContainer}>
              <View style={styles.visualRow}>
                <Car size={32} color={colors.titleText} />
                <View style={styles.progressBarBase}>
                  <View style={styles.progressBarActive} />
                  <View style={styles.progressCenterDot} />
                </View>
                <View>
                  <MapPin size={24} color="#EF4444" fill="#EF4444" />
                </View>
              </View>
              <View style={styles.visualLabels}>
                <View>
                  <Text
                    style={[
                      commonStyling.title,
                      {
                        fontSize: 13,
                        fontFamily: "Bold",
                      },
                    ]}
                  >
                    Driver
                  </Text>
                  <Text
                    style={[
                      styles.visualSubLabel,
                      commonStyling.subtitle,
                      {
                        fontSize: 11,
                      },
                    ]}
                  >
                    2.3 mi away
                  </Text>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <Text
                    style={[
                      {
                        fontSize: 13,
                        fontFamily: "Bold",
                        color: "#EF4444",
                      },
                    ]}
                  >
                    Pickup
                  </Text>
                  <Text
                    style={[
                      styles.visualSubLabel,
                      commonStyling.subtitle,
                      {
                        fontSize: 11,
                      },
                    ]}
                  >
                    Your location
                  </Text>
                </View>
              </View>
            </View>

            {/* Driver Info Footer */}
            <View
              style={[
                styles.driverFooter,
                {
                  backgroundColor: colors.cardBackground,
                },
              ]}
            >
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
                  Michael Johnson is on the way
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
                Toyota
              </Text>
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
              Total paid
            </Text>
            <Text
              style={{
                color: "#10B981",
                fontSize: 24,
                fontFamily: "Bold",
              }}
            >
              {formatPrice(rideDetail?.estimated_fare)}
            </Text>
          </View>

          <View style={styles.paymentConfirmedBadge}>
            <Check size={14} color="#10B981" strokeWidth={3} />
            <Text style={styles.confirmedText}>Payment confirmed</Text>
          </View>
        </View>

        {rideDetail?.status === "driver assigned" && (
          <View
            style={{
              gap: 12,
            }}
          >
            <Buttons
              title="Track Live Location"
              onPress={() => {
                navigation.navigate("RiderRideDetailsStack", {
                  screen: "TripInProgress",
                });
              }}
            />
            <Buttons type="cancel" title="Cancel Ride" onPress={() => {}} />
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
