import React from "react";
import { View, StyleSheet, ScrollView, Dimensions } from "react-native";
import useTheme from "../../hooks/useThemes";
import { SkeletonBone } from "./skelentonBone";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export const NotificationsSkeleton = () => {
  const { colors } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: colors.surfacePrimary }}>
      {/* Header Placeholder (Matches your Header component height) */}
      <View style={styles.skeletonHeader}>
        <SkeletonBone width={120} height={24} />
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Description Placeholder */}
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <SkeletonBone width={SCREEN_WIDTH * 0.8} height={14} />
        </View>

        {/* Notification List Items */}
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <View
            key={i}
            style={[
              styles.itemWrapper,
              {
                backgroundColor: colors.surfaceElevated,
                borderBottomColor: colors.lightPrimaryBlueBorder,
              },
            ]}
          >
            {/* Circular Icon Placeholder */}
            <SkeletonBone width={48} height={48} borderRadius={24} />

            <View style={styles.textWrapper}>
              <View style={styles.titleRow}>
                {/* Title */}
                <SkeletonBone
                  width={SCREEN_WIDTH * 0.4}
                  height={16}
                  style={{ marginBottom: 8 }}
                />
              </View>

              {/* Body / Description (2 lines) */}
              <SkeletonBone
                width={SCREEN_WIDTH * 0.9}
                height={12}
                style={{ marginBottom: 6 }}
              />
              <SkeletonBone
                width={SCREEN_WIDTH * 0.6}
                height={12}
                style={{ marginBottom: 10 }}
              />

              {/* Time Text */}
              <SkeletonBone width={SCREEN_WIDTH * 0.25} height={10} />
            </View>

            {/* Chevron Placeholder */}
            <SkeletonBone width={14} height={14} borderRadius={7} />
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
  itemWrapper: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  textWrapper: {
    flex: 1,
    marginLeft: 16,
    marginRight: 8,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
});
