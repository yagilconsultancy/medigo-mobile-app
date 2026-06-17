import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import useTheme from "../../hooks/useThemes";
import { SkeletonBone } from "./skelentonBone";
import { SafeAreaView } from "react-native-safe-area-context";

export const NotificationsSettingsSkeleton = () => {
  const { colors } = useTheme();

  const SkeletonRow = () => (
    <View
      style={[
        styles.settingRow,
        { borderColor: colors.lightPrimaryBlueBorder },
      ]}
    >
      <SkeletonBone width={44} height={44} borderRadius={12} />
      <View style={styles.rowContent}>
        <SkeletonBone width={120} height={16} borderRadius={4} />
        <SkeletonBone width={180} height={12} borderRadius={4} marginTop={8} />
      </View>
      <SkeletonBone width={45} height={24} borderRadius={12} />
    </View>
  );

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
        {/* Section 1 */}
        <SkeletonBone width={160} height={22} marginBottom={20} marginTop={8} />
        <SkeletonRow />
        <SkeletonRow />
        <SkeletonRow />

        {/* Section 2 */}
        <SkeletonBone
          width={200}
          height={22}
          marginBottom={20}
          marginTop={24}
        />
        <SkeletonRow />
        <SkeletonRow />

        {/* Section 3 */}
        <SkeletonBone
          width={150}
          height={22}
          marginBottom={20}
          marginTop={24}
        />
        <SkeletonRow />
        <SkeletonRow />
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
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
  },
  rowContent: { flex: 1, marginLeft: 16, marginRight: 8 },
});
