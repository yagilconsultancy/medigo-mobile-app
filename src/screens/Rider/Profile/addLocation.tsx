import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Switch,
} from "react-native";
import {
  X,
  Search,
  Home,
  Building2,
  Briefcase,
  MapPin,
  Star,
  Zap,
} from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import useTheme from "../../../hooks/useThemes";
import { commonStyles } from "../../../styles/commonStyles";
import Header from "../../../components/reuseables/header";
import { useCreateLocationMutation } from "../../../hooks/mutations/useUser";
import { CreateLocationPayload } from "../../../types/user.types";
import Buttons from "../../../components/buttons/buttons";
import GoogleInput from "../../../components/inputs/googleInput";

const AddLocationScreen = () => {
  const [locationType, setLocationType] = useState("work");
  const [isFavorite, setIsFavorite] = useState(true);
  const [isDefault, setIsDefault] = useState(true);
  const [loading, setloading] = useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { colors, theme } = useTheme();
  const commonStyling = commonStyles(colors);
  const [form, setForm] = useState({
    label: "",
    address: "",
    latitude: 0,
    longitude: 0,
  });

  const createLocationMutation = useCreateLocationMutation();

  const handleSaveAddress = () => {
    const newLocation: CreateLocationPayload = {
      label: form.label,
      location_type: locationType,
      address: form.address,
      latitude: form.latitude,
      longitude: form.longitude,
      is_default: isDefault,
    };

    createLocationMutation.mutate(newLocation, {
      onSuccess: () => {
        navigation.goBack();
      },
    });
  };

  const updateFormFields = (fields: Partial<any>) => {
    setForm((prev) => ({ ...prev, ...fields }));
  };

  const onPlaceSelected = (data: any) => {
    setForm((prev) => ({
      ...prev,
      address: data.address,
      latitude: data.latitude,
      longitude: data.longitude,
    }));
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

      <Header title="Add New Location" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text
          style={[
            commonStyling.subtitle,
            { marginBottom: 24, fontSize: 14, fontFamily: "Medium" },
          ]}
        >
          Save a place for faster booking
        </Text>

        {/* Input: Location Name */}
        <Text
          style={[
            styles.inputLabel,
            commonStyling.title,
            {
              fontFamily: "SemiBold",
              fontSize: 14,
            },
          ]}
        >
          Location Name <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.surfaceSecondary,
              color: colors.subTitleText,
            },
          ]}
          placeholder="Mom's house"
          placeholderTextColor={colors.subTitleText}
          value={form.label}
          onChangeText={(text) => updateFormFields({ label: text })}
        />

        {/* Input: Address with Search Icon */}
        <Text
          style={[
            styles.inputLabel,
            commonStyling.title,
            {
              fontFamily: "SemiBold",
              fontSize: 14,
            },
          ]}
        >
          Address <Text style={styles.required}>*</Text>
        </Text>
        <GoogleInput
          placeholder={`2847 Maple Avenue`}
          borderColor={colors.krGreen}
          inputValue={form.address}
          setinputValue={(t: string) => updateFormFields({ address: t })}
          dropdown={true}
          onPlaceSelected={onPlaceSelected}
          loading={loading}
          setLoading={setloading}
        />

        {/* Location Type Selection Grid */}
        <Text
          style={[
            styles.inputLabel,
            commonStyling.title,
            {
              fontFamily: "SemiBold",
              fontSize: 14,
              marginTop: 24,
            },
          ]}
        >
          Location Type
        </Text>
        <View style={styles.typeGrid}>
          <TypeTile
            icon={
              <Home
                size={20}
                color={locationType === "home" ? "#3B82F6" : "#94A3B8"}
              />
            }
            label="Home"
            selected={locationType === "home"}
            onPress={() => setLocationType("home")}
          />
          <TypeTile
            icon={
              <Building2
                size={20}
                color={locationType === "medical" ? "#3B82F6" : "#94A3B8"}
              />
            }
            label="Hospital"
            selected={locationType === "medical"}
            onPress={() => setLocationType("medical")}
          />
          <TypeTile
            icon={
              <Briefcase
                size={20}
                color={locationType === "work" ? "#3B82F6" : "#94A3B8"}
              />
            }
            label="Work"
            selected={locationType === "work"}
            onPress={() => setLocationType("work")}
          />
          <TypeTile
            icon={
              <MapPin
                size={20}
                color={locationType === "custom" ? "#3B82F6" : "#94A3B8"}
              />
            }
            label="Custom"
            selected={locationType === "custom"}
            onPress={() => setLocationType("custom")}
          />
        </View>

        {/* Preference Toggles */}
        <View style={styles.toggleGroup}>
          <PreferenceToggle
            icon={<Star size={18} color="#94A3B8" />}
            title="Favorite"
            sub="Quick access from dashboard"
            value={isFavorite}
            onToggle={setIsFavorite}
          />
          <PreferenceToggle
            icon={<MapPin size={18} color="#94A3B8" />}
            title="Set as Default Pickup"
            sub="Auto-fill for new rides"
            value={isDefault}
            onToggle={setIsDefault}
          />
        </View>

        {/* Informational Banner */}
        <View
          style={[
            styles.infoBanner,
            {
              backgroundColor: colors.homelightPrimaryBlue50,
            },
          ]}
        >
          <View
            style={[
              styles.infoIconCircle,
              {
                backgroundColor: colors.surfaceElevated,
              },
            ]}
          >
            <MapPin size={16} color="#3B82F6" />
          </View>
          <View style={styles.bannerTextContent}>
            <Text
              style={[
                commonStyling.title,
                {
                  fontSize: 14,
                  fontFamily: "SemiBold",
                },
              ]}
            >
              Quick Access
            </Text>
            <Text
              style={[
                commonStyling.subtitle,
                styles.bannerSub,
                {
                  fontSize: 12,
                },
              ]}
            >
              Saved locations appear on your dashboard for quick booking.
            </Text>
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton}>
          <Buttons
            title="Save"
            onPress={handleSaveAddress}
            loading={createLocationMutation.isPending}
          />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

