import React from "react";
import { View, StyleSheet, ScrollView, Dimensions } from "react-native";
import useTheme from "../../hooks/useThemes";
import { SkeletonBone } from "./skelentonBone";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export const LocationDetailsSkeleton = () => {
  const { colors } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: colors.surfacePrimary }}>
      {/* Header Placeholder */}
      <View style={styles.skeletonHeader}>
        <SkeletonBone width={140} height={24} />
        <SkeletonBone width={40} height={40} borderRadius={20} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Subtitle Description */}
          <SkeletonBone width={SCREEN_WIDTH * 0.60} height={14} style={{ marginBottom: 24 }} />

          {/* Section Label */}
          <SkeletonBone width={80} height={16} style={{ marginBottom: 12 }} />

          {/* Main Card */}
          <View
            style={[
              styles.mainCard,
              { borderColor: colors.lightPrimaryBlueBorder },
            ]}
          >
            {/* Horizontal Header (Icon + Text + Badge) */}
            <View style={styles.locationHeader}>
              <SkeletonBone width={50} height={50} borderRadius={12} />
              <View style={{ flex: 1, marginLeft: 16 }}>
                <SkeletonBone
                  width={SCREEN_WIDTH * 0.40}
                  height={16}
                  style={{ marginBottom: 8 }}
                />
                <SkeletonBone width={SCREEN_WIDTH * 0.80} height={12} />
              </View>
              <SkeletonBone width={60} height={24} borderRadius={8} />
            </View>

            {/* Toggle Rows */}
            <View style={{ gap: 12 }}>
              {[1, 2].map((i) => (
                <View
                  key={i}
                  style={[
                    styles.toggleRow,
                    { borderColor: colors.lightPrimaryBlueBorder },
                  ]}
                >
                  <SkeletonBone width={36} height={36} borderRadius={18} />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <SkeletonBone
                      width={SCREEN_WIDTH * 0.50}
                      height={14}
                      style={{ marginBottom: 6 }}
                    />
                    <SkeletonBone width={SCREEN_WIDTH * 0.70} height={10} />
                  </View>
                  <SkeletonBone width={40} height={24} borderRadius={12} />
                </View>
              ))}
            </View>
          </View>

          {/* Map Preview Label */}
          <SkeletonBone
            width={100}
            height={16}
            style={{ marginTop: 24, marginBottom: 12 }}
          />

          {/* Map Container Placeholder */}
          <SkeletonBone
            width={SCREEN_WIDTH}
            height={200}
            borderRadius={16}
            style={{ marginBottom: 40 }}
          />

          {/* Footer Action Buttons */}
          <View style={{ gap: 16, marginBottom: 40 }}>
            <SkeletonBone width={SCREEN_WIDTH} height={56} borderRadius={28} />
            <SkeletonBone width={SCREEN_WIDTH} height={56} borderRadius={28} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  skeletonHeader: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 40,
  },
  content: { paddingHorizontal: 20 },
  mainCard: {
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
  },
  locationHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
  },
});
