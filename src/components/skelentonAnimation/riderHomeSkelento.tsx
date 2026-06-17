import React, { useEffect } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useTheme from "../../hooks/useThemes";
import { SkeletonBone } from "./skelentonBone";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export const RiderHomeSkeleton = () => {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.surfacePrimary }}>
      <View style={{ padding: 20 }}>
        {/* Header Skeleton */}
        <View style={styles.headerRow}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <SkeletonBone width={48} height={48} borderRadius={24} />
            <View style={{ marginLeft: 12 }}>
              <SkeletonBone
                width={100}
                height={14}
                style={{ marginBottom: 8 }}
              />
              <SkeletonBone width={140} height={24} />
            </View>
          </View>
          <SkeletonBone width={40} height={40} borderRadius={20} />
        </View>

        {/* Quick Book Card Skeleton */}
        <View
          style={[
            styles.skeletonCard,
            { backgroundColor: colors.surfaceSecondary },
          ]}
        >
          <SkeletonBone width={180} height={20} style={{ marginBottom: 20 }} />
          <SkeletonBone
            width={SCREEN_WIDTH}
            height={60}
            borderRadius={12}
            style={{ marginBottom: 12 }}
          />
          <SkeletonBone
            width={SCREEN_WIDTH}
            height={50}
            borderRadius={20}
            style={{ marginBottom: 12 }}
          />
          <SkeletonBone
            width={SCREEN_WIDTH}
            height={50}
            borderRadius={12}
            style={{ marginBottom: 12 }}
          />
          <SkeletonBone width={SCREEN_WIDTH} height={55} borderRadius={24} />
        </View>

        {/* Section Header */}
        <View style={styles.sectionHeader}>
          <SkeletonBone width={140} height={20} />
          <SkeletonBone width={60} height={14} />
        </View>

        {/* List Items Skeleton */}
        {[1, 2].map((i) => (
          <View
            key={i}
            style={[styles.skeletonCard, { height: 80, marginBottom: 16 }]}
          />
        ))}

        {/* Map Placeholder */}
        <SkeletonBone width={SCREEN_WIDTH} height={200} borderRadius={16} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },
  skeletonCard: {
    padding: 16,
    borderRadius: 24,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
});
