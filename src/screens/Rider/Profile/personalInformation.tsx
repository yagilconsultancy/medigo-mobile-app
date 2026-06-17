import React from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Image,
} from "react-native";
import { ChevronLeft, Lock } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import useTheme from "../../../hooks/useThemes";
import { commonStyles } from "../../../styles/commonStyles";
import Header from "../../../components/reuseables/header";
import { useUserProfile } from "../../../hooks/queries/useUserProfile";

const PersonalInformationScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { colors, theme } = useTheme();
  const commonStyling = commonStyles(colors);
  const { data, isLoading } = useUserProfile();

  console.log(data?.data);

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

      <Header
        title="Personal Information"
        rightText={
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("RiderProfileContentsStack", {
                screen: "EditProfileScreen",
              });
            }}
          >
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        }
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Image Section */}
        <View style={styles.profileImageContainer}>
          {data?.data.avatar_url ? (
            <Image
              source={{ uri: data.data.avatar_url }}
              style={styles.avatar}
            />
          ) : (
            <Image
              source={require("../../../../assets/images/noProfileImage.jpg")}
              style={styles.avatar}
            />
          )}
        </View>

        {/* Personal Details Section */}
        <Text
          style={[
            styles.sectionLabel,
            commonStyling.subtitle,
            {
              fontSize: 13,
              fontFamily: "SemiBold",
            },
          ]}
        >
          Personal Details
        </Text>
        <View
          style={[
            styles.infoCard,
            {
              backgroundColor: colors.homelightPrimaryBlue50,
              borderColor: colors.lightPrimaryBlueBorder,
            },
          ]}
        >
          <DataField label="First Name" value={data?.data.first_name} />
          <View style={styles.divider} />
          <DataField label="Last Name" value={data?.data.last_name} />
          <View style={styles.divider} />
          <DataField label="Email" value={data?.data.email} />
          <View style={styles.divider} />
          <DataField label="Phone Number" value={data?.data.phone} />
        </View>

        {/* Medical Information Section */}
        <Text
          style={[
            styles.sectionLabel,
            commonStyling.subtitle,
            {
              fontSize: 13,
              fontFamily: "SemiBold",
              marginTop: 24,
            },
          ]}
        >
          Medical Information
        </Text>
        <View
          style={[
            styles.infoCard,
            {
              backgroundColor: colors.homelightPrimaryBlue50,
              borderColor: colors.lightPrimaryBlueBorder,
            },
          ]}
        >
          <View style={styles.fieldContainer}>
            <Text
              style={[
                styles.fieldLabel,
                commonStyling.subtitle,
                {
                  fontSize: 13,
                  fontFamily: "Medium",
                },
              ]}
            >
              Medical Notes (Optional)
            </Text>
            <Text style={styles.fieldValueGray}>No medical notes added</Text>
          </View>
        </View>

        {/* Privacy Banner */}
        <View style={styles.privacyBanner}>
          <View style={styles.lockIconWrapper}>
            <Lock size={16} color="#3B82F6" fill="#3B82F6" />
          </View>
          <View style={styles.bannerTextContainer}>
            <Text style={styles.bannerTitle}>Privacy Protected</Text>
            <Text style={styles.bannerSub}>
              Your information is encrypted and HIPAA compliant. Only shared
              with your assigned driver for safety.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// --- Sub-components ---
const DataField = ({ label, value }: any) => {
  const { colors } = useTheme();
  const commonStyling = commonStyles(colors);

  return (
    <View style={styles.fieldContainer}>
      <Text
        style={[
          styles.fieldLabel,
          commonStyling.subtitle,
          {
            fontSize: 13,
            fontFamily: "Medium",
          },
        ]}
      >
        {label}
      </Text>
      <Text
        style={[
          commonStyling.title,
          {
            fontSize: 15,
          },
        ]}
      >
        {value}
      </Text>
    </View>
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
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  headerTitle: { fontSize: 18, fontWeight: "800", color: "#1E293B" },
  editText: { fontSize: 16, fontWeight: "600", color: "#94A3B8" },

  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },

  profileImageContainer: { alignItems: "center", marginVertical: 30 },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
  },

  sectionLabel: {
    marginBottom: 12,
  },
  infoCard: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: "hidden",
  },
  fieldContainer: { padding: 16 },
  fieldLabel: { marginBottom: 6 },
  fieldValueGray: { fontSize: 14, color: "#94A3B8" },
  divider: { height: 1, backgroundColor: "#F1F5F9", marginHorizontal: 16 },

  privacyBanner: {
    flexDirection: "row",
    backgroundColor: "#EFF6FF",
    padding: 16,
    borderRadius: 16,
    marginTop: 24,
    alignItems: "flex-start",
  },
  lockIconWrapper: { marginTop: 2 },
  bannerTextContainer: { flex: 1, marginLeft: 12 },
  bannerTitle: { fontSize: 14, fontWeight: "800", color: "#1E3A8A" },
  bannerSub: { fontSize: 12, color: "#3B82F6", marginTop: 4, lineHeight: 18 },
});

export default PersonalInformationScreen;
