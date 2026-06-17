import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useTheme from "../../hooks/useThemes";

const SkeletonItem = ({ style }: { style: any }) => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  return (
    <Animated.View style={[style, { opacity, backgroundColor: "#E2E8F0" }]} />
  );
};

const RideStatusSkeleton = () => {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.surfacePrimary }}>
      <View style={styles.header}>
        <SkeletonItem style={styles.titleSkeleton} />
        <SkeletonItem style={styles.circleSkeleton} />
      </View>

      <View style={{ paddingHorizontal: 20 }}>
        {/* Banner Skeleton */}
        <SkeletonItem style={styles.bannerSkeleton} />

        {/* Tracking Card Skeleton */}
        <View style={styles.cardContainer}>
          <SkeletonItem style={styles.badgeSkeleton} />
          <View style={styles.visualRow}>
            <SkeletonItem style={styles.iconSkeleton} />
            <SkeletonItem style={styles.lineSkeleton} />
            <SkeletonItem style={styles.iconSkeleton} />
          </View>
          <SkeletonItem style={styles.footerSkeleton} />
        </View>

        {/* Details Card Skeleton */}
        <View style={styles.detailsCard}>
          <SkeletonItem style={styles.headingSkeleton} />
          <View style={{ flexDirection: "row", gap: 12, marginBottom: 20 }}>
            <SkeletonItem style={styles.circleSkeleton} />
            <View style={{ flex: 1, gap: 8 }}>
              <SkeletonItem style={{ width: "40%", height: 12 }} />
              <SkeletonItem style={{ width: "70%", height: 16 }} />
            </View>
          </View>
          <SkeletonItem style={styles.longLineSkeleton} />
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <SkeletonItem
              style={{ width: "45%", height: 40, borderRadius: 12 }}
            />
            <SkeletonItem
              style={{ width: "45%", height: 40, borderRadius: 12 }}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    alignItems: "center",
  },
  titleSkeleton: { width: 120, height: 28, borderRadius: 4 },
  circleSkeleton: { width: 40, height: 40, borderRadius: 20 },
  bannerSkeleton: {
    width: "100%",
    height: 50,
    borderRadius: 16,
    marginBottom: 24,
  },
  cardContainer: {
    width: "100%",
    height: 200,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 24,
    alignItems: "center",
    marginBottom: 24,
  },
  badgeSkeleton: { width: 140, height: 40, borderRadius: 20, marginBottom: 30 },
  visualRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 30,
  },
  iconSkeleton: { width: 32, height: 32, borderRadius: 8 },
  lineSkeleton: { flex: 1, height: 4, marginHorizontal: 10 },
  footerSkeleton: { width: "100%", height: 50, borderRadius: 16 },
  detailsCard: {
    width: "100%",
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  headingSkeleton: { width: 100, height: 14, marginBottom: 20 },
  longLineSkeleton: { width: "100%", height: 1, marginVertical: 16 },
});

export default RideStatusSkeleton;
