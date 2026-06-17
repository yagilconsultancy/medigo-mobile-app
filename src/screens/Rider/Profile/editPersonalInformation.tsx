import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { ChevronLeft, Camera, Lock, ChevronDown } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import useTheme from "../../../hooks/useThemes";
import { commonStyles } from "../../../styles/commonStyles";
import Header from "../../../components/reuseables/header";
import { useUserProfile } from "../../../hooks/queries/useUserProfile";
import { UpdateProfilePayload } from "../../../types/auth.types";
import { useUpdateProfileMutation } from "../../../hooks/mutations/useUser";
import Buttons from "../../../components/buttons/buttons";

const EditProfileScreen = () => {
  const { data, isLoading } = useUserProfile();
  const [form, setForm] = useState({
    firstName: data?.data.first_name,
    lastName: data?.data.last_name,
    email: data?.data.email,
    phone: data?.data.phone,
    medicalNotes: "",
    avatar_url: data?.data.avatar_url,
  });
  const updateProfileMutation = useUpdateProfileMutation();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { colors, theme } = useTheme();
  const commonStyling = commonStyles(colors);

  const updateBioFields = (fields: Partial<any>) => {
    setForm((prev) => ({ ...prev, ...fields }));
  };

  const handleBioSubmit = () => {
    const profileData: UpdateProfilePayload = {
      first_name: form.firstName, // Pull these from your local component state
      last_name: form.lastName,
      medical_notes: form.medical_notes,
      avatar_url: form.avatar_url,
      email: form.email,
    };

    console.log(profileData);

    updateProfileMutation.mutate(profileData, {
      onSuccess: () => {
        navigation.goBack();
      },
    });
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"], // Updated syntax for newer versions
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      // result.assets[0].uri is the local path to the image
      setForm({ ...form, avatar_url: result.assets[0].uri });
    }
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

      <Header title="Personal Information" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Image with Upload Trigger */}
        <View style={styles.profileContainer}>
          <View style={styles.imageWrapper}>
            <Image
              source={
                form.avatar_url
                  ? { uri: form.avatar_url }
                  : data?.data.avatar_url
                    ? { uri: data.data.avatar_url }
                    : require("../../../../assets/images/noProfileImage.jpg")
              }
              style={styles.avatar}
            />

            {/* 2. Add the onPress trigger */}
            <TouchableOpacity style={styles.cameraBtn} onPress={pickImage}>
              <Camera size={16} color="#1E293B" />
            </TouchableOpacity>
          </View>
        </View>

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

        {/* Name Row */}
        <View style={styles.row}>
          <View style={styles.flex1}>
            <Text
              style={[
                styles.inputLabel,
                commonStyling.title,
                {
                  fontSize: 14,
                },
              ]}
            >
              First Name<Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.surfaceElevated,
                  borderColor: colors.lightPrimaryBlueBorder,
                  color: colors.titleText,
                  fontFamily: "Regular",
                },
              ]}
              value={form.firstName}
              onChangeText={(val) => updateBioFields({ firstName: val })}
            />
          </View>
          <View style={styles.flex1}>
            <Text
              style={[
                styles.inputLabel,
                commonStyling.title,
                {
                  fontSize: 14,
                },
              ]}
            >
              Last Name<Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.surfaceElevated,
                  borderColor: colors.lightPrimaryBlueBorder,
                  color: colors.titleText,
                  fontFamily: "Regular",
                },
              ]}
              value={form.lastName}
              onChangeText={(val) => updateBioFields({ lastName: val })}
            />
          </View>
        </View>

        {/* Email Input */}
        <Text
          style={[
            styles.inputLabel,
            commonStyling.title,
            {
              fontSize: 14,
            },
          ]}
        >
          Email<Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.surfaceElevated,
              borderColor: colors.lightPrimaryBlueBorder,
              color: colors.titleText,
              fontFamily: "Regular",
            },
          ]}
          keyboardType="email-address"
          value={form.email}
          onChangeText={(val) => updateBioFields({ email: val })}
        />

        {/* Phone Input with Dropdown */}
        <Text
          style={[
            styles.inputLabel,
            commonStyling.title,
            {
              fontSize: 14,
            },
          ]}
        >
          Phone Number<Text style={styles.required}>*</Text>
        </Text>
        <View
          style={[
            styles.phoneInputContainer,
            {
              backgroundColor: colors.surfaceElevated,
              borderColor: colors.lightPrimaryBlueBorder,
            },
          ]}
        >
          <TextInput
            style={[
              styles.phoneInput,
              {
                backgroundColor: colors.surfaceElevated,
                borderColor: colors.lightPrimaryBlueBorder,
                color: colors.titleText,
                fontFamily: "Regular",
              },
            ]}
            keyboardType="phone-pad"
            value={form.phone}
            onChangeText={(val) => updateBioFields({ phone: val })}
          />
          <ChevronDown size={20} color="#CBD5E1" style={{ marginRight: 12 }} />
        </View>

        {/* Medical Info Section */}
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
          <Lock
            size={16}
            color="#3B82F6"
            fill="#3B82F6"
            style={{ marginTop: 2 }}
          />
          <View style={styles.bannerTextWrapper}>
            <Text style={styles.bannerTitle}>Privacy Protected</Text>
            <Text style={styles.bannerSub}>
              Your information is encrypted and HIPAA compliant. Only shared
              with your assigned driver for safety.
            </Text>
          </View>
        </View>

        {/* Action Button */}
        <View style={styles.saveBtn}>
          <Buttons
            title="Save changes"
            onPress={handleBioSubmit}
            loading={updateProfileMutation.isPending}
          />
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

  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  profileContainer: { alignItems: "center", marginVertical: 24 },
  imageWrapper: { position: "relative" },
  avatar: { width: 100, height: 100, borderRadius: 50 },
  cameraBtn: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#FFF",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },

  sectionLabel: {
    marginBottom: 16,
  },
  row: { flexDirection: "row", gap: 12 },
  flex1: { flex: 1 },

  inputLabel: {
    marginBottom: 8,
    marginTop: 16,
  },
  required: { color: "#EF4444" },
  input: {
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 15,
  },

  phoneInputContainer: {
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  phoneInput: {
    flex: 1,
    paddingHorizontal: 16,
  },

  medicalBox: {
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    minHeight: 80,
  },
  fieldLabelSmall: { fontSize: 12, color: "#94A3B8", marginBottom: 4 },
  medicalInput: { fontSize: 14, color: "#1E293B", padding: 0 },

  privacyBanner: {
    flexDirection: "row",
    backgroundColor: "#EFF6FF",
    padding: 16,
    borderRadius: 16,
    marginTop: 24,
    gap: 12,
  },
  bannerTextWrapper: { flex: 1 },
  bannerTitle: { fontSize: 14, fontWeight: "800", color: "#1E3A8A" },
  bannerSub: { fontSize: 12, color: "#3B82F6", marginTop: 4, lineHeight: 18 },

  saveBtn: {
    marginTop: 32,
  },
  saveBtnText: { color: "#FFF", fontSize: 16, fontWeight: "800" },

  infoCard: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: "hidden",
  },
  fieldContainer: { padding: 16 },
  fieldLabel: { marginBottom: 6 },
  fieldValueGray: { fontSize: 14, color: "#94A3B8" },
});

export default EditProfileScreen;
