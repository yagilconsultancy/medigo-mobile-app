import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StatusBar,
} from "react-native";
import { ChevronLeft, Camera, ShieldCheck, User } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../../components/reuseables/header";
import { useUserStore } from "../../../store/userStore";
import useTheme from "../../../hooks/useThemes";
import { commonStyles } from "../../../styles/commonStyles";
import { useDriverProfile } from "../../../hooks/queries/useDriverProfile";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Input from "../../../components/inputs/input";
import Buttons from "../../../components/buttons/buttons";
import { useUpdateDriverProfile } from "../../../hooks/mutations/useUser";

const EditDriverPersonalInfo = () => {
  const { user } = useUserStore();
  const { colors, theme } = useTheme();
  const commonStyling = commonStyles(colors);
  const { data: profileData, isLoading } = useDriverProfile();
  const profile = profileData?.data;
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const [firstName, setFirstName] = useState(user?.data.first_name);
  const [lastName, setLastName] = useState(user?.data.last_name);
  const [email, setEmail] = useState(user?.data.email);
  const [phone, setPhone] = useState(user?.data.phone);

  const { mutate: updateProfile, isPending } = useUpdateDriverProfile();

  const handleSave = () => {
    const formData = {
      first_name: firstName, // Pull these from your local component state
      last_name: lastName,
      email: email,
      phone: phone,
    };

    updateProfile(formData, {
      onSuccess: () => {
        navigation.goBack();
      },
    });
  };
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

      <Header title="Edit Personal Information" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Photo Update Section */}
        <View style={styles.photoSection}>
          <View style={styles.avatarContainer}>
            <View
              style={[
                styles.avatarBg,
                {
                  backgroundColor: colors.surfaceBrand,
                },
              ]}
            >
              <User size={60} color={colors.primaryColor} />
            </View>
            <TouchableOpacity
              style={[
                styles.cameraBadge,
                {
                  backgroundColor: colors.primaryColor,
                },
              ]}
            >
              <Camera size={18} color="#FFF" />
            </TouchableOpacity>
          </View>
          <Text
            style={[
              styles.updatePhotoText,
              commonStyling.subtitle,
              {
                fontSize: 14,
              },
            ]}
          >
            Update profile photo
          </Text>
        </View>

        {/* Identity Verification Banner */}
        <View style={styles.verifiedBanner}>
          <ShieldCheck size={20} color="#10B981" />
          <View style={styles.verifiedTextGroup}>
            <Text style={styles.verifiedTitle}>Identity Verified</Text>
            <Text style={styles.verifiedSub}>
              Your identity has been verified by Medigo.
            </Text>
          </View>
        </View>

        {/* Form Fields */}
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

        <Input
          title="First Name"
          value={firstName}
          onChangeText={setFirstName}
        />

        <View
          style={{
            marginTop: 16,
          }}
        >
          <Input
            title="Last Name"
            value={lastName}
            onChangeText={setLastName}
          />
        </View>

        <View
          style={{
            marginTop: 16,
          }}
        >
          <Input
            title="Email Address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
        </View>

        <View
          style={{
            marginTop: 16,
          }}
        >
          <Input
            title="Phone Number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Fixed Footer Button */}
      <View
        style={[
          styles.footer,
          {
            backgroundColor: colors.surfacePrimary,
          },
        ]}
      >
        <Buttons
          title="Save Changes"
          onPress={() => {
            handleSave();
          }}
          loading={isPending}
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
  headerTitle: { fontSize: 18, fontWeight: "800", color: "#1E293B" },

  scrollContent: { padding: 24 },

  photoSection: { alignItems: "center", marginBottom: 32 },
  avatarContainer: { position: "relative" },
  avatarBg: {
    width: 110,
    height: 110,
    borderRadius: 55,
    justifyContent: "center",
    alignItems: "center",
  },
  cameraBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  updatePhotoText: {
    marginTop: 12,
  },

  verifiedBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ECFDF5",
    padding: 16,
    borderRadius: 16,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: "#D1FAE5",
  },
  verifiedTextGroup: { marginLeft: 12 },
  verifiedTitle: { fontSize: 14, fontFamily: "Bold", color: "#065F46" },
  verifiedSub: {
    fontSize: 12,
    color: "#059669",
    marginTop: 1,
    fontFamily: "Regular",
  },

  sectionLabel: {
    marginBottom: 20,
  },

  inputGroup: { marginBottom: 20 },
  inputLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 8,
  },
  input: {
    height: 56,
    backgroundColor: "#FFF",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 15,
    fontWeight: "600",
    color: "#334155",
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },

  footer: {
    padding: 24,
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
});

export default EditDriverPersonalInfo;
