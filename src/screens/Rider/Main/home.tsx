import React, { useCallback, useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Dimensions,
  Alert,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Bell,
  MapPin,
  Calendar,
  Plus,
  Headphones,
} from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import useTheme from "../../../hooks/useThemes";
import { commonStyles } from "../../../styles/commonStyles";
import { FONT_SIZES } from "../../../constants/sizes";
import Buttons from "../../../components/buttons/buttons";
import { format } from "date-fns";
import { useUserProfile } from "../../../hooks/queries/useUserProfile";
import { useSavedLocations } from "../../../hooks/queries/useSavedLocations";
import { getLocationTypeStyles } from "../../../utils/getLocationTypeStyles";
import LocationCard from "../../../components/cards/locationCard";
import MapScreen from "../../../components/map/map";
import { RiderHomeSkeleton } from "../../../components/skelentonAnimation/riderHomeSkelento";
import { useMyRides } from "../../../hooks/queries/useMyRides";
import UpcomingRideCard from "../../../components/cards/upcomingRidesCard";
import { useRideStore } from "../../../store/useRideStore";
import GoogleInput from "../../../components/inputs/googleInput";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const SNAP_POINTS = [SCREEN_HEIGHT * 0.5, SCREEN_HEIGHT * 0.3];
const BUTTON_GAP = 16;

const RiderHomeScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { data, isLoading, refetch: refetchProfile } = useUserProfile();
  const {
    data: savedLocations,
    isLoading: loadingSavedLocation,
    refetch: refetchSavedLocations,
  } = useSavedLocations();
  const {
    data: upcomingData,
    isLoading: loadingUpcoming,
    refetch: refetchUpcomingRides,
  } = useMyRides();
  const { colors, theme } = useTheme();
  const commonStyling = commonStyles(colors);
  const [refreshing, setRefreshing] = useState(false);
  const [sheetHeight, setSheetHeight] = useState(SNAP_POINTS[0]);
  const pickup = useRideStore((state) => state.pickup);
  const destination = useRideStore((state) => state.destination);
  const setPickup = useRideStore((state) => state.setPickup);
  const setDestination = useRideStore((state) => state.setDestination);
  const setScheduledTrip = useRideStore((state) => state.setScheduledTrip);
  const [pickupInput, setPickupInput] = useState(pickup?.address ?? "");
  const [destinationInput, setDestinationInput] = useState(
    destination?.address ?? "",
  );
  const [loadingPickup, setLoadingPickup] = useState(false);
  const [loadingDestination, setLoadingDestination] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        refetchProfile(),
        refetchSavedLocations(),
        refetchUpcomingRides(),
      ]);
    } finally {
      setRefreshing(false);
    }
  }, [refetchProfile, refetchSavedLocations, refetchUpcomingRides]);

  useEffect(() => {
    setPickupInput(pickup?.address ?? "");
  }, [pickup?.address]);

  useEffect(() => {
    if (pickup?.address || !savedLocations?.data?.length) return;

    const defaultPickup = savedLocations.data.find(
      (location) => location.is_default,
    );

    if (!defaultPickup) return;

    setPickup({
      address: defaultPickup.address,
      latitude: defaultPickup.latitude,
      longitude: defaultPickup.longitude,
    });
  }, [pickup?.address, savedLocations?.data, setPickup]);

  useEffect(() => {
    setDestinationInput(destination?.address ?? "");
  }, [destination?.address]);

  const handleQuickBook = (scheduled: boolean) => {
    if (
      !pickup?.address ||
      pickup.latitude === null ||
      pickup.longitude === null
    ) {
      Alert.alert("Please select a pickup location");
      return;
    }

    if (
      !destination?.address ||
      destination.latitude === null ||
      destination.longitude === null
    ) {
      Alert.alert("Please select where you are going");
      return;
    }

    setScheduledTrip(scheduled);
    navigation.navigate("RiderRideDetailsStack", {
      screen: "BookARide",
      params: { scheduledTrip: scheduled },
    });
  };

  useEffect(() => {
    if (!isLoading && data) {
      if (!data.data.first_name) {
        navigation.navigate("Auth", {
          screen: "AddInformation",
        });
      }
    }
  }, [data, isLoading]);

  if (isLoading || loadingSavedLocation) {
    return <RiderHomeSkeleton />;
  }

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surfacePrimary,
        },
      ]}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar
          barStyle={theme === "light" ? "dark-content" : "light-content"}
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primaryColor}
              colors={[colors.primaryColor]}
            />
          }
        >
          {/* Header Profile Section */}
          <View style={styles.header}>
            <View style={styles.profileInfo}>
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
              <View style={styles.greetingBox}>
                <Text
                  style={[
                    commonStyling.subtitle,
                    {
                      fontSize: 14,
                    },
                  ]}
                >
                  Good afternoon,
                </Text>
                <Text
                  style={[
                    commonStyling.title,
                    {
                      fontSize: 24,
                      fontFamily: "Bold",
                    },
                  ]}
                >
                  {data?.data.first_name}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={[
                styles.notificationBtn,
                {
                  backgroundColor: colors.surfacePrimary,
                },
              ]}
              onPress={() => {
                navigation.navigate("RiderNotificationStack");
              }}
            >
              <Bell color={colors.titleText} size={24} />
              <View style={styles.notifBadge} />
            </TouchableOpacity>
          </View>

          {/* Quick Book Card */}
          <View
            style={[
              styles.mainCard,
              {
                backgroundColor: colors.homelightPrimaryBlue50,
                borderColor: colors.lightPrimaryBlueBorder,
              },
            ]}
          >
            <Text
              style={[
                commonStyling.title,
                {
                  fontSize: 20,
                  fontFamily: "Bold",
                  marginBottom: 16,
                },
              ]}
            >
              Quick Book a Ride
            </Text>

            <View style={styles.inputWrapper}>
              <View
                style={[
                  styles.locationInputWrapper,
                  {
                    borderColor: colors.lightPrimaryBlueBorder,
                    borderWidth: 1,
                    borderRadius: 10,
                  },
                ]}
              >
                <View style={styles.iconCircleBlue}>
                  <MapPin color="#3B82F6" size={18} />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text
                    style={[
                      commonStyling.subtitle,
                      {
                        fontSize: FONT_SIZES.SMALL,
                        marginBottom: 4,
                      },
                    ]}
                  >
                    Pickup Location
                  </Text>
                  <GoogleInput
                    placeholder="Enter pickup location"
                    inputValue={pickupInput}
                    setinputValue={(text) => {
                      setPickupInput(text);
                      setPickup({
                        address: text,
                        latitude: null,
                        longitude: null,
                      });
                    }}
                    dropdown={true}
                    onPlaceSelected={(place) => {
                      setPickup({
                        address: place.address,
                        latitude: place.latitude,
                        longitude: place.longitude,
                      });
                      setPickupInput(place.address);
                    }}
                    loading={loadingPickup}
                    setLoading={setLoadingPickup}
                  />
                </View>
              </View>

              <View
                style={[
                  styles.destinationInputWrapper,
                  {
                    borderWidth: 1,
                    borderColor: colors.lightPrimaryBlueBorder,
                  },
                ]}
              >
                <GoogleInput
                  placeholder="Where to?"
                  inputValue={destinationInput}
                  setinputValue={(text) => {
                    setDestinationInput(text);
                    setDestination({
                      address: text,
                      latitude: null,
                      longitude: null,
                    });
                  }}
                  dropdown={true}
                  onPlaceSelected={(place) => {
                    setDestination({
                      address: place.address,
                      latitude: place.latitude,
                      longitude: place.longitude,
                    });
                    setDestinationInput(place.address);
                  }}
                  loading={loadingDestination}
                  setLoading={setLoadingDestination}
                />
              </View>

              <TouchableOpacity
                style={[
                  styles.scheduleBox,
                  {
                    borderColor: colors.lightPrimaryBlueBorder,
                    borderWidth: 1,
                    borderRadius: 10,
                  },
                ]}
                onPress={() => {
                  handleQuickBook(true);
                }}
              >
                <View style={styles.rowCenter}>
                  <Calendar color="#3B82F6" size={20} />
                  <Text
                    style={[
                      styles.scheduleText,
                      commonStyling.subtitle,
                      {
                        fontSize: FONT_SIZES.BODY,
                      },
                    ]}
                  >
                    Schedule for later
                  </Text>
                </View>
                <Plus color="#94A3B8" size={18} />
              </TouchableOpacity>

              <Buttons
                title="Book Now"
                onPress={() => {
                  handleQuickBook(false);
                }}
              />
            </View>
          </View>

          {/* Upcoming Rides Section */}
          <View style={styles.sectionHeader}>
            <Text
              style={[
                commonStyling.title,
                {
                  fontSize: 18,
                  fontFamily: "Bold",
                },
              ]}
            >
              Upcoming Rides
            </Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("RiderRideStack", {
                  screen: "MyRidesScreen",
                });
              }}
            >
              <Text
                style={[
                  commonStyling.subtitle,
                  {
                    fontSize: 14,
                    color: colors.primaryColor,
                    fontFamily: "Medium",
                  },
                ]}
              >
                View All
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={[
              styles.emptyStateCard,
              {
                backgroundColor: colors.homelightPrimaryBlue50,
                borderColor: colors.lightPrimaryBlueBorder,
              },
            ]}
          >
            {upcomingData?.data && upcomingData.data.length > 0 ? (
              upcomingData.data.slice(0, 2).map((loc) => {
                return (
                  <UpcomingRideCard
                    key={loc.id}
                    ride={loc}
                    onPress={() => {
                      navigation.navigate("RiderRideDetailsStack", {
                        screen: "RideDetails",
                        params: { id: loc.id },
                      });
                    }}
                  />
                );
              })
            ) : (
              <View
                style={{
                  alignItems: "center",
                  padding: 32,
                }}
              >
                <Text
                  style={[
                    commonStyling.subtitle,
                    {
                      fontSize: 14,
                      fontFamily: "SemiBold",
                    },
                  ]}
                >
                  No Upcoming Rides
                </Text>
                <Text
                  style={[
                    styles.emptySub,
                    commonStyling.title,
                    {
                      fontSize: 12,
                      fontFamily: "Regular",
                    },
                  ]}
                >
                  You do not have any upcoming ride yet.
                </Text>
                <TouchableOpacity
                  style={styles.emptyAction}
                  onPress={() => {
                    navigation.navigate("RiderRideDetailsStack", {
                      screen: "BookARide",
                    });
                  }}
                >
                  <Plus color="#3B82F6" size={16} />
                  <Text
                    style={[
                      commonStyling.subtitle,
                      {
                        fontSize: 12,
                        color: colors.primaryColor,
                        fontFamily: "Medium",
                      },
                    ]}
                  >
                    Book Ride
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Saved Locations Section */}
          <Text
            style={[
              commonStyling.title,
              {
                fontSize: 18,
                fontFamily: "Bold",
                marginBottom: 16,
              },
            ]}
          >
            Saved Locations
          </Text>
          <View
            style={[
              styles.emptyStateCard,
              {
                backgroundColor: colors.homelightPrimaryBlue50,
                borderColor: colors.lightPrimaryBlueBorder,
                alignItems: "center",
              },
            ]}
          >
            {savedLocations?.data && savedLocations.data.length > 0 ? (
              savedLocations.data.map((loc) => {
                const { icon, bg } = getLocationTypeStyles(loc.location_type);
                return (
                  <LocationCard
                    key={loc.id}
                    icon={icon}
                    bgColor={bg}
                    title={loc.label}
                    address={loc.address}
                    lastUsed={`Saved ${format(new Date(loc.created_at), "MMM d, yyyy")}`}
                    onPress={() =>
                      navigation.navigate("RiderProfileContentsStack", {
                        screen: "LocationDetailsScreen",
                        params: {
                          locationId: loc.id,
                        },
                      })
                    }
                  />
                );
              })
            ) : (
              <View
                style={{
                  alignItems: "center",
                  padding: 32,
                }}
              >
                <Text
                  style={[
                    commonStyling.subtitle,
                    {
                      fontSize: 14,
                      fontFamily: "SemiBold",
                    },
                  ]}
                >
                  No Saved Location
                </Text>
                <Text
                  style={[
                    styles.emptySub,
                    commonStyling.title,
                    {
                      fontSize: FONT_SIZES.BODY,
                    },
                  ]}
                >
                  You do not have any saved location yet.
                </Text>
                <TouchableOpacity
                  style={styles.emptyAction}
                  onPress={() => {
                    navigation.navigate("RiderProfileContentsStack", {
                      screen: "AddLocationScreen",
                    });
                  }}
                >
                  <Plus color="#3B82F6" size={16} />
                  <Text
                    style={[
                      commonStyling.subtitle,
                      {
                        fontSize: FONT_SIZES.SMALL,
                        color: colors.primaryColor,
                      },
                    ]}
                  >
                    Add Location
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <Text
            style={[
              commonStyling.title,
              {
                fontSize: 18,
                fontFamily: "Bold",
                marginBottom: 16,
              },
            ]}
          >
            Your Location
          </Text>

          <View style={styles.mapContainer}>
            <MapScreen bottomOffset={sheetHeight + BUTTON_GAP} />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 80 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  profileInfo: { flexDirection: "row", alignItems: "center" },
  avatar: { width: 48, height: 48, borderRadius: 24 },
  greetingBox: { marginLeft: 12 },
  userName: { fontSize: 18, fontWeight: "800", color: "#1E293B" },
  notificationBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  notifBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#EF4444",
    borderWidth: 1,
    borderColor: "#FFF",
  },

  mainCard: {
    borderRadius: 24,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
  },

  inputWrapper: { gap: 12 },
  locationInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 16,
    zIndex: 3,
  },
  iconCircleBlue: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
  },
  destinationInputWrapper: {
    borderRadius: 16,
    zIndex: 2,
  },
  scheduleBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
  },
  rowCenter: { flexDirection: "row", alignItems: "center", gap: 12 },
  scheduleText: { fontSize: 14, color: "#64748B" },
  bookNowBtn: {
    backgroundColor: "#93C5FD",
    padding: 16,
    borderRadius: 24,
    alignItems: "center",
    marginTop: 8,
  },
  bookNowText: { color: "#FFF", fontWeight: "700", fontSize: 16 },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  emptyStateCard: {
    borderRadius: 24,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
  },
  emptySub: {
    marginTop: 8,
    marginBottom: 12,
  },
  emptyAction: { flexDirection: "row", alignItems: "center", gap: 6 },
  supportFloat: {
    position: "absolute",
    bottom: -20,
    right: 10,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },

  mapContainer: {
    height: 200,
    width: "100%",
    borderRadius: 16,
    overflow: "hidden",
    marginTop: 12,

    backgroundColor: "#e5e5e5",
  },
});

export default RiderHomeScreen;
