import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import useTheme from "../../hooks/useThemes";
import { SkeletonBone } from "./skelentonBone";
import { SafeAreaView } from "react-native-safe-area-context";

export const RideDetailsSkeleton = () => {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.surfacePrimary }}>
      {/* Header Placeholder */}
      <View style={styles.header}>
        <View>
          <SkeletonBone width={140} height={24} style={{ marginBottom: 8 }} />
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <SkeletonBone width={16} height={16} borderRadius={4} />
            <SkeletonBone width={100} height={14} style={{ marginLeft: 6 }} />
            <SkeletonBone
              width={70}
              height={20}
              borderRadius={10}
              style={{ marginLeft: 10 }}
            />
          </View>
        </View>
        <SkeletonBone width={36} height={36} borderRadius={18} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Route Card Skeleton */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.homelightPrimaryBlue50,
              borderColor: colors.lightPrimaryBlueBorder,
            },
          ]}
        >
          <SkeletonBone width={60} height={14} style={{ marginBottom: 16 }} />
          <View style={{ flexDirection: "row" }}>
            <View style={{ alignItems: "center", width: 20 }}>
              <SkeletonBone width={10} height={10} borderRadius={5} />
              <SkeletonBone
                width={1}
                height={40}
                style={{ marginVertical: 4 }}
              />
              <SkeletonBone width={10} height={10} borderRadius={5} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <SkeletonBone
                width="40%"
                height={11}
                style={{ marginBottom: 4 }}
              />
              <SkeletonBone
                width="90%"
                height={14}
                style={{ marginBottom: 16 }}
              />
              <SkeletonBone
                width="40%"
                height={11}
                style={{ marginBottom: 4 }}
              />
              <SkeletonBone width="85%" height={14} />
            </View>
          </View>
        </View>

        {/* Driver Card Skeleton */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.homelightPrimaryBlue50,
              borderColor: colors.lightPrimaryBlueBorder,
            },
          ]}
        >
          <SkeletonBone width={80} height={14} style={{ marginBottom: 16 }} />
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <SkeletonBone width={50} height={50} borderRadius={25} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <SkeletonBone width={100} height={16} />
                <SkeletonBone width={40} height={18} />
              </View>
              <SkeletonBone width={80} height={12} style={{ marginTop: 6 }} />
            </View>
          </View>
          <View
            style={{
              height: 50,
              borderRadius: 12,
              marginTop: 16,
              backgroundColor: colors.cardBackground,
              padding: 12,
            }}
          >
            <SkeletonBone width={50} height={10} style={{ marginBottom: 6 }} />
            <SkeletonBone width={120} height={12} />
          </View>
        </View>

        {/* ETA Card Skeleton */}
        <View
          style={[
            styles.card,
            {
              flexDirection: "row",
              justifyContent: "space-between",
              backgroundColor: colors.homelightPrimaryBlue50,
              borderColor: colors.lightPrimaryBlueBorder,
            },
          ]}
        >
          <View>
            <SkeletonBone width={100} height={11} style={{ marginBottom: 8 }} />
            <SkeletonBone width={80} height={20} />
          </View>
          <SkeletonBone width={44} height={44} borderRadius={22} />
        </View>

        {/* Fare Details Skeleton */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.homelightPrimaryBlue50,
              borderColor: colors.lightPrimaryBlueBorder,
            },
          ]}
        >
          <SkeletonBone width={90} height={14} style={{ marginBottom: 16 }} />
          {[1, 2, 3].map((i) => (
            <View
              key={i}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 12,
              }}
            >
              <SkeletonBone width={80} height={12} />
              <SkeletonBone width={50} height={12} />
            </View>
          ))}
          <View
            style={{
              height: 1,
              backgroundColor: colors.lightPrimaryBlueBorder,
              marginVertical: 12,
            }}
          />
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <SkeletonBone width={60} height={16} />
            <SkeletonBone width={70} height={20} />
          </View>
        </View>

        {/* Action Buttons Skeleton */}
        <SkeletonBone
          width="100%"
          height={56}
          borderRadius={16}
          style={{ marginTop: 20 }}
        />
        <SkeletonBone
          width="100%"
          height={56}
          borderRadius={16}
          style={{ marginTop: 12 }}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    alignItems: "center",
    marginTop: 10,
  },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  card: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
});
