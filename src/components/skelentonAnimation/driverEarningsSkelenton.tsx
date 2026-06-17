import React from "react";
import { View, StyleSheet, ScrollView, Dimensions } from "react-native";
import useTheme from "../../hooks/useThemes";
import { SkeletonBone } from "./skelentonBone";
import { SafeAreaView } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export const DriverEarningsSkeleton = () => {
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
        {/* Subtitle Placeholder */}
        <SkeletonBone width={220} height={14} style={{ marginBottom: 20 }} />

        {/* 1. Available Balance Card Skeleton */}
        <View
          style={[
            styles.balanceCard,
            { backgroundColor: colors.primaryColor, opacity: 0.8 },
          ]}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <SkeletonBone
              width={24}
              height={24}
              borderRadius={12}
              backgroundColor="rgba(255,255,255,0.3)"
            />
            <SkeletonBone
              width={120}
              height={14}
              backgroundColor="rgba(255,255,255,0.3)"
            />
          </View>
          <SkeletonBone
            width={SCREEN_WIDTH * 0.7}
            height={48}
            style={{ marginVertical: 16 }}
            backgroundColor="rgba(255,255,255,0.3)"
          />

          <View
            style={{
              gap: 10,
              borderTopWidth: 1,
              borderTopColor: "rgba(255,255,255,0.1)",
              paddingTop: 16,
            }}
          >
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <SkeletonBone
                width={80}
                height={12}
                backgroundColor="rgba(255,255,255,0.2)"
              />
              <SkeletonBone
                width={100}
                height={12}
                backgroundColor="rgba(255,255,255,0.2)"
              />
            </View>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <SkeletonBone
                width={90}
                height={12}
                backgroundColor="rgba(255,255,255,0.2)"
              />
              <SkeletonBone
                width={80}
                height={12}
                backgroundColor="rgba(255,255,255,0.2)"
              />
            </View>
          </View>
          <SkeletonBone
            width={SCREEN_WIDTH}
            height={50}
            borderRadius={25}
            style={{ marginTop: 20 }}
            backgroundColor="#FFF"
          />
        </View>

        {/* 2. Today's Metrics Skeleton */}
        <View
          style={[
            styles.metricsCard,
            { borderColor: colors.lightPrimaryBlueBorder },
          ]}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 12,
            }}
          >
            <SkeletonBone width={100} height={14} />
            <SkeletonBone width={50} height={20} borderRadius={6} />
          </View>
          <View style={{ alignItems: "center", marginBottom: 20 }}>
            <SkeletonBone width={SCREEN_WIDTH * 0.50} height={32} style={{ marginBottom: 8 }} />
            <SkeletonBone width={SCREEN_WIDTH * 0.40} height={12} />
          </View>
          <View style={{ flexDirection: "row", gap: 12 }}>
            {[1, 2, 3].map((i) => (
              <View
                key={i}
                style={[
                  styles.statBox,
                  { borderColor: colors.lightPrimaryBlueBorder },
                ]}
              >
                <SkeletonBone
                  width={40}
                  height={10}
                  style={{ marginBottom: 6 }}
                />
                <SkeletonBone width={30} height={16} />
              </View>
            ))}
          </View>
        </View>

        {/* 3. Performance Analytics (Chart) Skeleton */}
        <SkeletonBone
          width={150}
          height={18}
          style={{ marginTop: 24, marginBottom: 12 }}
        />
        <View
          style={[
            styles.tabContainer,
            { borderColor: colors.lightPrimaryBlueBorder },
          ]}
        >
          {[1, 2, 3].map((i) => (
            <View key={i} style={{ flex: 1, padding: 4 }}>
              <SkeletonBone width={SCREEN_WIDTH} height={30} borderRadius={8} />
            </View>
          ))}
        </View>
        <View
          style={[
            styles.chartCard,
            { borderColor: colors.lightPrimaryBlueBorder },
          ]}
        >
          <SkeletonBone width={120} height={14} style={{ marginBottom: 20 }} />
          <View style={styles.chartArea}>
            {[40, 70, 50, 90, 60, 80, 45].map((h, i) => (
              <View key={i} style={{ alignItems: "center", gap: 8 }}>
                <SkeletonBone width={30} height={h} borderRadius={6} />
                <SkeletonBone width={15} height={10} />
              </View>
            ))}
          </View>
        </View>

        {/* 4. Recent History Skeleton */}
        <SkeletonBone
          width={130}
          height={18}
          style={{ marginTop: 24, marginBottom: 12 }}
        />
        {[1, 2].map((i) => (
          <View
            key={i}
            style={[
              styles.historyItem,
              { borderColor: colors.lightPrimaryBlueBorder },
            ]}
          >
            <View style={{ flex: 1, gap: 6 }}>
              <SkeletonBone width={80} height={14} />
              <SkeletonBone width={100} height={12} />
              <SkeletonBone width={60} height={10} />
            </View>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <SkeletonBone width={70} height={24} />
              <SkeletonBone width={18} height={18} borderRadius={9} />
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
    paddingHorizontal: 16,
  },
  scrollContent: { padding: 16 },
  balanceCard: { borderRadius: 24, padding: 20 },
  metricsCard: { borderRadius: 20, padding: 20, marginTop: 20, borderWidth: 1 },
  statBox: {
    flex: 1,
    padding: 12,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 1,
  },
  tabContainer: {
    flexDirection: "row",
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  chartCard: { borderRadius: 20, padding: 20, borderWidth: 1 },
  chartArea: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 100,
  },
  historyItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
    borderWidth: 1,
  },
});
