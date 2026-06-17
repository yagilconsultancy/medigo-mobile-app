import React from "react";
import { View, StyleSheet, ScrollView, Dimensions } from "react-native";
import useTheme from "../../hooks/useThemes";
import { SafeAreaView } from "react-native-safe-area-context";
import { SkeletonBone } from "./skelentonBone";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export const UpcomingRidesSkeleton = () => {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.surfacePrimary }}>
      {/* Header Placeholder (Matching your Header component height) */}
      <View style={styles.headerPlaceholder}>
        <SkeletonBone width={150} height={24} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        scrollEnabled={false}
      >
        {/* Subheadline Placeholder */}
        <SkeletonBone width={200} height={14} style={{ marginBottom: 20 }} />

        {/* Mocking 3 Ride Cards */}
        {[1, 2, 3].map((key) => (
          <View
            key={key}
            style={[
              styles.rideCard,
              {
                borderColor: colors.lightPrimaryBlueBorder,
                backgroundColor: colors.surfacePrimary,
              },
            ]}
          >
            {/* Card Header: Time and Status Badge */}
            <View style={styles.cardHeader}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <SkeletonBone width={16} height={16} borderRadius={4} />
                <SkeletonBone
                  width={100}
                  height={14}
                  style={{ marginLeft: 8 }}
                />
              </View>
              <SkeletonBone width={80} height={28} borderRadius={12} />
            </View>

            {/* Passenger Name & Medical Badge */}
            <SkeletonBone
              width={SCREEN_WIDTH * 0.60}
              height={22}
              style={{ marginBottom: 12 }}
            />
            <SkeletonBone
              width={140}
              height={24}
              borderRadius={8}
              style={{ marginBottom: 20 }}
            />

            {/* Route Timeline Skeleton */}
            <View style={styles.routeContainer}>
              <View style={styles.timelineIndicators}>
                <SkeletonBone width={10} height={10} borderRadius={5} />
                <SkeletonBone
                  width={1}
                  height={40}
                  style={{ marginVertical: 4 }}
                />
                <SkeletonBone width={10} height={10} borderRadius={5} />
              </View>
              <View style={{ flex: 1, gap: 12 }}>
                <View>
                  <SkeletonBone
                    width={40}
                    height={10}
                    style={{ marginBottom: 4 }}
                  />
                  <SkeletonBone width={SCREEN_WIDTH * 0.80} height={14} />
                </View>
                <View style={{ marginTop: 4 }}>
                  <SkeletonBone
                    width={60}
                    height={10}
                    style={{ marginBottom: 4 }}
                  />
                  <SkeletonBone width={SCREEN_WIDTH * 0.75} height={14} />
                </View>
              </View>
            </View>

            {/* Card Footer */}
            <View
              style={[
                styles.cardFooter,
                { borderTopColor: colors.lightPrimaryBlueBorder },
              ]}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
              >
                <SkeletonBone width={16} height={16} borderRadius={8} />
                <SkeletonBone width={50} height={14} />
              </View>
              <SkeletonBone width={60} height={24} />
              <SkeletonBone width={70} height={14} />
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerPlaceholder: {
    height: 60,
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  scrollContent: { padding: 16 },
  rideCard: {
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  routeContainer: { flexDirection: "row", gap: 12, marginBottom: 20 },
  timelineIndicators: { alignItems: "center", width: 12, paddingTop: 4 },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    paddingTop: 16,
  },
});
