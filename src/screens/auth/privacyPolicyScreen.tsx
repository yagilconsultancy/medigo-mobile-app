import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";
import { ChevronLeft, Info } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useTheme from "../../hooks/useThemes";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { commonStyles } from "../../styles/commonStyles";
import Header from "../../components/reuseables/header";
import Buttons from "../../components/buttons/buttons";

const PrivacyPolicyScreen = () => {
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

      <Header title="Privacy Policy" />

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
          Privacy Policy
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
          Last Updated: February 21, 2026
        </Text>

        {/* Highlighted Alert Box */}
        <View style={styles.alertBox}>
          <View style={styles.alertHeader}>
            <Info size={18} color="#EF4444" />
            <Text
              style={[
                styles.alertTitle,
                {
                  fontSize: 15,
                  fontFamily: "Bold",
                },
              ]}
            >
              Non-Emergency Service Notice
            </Text>
          </View>
          <Text
            style={[
              styles.alertText,
              {
                fontSize: 14,
                fontFamily: "Bold",
              },
            ]}
          >
            MediGo is NOT an emergency service. In case of a medical emergency,
            please call 911 or your local emergency number immediately. MediGo
            is designed for non-emergency medical transportation only.
          </Text>
        </View>

        {/* 1. Introduction */}
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
            1. Introduction
          </Text>
          <Text
            style={[styles.bodyText, commonStyling.subtitle, { fontSize: 16 }]}
          >
            MediGo Inc. ("MediGo", "we", "us", or "our") is committed to
            protecting your privacy. This Privacy Policy explains how we
            collect, use, disclose, and safeguard your information when you use
            our healthcare transportation platform.
          </Text>
          <Text
            style={[styles.bodyText, commonStyling.subtitle, { fontSize: 16 }]}
          >
            By using MediGo services, you agree to the collection and use of
            information in accordance with this policy.
          </Text>
        </View>

        {/* 2. Information We Collect */}
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
            2. Information We Collect
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
            2.1 Account & Identity Information
          </Text>
          <View style={styles.bulletRow}>
            <Text
              style={[
                styles.bullet,
                {
                  color: colors.primaryColor,
                },
              ]}
            >
              •
            </Text>
            <Text
              style={[
                styles.bulletText,
                commonStyling.subtitle,
                {
                  fontSize: 16,
                },
              ]}
            >
              Full name, date of birth, gender
            </Text>
          </View>
          <View style={styles.bulletRow}>
            <Text
              style={[
                styles.bullet,
                {
                  color: colors.primaryColor,
                },
              ]}
            >
              •
            </Text>
            <Text
              style={[
                styles.bulletText,
                commonStyling.subtitle,
                {
                  fontSize: 16,
                },
              ]}
            >
              Email address and phone number.
            </Text>
          </View>
          <View style={styles.bulletRow}>
            <Text
              style={[
                styles.bullet,
                {
                  color: colors.primaryColor,
                },
              ]}
            >
              •
            </Text>
            <Text
              style={[
                styles.bulletText,
                commonStyling.subtitle,
                {
                  fontSize: 16,
                },
              ]}
            >
              Profile picture (optional).
            </Text>
          </View>
          <View style={styles.bulletRow}>
            <Text
              style={[
                styles.bullet,
                {
                  color: colors.primaryColor,
                },
              ]}
            >
              •
            </Text>
            <Text
              style={[
                styles.bulletText,
                commonStyling.subtitle,
                {
                  fontSize: 16,
                },
              ]}
            >
              Government-issued ID verification (for safety)
            </Text>
          </View>

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
            2.2 Booking & Trip Information
          </Text>
          <View style={styles.bulletRow}>
            <Text
              style={[
                styles.bullet,
                {
                  color: colors.primaryColor,
                },
              ]}
            >
              •
            </Text>
            <Text
              style={[
                styles.bulletText,
                commonStyling.subtitle,
                {
                  fontSize: 16,
                },
              ]}
            >
              Pickup and drop-off locations
            </Text>
          </View>
          <View style={styles.bulletRow}>
            <Text
              style={[
                styles.bullet,
                {
                  color: colors.primaryColor,
                },
              ]}
            >
              •
            </Text>
            <Text
              style={[
                styles.bulletText,
                commonStyling.subtitle,
                {
                  fontSize: 16,
                },
              ]}
            >
              Date and time of scheduled rides
            </Text>
          </View>
          <View style={styles.bulletRow}>
            <Text
              style={[
                styles.bullet,
                {
                  color: colors.primaryColor,
                },
              ]}
            >
              •
            </Text>
            <Text
              style={[
                styles.bulletText,
                commonStyling.subtitle,
                {
                  fontSize: 16,
                },
              ]}
            >
              Trip purpose (medical appointment category)
            </Text>
          </View>

          <View style={styles.bulletRow}>
            <Text
              style={[
                styles.bullet,
                {
                  color: colors.primaryColor,
                },
              ]}
            >
              •
            </Text>
            <Text
              style={[
                styles.bulletText,
                commonStyling.subtitle,
                {
                  fontSize: 16,
                },
              ]}
            >
              Special assistance requirements (wheelchair, oxygen, escort)
            </Text>
          </View>

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
            2.3 Health-Related Information (Minimum Necessary)
          </Text>
          <View style={styles.bulletRow}>
            <Text
              style={[
                styles.bullet,
                {
                  color: colors.primaryColor,
                },
              ]}
            >
              •
            </Text>
            <Text
              style={[
                styles.bulletText,
                commonStyling.subtitle,
                {
                  fontSize: 16,
                },
              ]}
            >
              Mobility assistance needs
            </Text>
          </View>
          <View style={styles.bulletRow}>
            <Text
              style={[
                styles.bullet,
                {
                  color: colors.primaryColor,
                },
              ]}
            >
              •
            </Text>
            <Text
              style={[
                styles.bulletText,
                commonStyling.subtitle,
                {
                  fontSize: 16,
                },
              ]}
            >
              Allergies (if relevant to safe transport)
            </Text>
          </View>
          <View style={styles.bulletRow}>
            <Text
              style={[
                styles.bullet,
                {
                  color: colors.primaryColor,
                },
              ]}
            >
              •
            </Text>
            <Text
              style={[
                styles.bulletText,
                commonStyling.subtitle,
                {
                  fontSize: 16,
                },
              ]}
            >
              Emergency contact information
            </Text>
          </View>

          <View style={styles.bulletRow}>
            <Text
              style={[
                styles.bullet,
                {
                  color: colors.primaryColor,
                },
              ]}
            >
              •
            </Text>
            <Text
              style={[
                styles.bulletText,
                commonStyling.subtitle,
                {
                  fontSize: 16,
                },
              ]}
            >
              Medical facility destinations
            </Text>
          </View>

          <Text
            style={[
              styles.bulletText,
              commonStyling.subtitle,
              {
                fontSize: 16,
                marginTop: 14,
                fontStyle: "italic",
              },
            ]}
          >
            We collect only the minimum health information necessary to provide
            safe transportation. We do NOT collect detailed medical diagnoses or
            treatment information.
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
            2.4 Location Data
          </Text>
          <View style={styles.bulletRow}>
            <Text
              style={[
                styles.bullet,
                {
                  color: colors.primaryColor,
                },
              ]}
            >
              •
            </Text>
            <Text
              style={[
                styles.bulletText,
                commonStyling.subtitle,
                {
                  fontSize: 16,
                },
              ]}
            >
              Real-time GPS location (during active rides)
            </Text>
          </View>
          <View style={styles.bulletRow}>
            <Text
              style={[
                styles.bullet,
                {
                  color: colors.primaryColor,
                },
              ]}
            >
              •
            </Text>
            <Text
              style={[
                styles.bulletText,
                commonStyling.subtitle,
                {
                  fontSize: 16,
                },
              ]}
            >
              IP address and device location
            </Text>
          </View>
          <View style={styles.bulletRow}>
            <Text
              style={[
                styles.bullet,
                {
                  color: colors.primaryColor,
                },
              ]}
            >
              •
            </Text>
            <Text
              style={[
                styles.bulletText,
                commonStyling.subtitle,
                {
                  fontSize: 16,
                },
              ]}
            >
              Route and distance traveled
            </Text>
          </View>

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
            2.5 Communications
          </Text>
          <View style={styles.bulletRow}>
            <Text
              style={[
                styles.bullet,
                {
                  color: colors.primaryColor,
                },
              ]}
            >
              •
            </Text>
            <Text
              style={[
                styles.bulletText,
                commonStyling.subtitle,
                {
                  fontSize: 16,
                },
              ]}
            >
              In-app messages with drivers
            </Text>
          </View>
          <View style={styles.bulletRow}>
            <Text
              style={[
                styles.bullet,
                {
                  color: colors.primaryColor,
                },
              ]}
            >
              •
            </Text>
            <Text
              style={[
                styles.bulletText,
                commonStyling.subtitle,
                {
                  fontSize: 16,
                },
              ]}
            >
              Customer support interactions
            </Text>
          </View>
          <View style={styles.bulletRow}>
            <Text
              style={[
                styles.bullet,
                {
                  color: colors.primaryColor,
                },
              ]}
            >
              •
            </Text>
            <Text
              style={[
                styles.bulletText,
                commonStyling.subtitle,
                {
                  fontSize: 16,
                },
              ]}
            >
              Feedback and ratings
            </Text>
          </View>

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
            2.6 Device & Usage Data
          </Text>
          <View style={styles.bulletRow}>
            <Text
              style={[
                styles.bullet,
                {
                  color: colors.primaryColor,
                },
              ]}
            >
              •
            </Text>
            <Text
              style={[
                styles.bulletText,
                commonStyling.subtitle,
                {
                  fontSize: 16,
                },
              ]}
            >
              Device type, operating system, app version
            </Text>
          </View>
          <View style={styles.bulletRow}>
            <Text
              style={[
                styles.bullet,
                {
                  color: colors.primaryColor,
                },
              ]}
            >
              •
            </Text>
            <Text
              style={[
                styles.bulletText,
                commonStyling.subtitle,
                {
                  fontSize: 16,
                },
              ]}
            >
              Usage patterns and feature interactions
            </Text>
          </View>
          <View style={styles.bulletRow}>
            <Text
              style={[
                styles.bullet,
                {
                  color: colors.primaryColor,
                },
              ]}
            >
              •
            </Text>
            <Text
              style={[
                styles.bulletText,
                commonStyling.subtitle,
                {
                  fontSize: 16,
                },
              ]}
            >
              Crash reports and performance data
            </Text>
          </View>

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
            2.7 Payment Information
          </Text>
          <View style={styles.bulletRow}>
            <Text
              style={[
                styles.bullet,
                {
                  color: colors.primaryColor,
                },
              ]}
            >
              •
            </Text>
            <Text
              style={[
                styles.bulletText,
                commonStyling.subtitle,
                {
                  fontSize: 16,
                },
              ]}
            >
              Payment card details (processed by third-party processor)
            </Text>
          </View>
          <View style={styles.bulletRow}>
            <Text
              style={[
                styles.bullet,
                {
                  color: colors.primaryColor,
                },
              ]}
            >
              •
            </Text>
            <Text
              style={[
                styles.bulletText,
                commonStyling.subtitle,
                {
                  fontSize: 16,
                },
              ]}
            >
              Billing address
            </Text>
          </View>
          <View style={styles.bulletRow}>
            <Text
              style={[
                styles.bullet,
                {
                  color: colors.primaryColor,
                },
              ]}
            >
              •
            </Text>
            <Text
              style={[
                styles.bulletText,
                commonStyling.subtitle,
                {
                  fontSize: 16,
                },
              ]}
            >
              Transaction history
            </Text>
          </View>
          <Text
            style={[
              styles.bulletText,
              commonStyling.subtitle,
              {
                fontSize: 16,
                marginTop: 14,
                fontStyle: "italic",
              },
            ]}
          >
            MediGo does not store your full credit card number. Payment
            processing is handled by PCI-compliant third-party providers.
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
            2.8 Cookies (Web Portal)
          </Text>

          <Text
            style={[
              styles.bulletText,
              commonStyling.subtitle,
              {
                fontSize: 16,
                marginTop: 14,
              },
            ]}
          >
            Our web portal uses cookies and similar tracking technologies to
            enhance user experience, analyze usage, and remember your
            preferences.
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
            3. How We Use Your Information
          </Text>

          <View style={styles.bulletRow}>
            <Text
              style={[
                styles.bullet,
                {
                  color: colors.primaryColor,
                },
              ]}
            >
              •
            </Text>
            <Text
              style={[
                styles.bulletText,
                commonStyling.subtitle,
                {
                  fontSize: 16,
                },
              ]}
            >
              Service Delivery: Connect you with qualified drivers, facilitate
              rides, provide real-time tracking
            </Text>
          </View>
          <View style={styles.bulletRow}>
            <Text
              style={[
                styles.bullet,
                {
                  color: colors.primaryColor,
                },
              ]}
            >
              •
            </Text>
            <Text
              style={[
                styles.bulletText,
                commonStyling.subtitle,
                {
                  fontSize: 16,
                },
              ]}
            >
              Safety & Security: Verify identities, conduct background checks,
              monitor for fraudulent activity
            </Text>
          </View>
          <View style={styles.bulletRow}>
            <Text
              style={[
                styles.bullet,
                {
                  color: colors.primaryColor,
                },
              ]}
            >
              •
            </Text>
            <Text
              style={[
                styles.bulletText,
                commonStyling.subtitle,
                {
                  fontSize: 16,
                },
              ]}
            >
              Customer Support: Respond to inquiries, resolve issues, process
              refunds
            </Text>
          </View>
          <View style={styles.bulletRow}>
            <Text
              style={[
                styles.bullet,
                {
                  color: colors.primaryColor,
                },
              ]}
            >
              •
            </Text>
            <Text
              style={[
                styles.bulletText,
                commonStyling.subtitle,
                {
                  fontSize: 16,
                },
              ]}
            >
              Communication: Send booking confirmations, ride updates, service
              announcements
            </Text>
          </View>
          <View style={styles.bulletRow}>
            <Text
              style={[
                styles.bullet,
                {
                  color: colors.primaryColor,
                },
              ]}
            >
              •
            </Text>
            <Text
              style={[
                styles.bulletText,
                commonStyling.subtitle,
                {
                  fontSize: 16,
                },
              ]}
            >
              Improvement: Analyze usage patterns, develop new features, enhance
              user experience
            </Text>
          </View>
          <View style={styles.bulletRow}>
            <Text
              style={[
                styles.bullet,
                {
                  color: colors.primaryColor,
                },
              ]}
            >
              •
            </Text>
            <Text
              style={[
                styles.bulletText,
                commonStyling.subtitle,
                {
                  fontSize: 16,
                },
              ]}
            >
              Legal Compliance: Meet regulatory requirements, respond to legal
              requests
            </Text>
          </View>
          <View style={styles.bulletRow}>
            <Text
              style={[
                styles.bullet,
                {
                  color: colors.primaryColor,
                },
              ]}
            >
              •
            </Text>
            <Text
              style={[
                styles.bulletText,
                commonStyling.subtitle,
                {
                  fontSize: 16,
                },
              ]}
            >
              Marketing: Send promotional offers (you may opt-out anytime)
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
            4. How We Share Your Information
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
            4.1 With Transportation Providers
          </Text>
          <Text
            style={[
              styles.bulletText,
              commonStyling.subtitle,
              {
                fontSize: 16,
                marginTop: 8,
              },
            ]}
          >
            We share necessary information with your assigned driver, including
            your name, pickup/drop-off locations, special assistance needs, and
            contact information to facilitate safe transport.
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
            4.2 With Payment Processors
          </Text>
          <Text
            style={[
              styles.bulletText,
              commonStyling.subtitle,
              {
                fontSize: 16,
                marginTop: 8,
              },
            ]}
          >
            Payment information is shared with PCI-compliant third-party payment
            processors to complete transactions.
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
            4.3 With Service Providers
          </Text>
          <View style={styles.bulletRow}>
            <Text
              style={[
                styles.bullet,
                {
                  color: colors.primaryColor,
                },
              ]}
            >
              •
            </Text>
            <Text
              style={[
                styles.bulletText,
                commonStyling.subtitle,
                {
                  fontSize: 16,
                },
              ]}
            >
              Cloud hosting services (data storage)
            </Text>
          </View>
          <View style={styles.bulletRow}>
            <Text
              style={[
                styles.bullet,
                {
                  color: colors.primaryColor,
                },
              ]}
            >
              •
            </Text>
            <Text
              style={[
                styles.bulletText,
                commonStyling.subtitle,
                {
                  fontSize: 16,
                },
              ]}
            >
              Analytics platforms (usage insights)
            </Text>
          </View>
          <View style={styles.bulletRow}>
            <Text
              style={[
                styles.bullet,
                {
                  color: colors.primaryColor,
                },
              ]}
            >
              •
            </Text>
            <Text
              style={[
                styles.bulletText,
                commonStyling.subtitle,
                {
                  fontSize: 16,
                },
              ]}
            >
              Customer support tools
            </Text>
          </View>

          <View style={styles.bulletRow}>
            <Text
              style={[
                styles.bullet,
                {
                  color: colors.primaryColor,
                },
              ]}
            >
              •
            </Text>
            <Text
              style={[
                styles.bulletText,
                commonStyling.subtitle,
                {
                  fontSize: 16,
                },
              ]}
            >
              Background check services (driver verification)
            </Text>
          </View>

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
            4.4 For Legal & Compliance Purposes
          </Text>
          <Text
            style={[
              styles.bulletText,
              commonStyling.subtitle,
              {
                fontSize: 16,
                marginTop: 8,
              },
            ]}
          >
            We may disclose information when required by law, in response to
            legal processes, to protect rights and safety, or to prevent fraud
            and abuse.
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
            4.5 Business Transfers
          </Text>
          <Text
            style={[
              styles.bulletText,
              commonStyling.subtitle,
              {
                fontSize: 16,
                marginTop: 8,
              },
            ]}
          >
            In the event of a merger, acquisition, or sale of assets, your
            information may be transferred to the acquiring entity.
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
            5. Cross-Border Processing
          </Text>

          <Text
            style={[
              styles.bulletText,
              commonStyling.subtitle,
              {
                fontSize: 16,
                marginTop: 8,
              },
            ]}
          >
            MediGo operates in Canada. Your information may be processed and
            stored on servers located in Canada and the United States. By using
            our services, you consent to this transfer and processing.
          </Text>

          <Text
            style={[
              styles.bulletText,
              commonStyling.subtitle,
              {
                fontSize: 16,
                marginTop: 8,
              },
            ]}
          >
            We implement appropriate safeguards to protect your information in
            accordance with applicable data protection laws.
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
            6. Data Retention
          </Text>

          <View style={styles.bulletRow}>
            <Text
              style={[
                styles.bullet,
                {
                  color: colors.primaryColor,
                },
              ]}
            >
              •
            </Text>
            <Text
              style={[
                styles.bulletText,
                commonStyling.subtitle,
                {
                  fontSize: 16,
                },
              ]}
            >
              Account Information: Retained while your account is active
            </Text>
          </View>
          <View style={styles.bulletRow}>
            <Text
              style={[
                styles.bullet,
                {
                  color: colors.primaryColor,
                },
              ]}
            >
              •
            </Text>
            <Text
              style={[
                styles.bulletText,
                commonStyling.subtitle,
                {
                  fontSize: 16,
                },
              ]}
            >
              Trip Records: Retained for up to 7 years (tax and legal
              requirements)
            </Text>
          </View>
          <View style={styles.bulletRow}>
            <Text
              style={[
                styles.bullet,
                {
                  color: colors.primaryColor,
                },
              ]}
            >
              •
            </Text>
            <Text
              style={[
                styles.bulletText,
                commonStyling.subtitle,
                {
                  fontSize: 16,
                },
              ]}
            >
              Financial Records: Retained for up to 7 years (accounting
              compliance)
            </Text>
          </View>

          <View style={styles.bulletRow}>
            <Text
              style={[
                styles.bullet,
                {
                  color: colors.primaryColor,
                },
              ]}
            >
              •
            </Text>
            <Text
              style={[
                styles.bulletText,
                commonStyling.subtitle,
                {
                  fontSize: 16,
                },
              ]}
            >
              Communications: Retained for 2 years or as needed for support
            </Text>
          </View>

          <Text
            style={[
              styles.bulletText,
              commonStyling.subtitle,
              {
                fontSize: 16,
                marginTop: 8,
              },
            ]}
          >
            You may request deletion of your account at any time, subject to
            legal retention requirements.
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
            7. Security Safeguards
          </Text>

          <Text
            style={[
              styles.bulletText,
              commonStyling.subtitle,
              {
                fontSize: 16,
                marginTop: 8,
              },
            ]}
          >
            We implement industry-standard security measures to protect your
            information:
          </Text>

          <View style={styles.bulletRow}>
            <Text
              style={[
                styles.bullet,
                {
                  color: colors.primaryColor,
                },
              ]}
            >
              •
            </Text>
            <Text
              style={[
                styles.bulletText,
                commonStyling.subtitle,
                {
                  fontSize: 16,
                },
              ]}
            >
              Encryption of data in transit (TLS/SSL)
            </Text>
          </View>
          <View style={styles.bulletRow}>
            <Text
              style={[
                styles.bullet,
                {
                  color: colors.primaryColor,
                },
              ]}
            >
              •
            </Text>
            <Text
              style={[
                styles.bulletText,
                commonStyling.subtitle,
                {
                  fontSize: 16,
                },
              ]}
            >
              Encryption of sensitive data at rest
            </Text>
          </View>
          <View style={styles.bulletRow}>
            <Text
              style={[
                styles.bullet,
                {
                  color: colors.primaryColor,
                },
              ]}
            >
              •
            </Text>
            <Text
              style={[
                styles.bulletText,
                commonStyling.subtitle,
                {
                  fontSize: 16,
                },
              ]}
            >
              Access controls and authentication
            </Text>
          </View>

          <View style={styles.bulletRow}>
            <Text
              style={[
                styles.bullet,
                {
                  color: colors.primaryColor,
                },
              ]}
            >
              •
            </Text>
            <Text
              style={[
                styles.bulletText,
                commonStyling.subtitle,
                {
                  fontSize: 16,
                },
              ]}
            >
              Regular security audits and monitoring
            </Text>
          </View>

          <View style={styles.bulletRow}>
            <Text
              style={[
                styles.bullet,
                {
                  color: colors.primaryColor,
                },
              ]}
            >
              •
            </Text>
            <Text
              style={[
                styles.bulletText,
                commonStyling.subtitle,
                {
                  fontSize: 16,
                },
              ]}
            >
              Employee training on data protection
            </Text>
          </View>

          <Text
            style={[
              styles.bulletText,
              commonStyling.subtitle,
              {
                fontSize: 14,
                marginTop: 8,
                fontStyle: "italic",
              },
            ]}
          >
            While we strive to protect your information, no method of
            transmission over the internet or electronic storage is 100% secure.
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
            8. Your Rights
          </Text>

          <Text
            style={[
              styles.bulletText,
              commonStyling.subtitle,
              {
                fontSize: 16,
                marginTop: 8,
              },
            ]}
          >
            You have the following rights regarding your personal information:
          </Text>

          <View style={styles.bulletRow}>
            <Text
              style={[
                styles.bullet,
                {
                  color: colors.primaryColor,
                },
              ]}
            >
              •
            </Text>
            <Text
              style={[
                styles.bulletText,
                commonStyling.subtitle,
                {
                  fontSize: 16,
                },
              ]}
            >
              Access: Request a copy of your personal information
            </Text>
          </View>
          <View style={styles.bulletRow}>
            <Text
              style={[
                styles.bullet,
                {
                  color: colors.primaryColor,
                },
              ]}
            >
              •
            </Text>
            <Text
              style={[
                styles.bulletText,
                commonStyling.subtitle,
                {
                  fontSize: 16,
                },
              ]}
            >
              Correction: Request correction of inaccurate information
            </Text>
          </View>
          <View style={styles.bulletRow}>
            <Text
              style={[
                styles.bullet,
                {
                  color: colors.primaryColor,
                },
              ]}
            >
              •
            </Text>
            <Text
              style={[
                styles.bulletText,
                commonStyling.subtitle,
                {
                  fontSize: 16,
                },
              ]}
            >
              Deletion: Request deletion of your account and data
            </Text>
          </View>

          <View style={styles.bulletRow}>
            <Text
              style={[
                styles.bullet,
                {
                  color: colors.primaryColor,
                },
              ]}
            >
              •
            </Text>
            <Text
              style={[
                styles.bulletText,
                commonStyling.subtitle,
                {
                  fontSize: 16,
                },
              ]}
            >
              Portability: Request transfer of your data to another service
            </Text>
          </View>

          <View style={styles.bulletRow}>
            <Text
              style={[
                styles.bullet,
                {
                  color: colors.primaryColor,
                },
              ]}
            >
              •
            </Text>
            <Text
              style={[
                styles.bulletText,
                commonStyling.subtitle,
                {
                  fontSize: 16,
                },
              ]}
            >
              Opt-Out: Unsubscribe from marketing communications
            </Text>
          </View>

          <View style={styles.bulletRow}>
            <Text
              style={[
                styles.bullet,
                {
                  color: colors.primaryColor,
                },
              ]}
            >
              •
            </Text>
            <Text
              style={[
                styles.bulletText,
                commonStyling.subtitle,
                {
                  fontSize: 16,
                },
              ]}
            >
              Withdraw Consent: Withdraw consent for data processing (may limit
              services)
            </Text>
          </View>

          <Text
            style={[
              styles.bulletText,
              commonStyling.subtitle,
              {
                fontSize: 14,
                marginTop: 8,
                fontStyle: "italic",
              },
            ]}
          >
            To exercise these rights, contact our Privacy Officer at
            privacy@medigo.com
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
            9. Children's Privacy
          </Text>

          <Text
            style={[
              styles.bulletText,
              commonStyling.subtitle,
              {
                fontSize: 16,
                marginTop: 8,
              },
            ]}
          >
            MediGo services are not directed to individuals under 18 years of
            age. If you are a parent or guardian booking rides for a minor, you
            are responsible for providing consent and ensuring appropriate
            supervision during transport.
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
            10. Policy Updates
          </Text>

          <Text
            style={[
              styles.bulletText,
              commonStyling.subtitle,
              {
                fontSize: 16,
                marginTop: 8,
              },
            ]}
          >
            We may update this Privacy Policy from time to time. We will notify
            you of material changes by:
          </Text>

          <View style={styles.bulletRow}>
            <Text
              style={[
                styles.bullet,
                {
                  color: colors.primaryColor,
                },
              ]}
            >
              •
            </Text>
            <Text
              style={[
                styles.bulletText,
                commonStyling.subtitle,
                {
                  fontSize: 16,
                },
              ]}
            >
              In-app notification
            </Text>
          </View>

          <View style={styles.bulletRow}>
            <Text
              style={[
                styles.bullet,
                {
                  color: colors.primaryColor,
                },
              ]}
            >
              •
            </Text>
            <Text
              style={[
                styles.bulletText,
                commonStyling.subtitle,
                {
                  fontSize: 16,
                },
              ]}
            >
              Email to your registered address
            </Text>
          </View>

          <View style={styles.bulletRow}>
            <Text
              style={[
                styles.bullet,
                {
                  color: colors.primaryColor,
                },
              ]}
            >
              •
            </Text>
            <Text
              style={[
                styles.bulletText,
                commonStyling.subtitle,
                {
                  fontSize: 16,
                },
              ]}
            >
              Posting the updated policy with a new effective date
            </Text>
          </View>

          <Text
            style={[
              styles.bulletText,
              commonStyling.subtitle,
              {
                fontSize: 14,
                marginTop: 8,
                fontStyle: "italic",
              },
            ]}
          >
            Continued use of MediGo after changes indicates acceptance of the
            updated policy.
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
              Address: 123 Healthcare Drive, Suite 400, Toronto, ON M5H 2N2,
              Canada
            </Text>
          </View>
        </View>

        {/* Contact Support Section */}
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
    borderBottomColor: "#F1F5F9",
  },
  backButton: { width: 40, height: 40, justifyContent: "center" },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
    marginLeft: 8,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    paddingBottom: 120,
  },
  effectiveDate: { marginTop: 8 },
  lastUpdated: { marginTop: 4 },

  // Alert Box
  alertBox: {
    backgroundColor: "#FEF2F2",
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
    borderWidth: 1,
    borderColor: "#FEE2E2",
  },
  alertHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  alertTitle: { color: "#EF4444" },
  alertText: { color: "#991B1B", lineHeight: 20 },

  // Sections
  section: { marginTop: 32 },
  sectionHeader: {
    marginBottom: 12,
  },
  subSectionHeader: {
    marginTop: 16,
    marginBottom: 8,
  },
  bodyText: {
    lineHeight: 22,
    marginBottom: 12,
  },

  // Bullets
  bulletRow: { flexDirection: "row", marginBottom: 6, paddingRight: 12 },
  bullet: { fontSize: 14, marginRight: 8, fontWeight: "800" },
  bulletText: { lineHeight: 22, flex: 1 },

  // Support Card
  supportCard: {
    padding: 20,
    borderRadius: 16,
    marginTop: 8,
  },
  supportText: {
    marginTop: 4,
  },

  // Footer
  footer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    padding: 24,
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

export default PrivacyPolicyScreen;
