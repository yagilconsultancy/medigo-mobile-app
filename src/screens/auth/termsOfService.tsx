import React from "react";
import { StyleSheet, View, Text, ScrollView, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useTheme from "../../hooks/useThemes";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { commonStyles } from "../../styles/commonStyles";
import Header from "../../components/reuseables/header";
import Buttons from "../../components/buttons/buttons";

const TermsOfServiceScreen = () => {
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
          Terms of Service
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
        <Text
          style={[
            styles.lastUpdated,
            commonStyling.subtitle,
            {
              fontSize: 13,
              fontFamily: "Bold",
            },
          ]}
        >
          Last Updated: February 26, 2026
        </Text>

        {/* 1. Acceptance */}
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
            1. Acceptance of Terms
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
            By creating an account and using MediGo services, you ("User",
            "Rider", "you") agree to be bound by these Terms of Service and our
            Privacy Policy. If you do not agree, please do not use our services.
          </Text>
        </View>

        {/* 2. Service Description */}
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
            2. Service Description
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
            MediGo is a technology platform that connects riders with
            independent transportation providers for non-emergency medical
            transportation. MediGo does not provide transportation services
            directly; we facilitate connections between riders and drivers.
          </Text>

          {/* Specific Warning Box from Design */}
          <View style={styles.warningBox}>
            <Text style={styles.warningText}>
              <Text style={{ fontWeight: "800" }}>Non-Emergency Only:</Text>{" "}
              MediGo is not an ambulance service and should never be used for
              medical emergencies. Call 911 immediately in emergency situations.
            </Text>
          </View>
        </View>

        {/* 3. Eligibility */}
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
            3. Eligibility
          </Text>
          {[
            "You must be at least 18 years old to create an account.",
            "You must provide accurate and complete information.",
            "You are responsible for maintaining account confidentiality.",
            "One person may not create multiple accounts.",
          ].map((item, index) => (
            <View key={index} style={styles.bulletRow}>
              <Text style={styles.bullet}>◆</Text>
              <Text
                style={[
                  styles.bulletText,
                  commonStyling.subtitle,
                  {
                    fontSize: 15,
                  },
                ]}
              >
                {item}
              </Text>
            </View>
          ))}
        </View>

        {/* 4. Booking and Cancellation */}
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
            4. Booking and Cancellation
          </Text>
          <Text
            style={[
              styles.subSectionHeader,
              commonStyling.title,
              {
                fontSize: 16,
                fontFamily: "SemiBold",
              },
            ]}
          >
            4.1 Ride Requests
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
            You may request immediate or scheduled rides through the app. Ride
            acceptance is subject to driver availability.
          </Text>

          <Text
            style={[
              styles.subSectionHeader,
              commonStyling.title,
              {
                fontSize: 16,
                fontFamily: "SemiBold",
              },
            ]}
          >
            4.2 Cancellation Policy
          </Text>
          {[
            "Free cancellation up to 2 hours before scheduled pickup.",
            "Cancellations within 2 hours may incur a $15 cancellation fee.",
            "No-shows will be charged the full estimated fare.",
            "Medical emergencies are exempt from cancellation fees (verification may be required)",
          ].map((item, index) => (
            <View key={index} style={styles.bulletRow}>
              <Text style={styles.bullet}>◆</Text>
              <Text
                style={[
                  styles.bulletText,
                  commonStyling.subtitle,
                  {
                    fontSize: 15,
                  },
                ]}
              >
                {item}
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
            5. Payment
          </Text>

          {[
            "You authorize MediGo to charge your payment method for all rides",
            "Pricing is calculated based on distance, time, and service type",
            "Final fares may vary from estimates due to route changes or wait time",
            "All payments are processed securely through third-party processors",
            "You are responsible for all charges incurred under your account",
          ].map((item, index) => (
            <View key={index} style={styles.bulletRow}>
              <Text style={styles.bullet}>◆</Text>
              <Text
                style={[
                  styles.bulletText,
                  commonStyling.subtitle,
                  {
                    fontSize: 15,
                  },
                ]}
              >
                {item}
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
            6. User Conduct
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
            You agree to:
          </Text>

          {[
            "Treat drivers with respect and courtesy",
            "Be ready at the pickup location at the scheduled time",
            "Not engage in harassment, discrimination, or illegal activity",
            "Not damage or soil the vehicle",
            "Follow driver instructions regarding safety and vehicle rules",
            "Not request drivers to exceed speed limits or violate traffic laws",
          ].map((item, index) => (
            <View key={index} style={styles.bulletRow}>
              <Text style={styles.bullet}>◆</Text>
              <Text
                style={[
                  styles.bulletText,
                  commonStyling.subtitle,
                  {
                    fontSize: 15,
                  },
                ]}
              >
                {item}
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
            7. Limitation of Liability
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
            MediGo acts solely as a technology platform. We are not responsible
            for:
          </Text>

          {[
            "Actions or omissions of independent drivers",
            "Vehicle accidents or incidents during transport",
            "Delays caused by traffic, weather, or unforeseen circumstances",
            "Lost or damaged personal belongings",
            "Medical outcomes or consequences related to your trip",
          ].map((item, index) => (
            <View key={index} style={styles.bulletRow}>
              <Text style={styles.bullet}>◆</Text>
              <Text
                style={[
                  styles.bulletText,
                  commonStyling.subtitle,
                  {
                    fontSize: 15,
                  },
                ]}
              >
                {item}
              </Text>
            </View>
          ))}

          <Text
            style={[
              styles.bodyText,
              commonStyling.subtitle,
              {
                fontSize: 14,
                marginTop: 16,
                fontStyle: "italic",
              },
            ]}
          >
            To the maximum extent permitted by law, MediGo's total liability
            shall not exceed the amount paid for the ride in question.
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
            8. Account Suspension & Termination
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
            We reserve the right to suspend or terminate your account for:
          </Text>

          {[
            "Violation of these Terms",
            "Fraudulent activity or payment disputes",
            "Abusive behavior toward drivers or staff",
            "Excessive cancellations or no-shows",
            "Any conduct that threatens safety or service integrity",
          ].map((item, index) => (
            <View key={index} style={styles.bulletRow}>
              <Text style={styles.bullet}>◆</Text>
              <Text
                style={[
                  styles.bulletText,
                  commonStyling.subtitle,
                  {
                    fontSize: 15,
                  },
                ]}
              >
                {item}
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
            9. Indemnification
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
            You agree to indemnify and hold harmless MediGo, its officers,
            employees, and affiliates from any claims, damages, or expenses
            arising from your use of the service or violation of these Terms.
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
            10. Governing Law
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
            These Terms shall be governed by and construed in accordance with
            the laws of the Province of Ontario, Canada, without regard to
            conflict of law principles.
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
            11. Changes to Terms
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
            We may modify these Terms at any time. Material changes will be
            communicated via email or in-app notification. Continued use after
            changes constitutes acceptance.
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
            11. Contact Us
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
                  fontSize: 16,
                  fontFamily: "Bold",
                },
              ]}
            >
              MediGo Inc. – Privacy Officer
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
            <Text
              style={[
                commonStyling.subtitle,
                styles.supportText,
                {
                  fontSize: 14,
                },
              ]}
            >
              Hours: 24/7 Support Available
            </Text>
          </View>
        </View>

        <Text style={styles.footerNote}>
          By clicking "Close", you acknowledge that you have read, understood
          and agree to the Terms of Service.
        </Text>
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
  scrollContent: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 140 },

  effectiveDate: { fontSize: 12, color: "#94A3B8", marginTop: 8 },
  lastUpdated: { fontSize: 12, color: "#94A3B8", marginTop: 2 },

  // Section Typography
  section: { marginTop: 28 },
  sectionHeader: {
    marginBottom: 12,
  },
  subSectionHeader: {
    marginTop: 14,
    marginBottom: 6,
  },
  bodyText: { lineHeight: 22 },

  // Red Warning Box
  warningBox: {
    backgroundColor: "#FFF1F2",
    borderLeftWidth: 4,
    borderLeftColor: "#F43F5E",
    padding: 16,
    marginTop: 16,
    borderRadius: 4,
  },
  warningText: { fontSize: 13, color: "#9F1239", lineHeight: 20 },

  // Bullets (matches design diamonds)
  bulletRow: { flexDirection: "row", marginTop: 10, paddingRight: 12 },
  bullet: { color: "#3B82F6", marginRight: 10, fontSize: 10, marginTop: 4 },
  bulletText: { lineHeight: 20, flex: 1 },

  supportCard: {
    padding: 20,
    borderRadius: 16,
    marginTop: 8,
  },
  supportText: {
    marginTop: 4,
  },
  contactHeader: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 8,
  },
  contactDetail: { fontSize: 13, color: "#64748B", marginBottom: 4 },
  linkText: { color: "#2563EB", fontWeight: "600" },
  footerNote: {
    fontSize: 11,
    color: "#94A3B8",
    textAlign: "center",
    marginTop: 24,
    lineHeight: 16,
  },

  // Footer Button
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
  closeBtnText: { color: "#FFF", fontSize: 16, fontWeight: "700" },
});

export default TermsOfServiceScreen;
