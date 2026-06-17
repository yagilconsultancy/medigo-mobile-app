import React from "react";
import { View, StyleSheet, ScrollView, Dimensions } from "react-native";
import useTheme from "../../hooks/useThemes";
import { SkeletonBone } from "./skelentonBone";
import { SafeAreaView } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export const ProfileSkeleton = () => {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.surfacePrimary }}>
      {/* Header Placeholder */}
      <View style={styles.skeletonHeader}>
        <SkeletonBone width={100} height={24} />
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 150 }}
        showsVerticalScrollIndicator={false}
      >
        {/* User Profile Section */}
        <View style={styles.profileSection}>
          <SkeletonBone width={80} height={80} borderRadius={40} />
          <View style={{ flex: 1, marginLeft: 24 }}>
            <SkeletonBone width={SCREEN_WIDTH * 0.70} height={28} style={{ marginBottom: 8 }} />
            <SkeletonBone width={SCREEN_WIDTH * 0.50} height={16} />
          </View>
        </View>

        {/* Menu Groups Loop */}
        {[1, 2, 3].map((section) => (
          <View key={section} style={{ marginTop: 24 }}>
            {/* Category Label */}
            <SkeletonBone width={80} height={12} style={{ marginBottom: 12 }} />

            {/* Settings Group Box */}
            <View
              style={[
                styles.settingsGroup,
                {
                  backgroundColor: colors.surfaceSecondary,
                  borderColor: colors.lightPrimaryBlueBorder,
                },
              ]}
            >
              {[1, 2].map((item) => (
                <View key={item} style={styles.optionRow}>
                  <SkeletonBone width={24} height={24} borderRadius={6} />
                  <SkeletonBone
                    width={SCREEN_WIDTH * 0.60}
                    height={18}
                    style={{ marginLeft: 12, flex: 1 }}
                  />
                  <SkeletonBone width={18} height={18} borderRadius={9} />
                </View>
              ))}
            </View>
          </View>
        ))}

        {/* Toggle Row Special Case */}
        <View style={{ marginTop: 24 }}>
          <SkeletonBone width={120} height={12} style={{ marginBottom: 12 }} />
          <View
            style={[
              styles.settingsGroup,
              {
                backgroundColor: colors.surfaceSecondary,
                borderColor: colors.lightPrimaryBlueBorder,
                padding: 16,
                flexDirection: "row",
                alignItems: "center",
              },
            ]}
          >
            <SkeletonBone width={40} height={40} borderRadius={20} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <SkeletonBone
                width={SCREEN_WIDTH * 0.40}
                height={16}
                style={{ marginBottom: 6 }}
              />
              <SkeletonBone width={SCREEN_WIDTH * 0.60} height={12} />
            </View>
            <SkeletonBone width={45} height={24} borderRadius={12} />
          </View>
        </View>

        {/* Logout Button Placeholder */}
        <SkeletonBone
          width={SCREEN_WIDTH}
          height={56}
          borderRadius={28}
          style={{ marginTop: 32 }}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  skeletonHeader: {
    height: 60,
    justifyContent: "center",
    paddingHorizontal: 20,
    marginTop: 40,
  },
  profileSection: {
    marginVertical: 24,
    flexDirection: "row",
    alignItems: "center",
  },
  settingsGroup: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: "hidden",
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
});
