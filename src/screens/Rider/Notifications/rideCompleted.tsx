import React from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { ChevronLeft, Calendar, User, Star } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import useTheme from "../../../hooks/useThemes";
import { commonStyles } from "../../../styles/commonStyles";
import Header from "../../../components/reuseables/header";
import { FONT_SIZES } from "../../../constants/sizes";
import Buttons from "../../../components/buttons/buttons";

const RideCompletedDetails = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { colors, theme } = useTheme();
  const commonStyling = commonStyles(colors);

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: colors.surfacePrimary,
        },
      ]}
    >
      <StatusBar
        barStyle={theme === "light" ? "dark-content" : "light-content"}
      />

      <Header title="Ride completed" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Top Status Card */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.homelightPrimaryBlue50,
              borderColor: colors.lightPrimaryBlueBorder,
            },
          ]}
        >
          <View style={styles.iconCircleBlue}>
            <Calendar color="#3B82F6" size={28} />
          </View>
          <Text
            style={[
              commonStyling.title,
              {
                fontSize: 24,
                fontFamily: "Bold",
              },
            ]}
          >
            Ride Completed
          </Text>
          <Text
            style={[
              styles.statusDate,
              commonStyling.subtitle,
              {
                fontSize: 14,
              },
            ]}
          >
            March 4, 2026, 10:45 AM
          </Text>
        </View>

        {/* Message Card */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.homelightPrimaryBlue50,
              borderColor: colors.lightPrimaryBlueBorder,
            },
          ]}
        >
          <Text
            style={[
              styles.sectionLabel,
              commonStyling.subtitle,
              {
                fontFamily: "Bold",
                fontSize: 14,
              },
            ]}
          >
            MESSAGE
          </Text>
          <Text
            style={[
              styles.messageText,
              commonStyling.title,
              {
                fontFamily: "Regular",
                fontSize: 16,
              },
            ]}
          >
            Your ride to Springfield General Hospital has been completed
            successfully.
          </Text>
        </View>

        {/* Details Card */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.homelightPrimaryBlue50,
              borderColor: colors.lightPrimaryBlueBorder,
            },
          ]}
        >
          <Text
            style={[
              styles.sectionLabel,
              commonStyling.subtitle,
              {
                fontFamily: "Bold",
                fontSize: 14,
              },
            ]}
          >
            DETAILS
          </Text>

          {/* Driver Info */}
          <View style={styles.driverRow}>
            <View style={styles.driverAvatar}>
              <User color="#3B82F6" size={24} />
            </View>
            <View style={styles.driverInfo}>
              <Text
                style={[
                  commonStyling.title,
                  {
                    fontSize: 16,
                    fontFamily: "Bold",
                  },
                ]}
              >
                John Driver
              </Text>
              <View style={styles.ratingRow}>
                <Star color="#F59E0B" fill="#F59E0B" size={14} />
                <Text
                  style={[
                    styles.ratingText,
                    commonStyling.subtitle,
                    {
                      fontSize: FONT_SIZES.BODY,
                    },
                  ]}
                >
                  4.8
                </Text>
              </View>
            </View>
          </View>

          <View
            style={[
              styles.divider,
              {
                backgroundColor: colors.lightPrimaryBlueBorder,
              },
            ]}
          />

          {/* Route Timeline */}
          <View style={styles.routeContainer}>
            <View style={styles.timeline}>
              <View style={styles.dotBlue} />
              <View style={styles.line} />
              <View style={styles.dotRed} />
            </View>
            <View style={styles.addressContainer}>
              <View>
                <Text
                  style={[
                    commonStyling.subtitle,
                    {
                      fontSize: FONT_SIZES.SMALL,
                    },
                  ]}
                >
                  Pickup
                </Text>
                <Text
                  style={[
                    styles.addressText,
                    commonStyling.title,
                    {
                      fontSize: 14,
                    },
                  ]}
                >
                  2847 Maple Avenue
                </Text>
              </View>
              <View style={[{ marginTop: 20 }]}>
                <Text
                  style={[
                    commonStyling.subtitle,
                    {
                      fontSize: FONT_SIZES.SMALL,
                    },
                  ]}
                >
                  Destination
                </Text>
                <Text
                  style={[
                    styles.addressText,
                    commonStyling.title,
                    {
                      fontSize: 14,
                    },
                  ]}
                >
                  Springfield General Hospital
                </Text>
              </View>
            </View>
          </View>

          <View
            style={[
              styles.divider,
              {
                backgroundColor: colors.lightPrimaryBlueBorder,
              },
            ]}
          />

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text
                style={[
                  commonStyling.subtitle,
                  {
                    fontSize: FONT_SIZES.SMALL,
                  },
                ]}
              >
                Distance
              </Text>
              <Text
                style={[
                  styles.addressText,
                  commonStyling.title,
                  {
                    fontSize: 14,
                    fontFamily: "Bold",
                  },
                ]}
              >
                5.2 mi
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text
                style={[
                  commonStyling.subtitle,
                  {
                    fontSize: FONT_SIZES.SMALL,
                  },
                ]}
              >
                Duration
              </Text>
              <Text
                style={[
                  styles.addressText,
                  commonStyling.title,
                  {
                    fontSize: 14,
                    fontFamily: "Bold",
                  },
                ]}
              >
                25 min
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text
                style={[
                  commonStyling.subtitle,
                  {
                    fontSize: FONT_SIZES.SMALL,
                  },
                ]}
              >
                Fare
              </Text>
              <Text
                style={[
                  styles.statValue,
                  { color: "#16A34A", fontSize: 14, fontFamily: "Bold" },
                ]}
              >
                $28.50
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Footer Action */}
      <View
        style={[
          styles.footer,
          {
            backgroundColor: colors.surfacePrimary,
          },
        ]}
      >
        <Buttons
          title="View Receipt"
          onPress={() => {
            navigation.navigate("ReceiptScreen");
          }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  headerTitle: { fontSize: 18, fontWeight: "800", color: "#1E293B" },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 100 },

  card: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },

  iconCircleBlue: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  statusDate: { marginTop: 8 },

  sectionLabel: {
    marginBottom: 12,
  },
  messageText: { lineHeight: 22 },

  driverRow: { flexDirection: "row", alignItems: "center" },
  driverAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
  },
  driverInfo: { marginLeft: 12 },
  ratingRow: { flexDirection: "row", alignItems: "center", marginTop: 2 },
  ratingText: { marginLeft: 4 },

  divider: { height: 1, marginVertical: 20 },

  routeContainer: { flexDirection: "row" },
  timeline: { alignItems: "center", width: 20, marginTop: 5 },
  dotBlue: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#3B82F6" },
  dotRed: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#EF4444" },
  line: { width: 1, flex: 1, backgroundColor: "#E2E8F0", marginVertical: 4 },
  addressContainer: { flex: 1, marginLeft: 12 },
  addressText: {
    marginTop: 2,
  },

  statsRow: { flexDirection: "row", justifyContent: "space-between" },
  statItem: { alignItems: "flex-start" },
  statValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E293B",
    marginTop: 4,
  },

  footer: {
    padding: 20,
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  primaryButton: {
    backgroundColor: "#3B82F6",
    paddingVertical: 18,
    borderRadius: 25,
    alignItems: "center",
  },
  buttonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
});

export default RideCompletedDetails;
