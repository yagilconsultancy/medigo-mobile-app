import React from "react";
import { View, StyleSheet, ScrollView, Dimensions } from "react-native";
import { SkeletonBone } from "./skelentonBone";
import useTheme from "../../hooks/useThemes";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export const SavedLocationsSkeleton = () => {
  const { colors } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: colors.surfacePrimary }}>
      {/* Header Placeholder */}
      <View style={styles.skeletonHeader}>
        <SkeletonBone width={160} height={24} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Description Placeholder */}
        <SkeletonBone width={SCREEN_WIDTH * 0.70} height={14} style={{ marginBottom: 24 }} />

        {/* "Add New Location" Card Placeholder */}
        <View
          style={[
            styles.addLocationCard,
            {
              backgroundColor: colors.homelightPrimaryBlue50,
              borderColor: colors.lightPrimaryBlueBorder,
            },
          ]}
        >
          <SkeletonBone width={48} height={48} borderRadius={24} />
          <View style={{ flex: 1, marginLeft: 16 }}>
            <SkeletonBone width={SCREEN_WIDTH * 0.50} height={16} style={{ marginBottom: 8 }} />
            <SkeletonBone width={SCREEN_WIDTH * 0.75} height={12} />
          </View>
        </View>

        {/* Favorites Section Placeholder */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <SkeletonBone width={16} height={16} borderRadius={4} />
          <SkeletonBone width={80} height={12} style={{ marginLeft: 8 }} />
        </View>

        {/* Favorite Location Cards */}
        {[1, 2].map((i) => (
          <LocationCardSkeleton key={`fav-${i}`} />
        ))}

        {/* All Locations Section Placeholder */}
        <SkeletonBone width={100} height={12} style={{ marginVertical: 12 }} />

        {/* Regular Location Cards */}
        {[1, 2, 3].map((i) => (
          <LocationCardSkeleton key={`reg-${i}`} />
        ))}
      </ScrollView>
    </View>
  );
};

// Internal helper to match your LocationCard component structure
const LocationCardSkeleton = () => {
  const { colors } = useTheme();
  return (
    <View
      style={[
        styles.locationCard,
        {
          backgroundColor: colors.surfaceElevated,
          borderColor: colors.lightPrimaryBlueBorder,
        },
      ]}
    >
      <SkeletonBone width={44} height={44} borderRadius={22} />
      <View style={{ flex: 1, marginLeft: 16 }}>
        <SkeletonBone width={SCREEN_WIDTH * 0.35} height={14} style={{ marginBottom: 6 }} />
        <SkeletonBone width={SCREEN_WIDTH * 0.85} height={12} style={{ marginBottom: 6 }} />
        <SkeletonBone width={SCREEN_WIDTH * 0.25} height={10} />
      </View>
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
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  addLocationCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 24,
  },
  locationCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 12,
  },
});
