import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";
import {
  ChevronLeft,
  MapPin,
  Bell,
  Camera,
  Phone,
  Info,
} from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useTheme from "../../hooks/useThemes";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { commonStyles } from "../../styles/commonStyles";
import Header from "../../components/reuseables/header";
import Buttons from "../../components/buttons/buttons";

const LocationConsentScreen = () => {
  const { colors, theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
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

      <Header title="Terms of Service" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text
          style={[
            commonStyling.title,
            {
              fontSize: 20,
              fontFamily: "Bold",
            },
          ]}
        >
          Data & Location Consent
        </Text>
        <Text
          style={[
            styles.effectiveDate,
            commonStyling.subtitle,
            {
              fontSize: 13,
              fontFamily: "Bold",
            },
          ]}
        >
          Effective Date: February 26, 2026
        </Text>

        {/* Introduction */}
        <View style={styles.section}>
          <Text
            style={[
              styles.sectionHeader,
              commonStyling.title,
              {
                fontSize: 18,
                fontFamily: "Bold",
              },
            ]}
          >
            Your Consent
          </Text>
          <Text
            style={[
              styles.bodyText,
              commonStyling.subtitle,
              {
                fontSize: 15,
              },
            ]}
          >
            By accepting this consent, you authorize MediGo to collect, process,
            and use your location data and other personal information as
            described below to provide safe and reliable transportation
            services.
          </Text>
        </View>

        {/* 1. Location Data Collection */}
        <View style={styles.section}>
          <Text
            style={[
              styles.sectionHeader,
              commonStyling.title,
              {
                fontSize: 18,
                fontFamily: "Bold",
              },
            ]}
          >
            1. Location Data Collection
          </Text>
          <Text
            style={[
              styles.subHeader,
              commonStyling.title,
              {
                fontSize: 16,
                fontFamily: "SemiBold",
              },
            ]}
          >
            What We Collect:
          </Text>
          {[
            {
              t: "Precise GPS Location",
              d: "Real-time location during active rides",
            },
            {
              t: "Approximate Location",
              d: "When browsing or scheduling rides",
            },
            {
              t: "Pickup & Drop-off Addresses",
              d: "Saved locations and destinations",
            },
            {
              t: "Route Data",
              d: "Path taken during rides for safety and optimization",
            },
          ].map((item, i) => (
            <View key={i} style={styles.bulletRow}>
              <View
                style={[
                  styles.blueSquare,
                  {
                    backgroundColor: colors.primaryColor,
                  },
                ]}
              />
              <Text
                style={[
                  styles.bulletText,
                  commonStyling.subtitle,
                  {
                    fontSize: 15,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.bulletText,
                    commonStyling.subtitle,
                    {
                      fontSize: 15,
                      fontFamily: "Bold",
                    },
                  ]}
                >
                  {item.t}:
                </Text>{" "}
                {item.d}
              </Text>
            </View>
          ))}

          <Text
            style={[
              styles.subHeader,
              commonStyling.title,
              {
                fontSize: 16,
                fontFamily: "SemiBold",
                marginTop: 16,
              },
            ]}
          >
            When We Collect
          </Text>

          {/* Blue Highlighted Box */}
          <View
            style={[
              styles.blueInfoBox,
              {
                backgroundColor: colors.surfaceBrand,
                borderWidth: 1,
                borderColor: colors.lightPrimaryBlueBorder,
              },
            ]}
          >
            {[
              "While App is Open: Essential for finding and matching with drivers.",
              "During Active Rides: Continuous tracking for safety and navigation.",
              "In Background (with permission): Limited tracking for scheduled ride reminders.",
            ].map((text, i) => (
              <View key={i} style={styles.bulletRow}>
                <View
                  style={[
                    styles.whiteSquare,
                    {
                      backgroundColor: colors.primaryColor,
                    },
                  ]}
                />
                <Text
                  style={[
                    styles.blueBoxText,
                    {
                      fontSize: 15,
                      color: colors.primaryColor,
                    },
                  ]}
                >
                  {text}
                </Text>
              </View>
            ))}
          </View>

          <Text
            style={[
              styles.subHeader,
              commonStyling.title,
              {
                fontSize: 16,
                fontFamily: "SemiBold",
                marginTop: 24,
              },
            ]}
          >
            Why We Need Location Data
          </Text>
          {[
            "Match you with nearby drivers",
            "Provide accurate pickup and drop-off navigation",
            "Enable real-time ride tracking for you and trusted contacts",
            "Calculate accurate fares based on distance",
            "Improve route efficiency and service quality",
            "Respond to safety incidents and emergency situations",
            "Verify ride completion and billing accuracy",
          ].map((text, i) => (
            <View key={i} style={styles.bulletRow}>
              <View
                style={[
                  styles.blueSquare,
                  {
                    backgroundColor: colors.primaryColor,
                  },
                ]}
              />
              <Text
                style={[
                  styles.bulletText,
                  commonStyling.subtitle,
                  {
                    fontSize: 15,
                  },
                ]}
              >
                {text}
              </Text>
            </View>
          ))}
        </View>

        {/* 2. Health & Mobility Data */}
        <View style={styles.section}>
          <Text
            style={[
              styles.sectionHeader,
              commonStyling.title,
              {
                fontSize: 18,
                fontFamily: "Bold",
              },
            ]}
          >
            2. Health & Mobility Data
          </Text>
          <Text
            style={[
              styles.bodyText,
              commonStyling.subtitle,
              {
                fontSize: 15,
              },
            ]}
          >
            You consent to MediGo collecting the following health-related
            information necessary for safe transport:
          </Text>
          {[
            "Mobility assistance requirements (Wheelchair, walker, none).",
            "Specific equipment needs (Oxygen, medical monitor).",
            "Emergency contact information.",
            "Reason for transport (Non-emergency medical needs).",
          ].map((text, i) => (
            <View key={i} style={styles.bulletRow}>
              <View
                style={[
                  styles.blueSquare,
                  {
                    backgroundColor: colors.primaryColor,
                  },
                ]}
              />
              <Text
                style={[
                  styles.bulletText,
                  commonStyling.subtitle,
                  {
                    fontSize: 15,
                  },
                ]}
              >
                {text}
              </Text>
            </View>
          ))}

          {/* Green Privacy Box */}
          <View style={styles.greenInfoBox}>
            <Text style={styles.greenBoxText}>
              <Text style={{ fontWeight: "800" }}>✓ Privacy Protection:</Text>{" "}
              We collect only the minimum necessary information. We do NOT
              request detailed diagnoses, treatment plans, or sensitive medical
              records.
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text
            style={[
              styles.sectionHeader,
              commonStyling.title,
              {
                fontSize: 18,
                fontFamily: "Bold",
              },
            ]}
          >
            3. Data Sharing
          </Text>
          <Text
            style={[
              styles.bodyText,
              commonStyling.subtitle,
              {
                fontSize: 15,
              },
            ]}
          >
            You consent to MediGo sharing relevant information with:
          </Text>
          {[
            {
              t: "Your Assigned Driver",
              d: " Name, photo, pickup/drop-off locations, contact info, special assistance needs",
            },
            {
              t: "Emergency Contacts",
              d: "Real-time ride tracking and location during active rides (if you enable this feature)",
            },
            {
              t: "Customer Support",
              d: "Information necessary to resolve issues or provide assistance",
            },
            {
              t: "Safety & Compliance",
              d: "Law enforcement, medical personnel, or regulatory authorities when legally required or for safety purposes",
            },
          ].map((item, i) => (
            <View key={i} style={styles.bulletRow}>
              <View
                style={[
                  styles.blueSquare,
                  {
                    backgroundColor: colors.primaryColor,
                  },
                ]}
              />
              <Text
                style={[
                  styles.bulletText,
                  commonStyling.subtitle,
                  {
                    fontSize: 15,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.bulletText,
                    commonStyling.subtitle,
                    {
                      fontSize: 15,
                      fontFamily: "Bold",
                    },
                  ]}
                >
                  {item.t}:
                </Text>{" "}
                {item.d}
              </Text>
            </View>
          ))}
        </View>

        {/* 4. Device Permissions */}
        <View style={styles.section}>
          <Text
            style={[
              styles.sectionHeader,
              commonStyling.title,
              {
                fontSize: 18,
                fontFamily: "Bold",
              },
            ]}
          >
            4. Device Permissions
          </Text>
          <Text
            style={[
              styles.bodyText,
              commonStyling.subtitle,
              {
                fontSize: 15,
              },
            ]}
          >
            To use MediGo services, you grant permission for the app to access:
          </Text>
          {[
            {
              icon: <MapPin size={18} color="#EF4444" />,
              title: "Location Services",
              desc: "Required for ride matching and navigation.",
            },
            {
              icon: <Bell size={18} color="#F59E0B" />,
              title: "Notifications",
              desc: "Alerts for driver arrivals, safety, and receipts.",
            },
            {
              icon: <Camera size={18} color="#64748B" />,
              title: "Camera (Optional)",
              desc: "For profile photo upload.",
            },
            {
              icon: <Phone size={18} color="#10B981" />,
              title: "Phone Calls",
              desc: "One-tap calling to contact driver or support",
            },
          ].map((item, i) => (
            <View
              key={i}
              style={[
                styles.permCard,
                {
                  borderColor: colors.lightPrimaryBlueBorder,
                },
              ]}
            >
              <View style={styles.permIconContainer}>{item.icon}</View>
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    commonStyling.title,
                    {
                      fontSize: 16,
                      fontFamily: "SemiBold",
                    },
                  ]}
                >
                  {item.title}
                </Text>
                <Text
                  style={[
                    styles.permDesc,
                    commonStyling.subtitle,
                    {
                      fontSize: 14,
                    },
                  ]}
                >
                  {item.desc}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text
            style={[
              styles.sectionHeader,
              commonStyling.title,
              {
                fontSize: 18,
                fontFamily: "Bold",
              },
            ]}
          >
            5. Your Control & Rights
          </Text>
          <Text
            style={[
              styles.subHeader,
              commonStyling.title,
              {
                fontSize: 16,
                fontFamily: "SemiBold",
              },
            ]}
          >
            Managing Location Permissions
          </Text>
          <Text
            style={[
              styles.bodyText,
              commonStyling.subtitle,
              {
                fontSize: 15,
              },
            ]}
          >
            You can control location sharing through your device settings:
          </Text>
          {[
            {
              t: "Always Allow",
              d: " Best experience with background ride notifications",
            },
            {
              t: "While Using App:",
              d: " Standard functionality, no background location",
            },
            {
              t: "Ask Every Time:",
              d: "Manual permission for each ride",
            },
            {
              t: "Never",
              d: "App functionality will be limited",
            },
          ].map((item, i) => (
            <View key={i} style={styles.bulletRow}>
              <View
                style={[
                  styles.blueSquare,
                  {
                    backgroundColor: colors.primaryColor,
                  },
                ]}
              />
              <Text
                style={[
                  styles.bulletText,
                  commonStyling.subtitle,
                  {
                    fontSize: 15,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.bulletText,
                    commonStyling.subtitle,
                    {
                      fontSize: 15,
                      fontFamily: "Bold",
                    },
                  ]}
                >
                  {item.t}:
                </Text>{" "}
                {item.d}
              </Text>
            </View>
          ))}

          <Text
            style={[
              styles.subHeader,
              commonStyling.title,
              {
                fontSize: 16,
                fontFamily: "SemiBold",
                marginTop: 24,
              },
            ]}
          >
            Data Access & Deletion
          </Text>
          <Text
            style={[
              styles.bodyText,
              commonStyling.subtitle,
              {
                fontSize: 15,
              },
            ]}
          >
            You have the right to:
          </Text>
          {[
            "Request a copy of your personal data",
            "Correct inaccurate information",
            "Request deletion of your account and data",
            "Withdraw consent (may limit service availability)",
          ].map((text, i) => (
            <View key={i} style={styles.bulletRow}>
              <View
                style={[
                  styles.blueSquare,
                  {
                    backgroundColor: colors.primaryColor,
                  },
                ]}
              />
              <Text
                style={[
                  styles.bulletText,
                  commonStyling.subtitle,
                  {
                    fontSize: 15,
                  },
                ]}
              >
                {text}
              </Text>
            </View>
          ))}

          <Text
            style={[
              styles.bodyText,
              commonStyling.subtitle,
              {
                fontSize: 14,
                marginTop: 24,
                fontStyle: "italic",
              },
            ]}
          >
            Contact privacy@medigo.com to exercise these rights.
          </Text>
        </View>

        <View style={styles.section}>
          <Text
            style={[
              styles.sectionHeader,
              commonStyling.title,
              {
                fontSize: 18,
                fontFamily: "Bold",
              },
            ]}
          >
            6. Data Security
          </Text>
          <Text
            style={[
              styles.subHeader,
              commonStyling.title,
              {
                fontSize: 16,
                fontFamily: "SemiBold",
              },
            ]}
          >
            We protect your data using:
          </Text>
          <Text
            style={[
              styles.bodyText,
              commonStyling.subtitle,
              {
                fontSize: 15,
              },
            ]}
          >
            You can control location sharing through your device settings:
          </Text>

          {[
            "Encryption in transit (TLS/SSL)",
            "Encryption at rest for sensitive data",
            "Access controls and authentication",
            "Regular security audits and monitoring",
            "Employee confidentiality agreements",
          ].map((text, i) => (
            <View key={i} style={styles.bulletRow}>
              <View
                style={[
                  styles.blueSquare,
                  {
                    backgroundColor: colors.primaryColor,
                  },
                ]}
              />
              <Text
                style={[
                  styles.bulletText,
                  commonStyling.subtitle,
                  {
                    fontSize: 15,
                  },
                ]}
              >
                {text}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text
            style={[
              styles.sectionHeader,
              commonStyling.title,
              {
                fontSize: 18,
                fontFamily: "Bold",
              },
            ]}
          >
            7. Consent Duration & Withdrawal
          </Text>

          <Text
            style={[
              styles.bodyText,
              commonStyling.subtitle,
              {
                fontSize: 15,
              },
            ]}
          >
            This consent remains valid while your account is active. You may
            withdraw consent at any time by:
          </Text>

          {[
            "Adjusting app permissions in device settings",
            "Contacting customer support",
            "Deleting your account",
          ].map((text, i) => (
            <View key={i} style={styles.bulletRow}>
              <View
                style={[
                  styles.blueSquare,
                  {
                    backgroundColor: colors.primaryColor,
                  },
                ]}
              />
              <Text
                style={[
                  styles.bulletText,
                  commonStyling.subtitle,
                  {
                    fontSize: 15,
                  },
                ]}
              >
                {text}
              </Text>
            </View>
          ))}
        </View>

        {/* Important Warning Box */}
        <View
          style={[
            styles.yellowInfoBox,
            {
              backgroundColor: colors.lightYellow,
            },
          ]}
        >
          <Info size={18} color="#92400E" />
          <Text
            style={[
              styles.yellowBoxText,
              commonStyling.subtitle,
              {
                fontSize: 14,
                color: colors.darkYellow,
              },
            ]}
          >
            <Text style={{ fontFamily: "Bold" }}>Important:</Text> Withdrawing
            location consent will prevent you from booking or tracking rides, as
            location services are essential for MediGo functionality.
          </Text>
        </View>

        <View style={styles.section}>
          <Text
            style={[
              styles.sectionHeader,
              commonStyling.title,
              {
                fontSize: 18,
                fontFamily: "Bold",
              },
            ]}
          >
            8. Contact Us
          </Text>
          <View
            style={[
              styles.supportCard,
              {
                backgroundColor: colors.cardBackground,
                borderWidth: 1,
                borderColor: colors.lightPrimaryBlueBorder,
              },
            ]}
          >
            <Text
              style={[
                commonStyling.title,
                styles.supportText,
                {
                  fontSize: 15,
                  fontFamily: "Bold",
                },
              ]}
            >
              Questions about data usage?
            </Text>
            <Text
              style={[
                commonStyling.subtitle,
                styles.supportText,
                {
                  fontSize: 14,
                },
              ]}
            >
              Email: privacy@medigo.com
            </Text>
            <Text
              style={[
                commonStyling.subtitle,
                styles.supportText,
                {
                  fontSize: 14,
                },
              ]}
            >
              Phone: 1-855-MEDIGO (1-855-633-4461)
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Footer Close Button */}
      <View
        style={[
          styles.footer,
          {
            backgroundColor: colors.surfacePrimary,
          },
        ]}
      >
        <Buttons
          title="Close"
          onPress={() => {
            navigation.goBack();
          }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  navHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F8FAFC",
  },
  backButton: { width: 40, height: 40, justifyContent: "center" },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
    textAlign: "center",
    flex: 0.8,
  },
  scrollContent: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 120 },
  mainTitle: { fontSize: 22, fontWeight: "800", color: "#0F172A" },
  effectiveDate: { fontSize: 12, color: "#94A3B8", marginTop: 8 },

  // Section Layout
  section: { marginTop: 32 },
  sectionHeader: {
    marginBottom: 12,
  },
  subHeader: {
    marginBottom: 12,
  },
  bodyText: { lineHeight: 22, marginBottom: 8 },
  boldText: { fontWeight: "700", color: "#334155" },

  // Bullets
  bulletRow: { flexDirection: "row", marginTop: 10, paddingRight: 16 },
  blueSquare: {
    width: 6,
    height: 6,
    marginTop: 7,
    marginRight: 12,
    borderRadius: 1,
  },
  whiteSquare: {
    width: 6,
    height: 6,
    marginTop: 7,
    marginRight: 12,
    borderRadius: 1,
  },
  bulletText: { lineHeight: 20, flex: 1 },

  // Colored Boxes
  blueInfoBox: {
    borderRadius: 12,
    padding: 16,
    marginTop: 4,
  },
  blueBoxText: { lineHeight: 20, flex: 1 },
  greenInfoBox: {
    backgroundColor: "#F0FDF4",
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#22C55E",
  },
  greenBoxText: { fontSize: 13, color: "#166534", lineHeight: 20 },
  yellowInfoBox: {
    borderRadius: 12,
    padding: 16,
    marginTop: 32,
    flexDirection: "row",
    gap: 12,
  },
  yellowBoxText: { lineHeight: 20, flex: 1 },

  // Permission Cards
  permCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  permIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  permDesc: { marginTop: 2 },

  // Footer & Contact
  contactSection: {
    marginTop: 40,
    padding: 20,
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
  },
  contactTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 8,
  },
  contactDetail: { fontSize: 13, color: "#64748B", marginTop: 4 },
  footer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    padding: 24,
    backgroundColor: "#FFF",
  },
  closeBtn: {
    height: 56,
    borderRadius: 28,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
  },
  supportText: {
    marginTop: 4,
  },
  supportCard: {
    padding: 20,
    borderRadius: 16,
    marginTop: 8,
  },
  closeBtnText: { color: "#FFF", fontSize: 16, fontWeight: "700" },
});

export default LocationConsentScreen;
