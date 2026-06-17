import React, { useCallback, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  RefreshControl,
} from "react-native";
import {
  ChevronLeft,
  Bell,
  Download,
  ChevronRight,
  DollarSign,
  TrendingUp,
} from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useTheme from "../../../hooks/useThemes";
import { commonStyles } from "../../../styles/commonStyles";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import Header from "../../../components/reuseables/header";
import { useEarningsSummary } from "../../../hooks/queries/useEarningSummary";
import { useWalletBalance } from "../../../hooks/queries/useWalletBalance";
import { useEarningsHistory } from "../../../hooks/queries/useEarningHistory";
import { DriverEarningsSkeleton } from "../../../components/skelentonAnimation/driverEarningsSkelenton";
import { formatPrice } from "../../../utils/formatPrice";

const DriverEarningsDashboard = () => {
  const { colors, theme } = useTheme();
  const commonStyling = commonStyles(colors);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [refreshing, setRefreshing] = useState(false);
  const {
    data: walletBalance,
    isLoading: isWalletLoading,
    refetch: refetchWalletBalance,
  } = useWalletBalance();
  const balance = walletBalance?.data;
  const { data, isLoading, refetch: refetchEarningsSummary } =
    useEarningsSummary();
  const summary = data?.data;
  const {
    data: historyData,
    isLoading: isHistoryLoading,
    refetch: refetchEarningsHistory,
  } = useEarningsHistory(7);
  const history = historyData?.data || [];

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        refetchWalletBalance(),
        refetchEarningsSummary(),
        refetchEarningsHistory(),
      ]);
    } finally {
      setRefreshing(false);
    }
  }, [refetchWalletBalance, refetchEarningsSummary, refetchEarningsHistory]);

  if (isLoading || isWalletLoading || isHistoryLoading) {
    return <DriverEarningsSkeleton />;
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

      <Header title="Earnings" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primaryColor}
            colors={[colors.primaryColor]}
          />
        }
      >
        <Text
          style={[
            styles.subHeaderText,
            commonStyling.subtitle,
            {
              fontSize: 14,
            },
          ]}
        >
          View and Manage all your earnings
        </Text>

        {/* Available Balance Card */}
        <View
          style={[styles.balanceCard, { backgroundColor: colors.primaryColor }]}
        >
          <View style={styles.balanceHeader}>
            <View style={styles.currencyCircle}>
              <DollarSign size={16} color="#FFF" />
            </View>
            <Text
              style={{
                fontSize: 14,
                fontFamily: "SemiBold",
                color: "#ffffff",
              }}
            >
              Available Balance
            </Text>
          </View>
          <Text style={styles.balanceAmount}>
            {formatPrice(balance?.available_balance)}
          </Text>

          <TouchableOpacity
            style={styles.withdrawBtn}
            onPress={() => {
              navigation.navigate("DriverWalletDetailsStack", {
                screen: "WithdrawEarnings",
              });
            }}
          >
            <Download size={20} color="#2563EB" style={{ marginRight: 8 }} />
            <Text style={styles.withdrawText}>Withdraw Earnings</Text>
          </TouchableOpacity>
        </View>

        {/* Today's Summary Metrics */}
        <View
          style={[
            styles.metricsCard,
            {
              borderColor: colors.lightPrimaryBlueBorder,
            },
          ]}
        >
          <View style={styles.metricHeader}>
            <Text
              style={[
                commonStyling.subtitle,
                {
                  fontSize: 14,
                },
              ]}
            >
              Today Earnings
            </Text>
            <View style={styles.growthBadge}>
              <TrendingUp size={12} color="#10B981" />
              <Text style={styles.growthText}>
                {summary?.earnings_today_change_percent}
              </Text>
            </View>
          </View>
          <Text
            style={[
              styles.todayAmount,
              commonStyling.title,
              {
                fontSize: 32,
                fontFamily: "Bold",
                textAlign: "center",
              },
            ]}
          >
            ${summary?.earnings_today}
          </Text>
          <Text
            style={[
              commonStyling.subtitle,
              {
                fontSize: 13,
                textAlign: "center",
              },
            ]}
          >
            Total earnings this period
          </Text>

          <View style={styles.statsGrid}>
            <View
              style={[
                styles.statBox,
                {
                  borderColor: colors.lightPrimaryBlueBorder,
                },
              ]}
            >
              <Text
                style={[
                  styles.statIcon,
                  commonStyling.subtitle,
                  {
                    fontSize: 12,
                  },
                ]}
              >
                📋 Trips
              </Text>
              <Text
                style={[
                  commonStyling.subtitle,
                  {
                    fontSize: 16,
                    fontFamily: "SemiBold",
                  },
                ]}
              >
                {summary?.trips_today}
              </Text>
            </View>
            <View
              style={[
                styles.statBox,
                {
                  borderColor: colors.lightPrimaryBlueBorder,
                },
              ]}
            >
              <Text
                style={[
                  styles.statIcon,
                  commonStyling.subtitle,
                  {
                    fontSize: 12,
                  },
                ]}
              >
                🕒 Hours
              </Text>
              <Text
                style={[
                  commonStyling.subtitle,
                  {
                    fontSize: 16,
                    fontFamily: "SemiBold",
                  },
                ]}
              >
                {summary?.hours_today}
              </Text>
            </View>
            <View
              style={[
                styles.statBox,
                {
                  borderColor: colors.lightPrimaryBlueBorder,
                },
              ]}
            >
              <Text
                style={[
                  styles.statIcon,
                  commonStyling.subtitle,
                  {
                    fontSize: 12,
                  },
                ]}
              >
                💰 Avg
              </Text>
              <Text
                style={[
                  commonStyling.subtitle,
                  {
                    fontSize: 16,
                    fontFamily: "SemiBold",
                  },
                ]}
              >
                ${summary?.avg_earnings_per_trip}
              </Text>
            </View>
          </View>
        </View>

        {/* Recent History */}
        <Text
          style={[
            styles.sectionLabel,
            commonStyling.title,
            {
              fontSize: 16,
              fontFamily: "Bold",
            },
          ]}
        >
          Recent History
        </Text>
        {history && history.length === 0 && (
          /* Empty State when no rides are returned */
          <View
            style={[
              {
                justifyContent: "center",
                alignItems: "center",
                marginTop: 24,
              },
            ]}
          >
            <Text style={commonStyling.subtitle}>No earning history</Text>
          </View>
        )}
        {history.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.historyItem,
              {
                borderColor: colors.lightPrimaryBlueBorder,
              },
            ]}
          >
            <View style={{ flex: 1 }}>
              <Text
                style={[
                  commonStyling.title,
                  {
                    fontSize: 14,
                    fontFamily: "Bold",
                  },
                ]}
              >
                {item.day}
              </Text>
              <Text
                style={[
                  styles.historyTrips,
                  commonStyling.subtitle,
                  {
                    fontSize: 12,
                    fontFamily: "Medium",
                  },
                ]}
              >
                {item.trips}
              </Text>
              <Text style={[styles.historyGrowth, { color: item.color }]}>
                {item.growth}
              </Text>
            </View>
            <View style={styles.historyAmountRow}>
              <Text style={styles.historyAmount}>{item.amount}</Text>
              <ChevronRight size={18} color="#94A3B8" />
            </View>
          </TouchableOpacity>
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
    padding: 16,
    backgroundColor: "#FFF",
  },
  headerTitle: { fontSize: 18, fontWeight: "800", color: "#1E293B" },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },
  notifDot: {
    position: "absolute",
    top: 2,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#EF4444",
    borderWidth: 1.5,
    borderColor: "#FFF",
  },

  scrollContent: { padding: 16 },
  subHeaderText: {
    marginBottom: 20,
  },

  balanceCard: {
    borderRadius: 24,
    padding: 20,
  },
  balanceHeader: { flexDirection: "row", alignItems: "center", gap: 8 },
  currencyCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },

  balanceAmount: {
    color: "#FFF",
    fontSize: 48,
    marginVertical: 12,
    fontFamily: "Bold",
  },
  payoutInfo: {
    width: "100%",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
    paddingTop: 16,
    gap: 8,
  },
  payoutRow: { flexDirection: "row", justifyContent: "space-between" },
  payoutLabel: { color: "#BFDBFE", fontSize: 14, fontFamily: "Regular" },
  payoutValue: { color: "#FFF", fontSize: 14, fontFamily: "Bold" },
  withdrawBtn: {
    backgroundColor: "#FFF",
    width: "100%",
    height: 50,
    borderRadius: 50,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  withdrawText: { color: "#2563EB", fontWeight: "700", fontSize: 15 },
  changeMethod: {
    color: "#DBEAFE",
    fontSize: 14,
    marginTop: 12,
    textDecorationLine: "underline",
    fontFamily: "SemiBold",
    textAlign: "center",
  },

  metricsCard: {
    borderRadius: 20,
    padding: 20,
    marginTop: 20,
    borderWidth: 1,
  },
  metricHeader: { flexDirection: "row", justifyContent: "space-between" },

  growthBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 4,
  },
  growthText: { color: "#10B981", fontSize: 11, fontWeight: "700" },
  todayAmount: {
    marginTop: 8,
  },

  statsGrid: { flexDirection: "row", gap: 12, marginTop: 20 },
  statBox: {
    flex: 1,
    padding: 12,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 1,
  },
  statIcon: {
    marginBottom: 4,
  },

  sectionLabel: {
    marginTop: 24,
    marginBottom: 12,
  },
  tabContainer: {
    flexDirection: "row",
    padding: 4,
    borderRadius: 12,
    gap: 4,
    borderWidth: 1,
  },
  tab: {
    flex: 1,
    height: 36,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  activeTab: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },

  chartCard: {
    borderRadius: 20,
    padding: 20,
    marginTop: 16,
    borderWidth: 1,
  },
  chartTitle: {
    marginBottom: 20,
  },
  chartArea: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 100,
  },
  chartCol: { alignItems: "center", gap: 8 },
  bar: { width: 30, borderRadius: 6 },

  goalCard: {
    backgroundColor: "#FFF7ED",
    borderRadius: 20,
    padding: 20,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#FFEDD5",
  },
  goalHeader: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    marginBottom: 16,
  },
  goalIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
  },
  goalTitle: { fontSize: 14, fontWeight: "800", color: "#9A3412" },
  goalSub: { fontSize: 12, color: "#C2410C", fontWeight: "600" },
  progressBarBg: {
    height: 8,
    backgroundColor: "#FFEDD5",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBarFill: { height: "100%", backgroundColor: "#F59E0B" },
  progressText: {
    fontSize: 11,
    color: "#9A3412",
    fontWeight: "700",
    marginTop: 8,
  },

  historyItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
    borderWidth: 1,
  },

  historyTrips: { marginTop: 2 },
  historyGrowth: { fontSize: 12, marginTop: 4, fontFamily: "SemiBold" },
  historyAmountRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  historyAmount: { fontSize: 20, fontFamily: "Bold", color: "#10B981" },

});

export default DriverEarningsDashboard;
