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
  Calendar,
  MapPin,
  ChevronRight,
} from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useTheme from "../../../hooks/useThemes";
import { commonStyles } from "../../../styles/commonStyles";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Header from "../../../components/reuseables/header";
import { useDriverUpcomingRides } from "../../../hooks/queries/useDriverUpcomingRide";
import { UpcomingRidesSkeleton } from "../../../components/skelentonAnimation/upcomingRides";
import { formatHumanReadableDate } from "../../../utils/formatHumanReadableDate";

const UpcomingRidesScreen = () => {
  const { colors, theme } = useTheme();
  const commonStyling = commonStyles(colors);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const {
    data: driverUpcomingRides,
    refetch,
    isRefetching,
    isLoading,
  } = useDriverUpcomingRides();
  const rides = driverUpcomingRides?.data || [];

  if (isLoading) {
    return <UpcomingRidesSkeleton />;
  }

  console.log(rides);

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

      <Header title="Upcoming Rides" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text
          style={[
            styles.subheadline,
            commonStyling.subtitle,
            {
              fontSize: 14,
            },
          ]}
        >
          View and Manage your upcoming rides
        </Text>

        {rides && rides.length === 0 && (
          /* Empty State when no rides are returned */
          <View
            style={[
              styles.rideCard,
              {
                justifyContent: "center",
                alignItems: "center",
              },
            ]}
          >
            <Text style={commonStyling.subtitle}>No upcoming rides found</Text>
          </View>
        )}

        {rides.map((ride) => (
          <View
            key={ride.id}
            style={[
              styles.rideCard,
              {
                borderColor: colors.lightPrimaryBlueBorder,
              },
            ]}
          >
            {/* Card Header */}
            <View style={styles.cardHeader}>
              <View style={styles.timeRow}>
                <Calendar size={16} color="#64748B" />
                <Text
                  style={[
                    commonStyling.title,
                    {
                      fontSize: 14,
                      fontFamily: "SemiBold",
                    },
                  ]}
                >
                  {formatHumanReadableDate(ride.scheduled_at)}
                </Text>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: colors.surfaceBrand },
                ]}
              >
                <Text
                  style={[styles.statusText, { color: colors.primaryColor }]}
                >
                  {ride.status}
                </Text>
              </View>
            </View>

            {/* Passenger Info */}
            <Text
              style={[
                styles.passengerName,
                commonStyling.title,
                {
                  fontSize: 18,
                  fontFamily: "Bold",
                },
              ]}
            >
              {ride.passenger}
            </Text>
            <View
              style={[
                styles.medicalBadge,
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
                {ride.ride_type}
              </Text>
            </View>

            {/* Route Timeline */}
            <View style={styles.routeContainer}>
              <View style={styles.timelineIndicators}>
                <View style={styles.pickupDot} />
                <View style={styles.line} />
                <View style={styles.destDot} />
              </View>
              <View>
                <View style={styles.locationItem}>
                  <Text
                    style={[
                      commonStyling.subtitle,
                      {
                        fontSize: 12,
                      },
                    ]}
                  >
                    Pickup
                  </Text>
                  <Text
                    style={[
                      commonStyling.title,
                      {
                        fontSize: 14,
                        fontFamily: "SemiBold",
                      },
                    ]}
                  >
                    {ride.pickup_address}
                  </Text>
                </View>
                <View style={[styles.locationItem, { marginTop: 12 }]}>
                  <Text
                    style={[
                      commonStyling.subtitle,
                      {
                        fontSize: 12,
                      },
                    ]}
                  >
                    Destination
                  </Text>
                  <Text
                    style={[
                      commonStyling.title,
                      {
                        fontSize: 14,
                        fontFamily: "SemiBold",
                      },
                    ]}
                  >
                    {ride.destination_address}
                  </Text>
                </View>
              </View>
            </View>

            {/* Card Footer */}
            <View
              style={[
                styles.cardFooter,
                {
                  borderTopColor: colors.lightPrimaryBlueBorder,
                },
              ]}
            >
              <View style={styles.distanceRow}>
                <MapPin size={16} color="#94A3B8" />
                <Text
                  style={[
                    commonStyling.subtitle,
                    {
                      fontSize: 14,
                      fontFamily: "Medium",
                    },
                  ]}
                >
                  {ride.estimated_distance_miles} mi
                </Text>
              </View>
              <Text
                style={[
                  styles.fareText,
                  {
                    fontSize: 20,
                    fontFamily: "Bold",
                    color: "#10B981",
                  },
                ]}
              >
                {ride.final_fare}
              </Text>
              <TouchableOpacity
                style={styles.detailsButton}
                onPress={() => {
                  navigation.navigate("DriverRideDetailsStack", {
                    screen: "RideDetails",
                    params: {
                      id: ride.id,
                    },
                  });
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: "Medium",
                    color: colors.primaryColor,
                  }}
                >
                  Details
                </Text>
                <ChevronRight size={16} color={colors.primaryColor} />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    height: 60,
    backgroundColor: "#FFF",
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: { fontSize: 22, fontWeight: "800", color: "#1E293B" },
  notificationContainer: { position: "relative" },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#EF4444",
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFF",
  },
  badgeText: { color: "#FFF", fontSize: 10, fontWeight: "800" },

  scrollContent: { padding: 16 },
  subheadline: { marginBottom: 20 },

  rideCard: {
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  timeRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  statusText: { fontSize: 12, fontWeight: "700" },

  passengerName: {
    marginBottom: 8,
  },
  medicalBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 20,
  },

  routeContainer: { flexDirection: "row", gap: 12, marginBottom: 20 },
  timelineIndicators: { alignItems: "center", width: 12, paddingTop: 4 },
  pickupDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#3B82F6",
  },
  line: { width: 1, flex: 1, backgroundColor: "#E2E8F0", marginVertical: 4 },
  destDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#EF4444",
  },
  locationItem: { gap: 2 },

  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    paddingTop: 16,
  },
  distanceRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  fareText: {
    flex: 1,
    textAlign: "center",
  },
  detailsButton: { flexDirection: "row", alignItems: "center", gap: 2 },

  tabBar: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    justifyContent: "space-around",
  },
  tabItem: { alignItems: "center", gap: 4 },
  tabLabel: { fontSize: 11, fontWeight: "600", color: "#94A3B8" },
  tabActive: { color: "#2563EB" },
});

export default UpcomingRidesScreen;
