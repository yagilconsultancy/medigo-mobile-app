import React from "react";
import { View, StyleSheet, ScrollView, Dimensions } from "react-native";
import useTheme from "../../hooks/useThemes";
import { SkeletonBone } from "./skelentonBone";
import { SafeAreaView } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export const ChatsSkeleton = () => {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.surfacePrimary }}>
      {/* Header Placeholder */}
      <View style={styles.headerPlaceholder}>
        <SkeletonBone width={80} height={24} />
      </View>

      <ScrollView
        contentContainerStyle={styles.listContent}
        scrollEnabled={false}
      >
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <View
            key={i}
            style={[
              styles.itemContainer,
              {
                backgroundColor:
                  i === 1 ? colors.surfaceElevated : colors.surfacePrimary,
              },
            ]}
          >
            {/* Avatar Skeleton */}
            <View style={styles.avatarContainer}>
              <SkeletonBone width={50} height={50} borderRadius={25} />
              {i === 1 && (
                <View
                  style={[
                    styles.onlineIndicator,
                    { borderColor: colors.surfaceElevated },
                  ]}
                />
              )}
            </View>

            {/* Content Skeleton */}
            <View style={styles.contentContainer}>
              <View style={styles.headerRow}>
                <SkeletonBone width={120} height={16} />
                <SkeletonBone width={40} height={12} />
              </View>

              <View style={styles.appointmentRow}>
                <SkeletonBone width={14} height={14} borderRadius={7} />
                <SkeletonBone
                  width={100}
                  height={12}
                  style={{ marginLeft: 6 }}
                />
              </View>

              <View style={styles.messageRow}>
                <SkeletonBone width={SCREEN_WIDTH * 0.85} height={14} />
                {i % 2 === 0 && (
                  <SkeletonBone width={20} height={20} borderRadius={10} />
                )}
              </View>
            </View>
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
  listContent: { paddingHorizontal: 16, paddingTop: 10 },
  itemContainer: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 16,
    marginBottom: 8,
  },
  avatarContainer: { position: "relative" },
  contentContainer: { flex: 1, marginLeft: 16 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  appointmentRow: { flexDirection: "row", alignItems: "center" },
  messageRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#22C55E",
    borderWidth: 2,
  },
});
