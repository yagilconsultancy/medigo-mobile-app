import React, { useCallback, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from "react-native";
import {
  ChevronLeft,
  Download,
  RotateCcw,
  History,
} from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import useTheme from "../../../hooks/useThemes";
import { commonStyles } from "../../../styles/commonStyles";
import Header from "../../../components/reuseables/header";
import {
  RiderHistoryFilter,
  useRiderHistoryOverview,
} from "../../../hooks/queries/useRiderHistoryOverview";
import rideService from "../../../api/services/rideService";
import { formatPrice } from "../../../utils/formatPrice";
import { format } from "date-fns";
import { RideHistorySkeleton } from "../../../components/skelentonAnimation/rideHistorySkelenton";
import { useRideStore } from "../../../store/useRideStore";

const RideHistoryScreen = () => {
  const { colors, theme } = useTheme();
  const commonStyling = commonStyles(colors);
  const [refreshing, setRefreshing] = useState(false);

  const [filter, setFilter] = useState<RiderHistoryFilter>("completed");
  const [limit, setLimit] = useState(20);

  // Totals come from the server summary, the list from the filtered page.
  const { data, isLoading, isFetching, refetch } = useRiderHistoryOverview(
    filter,
    limit,
  );

  const rides = data?.data?.rides || [];
  const summary = data?.data?.summary;
  const filteredTotal = data?.data?.filtered_total ?? rides.length;
  const canLoadMore = rides.length < filteredTotal && limit < 100;

  const filterOptions: { key: RiderHistoryFilter; label: string }[] = [
    { key: "completed", label: "Completed" },
    { key: "cancelled", label: "Cancelled" },
    { key: "all", label: "All" },
  ];

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  if (isLoading) {
    return <RideHistorySkeleton />;
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.surfacePrimary }]}
    >
      <StatusBar
        barStyle={theme === "light" ? "dark-content" : "light-content"}
      />
      <Header title="Ride History" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primaryColor}
            colors={[colors.primaryColor]}
          />
        }
      >
        <View style={styles.subHeader}>
          <Text style={[commonStyling.subtitle, { fontSize: 14 }]}>
            All your ride history
          </Text>
        </View>

        {/* Filter */}
        <View style={styles.filterRow}>
          {filterOptions.map((option) => {
            const active = filter === option.key;
            return (
              <TouchableOpacity
                key={option.key}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor: active
                      ? colors.primaryColor
                      : colors.surfaceElevated,
                    borderColor: colors.lightPrimaryBlueBorder,
                  },
                ]}
                onPress={() => {
                  setFilter(option.key);
                  setLimit(20);
                }}
              >
                <Text
                  style={{
                    fontSize: 13,
                    fontFamily: "SemiBold",
                    color: active ? "#FFF" : colors.titleText,
                  }}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Summary Dashboard */}
        <View style={styles.dashboardRow}>
          <StatCard
            label="COMPLETED RIDES"
            value={String(summary?.completed_rides ?? 0)}
            colors={colors}
            commonStyling={commonStyling}
          />
          <StatCard
            label="MILES TRAVELED"
            value={String(summary?.miles_traveled ?? 0)}
            colors={colors}
            commonStyling={commonStyling}
            isPrimary
          />
        </View>

        <Text
          style={[styles.sectionTitle, commonStyling.subtitle, styles.bold14]}
        >
          {filter === "all"
            ? "All Rides"
            : filter === "completed"
              ? "Completed Rides"
              : "Cancelled Rides"}
        </Text>

        {isLoading ? (
          <ActivityIndicator
            color={colors.primaryColor}
            style={{ marginTop: 20 }}
          />
        ) : rides.length > 0 ? (
          <>
            {rides.map((ride: any) => (
              <HistoryCard key={ride.id} ride={ride} />
            ))}
            {canLoadMore && (
              <TouchableOpacity
                style={styles.loadMoreBtn}
                disabled={isFetching}
                onPress={() => setLimit((prev) => Math.min(prev + 20, 100))}
              >
                {isFetching ? (
                  <ActivityIndicator color={colors.primaryColor} />
                ) : (
                  <Text style={{ color: colors.primaryColor, fontFamily: "SemiBold" }}>
                    Show more
                  </Text>
                )}
              </TouchableOpacity>
            )}
          </>
        ) : (
          <View style={styles.emptyContainer}>
            <History size={48} color={colors.textSecondary} strokeWidth={1} />
            <Text style={[commonStyling.subtitle, { marginTop: 10 }]}>
              No history found
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

// --- Stat Card Helper ---
const StatCard = ({ label, value, colors, commonStyling, isPrimary }: any) => (
  <View
    style={[
      styles.statCard,
      {
        backgroundColor: colors.homelightPrimaryBlue50,
        borderColor: colors.lightPrimaryBlueBorder,
      },
    ]}
  >
    <Text
      style={[
        styles.statLabel,
        commonStyling.title,
        { fontSize: 10, color: colors.textSecondary },
      ]}
    >
      {label}
    </Text>
    <Text
      style={[
        styles.statValue,
        commonStyling.title,
        {
          fontFamily: "Bold",
          fontSize: 24,
          color: isPrimary ? colors.primaryColor : colors.titleText,
        },
      ]}
    >
      {value}
    </Text>
  </View>
);

// --- History Card Component ---
const HistoryCard = ({ ride }: { ride: any }) => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { colors } = useTheme();
  const commonStyling = commonStyles(colors);
  const setPickup = useRideStore((state) => state.setPickup);
  const setDestination = useRideStore((state) => state.setDestination);

  const formattedDate = format(new Date(ride.scheduled_at), "MMM dd, yyyy");
  const formattedTime = format(new Date(ride.scheduled_at), "hh:mm a");

  // Status Color Logic
  const rideStatus = String(ride.status ?? "").toLowerCase();
  const statusColor =
    rideStatus === "completed"
      ? "#10B981"
      : rideStatus === "cancelled" || rideStatus === "no_show"
        ? "#EF4444"
        : "#F59E0B";

  const [rebooking, setRebooking] = useState(false);

  const isUsablePoint = (lat: any, lng: any) =>
    typeof lat === "number" &&
    typeof lng === "number" &&
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    !(lat === 0 && lng === 0);

  const handleRebook = async () => {
    if (rebooking) return;
    setRebooking(true);
    try {
      // The list item has no coordinates, so load the full ride first.
      const detail = (await rideService.getRideDetail(ride.id))?.data;

      if (
        !detail ||
        !isUsablePoint(detail.pickup_latitude, detail.pickup_longitude) ||
        !isUsablePoint(detail.destination_latitude, detail.destination_longitude)
      ) {
        Alert.alert(
          "Cannot rebook this ride",
          "The saved locations for this ride are incomplete. Please book a new ride instead.",
        );
        return;
      }

      setPickup({
        address: detail.pickup_address ?? "",
        latitude: detail.pickup_latitude,
        longitude: detail.pickup_longitude,
      });
      setDestination({
        address: detail.destination_address ?? "",
        latitude: detail.destination_latitude,
        longitude: detail.destination_longitude,
      });

      navigation.navigate("RiderRideDetailsStack", {
        screen: "BookARide",
        // scheduledTrip lets the date picker allow a future day; the booking
        // screen moves the old date forward.
        params: { rebookRide: detail, scheduledTrip: true },
      });
    } catch (e) {
      Alert.alert(
        "Cannot rebook this ride",
        "We could not load this ride. Please check your connection and try again.",
      );
    } finally {
      setRebooking(false);
    }
  };

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surfaceElevated,
          borderColor: colors.lightPrimaryBlueBorder,
        },
      ]}
    >
      <View style={styles.cardHeader}>
        <View>
          <Text
            style={[commonStyling.title, styles.bold14, { marginBottom: 4 }]}
          >
            {formattedDate}
          </Text>
          <Text style={[commonStyling.subtitle, { fontSize: 12 }]}>
            {formattedTime}
          </Text>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Text
            style={[commonStyling.title, { fontSize: 16, fontFamily: "Bold" }]}
          >
            {formatPrice(ride.final_fare ?? ride.estimated_fare, true)}
          </Text>
          <Text style={[styles.cardStatus, { color: statusColor }]}>
            {String(ride.status ?? "").replace(/_/g, " ").toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={styles.routeRow}>
        <View style={styles.timeline}>
          <View style={styles.dotBlue} />
          <View style={styles.line} />
          <View style={styles.dotBlue} />
        </View>
        <View style={styles.addressBox}>
          <Text style={[commonStyling.subtitle, { fontSize: 10 }]}>PICKUP</Text>
          <Text
            numberOfLines={1}
            style={[commonStyling.title, { fontSize: 13, marginTop: 2 }]}
          >
            {ride.pickup_address}
          </Text>
          <Text
            style={[commonStyling.subtitle, { fontSize: 10, marginTop: 20 }]}
          >
            DESTINATION
          </Text>
          <Text
            numberOfLines={1}
            style={[commonStyling.title, { fontSize: 13, marginTop: 2 }]}
          >
            {ride.destination_address}
          </Text>
        </View>
      </View>

      {ride.facility_name && (
        <Text
          style={[styles.driverInfo, commonStyling.subtitle, { fontSize: 12 }]}
        >
          Facility: {ride.facility_name}
        </Text>
      )}

      <View style={styles.actionRow}>
        <TouchableOpacity
          style={styles.outlineBtn}
          onPress={() =>
            navigation.navigate("RiderNotificationStack", {
              screen: "ReceiptScreen",
              params: { rideId: ride.id },
            })
          }
        >
          <Download size={16} color={colors.titleText} />
          <Text
            style={[
              commonStyling.title,
              { fontSize: 14, fontFamily: "SemiBold" },
            ]}
          >
            Receipt
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filledBtn, rebooking && { opacity: 0.6 }]}
          onPress={handleRebook}
          disabled={rebooking}
        >
          {rebooking ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <RotateCcw size={16} color="#FFF" />
          )}
          <Text style={styles.filledBtnText}>Rebook</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 50 },
  subHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  filterDropdown: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  filterText: {
    fontSize: 12,
    color: "#1E293B",
    marginHorizontal: 6,
    fontWeight: "600",
  },
  filterRow: { flexDirection: "row", gap: 8, marginBottom: 20 },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  loadMoreBtn: { alignItems: "center", paddingVertical: 12 },
  dashboardRow: { flexDirection: "row", gap: 12, marginBottom: 24 },
  statCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    elevation: 2,
  },
  statLabel: { letterSpacing: 0.5 },
  statValue: { marginTop: 4 },
  sectionTitle: { marginBottom: 16 },
  bold14: { fontSize: 14, fontFamily: "SemiBold" },
  card: { borderRadius: 20, padding: 16, marginBottom: 16, borderWidth: 1 },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  cardStatus: { fontSize: 10, fontWeight: "800", marginTop: 2 },
  routeRow: { flexDirection: "row", marginBottom: 16 },
  timeline: { width: 12, alignItems: "center", marginTop: 4 },
  dotBlue: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#3B82F6" },
  line: { width: 1, flex: 1, backgroundColor: "#F1F5F9", marginVertical: 2 },
  addressBox: { flex: 1, marginLeft: 12 },
  driverInfo: { marginBottom: 16 },
  actionRow: { flexDirection: "row", gap: 12 },
  outlineBtn: {
    flex: 1,
    flexDirection: "row",
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  filledBtn: {
    flex: 1,
    flexDirection: "row",
    height: 44,
    borderRadius: 12,
    backgroundColor: "#3B82F6",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  filledBtnText: { fontSize: 14, fontWeight: "700", color: "#FFF" },
  emptyContainer: { alignItems: "center", marginTop: 40, opacity: 0.5 },
});

export default RideHistoryScreen;
