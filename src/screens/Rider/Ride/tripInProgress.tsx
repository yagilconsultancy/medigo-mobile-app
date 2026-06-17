import {
  Alert,
  Button,
  Dimensions,
  Linking,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapScreen from "../../../components/map/map";
import { useEffect, useState } from "react";
import useTheme from "../../../hooks/useThemes";
import { commonStyles } from "../../../styles/commonStyles";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import CustomBottomSheet from "../../../components/modals/bottomSheet";
import { Info, MessageCircle, User } from "lucide-react-native";
import { useRideTracking } from "../../../hooks/useTracking";
import { storage } from "../../../utils/storage";
import { useUserStore } from "../../../store/userStore";
import { formatPrice } from "../../../utils/formatPrice";
import { milesToKm } from "../../../utils/milesToKilometer";
import { formatDuration } from "../../../utils/formatDuration";
import RideRouteCard from "../../../components/map/rideRouteCard";
import { useDriverTracking } from "../../../hooks/useDriverTracking";
import { useRideDetail } from "../../../hooks/queries/useRideDetails";
import { useGetRideTimeline } from "../../../hooks/queries/useRideTimeline";
import { formatDisplayText } from "../../../utils/formatText";
import Buttons from "../../../components/buttons/buttons";
import { useUpdateRideStatus } from "../../../hooks/mutations/useRide";
import * as Clipboard from "expo-clipboard";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const BUTTON_GAP = 16;

function TripInProgress() {

  const RIDER_SNAP_POINTS = [SCREEN_HEIGHT * 0.30, SCREEN_HEIGHT * 0.45];
  const DRIVER_SNAP_POINTS = [SCREEN_HEIGHT * 0.30, SCREEN_HEIGHT * 0.35]; // Or whatever your driver layout needs
  const { user } = useUserStore();
  const { mutate: updateStatus, isPending } = useUpdateRideStatus();
  const { colors, theme } = useTheme();
  const commonStyling = commonStyles(colors);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const route = useRoute<any>();
  const { activeRide, role: routeRole } = route.params;
  const userRole = routeRole ?? user?.data?.role ?? (user as any)?.role ?? null;
  // ✅ Dynamically assign the correct array reference based on the user's role
  const activeSnapPoints =
    userRole === "driver" ? DRIVER_SNAP_POINTS : RIDER_SNAP_POINTS;
  const [token, setToken] = useState<string | null>(null);
  const {
    data: rideTimeline,
    isLoading: loadingTimeline,
    error,
    refetch,
  } = useGetRideTimeline(activeRide?.id);
  const { data, isLoading } = useRideDetail(activeRide?.id);
  useEffect(() => {
    const loadToken = async () => {
      const t = await storage.getToken();
      setToken(t);
    };
    loadToken();
  }, []);

  console.log(data?.data.destination_latitude);

  const pickup =
    data?.data?.pickup_latitude != null && data?.data?.pickup_longitude != null
      ? {
          latitude: data.data.pickup_latitude,
          longitude: data.data.pickup_longitude,
          address: data.data.pickup_address,
        }
      : null;

  const destination =
    data?.data?.destination_latitude != null &&
    data?.data?.destination_longitude != null
      ? {
          latitude: data.data.destination_latitude,
          longitude: data.data.destination_longitude,
          address: data.data.destination_address,
        }
      : null;

  // 3. Conditional Role Checking Execution
  const isDriver = userRole === "driver";
  const isRider = userRole === "rider" || userRole === "passenger";
  const currentRideStatus =
    rideTimeline?.data?.at(-1)?.to_status ??
    data?.data?.status ??
    activeRide?.status ??
    null;
  const rideDetail: any = data?.data;
  const driverPhone =
    activeRide?.driver_phone ?? rideDetail?.driver_phone ?? null;

  // Run Rider listening hook ONLY if user is a rider
  const { driverLocation, eta } = useRideTracking(
    isRider ? activeRide?.id : null,
    token,
  );

  // Run Driver broadcasting hook ONLY if user is a driver
  const driverCurrentLocation = useDriverTracking(
    isDriver ? activeRide?.id : null,
    token,
  );

  const callDriver = async () => {
    const phoneNumber = driverPhone;

    if (!phoneNumber) {
      Alert.alert("Error", "Driver phone number not available");
      return;
    }

    const sanitizedPhoneNumber = String(phoneNumber).replace(/[^\d+]/g, "");
    const url = `tel:${sanitizedPhoneNumber}`;

    try {
      await Linking.openURL(url);
    } catch (error) {
      await Clipboard.setStringAsync(String(phoneNumber));
      Alert.alert(
        "Driver phone number",
        `${phoneNumber}\n\nPhone dialer is not available on this device, so the number has been copied.`,
      );
    }
  };

  return (
    <View>
      <StatusBar
        barStyle={theme === "light" ? "dark-content" : "light-content"}
      />
      <View
        style={{
          height: "100%",
          width: "100%",
          borderRadius: 16,
          overflow: "hidden",
        }}
      >
        <MapScreen
          pickup={pickup}
          destination={destination}
          driverLocation={isDriver ? driverCurrentLocation : driverLocation}
          rideStatus={currentRideStatus}
        />
      </View>

      <CustomBottomSheet
        backgroundColor={colors.lightGray}
          snapPoints={activeSnapPoints}
        //  snapPoints={CUSTOM_SNAP_POINTS}
        isScrollable={true}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 200,
            paddingTop: 50,
            flexGrow: 1,
            backgroundColor: colors.lightGray,
          }}
        >
          <Text
            style={[
              commonStyling.title,
              {
                fontSize: 18,
                fontFamily: "Bold",
                textAlign: "center",
                marginVertical: 16,
              },
            ]}
          >
            {isRider
              ? formatDisplayText(currentRideStatus)
              : currentRideStatus === "driver_en_route"
                ? formatDisplayText(currentRideStatus)
                : currentRideStatus === "driver_arrived"
                  ? "Arrived at Pick up"
                  : formatDisplayText(currentRideStatus)}
          </Text>

          {/* Driver Header Section */}
          {/* <View style={styles.driverHeader}>
            <View style={styles.driverProfile}>
              <View style={styles.avatarContainer}>
                <User size={32} color="#2563EB" />
              </View>
              <View>
                <Text
                  style={[
                    commonStyling.title,
                    {
                      fontSize: 16,
                      fontFamily: "SemiBold",
                    },
                  ]}
                >
                  {user?.data.role === "rider"
                    ? activeRide.driver_name
                    : activeRide.rider_name}
                </Text>
                {user?.data.role === "rider" && driverPhone ? (
                  <Text
                    style={[
                      commonStyling.subtitle,
                      {
                        fontSize: 13,
                        marginTop: 4,
                      },
                    ]}
                  >
                    {driverPhone}
                  </Text>
                ) : null}
                <View style={styles.ratingRow}>
                  <Text style={styles.star}>★</Text>
                  <Text
                    style={[
                      commonStyling.title,
                      {
                        fontSize: 14,
                      },
                    ]}
                  >
                    {activeRide.driver_rating}
                  </Text>
                  <View style={styles.dot} />
                  <Text
                    style={[
                      commonStyling.subtitle,
                      {
                        fontSize: 14,
                      },
                    ]}
                  >
                    {activeRide.driver_vehicle_make}{" "}
                    {activeRide.driver_vehicle_type}{" "}
                    {activeRide.driver_vehicle_model}
                  </Text>
                </View>
              </View>
            </View>
          </View> */}

          {/* Route Section */}

          {/* <RideRouteCard
            pickup={activeRide?.pickup_address}
            destination={activeRide?.destination_address}
          /> */}

          {/* Trip Metrics Row */}
          {/* <View style={styles.metricsRow}>
            <View style={styles.metricItem}>
              <Text
                style={[
                  styles.metricLabel,
                  commonStyling.subtitle,
                  {
                    fontSize: 12,
                  },
                ]}
              >
                Distance
              </Text>
              <Text
                style={[
                  commonStyling.title,
                  {
                    fontSize: 15,
                    fontFamily: "Bold",
                  },
                ]}
              >
                {milesToKm(activeRide?.estimated_distance_miles)}
              </Text>
            </View>
            <View style={styles.metricItem}>
              <Text
                style={[
                  styles.metricLabel,
                  commonStyling.subtitle,
                  {
                    fontSize: 12,
                  },
                ]}
              >
                ETA
              </Text>
              <Text
                style={[
                  commonStyling.title,
                  {
                    fontSize: 15,
                    fontFamily: "Bold",
                  },
                ]}
              >
                {formatDuration(activeRide?.estimated_duration_minutes)}
              </Text>
            </View>
            <View style={styles.metricItem}>
              <Text
                style={[
                  styles.metricLabel,
                  commonStyling.subtitle,
                  {
                    fontSize: 12,
                  },
                ]}
              >
                Fare
              </Text>
              <Text
                style={[
                  commonStyling.title,
                  {
                    fontSize: 15,
                    fontFamily: "Bold",
                    color: colors.primaryColor,
                  },
                ]}
              >
                {formatPrice(activeRide.estimated_fare)}
              </Text>
            </View>
          </View> */}

          {/* Medical Appointment Alert */}
          {isRider && (
            <View
              style={[
                styles.alertBox,
                {
                  backgroundColor: colors.surfaceBrand,
                },
              ]}
            >
              <Info size={20} color="#2563EB" />
              <View style={styles.alertContent}>
                <Text
                  style={[
                    styles.alertTitle,
                    commonStyling.title,
                    {
                      fontSize: 14,
                      color: colors.primaryColor,
                    },
                  ]}
                >
                  Medical Appointment
                </Text>
                <Text
                  style={[
                    styles.alertDescription,
                    commonStyling.subtitle,
                    {
                      fontSize: 12,
                      color: colors.primaryColor,
                    },
                  ]}
                >
                  Your driver is aware this is a medical appointment and will
                  ensure a comfortable, timely journey.
                </Text>
              </View>
            </View>
          )}

          {isRider && (
            <View style={styles.riderActionStack}>
              <TouchableOpacity
                style={styles.contactButton}
                onPress={callDriver}
              >
                <Text style={styles.contactButtonText}>Contact Driver</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => navigation.goBack()}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          )}

          {isDriver && (
            <View
              style={{
                marginTop: 16,
              }}
            >
              {currentRideStatus === "driver_en_route" && (
                <Buttons
                  title="Notify Passenger of Arrival"
                  loading={isPending}
                  onPress={() => {
                    updateStatus({
                      rideId: activeRide?.id,
                      payload: {
                        status: "driver_arrived",
                        notes: "",
                      },
                    });
                  }}
                />
              )}

              {currentRideStatus === "driver_arrived" && (
                <Buttons
                  title="Resend notification"
                  type="outline"
                  onPress={() => {}}
                />
              )}

              {(currentRideStatus === "driver_en_route" ||
                currentRideStatus === "driver_arrived") && (
                  <View
                    style={{
                      marginTop: 8,
                    }}
                  >
                    <Buttons
                      title="Start trip"
                      loading={isPending}
                      type={
                        currentRideStatus === "driver_arrived"
                          ? "primary"
                          : "inactive"
                      }
                      onPress={() => {
                        if (currentRideStatus === "driver_arrived") {
                          updateStatus({
                            rideId: activeRide?.id,
                            payload: {
                              status: "in_progress",
                              notes: "",
                            },
                          });
                        }
                      }}
                    />
                  </View>
                )}

              {currentRideStatus === "in_progress" && (
                <View
                  style={{
                    marginTop: 8,
                  }}
                >
                  <Buttons
                    title="Arrived at Destination"
                    loading={isPending}
                    type={"primary"}
                    onPress={() => {
                      updateStatus(
                        {
                          rideId: activeRide?.id,
                          payload: {
                            status: "completed",
                            notes: "",
                          },
                        },
                        {
                          onSuccess: (responseData) => {
                            navigation.navigate("DriverRideDetailsStack", {
                              screen: "CompletedRide",
                            });
                          },
                        },
                      );
                    }}
                  />
                </View>
              )}
            </View>
          )}

          {/* Contact Action */}
        </ScrollView>
      </CustomBottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    paddingTop: 50,
  },

  // Header
  driverHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  driverProfile: { flexDirection: "row", alignItems: "center", gap: 12 },
  avatarContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
  },
  ratingRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  star: { color: "#F59E0B", fontSize: 16, marginRight: 4 },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#94A3B8",
    marginHorizontal: 8,
  },
  chatButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
  },

  // Route
  routeContainer: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  routeRow: { flexDirection: "row", gap: 12 },
  indicatorContainer: { alignItems: "center", width: 20 },
  pickupRing: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#2563EB",
    backgroundColor: "#FFF",
  },
  routeLine: {
    width: 2,
    flex: 1,
    backgroundColor: "#E2E8F0",
    marginVertical: 4,
  },
  destinationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#EF4444",
  },
  locationInfo: { flex: 1 },
  locationLabel: { marginBottom: 2 },

  // Metrics
  metricsRow: { flexDirection: "row", gap: 12, marginVertical: 16 },
  metricItem: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
  },
  metricLabel: { marginBottom: 4 },

  // Alert Box
  alertBox: {
    flexDirection: "row",
    borderRadius: 16,
    padding: 16,
    gap: 12,
    marginBottom: 20,
  },
  alertContent: { flex: 1 },
  alertTitle: {
    marginBottom: 4,
  },
  alertDescription: {
    lineHeight: 18,
    opacity: 0.8,
  },

  // Button
  riderActionStack: {
    gap: 10,
  },
  contactButton: {
    height: 56,
    borderRadius: 16,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },
  contactButtonText: { fontSize: 16, fontWeight: "700", color: "#64748B" },
  closeButton: {
    height: 56,
    borderRadius: 16,
    backgroundColor: "#3B82F6",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: { fontSize: 16, fontWeight: "700", color: "#FFF" },
});

export default TripInProgress;
