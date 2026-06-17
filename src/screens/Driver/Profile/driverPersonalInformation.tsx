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
  User,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUserStore } from "../../../store/userStore";
import useTheme from "../../../hooks/useThemes";
import { commonStyles } from "../../../styles/commonStyles";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Header from "../../../components/reuseables/header";
import { useRideStore } from "../../../store/useRideStore";

const DriverPersonalInformationScreen = () => {
  const { user } = useUserStore();
  const { colors, theme } = useTheme();
  const commonStyling = commonStyles(colors);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const pickup = useRideStore((s) => s.pickup);

  console.log(user);

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

      <Header title="Personal Information" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Photo Section */}
        <View
          style={[
            styles.photoCard,
            {
              borderColor: colors.lightPrimaryBlueBorder,
            },
          ]}
        >
          <View style={styles.photoContainer}>
            <View
              style={[
                styles.avatarPlaceholder,
                {
                  backgroundColor: colors.surfaceBrand,
                },
              ]}
            >
              <User size={40} color={colors.primaryColor} />
            </View>
          </View>
          <View style={styles.photoTextContainer}>
            <Text
              style={[
                commonStyling.title,
                {
                  fontSize: 18,
                  fontFamily: "Bold",
                },
              ]}
            >
              Profile Photo
            </Text>
            <Text
              style={[
                styles.photoSubTitle,
                commonStyling.subtitle,
                {
                  fontSize: 14,
                },
              ]}
            >
              Update your profile picture
            </Text>
          </View>
        </View>

        {/* Identity Verification Banner */}
        <View style={styles.verifiedBanner}>
          <View style={styles.verifiedLeftBorder} />
          <ShieldCheck size={20} color="#10B981" />
          <View style={styles.verifiedTextGroup}>
            <Text
              style={{
                color: "#065F46",
                fontSize: 14,
                fontFamily: "Bold",
              }}
            >
              Identity Verified
            </Text>
            <Text style={styles.verifiedSub}>
              Your identity has been verified by MediGo
            </Text>
          </View>
        </View>

        {/* Contact Information Section */}
        <Text
          style={[
            styles.sectionLabel,
            commonStyling.title,
            {
              fontSize: 18,
              fontFamily: "Bold",
            },
          ]}
        >
          Contact Information
        </Text>

        {/* Full Name */}
        <View
          style={[
            styles.infoField,
            {
              borderColor: colors.lightPrimaryBlueBorder,
            },
          ]}
        >
          <View style={[styles.iconBg, { backgroundColor: "#EFF6FF" }]}>
            <User size={20} color="#3B82F6" />
          </View>
          <View style={styles.fieldContent}>
            <Text
              style={[
                commonStyling.subtitle,
                {
                  fontSize: 12,
                },
              ]}
            >
              Full Name
            </Text>
            <Text
              style={[
                styles.fieldValue,
                commonStyling.title,
                {
                  fontSize: 15,
                  fontFamily: "SemiBold",
                },
              ]}
            >
              {user?.data.first_name} {user?.data.last_name}
            </Text>
          </View>
        </View>

        {/* Email Address */}
        <View
          style={[
            styles.infoField,
            {
              borderColor: colors.lightPrimaryBlueBorder,
            },
          ]}
        >
          <View style={[styles.iconBg, { backgroundColor: "#EEF2FF" }]}>
            <Mail size={20} color="#6366F1" />
          </View>
          <View style={styles.fieldContent}>
            <Text
              style={[
                commonStyling.subtitle,
                {
                  fontSize: 12,
                },
              ]}
            >
              Email Address
            </Text>
            <Text
              style={[
                styles.fieldValue,
                commonStyling.title,
                {
                  fontSize: 15,
                  fontFamily: "SemiBold",
                },
              ]}
            >
              {user?.data.email}
            </Text>
          </View>
          <CheckCircle2 size={20} color="#10B981" />
        </View>

        {/* Phone Number */}
        <View
          style={[
            styles.infoField,
            {
              borderColor: colors.lightPrimaryBlueBorder,
            },
          ]}
        >
          <View style={[styles.iconBg, { backgroundColor: "#F0F9FF" }]}>
            <Phone size={20} color="#0EA5E9" />
          </View>
          <View style={styles.fieldContent}>
            <Text
              style={[
                commonStyling.subtitle,
                {
                  fontSize: 12,
                },
              ]}
            >
              Phone Number
            </Text>
            <Text
              style={[
                styles.fieldValue,
                commonStyling.title,
                {
                  fontSize: 15,
                  fontFamily: "SemiBold",
                },
              ]}
            >
              {user?.data.phone}
            </Text>
          </View>
          <CheckCircle2 size={20} color="#10B981" />
        </View>

        {/* Address Section */}
        <Text
          style={[
            styles.sectionLabel,
            commonStyling.title,
            {
              fontSize: 18,
              fontFamily: "Bold",
            },
          ]}
        >
          Address
        </Text>
        <View
          style={[
            styles.infoField,
            {
              borderColor: colors.lightPrimaryBlueBorder,
            },
          ]}
        >
          <View style={[styles.iconBg, { backgroundColor: "#F0F9FF" }]}>
            <MapPin size={20} color="#3B82F6" />
          </View>
          <View style={styles.fieldContent}>
            <Text
              style={[
                commonStyling.subtitle,
                {
                  fontSize: 12,
                },
              ]}
            >
              Current Address
            </Text>
            <Text
              style={[
                styles.fieldValue,
                commonStyling.title,
                {
                  fontSize: 15,
                  fontFamily: "SemiBold",
                },
              ]}
            >
              {pickup?.address}
            </Text>
          </View>
        </View>

        {/* Informational Note */}
        <View
          style={[
            styles.noteBox,
            {
              backgroundColor: colors.surfaceBrand,
            },
          ]}
        >
          <Text
            style={[
              commonStyling.subtitle,
              {
                fontSize: 12,
                color: colors.primaryColor,
              },
            ]}
          >
            <Text style={{ fontFamily: "Bold" }}>Note: </Text>
            Changes to your personal information may require re-verification.
            Contact support if you need to update your date of birth.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    height: 60,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: { fontSize: 20, fontWeight: "800", color: "#1E293B" },
  editLink: { fontSize: 16, fontWeight: "600", color: "#94A3B8" },

  scrollContent: { padding: 24 },

  photoCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    marginBottom: 20,
  },
  photoContainer: { position: "relative" },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  dimensionBadge: {
    position: "absolute",
    bottom: -12,
    alignSelf: "center",
    backgroundColor: "#3B82F6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  dimensionText: { color: "#FFF", fontSize: 12, fontWeight: "800" },
  photoTextContainer: { marginLeft: 20 },
  photoSubTitle: { marginTop: 4 },

  verifiedBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ECFDF5",
    padding: 16,
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 32,
  },
  verifiedLeftBorder: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: "#10B981",
  },
  verifiedTextGroup: { marginLeft: 12 },
  verifiedSub: { fontSize: 12, color: "#059669", marginTop: 2 },

  sectionLabel: {
    marginBottom: 16,
    marginTop: 8,
  },
  infoField: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 16,
  },
  iconBg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  fieldContent: { flex: 1, marginLeft: 16 },
  fieldValue: {
    marginTop: 2,
  },

  noteBox: {
    padding: 20,
    borderRadius: 24,
    marginTop: 8,
  },
  noteText: { fontSize: 13, color: "#1E40AF", lineHeight: 20 },
});

export default DriverPersonalInformationScreen;
