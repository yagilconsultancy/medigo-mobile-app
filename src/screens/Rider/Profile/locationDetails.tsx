import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  Switch,
  ScrollView,
  Dimensions,
  Alert,
  ActivityIndicator,
} from "react-native";
import { MoreVertical, Home, Star, MapPin } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import useTheme from "../../../hooks/useThemes";
import { commonStyles } from "../../../styles/commonStyles";
import Header from "../../../components/reuseables/header";
import MapScreen from "../../../components/map/map";
import { useSavedLocationDetails } from "../../../hooks/queries/useSavedLocationDetails";
import {
  useDeleteSavedLocation,
  useUpdateSavedLocation,
} from "../../../hooks/mutations/useUser";
import { LocationDetailsSkeleton } from "../../../components/skelentonAnimation/locationDetailsSkelenton";
import { useRideStore } from "../../../store/useRideStore";
import Toast from "react-native-toast-message";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const SNAP_POINTS = [SCREEN_HEIGHT * 0.5, SCREEN_HEIGHT * 0.3];
const BUTTON_GAP = 16;
const LocationDetailsScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { colors, theme } = useTheme();
  const commonStyling = commonStyles(colors);
  const [sheetHeight, setSheetHeight] = useState(SNAP_POINTS[0]);
  const route = useRoute<any>();
  const { locationId } = route.params;
  const [showOptions, setshowOptions] = useState(false);
  const { data, isLoading, error } = useSavedLocationDetails(locationId);
  const location = data?.data;
  const [isFavorite, setIsFavorite] = useState(false);
  const [isDefaultPickup, setIsDefaultPickup] = useState(location?.is_default);
  const { mutate: deleteLocation, isPending: isDeleting } =
    useDeleteSavedLocation();
  const { mutate: updateLocation, isPending: isUpdatingLocation } =
    useUpdateSavedLocation();
  const setPickup = useRideStore((state) => state.setPickup);

  useEffect(() => {
    setIsDefaultPickup(location?.is_default ?? false);
  }, [location?.is_default]);

  const getLocationPoint = () => ({
    address: location?.address ?? "",
    latitude: location?.latitude ?? null,
    longitude: location?.longitude ?? null,
  });

  const showPickupSuccessToast = () => {
    Toast.show({
      type: "tripToast",
      text1: "Pickup location set",
      text2: "This location will be used for your next ride.",
    });
  };

  const persistDefaultPickup = (value: boolean) => {
    if (!location) return;

    setIsDefaultPickup(value);

    updateLocation({
      locationId,
      showAlert: false,
      data: {
        label: location.label,
        location_type: location.location_type,
        address: location.address,
        latitude: location.latitude,
        longitude: location.longitude,
        place_id: location.place_id,
        notes: location.notes,
        is_default: value,
      },
    });

    if (value) {
      setPickup(getLocationPoint());
    }
  };

  const handleSetAsPickupLocation = () => {
    if (!location) return;

    setPickup(getLocationPoint());
    showPickupSuccessToast();

    if (!isDefaultPickup) {
      persistDefaultPickup(true);
    }
  };

  const handleBookRideToLocation = () => {
    handleSetAsPickupLocation();
    navigation.navigate("RiderRideDetailsStack", {
      screen: "BookARide",
    });
  };

  const confirmDelete = () => {
    Alert.alert(
      "Delete Location",
      "Are you sure you want to remove this saved location?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () =>
            deleteLocation(locationId, {
              onSuccess: () => {
                navigation.goBack();
              },
            }),
        },
      ],
    );
  };

  if (isLoading) {
    return <LocationDetailsSkeleton />;
  }

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
        title="Location Details"
        rightText={
          <TouchableOpacity
            style={[
              styles.backButton,
              { backgroundColor: colors.surfaceSecondary },
            ]}
            onPress={() => {
              setshowOptions(true);
            }}
          >
            <MoreVertical color={colors.titleText} size={24} />
          </TouchableOpacity>
        }
      />

      {showOptions && (
        <View style={dropdownStyle(colors)}>
          <Text
            style={dropdownTextStyle(colors, commonStyling)}
            onPress={() => {
              navigation.navigate("RiderProfileContentsStack", {
                screen: "EditLocationScreen",
                params: {
                  locationId: locationId,
                  address: location?.address,
                  locationName: location?.label,
                  locationType: location?.location_type,
                },
              });
              setshowOptions(false);
            }}
          >
            Edit
          </Text>
          <Text
            style={dropdownTextStyle(colors, commonStyling)}
            onPress={() => {
              confirmDelete();
              setshowOptions(false);
            }}
          >
            Delete
          </Text>
        </View>
      )}

      <ScrollView>
        <View style={styles.content}>
          <Text
            style={[
              styles.description,
              commonStyling.subtitle,
              { fontSize: 14, fontFamily: "Medium" },
            ]}
          >
            Manage this pickup or destination
          </Text>

          <View style={styles.sectionHeader}>
            <Text
              style={[
                styles.sectionLabel,
                commonStyling.title,
                { fontSize: 14, fontFamily: "Bold" },
              ]}
            >
              Location
            </Text>
          </View>
          <View
            style={[
              styles.mainCard,
              {
                borderColor: colors.lightPrimaryBlueBorder,
              },
            ]}
          >
            <View style={styles.locationHeader}>
              <View
                style={[
                  styles.iconBox,
                  {
                    backgroundColor: colors.homelightPrimaryBlue50,
                  },
                ]}
              >
                <Home size={24} color="#3B82F6" />
              </View>
              <View style={styles.titleWrapper}>
                <Text
                  style={[
                    commonStyling.title,
                    {
                      fontSize: 14,
                      fontFamily: "Bold",
                    },
                  ]}
                >
                  {location?.location_type}
                </Text>
                <Text
                  style={[
                    commonStyling.subtitle,
                    { fontSize: 12, marginTop: 2, width: 150 },
                  ]}
                  numberOfLines={2}
                >
                  {location?.address}
                </Text>
              </View>
              <View style={styles.favoriteBadge}>
                <Star size={12} color="#F59E0B" fill="#F59E0B" />
                <Text style={styles.favoriteText}>Favorite</Text>
              </View>
            </View>

            {/* Preference Toggles */}
            <View style={styles.toggleContainer}>
              <View
                style={[
                  styles.toggleRow,
                  {
                    borderColor: colors.lightPrimaryBlueBorder,
                  },
                ]}
              >
                <View
                  style={[
                    styles.toggleIconCircle,
                    {
                      backgroundColor: colors.homelightPrimaryBlue50,
                    },
                  ]}
                >
                  <Star size={20} color="#F59E0B" />
                </View>
                <View style={styles.toggleTextContent}>
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
                      { fontSize: 12, marginTop: 2 },
                    ]}
                  >
                    Quick access from dashboard
                  </Text>
                </View>
                <Switch
                  value={isFavorite}
                  onValueChange={setIsFavorite}
                  trackColor={{ false: "#E2E8F0", true: "#3B82F6" }}
                />
              </View>

              <View
                style={[
                  styles.toggleRow,
                  {
                    borderColor: colors.lightPrimaryBlueBorder,
                    marginTop: 12,
                  },
                ]}
              >
                <View
                  style={[
                    styles.toggleIconCircle,
                    {
                      backgroundColor: colors.homelightPrimaryBlue50,
                    },
                  ]}
                >
                  <MapPin size={20} color="#94A3B8" />
                </View>
                <View style={styles.toggleTextContent}>
                  <Text
                    style={[
                      commonStyling.title,
                      {
                        fontSize: 14,
                        fontFamily: "Bold",
                      },
                    ]}
                  >
                    "Use as Pickup for Next Ride"
                  </Text>
                  <Text
                    style={[
                      commonStyling.subtitle,
                      { fontSize: 12, marginTop: 2 },
                    ]}
                  >
                    Auto-select for future bookings
                  </Text>
                </View>
                <Switch
                  value={isDefaultPickup}
                  onValueChange={persistDefaultPickup}
                  trackColor={{ false: "#E2E8F0", true: "#3B82F6" }}
                />
              </View>
            </View>
          </View>
          {/* Map Preview Section */}
          <Text
            style={[
              styles.sectionLabel,
              commonStyling.title,
              { fontSize: 14, fontFamily: "Bold", marginTop: 24 },
            ]}
          >
            Map Preview
          </Text>

          <View style={styles.mapContainer}>
            <MapScreen
              bottomOffset={sheetHeight + BUTTON_GAP}
              pickup={{
                latitude: location?.latitude ?? 0,
                longitude: location?.longitude ?? 0,
              }}
            />
          </View>

          {/* Action Buttons */}
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={handleBookRideToLocation}
          >
            {isUpdatingLocation ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.primaryBtnText}>
                Book Ride to This Location
              </Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={handleSetAsPickupLocation}
          >
            {isUpdatingLocation ? (
              <ActivityIndicator color="#3B82F6" />
            ) : (
              <Text style={styles.secondaryBtnText}>
                Set as Pickup Location
              </Text>
            )}
          </TouchableOpacity>
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
    paddingVertical: 12,
  },
  headerTitle: { fontSize: 18, fontWeight: "800", color: "#1E293B" },
  headerBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  content: { flex: 1, paddingHorizontal: 20 },
  subtext: { fontSize: 14, color: "#64748B", marginBottom: 24 },
  sectionLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 12,
  },

  mainCard: {
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
  },
  locationHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  iconBox: {
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  titleWrapper: { flex: 1, marginLeft: 16 },
  favoriteBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  favoriteText: { fontSize: 11, fontWeight: "700", color: "#D97706" },

  toggleContainer: { gap: 8 },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
  },
  toggleIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  toggleTextContent: { flex: 1, marginLeft: 12 },
  toggleTitle: { fontSize: 14, fontWeight: "700", color: "#1E293B" },
  toggleSub: { fontSize: 11, color: "#94A3B8", marginTop: 2 },

  mapContainer: {
    height: 200,
    width: "100%",
    borderRadius: 16,
    overflow: "hidden",
    marginTop: 12,
    marginBottom: 40,
    backgroundColor: "#e5e5e5",
  },

  mapGridLines: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  mapPinOuter: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#3B82F6",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#FFF",
  },
  mapPinShadow: {
    shadowColor: "#3B82F6",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  mapOverlay: {
    position: "absolute",
    bottom: 12,
    left: 12,
    right: 12,
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  overlayText: { fontSize: 13, fontWeight: "600", color: "#1E293B" },

  footer: { marginTop: "auto", marginBottom: 20, gap: 12 },
  primaryBtn: {
    height: 56,
    backgroundColor: "#3B82F6",
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  primaryBtnText: { color: "#FFF", fontSize: 15, fontWeight: "800" },
  secondaryBtn: {
    height: 56,
    backgroundColor: "#FFF",
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#3B82F6",
  },
  secondaryBtnText: { color: "#3B82F6", fontSize: 15, fontWeight: "800" },
  description: {
    marginBottom: 24,
    textAlign: "left",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
});

const dropdownStyle = (colors: any) => ({
  backgroundColor: colors.surfacePrimary,
  position: "absolute" as const,
  right: 20,
  top: 120,
  zIndex: 999,
  borderWidth: 1,
  paddingHorizontal: 8,
  borderColor: colors.lightPrimaryBlueBorder,
  borderRadius: 8,
});

const dropdownTextStyle = (colors: any, commonStyling: any) => [
  commonStyling.subtitle,
  { color: colors.titleText, paddingVertical: 8, paddingHorizontal: 4 },
];

export default LocationDetailsScreen;
