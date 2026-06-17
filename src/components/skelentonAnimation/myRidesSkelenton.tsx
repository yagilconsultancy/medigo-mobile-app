import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Dimensions} from "react-native";
import useTheme from "../../hooks/useThemes";
import { SkeletonBone } from "./skelentonBone";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export const MyRidesSkeleton = () => {
  const { colors } = useTheme();

  return (
    <View
      style={{ flex: 1, backgroundColor: colors.surfacePrimary, padding: 20 }}
    >
      {/* Header Placeholder */}
      <View style={styles.skeletonHeader}>
        <SkeletonBone width={120} height={24} />
        <SkeletonBone width={40} height={40} borderRadius={20} />
      </View>

      <SkeletonBone width={200} height={14} style={{ marginBottom: 30 }} />

      {/* Active Ride Card Skeleton */}
      <View style={styles.sectionTitleRow}>
        <SkeletonBone width={100} height={16} />
      </View>
      <View
        style={[
          styles.activeCardSkeleton,
          { backgroundColor: colors.homelightPrimaryBlue50 },
        ]}
      >
        <View style={styles.rowBetween}>
          <SkeletonBone width={100} height={20} />
          <SkeletonBone width={80} height={24} borderRadius={12} />
        </View>
        <View style={{ marginVertical: 20 }}>
          <SkeletonBone
            width={SCREEN_WIDTH * 0.80}
            height={14}
            style={{ marginBottom: 10 }}
          />
          <SkeletonBone width={SCREEN_WIDTH * 0.60} height={14} />
        </View>
        <View style={styles.driverRowSkeleton}>
          <SkeletonBone width={40} height={40} borderRadius={20} />
          <SkeletonBone width={120} height={14} style={{ marginLeft: 12 }} />
        </View>
        <SkeletonBone
          width={SCREEN_WIDTH}
          height={50}
          borderRadius={16}
          style={{ marginTop: 20 }}
        />
      </View>

      {/* Upcoming Rides Skeleton */}
      <View style={[styles.sectionTitleRow, { marginTop: 40 }]}>
        <SkeletonBone width={120} height={16} />
      </View>

      {[1, 2].map((i) => (
        <View key={i} style={styles.upcomingCardSkeleton}>
          <View style={styles.rowBetween}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <SkeletonBone width={36} height={36} borderRadius={10} />
              <View style={{ marginLeft: 10 }}>
                <SkeletonBone
                  width={100}
                  height={14}
                  style={{ marginBottom: 6 }}
                />
                <SkeletonBone width={60} height={12} />
              </View>
            </View>
            <SkeletonBone width={70} height={22} borderRadius={8} />
          </View>
          <View style={{ marginTop: 20 }}>
            <SkeletonBone
              width={SCREEN_WIDTH * 0.90}
              height={12}
              style={{ marginBottom: 15 }}
            />
            <SkeletonBone width={SCREEN_WIDTH * 0.90} height={12} />
          </View>
          <View style={[styles.rowBetween, { marginTop: 20 }]}>
            <SkeletonBone width={SCREEN_WIDTH * 0.90} height={44} borderRadius={12} />
            <SkeletonBone width={SCREEN_WIDTH * 0.20} height={14} />
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  skeletonHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    marginTop: 40,
  },
  sectionTitleRow: {
    marginBottom: 16,
  },
  activeCardSkeleton: {
    padding: 20,
    borderRadius: 24,
    height: 280,
  },
  upcomingCardSkeleton: {
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    marginBottom: 16,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  driverRowSkeleton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
});
