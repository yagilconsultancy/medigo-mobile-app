import React, { useCallback, useMemo, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import {
  ChevronLeft,
  ChevronDown,
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
import { useMyRides } from "../../../hooks/queries/useMyRides";
import { format } from "date-fns";
import { RideHistorySkeleton } from "../../../components/skelentonAnimation/rideHistorySkelenton";
import { useRideStore } from "../../../store/useRideStore";

const RideHistoryScreen = () => {
  const { colors, theme } = useTheme();
  const commonStyling = commonStyles(colors);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch completed rides
  const { data, isLoading, refetch } = useMyRides({
    status: "completed",
    limit: 50,
  });

  const rides = data?.data || [];

  // Calculate dynamic stats
  const stats = useMemo(() => {
    const totalRides = rides.length;
    const totalSpent = rides.reduce(
      (sum, ride) => sum + (ride.final_fare || 0),
      0,
    );
    return { totalRides, totalSpent };
  }, [rides]);

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
          <TouchableOpacity style={styles.filterDropdown}>
            <History size={14} color="#3B82F6" />
            <Text style={styles.filterText}>All Time</Text>
            <ChevronDown size={14} color="#64748B" />
          </TouchableOpacity>
        </View>

        {/* Summary Dashboard */}
        <View style={styles.dashboardRow}>
          <StatCard
            label="TOTAL RIDES"
            value={stats.totalRides.toString()}
            colors={colors}
            commonStyling={commonStyling}
          />
          <StatCard
            label="TOTAL SPENT"
            value={`$${stats.totalSpent.toFixed(2)}`}
            colors={colors}
            commonStyling={commonStyling}
            isPrimary
          />
        </View>

        <Text
          style={[styles.sectionTitle, commonStyling.subtitle, styles.bold14]}
        >
          All Rides
        </Text>

        {isLoading ? (
          <ActivityIndicator
            color={colors.primaryColor}
            style={{ marginTop: 20 }}
          />
        ) : rides.length > 0 ? (
          rides.map((ride) => <HistoryCard key={ride.id} ride={ride} />)
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
  const isCancelled = ride.status.toLowerCase() === "cancelled";
  const statusColor = isCancelled ? "#EF4444" : "#10B981";

  const handleRebook = () => {
    setPickup({
      address: ride.pickup_address ?? "",
      latitude: ride.pickup_latitude ?? 0,
      longitude: ride.pickup_longitude ?? 0,
    });
    setDestination({
      address: ride.destination_address ?? "",
      latitude: ride.destination_latitude ?? 0,
      longitude: ride.destination_longitude ?? 0,
    });

    navigation.navigate("RiderRideDetailsStack", {
      screen: "BookARide",
      params: { rebookRide: ride },
    });
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
            ${ride.final_fare || ride.estimated_fare || "0.00"}
          </Text>
          <Text style={[styles.cardStatus, { color: statusColor }]}>
            {ride.status.toUpperCase()}
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
          style={styles.filledBtn}
          onPress={handleRebook}
        >
          <RotateCcw size={16} color="#FFF" />
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
