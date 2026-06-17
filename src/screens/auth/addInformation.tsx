import { ScrollView, StyleSheet, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useTheme from "../../hooks/useThemes";
import { commonStyles } from "../../styles/commonStyles";
import BackButton from "../../components/buttons/backButton";
import { Lock } from "lucide-react-native";
import Input from "../../components/inputs/input";
import Dropdown from "../../components/inputs/dropdown";
import MultilineInput from "../../components/inputs/multilineInput";
import { FONT_SIZES } from "../../constants/sizes";
import Buttons from "../../components/buttons/buttons";
import RightArrow from "../../../assets/icons/rightArrow";
import { useUpdateProfileMutation } from "../../hooks/mutations/useUser";
import { useState } from "react";
import { RegisterPayload, UpdateProfilePayload } from "../../types/auth.types";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

function AddInformation() {
  const { colors } = useTheme();
  const commonStyling = commonStyles(colors);
  const updateProfileMutation = useUpdateProfileMutation();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [selectedGender, setselectedGender] = useState("");
  const [bioFormData, setbioFormData] = useState<RegisterPayload>({
    first_name: "",
    last_name: "",
    medical_notes: "",
    emergency_contacts: "",
  });

  const updateBioFields = (fields: Partial<RegisterPayload>) => {
    setbioFormData((prev) => ({ ...prev, ...fields }));
  };

  const handleBioSubmit = () => {
    console.log(bioFormData);

    const profileData: UpdateProfilePayload = {
      first_name: bioFormData.first_name, // Pull these from your local component state
      last_name: bioFormData.last_name,
      gender: selectedGender,
      home_address: "",
      medical_notes: bioFormData.medical_notes,
      // date_of_birth: "",
      avatar: "",
    };

    updateProfileMutation.mutate(profileData, {
      onSuccess: () => {
        navigation.navigate("ReviewAndAccept");
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
      <ScrollView
        style={{
          paddingHorizontal: 24,
          paddingBottom: 40,
          paddingTop: 16,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <BackButton />
        </View>

        <Text
          style={[
            commonStyling.title,
            styles.mainTitle,
            {
              marginTop: 16,
              fontSize: 30,
              fontFamily: "Bold",
            },
          ]}
        >
          Your Information
        </Text>
        <Text style={[commonStyling.subtitle, styles.subTitle]}>
          Help us provide you with the best care during your rides.
        </Text>
        <View style={styles.row}>
          <View style={{ flex: 1, marginRight: 10 }}>
            <Input
              title="First Name"
              placeholder="Jhon"
              value={bioFormData.first_name}
              onChangeText={(val) => updateBioFields({ first_name: val })}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Input
              title="Last Name"
              placeholder="Doe"
              value={bioFormData.last_name}
              onChangeText={(val) => updateBioFields({ last_name: val })}
            />
          </View>
        </View>
        <Dropdown
          label="Gender"
          data={["Male", "Female", "Others"]}
          selected={selectedGender}
          onSelect={(val) => setselectedGender(val)}
        />
        <Input
          title="Emergency Contact (Optional)"
          placeholder="(555) 000-0000"
          value={bioFormData.emergency_contacts}
          onChangeText={(val) => updateBioFields({ emergency_contacts: val })}
        />

        <View
          style={{
            marginTop: 12,
          }}
        >
          <MultilineInput
            title="Medical Notes (Optional)"
            value={bioFormData.medical_notes}
            onChangeText={(val) => updateBioFields({ medical_notes: val })}
            placeholder="Any special requirements or medical conditions we should know about..."
          />
        </View>

        <View
          style={[
            styles.privacyBanner,
            {
              backgroundColor: colors.surfaceBrand,
              marginTop: 32,
            },
          ]}
        >
          <View style={styles.lockIconWrapper}>
            <Lock size={16} color="#3B82F6" fill="#3B82F6" />
          </View>
          <View style={styles.bannerTextContainer}>
            <Text
              style={[
                styles.bannerTitle,
                commonStyling.title,
                {
                  color: colors.primaryColor,
                  fontSize: FONT_SIZES.BODY,
                },
              ]}
            >
              Privacy Protected
            </Text>
            <Text
              style={[
                styles.bannerSub,
                commonStyling.subtitle,
                {
                  color: colors.lightPrimaryBlue,
                  fontSize: FONT_SIZES.BODY,
                },
              ]}
            >
              Your information is encrypted and HIPAA compliant. Only shared
              with your assigned driver for safety.
            </Text>
          </View>
        </View>

        <View
          style={{
            marginTop: 40,
            marginBottom: 64,
          }}
        >
          <Buttons
            title="Continue"
            rightIcon={<RightArrow />}
            onPress={() => {
              handleBioSubmit();
            }}
            loading={updateProfileMutation.isPending}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default AddInformation;

const styles = StyleSheet.create({
  header: { marginBottom: 24 },

  mainTitle: {
    marginBottom: 8,
  },
  subTitle: {
    lineHeight: 22,
    marginBottom: 20,
  },

  row: { flexDirection: "row", marginBottom: 10 },

  privacyBanner: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 16,
    marginTop: 4,
    alignItems: "flex-start",
  },
  lockIconWrapper: { marginTop: 2 },
  bannerTextContainer: { flex: 1, marginLeft: 12 },
  bannerTitle: { color: "#1E3A8A" },
  bannerSub: { color: "#3B82F6", marginTop: 4, lineHeight: 18 },
});
