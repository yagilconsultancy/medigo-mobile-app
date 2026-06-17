import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  StatusBar,
} from "react-native";
import { ChevronLeft, Camera, AlertCircle } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUserStore } from "../../../store/userStore";
import useTheme from "../../../hooks/useThemes";
import { commonStyles } from "../../../styles/commonStyles";
import { useDriverProfile } from "../../../hooks/queries/useDriverProfile";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Header from "../../../components/reuseables/header";
import Input from "../../../components/inputs/input";
import Buttons from "../../../components/buttons/buttons";
import { useDriverVehicle } from "../../../hooks/queries/useDriverVehicleDetails";
import { useUpdateDriverVehicle } from "../../../hooks/mutations/useUser";
import * as ImagePicker from "expo-image-picker";

const EditVehicleDetails = () => {
  const { user } = useUserStore();
  const { colors, theme } = useTheme();
  const commonStyling = commonStyles(colors);
  const { data, isLoading } = useDriverVehicle();
  const vehicle = data?.data;
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [makeModel, setMakeModel] = useState(vehicle?.vehicle_make);
  const [color, setColor] = useState(vehicle?.vehicle_color);
  const [plate, setPlate] = useState(vehicle?.vehicle_plate);
  const [year, setYear] = useState(vehicle?.vehicle_year);
  const [avatar_url, setavatar_url] = useState("");

  const { mutate: updateVehicle, isPending } = useUpdateDriverVehicle();

  const handleSaveVehicle = () => {
    const formData = {
      vehicle_make: makeModel,
      vehicle_year: year,
      vehicle_plate: plate,
      vehicle_color: color,
    };

    updateVehicle(formData, {
      onSuccess: () => {
        // Navigate back to the Profile or Vehicle view screen
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
      setavatar_url(result.assets[0].uri);
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

      <Header title="Edit Vehicle Details" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Circular Vehicle Photo Section */}
        <View style={styles.photoSection}>
          <View style={styles.imageContainer}>
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=200&auto=format&fit=crop",
              }}
              style={styles.vehicleImage}
            />
            <TouchableOpacity style={styles.cameraBadge} onPress={pickImage}>
              <Camera size={18} color="#FFF" />
            </TouchableOpacity>
          </View>
          <Text
            style={[
              styles.photoSubtext,
              commonStyling.subtitle,
              {
                fontSize: 14,
              },
            ]}
          >
            Upload a clear photo of your vehicle
          </Text>
        </View>

        {/* Warning Banner */}
        <View style={styles.warningBanner}>
          <AlertCircle size={20} color="#B45309" />
          <Text style={styles.warningText}>
            Updating vehicle details may require re-verification.
          </Text>
        </View>

        {/* Form Fields Section */}
        <Text
          style={[
            styles.sectionTitle,
            commonStyling.title,
            {
              fontSize: 18,
              fontFamily: "Bold",
            },
          ]}
        >
          Vehicle Information
        </Text>

        <View style={styles.inputGroup}>
          <Input
            title="Vehicle Make & Model"
            value={makeModel}
            onChangeText={setMakeModel}
            placeholder="e.g. 2022 Toyota Camry"
          />
        </View>

        <View style={styles.inputGroup}>
          <Input
            title="Color"
            value={color}
            onChangeText={setColor}
            placeholder="e.g. Silver"
          />
        </View>

        <View style={styles.inputGroup}>
          <Input
            title="License Plate"
            value={plate}
            onChangeText={setPlate}
            placeholder="e.g. ABC 1234"
          />
        </View>

        <View style={styles.inputGroup}>
          <Input
            title="Year"
            value={year}
            onChangeText={setYear}
            keyboardType="numeric"
            placeholder="e.g. 2022"
          />
        </View>

        <View style={{ height: 50 }} />
      </ScrollView>

      {/* Footer Action Button */}
      <View style={[styles.footer, { backgroundColor: colors.surfacePrimary }]}>
        <Buttons
          title="Save Change"
          onPress={() => {
            handleSaveVehicle();
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

  photoSection: { alignItems: "center", marginBottom: 24 },
  imageContainer: { position: "relative" },
  vehicleImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#F1F5F9",
  },
  cameraBadge: {
    position: "absolute",
    bottom: 4,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#3B82F6",
    justifyContent: "center",
    alignItems: "center",
  },
  photoSubtext: {
    marginTop: 16,
  },

  warningBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFBEB",
    padding: 16,
    borderRadius: 14,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: "#FEF3C7",
    borderLeftWidth: 4,
    borderLeftColor: "#F59E0B",
  },
  warningText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: "#92400E",
    lineHeight: 18,
    fontFamily: "Regular",
  },

  sectionTitle: {
    marginBottom: 20,
  },

  inputGroup: { marginBottom: 20 },
  label: { fontSize: 13, fontWeight: "700", color: "#1E293B", marginBottom: 8 },
  input: {
    height: 54,
    backgroundColor: "#FFF",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 15,
    fontWeight: "500",
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
  saveButton: {
    height: 56,
    borderRadius: 28,
    backgroundColor: "#93C5FD", // Light blue per design state
    justifyContent: "center",
    alignItems: "center",
  },
  saveButtonText: { color: "#FFF", fontSize: 16, fontWeight: "700" },
});

export default EditVehicleDetails;
