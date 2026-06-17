import React, { useState } from "react";
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
  AlertCircle,
  Shield,
  FileText,
  MapPin,
  ChevronRight,
} from "lucide-react-native";
import useTheme from "../../hooks/useThemes";
import { commonStyles } from "../../styles/commonStyles";
import { FONT_SIZES } from "../../constants/sizes";
import { SafeAreaView } from "react-native-safe-area-context";
import Buttons from "../../components/buttons/buttons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useUpdateConsentMutation } from "../../hooks/mutations/useUser";

const ReviewAndAccept = () => {
  const { colors } = useTheme();
  const commonStyling = commonStyles(colors);
  const [agreements, setAgreements] = useState({
    emergency: false,
    privacy: false,
    terms: false,
    location: false,
  });
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const toggleAgreement = (key: keyof typeof agreements) => {
    setAgreements((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const consentMutation = useUpdateConsentMutation();

  const handleAcceptAll = () => {
    const payload = {
      consent_emergency_services: agreements.emergency,
      consent_privacy_policy: agreements.privacy,
      consent_terms_of_service: agreements.terms,
      consent_data_location: agreements.location,
    };

    consentMutation.mutate(payload, {
      onSuccess: () => {
        // Redirect to Dashboard or Success Screen
        navigation.navigate("RiderMainTabs");
      },
    });
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.surfacePrimary,
      }}
    >
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <ChevronLeft color="#1A1C1E" size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[commonStyling.title, styles.title]}>Review & Accept</Text>
        <Text style={[commonStyling.subtitle, styles.subtitle]}>
          Please review and accept the following agreements to continue.
        </Text>

        {/* 1. Non-Emergency Service Card */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.highlightRed50,
              borderColor: colors.lightPrimaryBlueBorder,
            },
          ]}
        >
          <View style={styles.row}>
            <View
              style={[
                styles.iconCircleRed,
                {
                  backgroundColor: colors.red,
                },
              ]}
            >
              <AlertCircle color="white" size={20} />
            </View>
            <View style={styles.textContainer}>
              <Text
                style={[
                  commonStyling.title,
                  {
                    color: colors.highlightRed150,
                    fontFamily: "Bold",
                    fontSize: FONT_SIZES.SUBTITLE,
                  },
                ]}
              >
                Non-Emergency Service
              </Text>
              <Text
                style={[
                  styles.cardDesc,
                  commonStyling.subtitle,
                  {
                    fontSize: FONT_SIZES.BODY,
                    color: colors.highlightRed150,
                    lineHeight: 20,
                  },
                ]}
              >
                MediGo is NOT an emergency service. In case of medical
                emergency, call 911 immediately.
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={[
              styles.checkboxRow,
              {
                opacity: 10,
              },
            ]}
            onPress={() => toggleAgreement("emergency")}
          >
            <View
              style={[
                styles.checkbox,
                agreements.emergency && styles.checkboxActive,
              ]}
            />
            <Text
              style={[
                commonStyling.subtitle,
                {
                  fontSize: FONT_SIZES.BODY,
                  lineHeight: 20,
                  color: colors.titleText,
                  fontFamily: "Medium",
                  flex: 1,
                },
              ]}
            >
              I understand this is not an emergency service
            </Text>
          </TouchableOpacity>
        </View>

        {/* 2. Privacy Policy */}
        <AgreementCard
          title="Privacy Policy"
          desc="How we protect your personal and health information"
          icon={<Shield color="#3B82F6" size={20} />}
          isSelected={agreements.privacy}
          onToggle={() => toggleAgreement("privacy")}
          navDestination="PrivacyPolicyScreen"
        />

        {/* 3. Terms of Service */}
        <AgreementCard
          title="Terms of Service"
          desc="Your rights and responsibilities"
          icon={<FileText color="#3B82F6" size={20} />}
          isSelected={agreements.terms}
          onToggle={() => toggleAgreement("terms")}
          navDestination="TermsOfServiceScreen"
        />

        {/* 4. Data & Location Consent */}
        <AgreementCard
          title="Data & Location Consent"
          desc="Location and health data usage"
          icon={<MapPin color="#3B82F6" size={20} />}
          isSelected={agreements.location}
          onToggle={() => toggleAgreement("location")}
          navDestination="LocationConsentScreen"
        />
      </ScrollView>

      {/* Fixed Bottom Button */}
      <View
        style={[
          styles.footer,
          {
            backgroundColor: colors.surfacePrimary,
          },
        ]}
      >
        <Buttons
          title="Accept all agreement to continue"
          onPress={handleAcceptAll}
          loading={consentMutation.isPending}
        />
      </View>
    </SafeAreaView>
  );
};

