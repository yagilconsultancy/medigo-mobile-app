import React from "react";
import { View, StyleSheet, ScrollView, Dimensions } from "react-native";
import useTheme from "../../hooks/useThemes";
import { SkeletonBone } from "./skelentonBone";
import { SafeAreaView } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export const VehicleDetailsSkeleton = () => {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.surfacePrimary }}>
      {/* Header Placeholder */}
      <View style={styles.headerPlaceholder}>
        <SkeletonBone width={140} height={24} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        scrollEnabled={false}
      >
        {/* Photo Card Skeleton */}
        <View
          style={[
            styles.photoCard,
            { borderColor: colors.lightPrimaryBlueBorder },
          ]}
        >
          <SkeletonBone width={64} height={64} borderRadius={32} />
          <View style={styles.photoTextGroup}>
            <SkeletonBone width={120} height={20} marginBottom={8} />
            <SkeletonBone width={180} height={14} />
          </View>
        </View>

        {/* Status Banner Skeleton */}
        <View style={styles.statusBanner}>
          <SkeletonBone width={20} height={20} borderRadius={10} />
          <View style={styles.statusTextGroup}>
            <SkeletonBone width={100} height={14} marginBottom={6} />
            <SkeletonBone width={200} height={12} />
          </View>
        </View>

        {/* Info Items Skeleton */}
        <SkeletonBone width={150} height={20} marginBottom={16} />
        {[1, 2, 3].map((i) => (
          <View
            key={i}
            style={[
              styles.infoItem,
              { borderColor: colors.lightPrimaryBlueBorder },
            ]}
          >
            <SkeletonBone width={36} height={36} borderRadius={10} />
            <View style={styles.itemContent}>
              <SkeletonBone width={60} height={10} marginBottom={6} />
              <SkeletonBone width={120} height={16} />
            </View>
          </View>
        ))}

        {/* Document Items Skeleton */}
        <SkeletonBone
          width={150}
          height={20}
          marginTop={20}
          marginBottom={16}
        />
        {[1, 2].map((i) => (
          <View
            key={i}
            style={[
              styles.docItem,
              { borderColor: colors.lightPrimaryBlueBorder },
            ]}
          >
            <SkeletonBone width={44} height={44} borderRadius={12} />
            <View style={styles.docContent}>
              <SkeletonBone width={140} height={16} marginBottom={6} />
              <SkeletonBone width={100} height={12} />
            </View>
            <SkeletonBone width={20} height={20} />
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
    paddingHorizontal: 20,
  },
  scrollContent: { padding: 20 },
  photoCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 20,
  },
  photoTextGroup: { marginLeft: 16 },
  statusBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F5F9", // Neutral gray for skeleton status
    padding: 16,
    borderRadius: 16,
    marginBottom: 32,
  },
  statusTextGroup: { marginLeft: 12 },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
  itemContent: { flex: 1, marginLeft: 12 },
  docItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
  docContent: { flex: 1, marginLeft: 14 },
});