// --- Sub-components ---

const TypeTile = ({ icon, label, selected, onPress }: any) => {
  const { colors } = useTheme();
  const commonStyling = commonStyles(colors);

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.tile,
        {
          backgroundColor: selected
            ? colors.surfaceElevated
            : colors.homelightPrimaryBlue50,
          borderColor: selected
            ? colors.primaryColor
            : colors.lightPrimaryBlueBorder,
        },
      ]}
    >
      {icon}
      <Text
        style={[
          styles.tileLabel,
          selected && styles.tileLabelSelected,
          commonStyling.subtitle,
          { fontFamily: "Medium", fontSize: 12 },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const PreferenceToggle = ({ icon, title, sub, value, onToggle }: any) => {
  const { colors, theme } = useTheme();
  const commonStyling = commonStyles(colors);
  return (
    <View
      style={[
        styles.toggleRow,
        {
          backgroundColor: colors.homelightPrimaryBlue50,
        },
      ]}
    >
      <View
        style={[
          styles.toggleIconWrapper,
          {
            backgroundColor: colors.surfaceElevated,
          },
        ]}
      >
        {icon}
      </View>
      <View style={styles.toggleTextWrapper}>
        <Text
          style={[
            commonStyling.title,
            {
              fontFamily: "SemiBold",
              fontSize: 14,
            },
          ]}
        >
          {title}
        </Text>
        <Text
          style={[
            commonStyling.subtitle,
            styles.toggleSub,
            {
              fontSize: 12,
            },
          ]}
        >
          {sub}
        </Text>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: "#E2E8F0", true: "#3B82F6" }}
        thumbColor="#FFFFFF"
      />
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
  headerTitle: { fontSize: 18, fontWeight: "800", color: "#1E293B" },
  closeButton: { padding: 4 },

  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },

  inputLabel: {
    marginBottom: 12,
    marginTop: 16,
  },
  required: { color: "#EF4444" },
  input: {
    height: 56,
    borderRadius: 16,
    paddingHorizontal: 16,
    fontSize: 15,
  },

  searchContainer: {
    height: 56,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 15, color: "#1E293B" },

  typeGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginTop: 4 },
  tile: {
    width: "48%",
    height: 80,
    borderRadius: 16,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  tileLabel: {
    marginTop: 8,
  },
  tileLabelSelected: { color: "#3B82F6" },

  toggleGroup: { marginTop: 24, gap: 12 },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
  },
  toggleIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  toggleTextWrapper: { flex: 1, marginLeft: 12 },
  toggleSub: { marginTop: 2 },

  infoBanner: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 16,
    marginTop: 24,
  },
  infoIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  bannerTextContent: { flex: 1, marginLeft: 12 },
  bannerSub: { marginTop: 4, lineHeight: 18 },

  saveButton: {
    marginTop: 32,
  },
  saveButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "800" },
});

export default AddLocationScreen;