// --- Reusable Sub-component for White Cards ---
const AgreementCard = ({
  title,
  desc,
  icon,
  isSelected,
  onToggle,
  navDestination,
}: any) => {
  const { colors } = useTheme();
  const commonStyling = commonStyles(colors);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.lightGray,
          borderColor: colors.lightPrimaryBlueBorder,
        },
      ]}
    >
      <View style={styles.row}>
        <View style={styles.iconCircleBlue}>{icon}</View>
        <View style={styles.textContainer}>
          <Text
            style={[
              commonStyling.title,
              {
                fontFamily: "Bold",
                fontSize: FONT_SIZES.SUBTITLE,
              },
            ]}
          >
            {title}
          </Text>
          <Text
            style={[
              styles.cardDesc,
              commonStyling.subtitle,
              {
                fontSize: FONT_SIZES.BODY,
                lineHeight: 20,
              },
            ]}
          >
            {desc}
          </Text>
          <TouchableOpacity
            style={styles.viewLinkRow}
            onPress={() => {
              navigation.navigate(navDestination);
            }}
          >
            <Text
              style={[
                styles.viewLinkText,
                commonStyling.subtitle,
                {
                  fontSize: FONT_SIZES.BODY,
                  lineHeight: 20,
                  color: colors.primaryColor,
                  fontFamily: "Medium",
                },
              ]}
            >
              View Agreement
            </Text>
            <ChevronRight color="#3B82F6" size={14} />
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity style={styles.checkboxRow} onPress={onToggle}>
        <View style={[styles.checkbox, isSelected && styles.checkboxActive]} />
        <Text
          style={[
            commonStyling.subtitle,
            {
              fontSize: FONT_SIZES.BODY,
              lineHeight: 20,
              color: colors.titleText,
              fontFamily: "Medium",
              flex: 1,
            },
          ]}
        >
          I agree to the {title}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: { paddingHorizontal: 20, paddingVertical: 10 },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF", // Required for shadows to show up
    justifyContent: "center",
    alignItems: "center",

    // Android Shadow
    elevation: 4,

    // iOS Shadow
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,

    // Border (from design)
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 100 },
  title: { marginTop: 24, fontSize: FONT_SIZES.HERO, fontFamily: "Bold" },
  subtitle: {
    marginTop: 8,
    marginBottom: 24,
    lineHeight: 22,
  },

  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },

  row: { flexDirection: "row", marginBottom: 16 },
  iconCircleRed: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  iconCircleBlue: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },

  textContainer: { flex: 1, marginLeft: 12 },
  cardDesc: { marginTop: 4 },

  viewLinkRow: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  viewLinkText: {
    marginRight: 4,
  },

  checkboxRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#FFFFFF33",
    padding: 12,
    borderRadius: 12,
    width: "100%",
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#CBD5E1",
    marginRight: 10,
    marginTop: 2, // Align checkbox with the first line of text
  },
  checkboxText: {
    flex: 1, // This is mandatory
    fontSize: 14, // FONT_SIZES.BODY
    lineHeight: 20,
    color: "#1E293B",
    fontFamily: "Medium",
    // No fixed width here
  },
  checkboxActive: { backgroundColor: "#3B82F6", borderColor: "#3B82F6" },

  footer: {
    paddingTop: 24,
    paddingBottom: 48,
    paddingHorizontal: 24,
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
  disabledButton: { backgroundColor: "#93C5FD", opacity: 0.8 },
  buttonText: { color: "#FFFFFF", fontSize: 15, fontWeight: "700" },
});

export default ReviewAndAccept;
