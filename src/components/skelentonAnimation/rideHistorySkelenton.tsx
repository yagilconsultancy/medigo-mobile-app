import { Dimensions, ScrollView } from "react-native";
import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, Easing } from "react-native";
import useTheme from "../../hooks/useThemes";
import { SkeletonBone } from "./skelentonBone";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export const RideHistorySkeleton = () => {
  const { colors } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: colors.surfacePrimary }}>
      {/* Fixed Header Placeholder */}
      <View style={styles.skeletonHeader}>
        <SkeletonBone width={140} height={24} />
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 10 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Subheader & Filter Placeholder */}
        <View style={styles.rowBetween}>
          <SkeletonBone width={120} height={14} />
          <SkeletonBone width={80} height={30} borderRadius={8} />
        </View>

        {/* Dashboard Row */}
        <View style={styles.dashboardRow}>
          <View
            style={[
              styles.statCardSkeleton,
              { backgroundColor: colors.homelightPrimaryBlue50 },
            ]}
          >
            <SkeletonBone width={60} height={10} style={{ marginBottom: 8 }} />
            <SkeletonBone width={40} height={24} />
          </View>
          <View
            style={[
              styles.statCardSkeleton,
              { backgroundColor: colors.homelightPrimaryBlue50 },
            ]}
          >
            <SkeletonBone width={70} height={10} style={{ marginBottom: 8 }} />
            <SkeletonBone width={80} height={24} />
          </View>
        </View>

        <SkeletonBone width={100} height={16} style={{ marginBottom: 20 }} />

        {/* List Items */}
        {[1, 2, 3].map((i) => (
          <View
            key={i}
            style={[
              styles.cardSkeleton,
              { backgroundColor: colors.surfaceElevated },
            ]}
          >
            <View style={styles.rowBetween}>
              <View>
                <SkeletonBone
                  width={100}
                  height={14}
                  style={{ marginBottom: 6 }}
                />
                <SkeletonBone width={60} height={12} />
              </View>
              <View style={{ alignItems: "flex-end" }}>
                <SkeletonBone
                  width={50}
                  height={18}
                  style={{ marginBottom: 6 }}
                />
                <SkeletonBone width={60} height={10} />
              </View>
            </View>

            <View style={styles.routeSection}>
              <View style={{ width: 10, alignItems: "center" }}>
                <SkeletonBone width={6} height={6} borderRadius={3} />
                <View style={styles.linePlaceholder} />
                <SkeletonBone width={6} height={6} borderRadius={3} />
              </View>
              <View style={{ flex: 1, marginLeft: 15 }}>
                <SkeletonBone
                  width={SCREEN_WIDTH * 0.80}
                  height={12}
                  style={{ marginBottom: 20 }}
                />
                <SkeletonBone width={SCREEN_WIDTH * 0.70} height={12} />
              </View>
            </View>

            <View style={styles.actionRow}>
              <SkeletonBone width={SCREEN_WIDTH * 0.48} height={44} borderRadius={12} />
              <SkeletonBone width={SCREEN_WIDTH * 0.48} height={44} borderRadius={12} />
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  skeletonHeader: {
    height: 60,
    justifyContent: "center",
    paddingHorizontal: 20,
    marginTop: 40,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  dashboardRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 32,
  },
  statCardSkeleton: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    height: 85,
  },
  cardSkeleton: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    height: 220,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  routeSection: {
    flexDirection: "row",
    marginVertical: 20,
  },
  linePlaceholder: {
    width: 1,
    height: 30,
    backgroundColor: "#F1F5F9",
    marginVertical: 4,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
});
