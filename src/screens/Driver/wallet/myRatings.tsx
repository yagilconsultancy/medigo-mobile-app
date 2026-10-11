import React, { useCallback, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  StatusBar,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { Star } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { format } from "date-fns";
import useTheme from "../../../hooks/useThemes";
import { commonStyles } from "../../../styles/commonStyles";
import Header from "../../../components/reuseables/header";
import { useMyRatings } from "../../../hooks/queries/useDriverRatings";

const Stars = ({ value, size }: { value: number; size: number }) => (
  <View style={{ flexDirection: "row", gap: 2 }}>
    {[1, 2, 3, 4, 5].map((n) => (
      <Star
        key={n}
        size={size}
        color="#F59E0B"
        fill={n <= Math.round(value) ? "#F59E0B" : "transparent"}
      />
    ))}
  </View>
);

const DriverRatings = () => {
  const { colors, theme } = useTheme();
  const commonStyling = commonStyles(colors);
  const { data, isLoading, refetch } = useMyRatings();
  const [refreshing, setRefreshing] = useState(false);
  const summary = data?.data;
  const total: number = summary?.total_ratings ?? 0;
  const ratings: any[] = summary?.ratings ?? [];

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.surfacePrimary }]}
    >
      <StatusBar
        barStyle={theme === "light" ? "dark-content" : "light-content"}
      />
      <Header title="My Ratings" />

      {isLoading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={colors.primaryColor} />
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View
            style={[
              styles.summaryCard,
              { borderColor: colors.lightPrimaryBlueBorder },
            ]}
          >
            {total > 0 ? (
              <>
                <Text
                  style={[
                    commonStyling.title,
                    { fontSize: 48, fontFamily: "Bold" },
                  ]}
                >
                  {Number(summary.average_rating).toFixed(1)}
                </Text>
                <Stars value={Number(summary.average_rating)} size={22} />
                <Text style={[commonStyling.subtitle, { marginTop: 8 }]}>
                  Based on {total} rating{total === 1 ? "" : "s"} from riders
                </Text>
              </>
            ) : (
              <>
                <Text
                  style={[
                    commonStyling.title,
                    { fontSize: 20, fontFamily: "Bold" },
                  ]}
                >
                  No ratings yet
                </Text>
                <Text
                  style={[
                    commonStyling.subtitle,
                    { marginTop: 8, textAlign: "center" },
                  ]}
                >
                  Your rating will show here after riders rate your trips.
                </Text>
              </>
            )}
          </View>

          {ratings.map((r, i) => (
            <View
              key={`${r.created_at}-${i}`}
              style={[
                styles.ratingCard,
                { borderColor: colors.lightPrimaryBlueBorder },
              ]}
            >
              <View style={styles.rowBetween}>
                <Stars value={r.rating} size={16} />
                <Text style={[commonStyling.subtitle, { fontSize: 12 }]}>
                  {r.created_at
                    ? format(new Date(r.created_at), "MMM dd, yyyy")
                    : ""}
                </Text>
              </View>
              {!!r.comment && (
                <Text style={[commonStyling.title, { fontSize: 14, marginTop: 8 }]}>
                  {r.comment}
                </Text>
              )}
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, paddingBottom: 40, gap: 12 },
  summaryCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    marginBottom: 8,
  },
  ratingCard: { borderWidth: 1, borderRadius: 14, padding: 14 },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

export default DriverRatings;
