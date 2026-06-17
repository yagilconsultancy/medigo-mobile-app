import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import useTheme from "../../hooks/useThemes";
import { SkeletonBone } from "./skelentonBone";
import { SafeAreaView } from "react-native-safe-area-context";

export const DocumentsSkeleton = () => {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.surfacePrimary }}>
      {/* Header Placeholder */}
      <View style={styles.headerPlaceholder}>
        <SkeletonBone width={120} height={24} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        scrollEnabled={false}
      >
        {/* Warning Banner Skeleton */}
        <View style={styles.warningBannerPlaceholder}>
          <View style={styles.rowBetween}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <SkeletonBone width={18} height={18} borderRadius={9} />
              <SkeletonBone width={100} height={14} />
            </View>
            <SkeletonBone width={70} height={14} />
          </View>
          <SkeletonBone width="100%" height={12} marginTop={12} />
          <SkeletonBone width="80%" height={12} marginTop={6} />
        </View>

        {/* Section Label Skeleton */}
        <SkeletonBone width={130} height={12} marginBottom={16} />

        {/* Document List Skeleton */}
        {[1, 2, 3, 4].map((i) => (
          <View
            key={i}
            style={[
              styles.docCard,
              { borderBottomColor: colors.lightPrimaryBlueBorder },
            ]}
          >
            <SkeletonBone width={44} height={44} borderRadius={12} />
            <View style={styles.docInfo}>
              <View style={styles.rowBetween}>
                <SkeletonBone width={140} height={16} />
                <SkeletonBone width={60} height={20} borderRadius={12} />
              </View>
              <SkeletonBone width={180} height={11} marginTop={8} />
              <SkeletonBone width={100} height={12} marginTop={6} />
              <SkeletonBone width={80} height={10} marginTop={4} />
            </View>
            <SkeletonBone width={18} height={18} marginLeft={10} />
          </View>
        ))}

        {/* Requirements Box Skeleton */}
        <View
          style={[
            styles.requirementsPlaceholder,
            { backgroundColor: colors.surfaceBrand },
          ]}
        >
          <SkeletonBone width={160} height={16} marginBottom={20} />
          {[1, 2, 3].map((j) => (
            <View key={j} style={styles.reqRow}>
              <SkeletonBone width={16} height={16} borderRadius={8} />
              <SkeletonBone width="85%" height={12} />
            </View>
          ))}
        </View>
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
  warningBannerPlaceholder: {
    backgroundColor: "#FEF3C750", // Faded amber
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#FEF3C7",
    marginBottom: 24,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  docCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  docInfo: { flex: 1, marginLeft: 16 },
  requirementsPlaceholder: {
    marginTop: 32,
    padding: 20,
    borderRadius: 20,
  },
  reqRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
});
