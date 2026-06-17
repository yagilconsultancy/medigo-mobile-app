import React from "react";
import { View, StyleSheet, ScrollView, Dimensions } from "react-native";
import { SkeletonBone } from "./skelentonBone";
import useTheme from "../../hooks/useThemes";
import { SafeAreaView } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export const EmergencyContactsSkeleton = () => {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.surfacePrimary }}>
      <View>
        {/* Header Placeholder */}
        <View style={styles.skeletonHeader}>
          <SkeletonBone width={180} height={24} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Safety Banner Skeleton */}
          <View
            style={[
              styles.safetyBanner,
              { backgroundColor: colors.homelightPrimaryBlue50 },
            ]}
          >
            <SkeletonBone width={20} height={20} borderRadius={4} />
            <View style={styles.bannerTextContent}>
              <SkeletonBone
                width={SCREEN_WIDTH * 0.40}
                height={14}
                style={{ marginBottom: 8 }}
              />
              <SkeletonBone
                width={SCREEN_WIDTH * 0.90}
                height={12}
                style={{ marginBottom: 4 }}
              />
              <SkeletonBone width={SCREEN_WIDTH * 0.80} height={12} />
            </View>
          </View>

          {/* Add Contact Dashed Button Skeleton */}
          <View
            style={[
              styles.addContactBtn,
              {
                borderColor: colors.lightPrimaryBlueBorder,
                borderStyle: "dashed",
              },
            ]}
          >
            <SkeletonBone
              width={32}
              height={32}
              borderRadius={16}
              style={{ marginRight: 12 }}
            />
            <SkeletonBone width={140} height={16} />
          </View>

          {/* Contact List Placeholders */}
          {[1, 2, 3].map((i) => (
            <ContactCardSkeleton key={i} />
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const ContactCardSkeleton = () => {
  const { colors } = useTheme();
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.homelightPrimaryBlue50,
          borderColor: colors.lightPrimaryBlueBorder,
        },
      ]}
    >
      <View style={styles.cardHeader}>
        <View style={{ flex: 1 }}>
          <SkeletonBone width={SCREEN_WIDTH * 0.50} height={16} style={{ marginBottom: 8 }} />
          <SkeletonBone width={SCREEN_WIDTH * 0.30} height={14} />
        </View>
        <SkeletonBone width={36} height={36} borderRadius={18} />
      </View>

      {/* Divider */}
      <View
        style={[
          styles.cardDivider,
          { backgroundColor: colors.lightPrimaryBlueBorder },
        ]}
      />

      {/* Phone Row */}
      <View style={styles.phoneRow}>
        <SkeletonBone width={16} height={16} borderRadius={4} />
        <SkeletonBone width={SCREEN_WIDTH * 0.40} height={14} style={{ marginLeft: 10 }} />
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
  safetyBanner: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 16,
    marginTop: 10,
    alignItems: "flex-start",
  },
  bannerTextContent: { flex: 1, marginLeft: 12 },
  addContactBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 64,
    borderRadius: 16,
    borderWidth: 1,
    marginVertical: 24,
  },
  card: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  cardDivider: {
    height: 1,
    marginVertical: 16,
  },
  phoneRow: { flexDirection: "row", alignItems: "center" },
});
