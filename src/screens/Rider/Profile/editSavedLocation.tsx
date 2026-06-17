import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Switch,
  ScrollView,
  StatusBar,
} from "react-native";
import {
  ChevronLeft,
  Home,
  Briefcase,
  Hospital,
  MapPin,
  Star,
} from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import useTheme from "../../../hooks/useThemes";
import { commonStyles } from "../../../styles/commonStyles";
import Header from "../../../components/reuseables/header";
import Input from "../../../components/inputs/input";
import GoogleInput from "../../../components/inputs/googleInput";
import Buttons from "../../../components/buttons/buttons";
import { useUpdateSavedLocation } from "../../../hooks/mutations/useUser";
import { UpdateLocationRequest } from "../../../types/user.types";

const EditLocationScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { colors, theme } = useTheme();
  const route = useRoute<any>();
  const commonStyling = commonStyles(colors);
  const [locationType, setLocationType] = useState(route.params.locationType);
  const [isFavorite, setIsFavorite] = useState(true);
  const [name, setname] = useState(route.params.locationName);
  const [form, setForm] = useState({
    label: "",
    address: route.params.address,
    latitude: 0,
    longitude: 0,
    place_id: "",
  });
  const [loadingAddress, setloadingAddress] = useState(false);
  const locationTypes = [
    { id: "home", icon: Home, label: "Home" },
    { id: "work", icon: Briefcase, label: "Work" },
    { id: "hospital", icon: Hospital, label: "Hospital" },
    { id: "custom", icon: MapPin, label: "Custom" },
  ];
  const { mutate, isPending } = useUpdateSavedLocation();

  const onPlaceSelected = (data: any) => {
    setForm((prev) => ({
      ...prev,
      address: data.address,
      latitude: data.latitude,
      longitude: data.longitude,
      place_id: data.place_id,
    }));
  };

  const updateFormFields = (fields: Partial<any>) => {
    setForm((prev) => ({ ...prev, ...fields }));
  };

  const handleSave = () => {
    console.log(form.place_id);
    const payload: UpdateLocationRequest = {
      label: name,
      location_type: locationType === "hospital" ? "medical" : locationType,
      address: form.address,
      latitude: form.latitude,
      longitude: form.longitude,
      place_id: form.place_id,
      notes: "string",
      is_default: isFavorite,
    };

    mutate(
      {
        locationId: route.params.locationId,
        data: payload,
      },
      {
        onSuccess: () => {
          // This only runs if the API call succeeds
          navigation.goBack();
        },
        onError: (error) => {
          // Optional: Specific UI logic for this screen's error state
          console.error("Local Error Handler:", error);
        },
      },
    );
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

      <Header title="Edit Location" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text
          style={[
            styles.subheadline,
            commonStyling.subtitle,
            {
              fontFamily: "Medium",
              fontSize: 13,
            },
          ]}
        >
          Update location details
        </Text>

        <Input
          title="Location Name"
          value={name}
          onChangeText={(val) => {
            setname(val);
          }}
        />

        {/* Address Input */}
        <View
          style={[
            styles.inputGroup,
            {
              marginTop: 8,
            },
          ]}
        >
          <Text
            style={[
              styles.label,
              commonStyling.title,
              {
                fontFamily: "Bold",
                fontSize: 14,
              },
            ]}
          >
            Address
          </Text>
          <GoogleInput
            placeholder=""
            borderColor={colors.krGreen}
            inputValue={form.address}
            setinputValue={(t: string) => updateFormFields({ address: t })}
            dropdown={true}
            onPlaceSelected={onPlaceSelected}
            loading={loadingAddress}
            setLoading={setloadingAddress}
          />
        </View>

        {/* Location Type Selection */}
        <Text
          style={[
            styles.label,
            commonStyling.title,
            {
              fontFamily: "Bold",
              fontSize: 14,
            },
          ]}
        >
          Location Type
        </Text>

        <View
          style={[
            styles.typeList,
            {
              borderColor: colors.lightPrimaryBlueBorder,
              borderWidth: 1,
              padding: 8,
            },
          ]}
        >
          {locationTypes.map((type) => (
            <TouchableOpacity
              key={type.id}
              onPress={() => setLocationType(type.id)}
              style={[
                styles.typeItem,
                locationType === type.id && styles.typeItemActive,
                {
                  borderColor:
                    locationType === type.id
                      ? colors.primaryColor
                      : colors.lightPrimaryBlueBorder,
                  backgroundColor:
                    locationType === type.id
                      ? colors.surfaceElevated
                      : colors.surfacePrimary,
                },
              ]}
            >
              <View
                style={[
                  styles.iconContainer,
                  locationType === type.id && styles.iconContainerActive,
                ]}
              >
                <type.icon
                  size={20}
                  color={locationType === type.id ? "#2563EB" : "#64748B"}
                />
              </View>
              <Text
                style={[
                  styles.typeLabel,

                  {
                    fontSize: 14,
                    fontFamily: "Bold",
                    color:
                      locationType === type.id
                        ? colors.primaryColor
                        : colors.titleText,
                  },
                ]}
              >
                {type.label}
              </Text>
              {locationType === type.id && (
                <View style={styles.radioActive}>
                  <View style={styles.radioInner} />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Favorite Toggle */}
        <View
          style={[
            styles.favoriteContainer,
            {
              borderColor: colors.lightPrimaryBlueBorder,
            },
          ]}
        >
          <View style={styles.favoriteInfo}>
            <View style={styles.starIconBg}>
              <Star size={20} color="#F59E0B" fill="#F59E0B" />
            </View>
            <View style={styles.favoriteTextContent}>
              <Text
                style={[
                  commonStyling.title,
                  {
                    fontSize: 14,
                    fontFamily: "Bold",
                  },
                ]}
              >
                Make Favorite
              </Text>
              <Text
                style={[
                  commonStyling.subtitle,
                  {
                    fontSize: 12,
                  },
                ]}
              >
                Quick access from dashboard
              </Text>
            </View>
          </View>
          <Switch
            value={isFavorite}
            onValueChange={setIsFavorite}
            trackColor={{ false: "#E2E8F0", true: "#3B82F6" }}
            thumbColor="#FFF"
          />
        </View>
      </ScrollView>

      {/* Save Button */}
      <View
        style={[
          styles.footer,
          { borderTopColor: colors.lightPrimaryBlueBorder },
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
    height: 56,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: { fontSize: 18, fontWeight: "800", color: "#0F172A" },
  scrollContent: { padding: 20 },
  subheadline: { marginBottom: 16 },

  label: { marginBottom: 8 },
  inputGroup: { marginBottom: 24 },
  textInput: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    color: "#1E293B",
    fontWeight: "500",
  },
  textArea: { height: 80, textAlignVertical: "top" },

  typeList: { marginBottom: 24, borderRadius: 16, overflow: "hidden" },
  typeItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  typeItemActive: {
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#3B82F6",
    borderRadius: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  iconContainerActive: { backgroundColor: "#FFF" },
  typeLabel: { flex: 1 },
  radioActive: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#FFF",
  },

  favoriteContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderWidth: 1,
    borderRadius: 16,
  },
  favoriteInfo: { flexDirection: "row", alignItems: "center", gap: 12 },
  starIconBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FEF3C7",
    justifyContent: "center",
    alignItems: "center",
  },
  favoriteTextContent: { gap: 2 },

  footer: { padding: 20, borderTopWidth: 1 },
  saveButton: {
    backgroundColor: "#A5C1F9", // Lightened blue matches the screenshot button state
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  saveButtonText: { color: "#FFF", fontSize: 16, fontWeight: "700" },
});

export default EditLocationScreen;
