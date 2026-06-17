import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import useTheme from "../../hooks/useThemes";
import { commonStyles } from "../../styles/commonStyles";
import RideRouteCard from "../map/rideRouteCard";
import * as Progress from "react-native-progress";
import Buttons from "../buttons/buttons";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { FONT_SIZES } from "../../constants/sizes";
import { useUserStore } from "../../store/userStore";
import { useRideMatching } from "../../hooks/useRideMatching";
import { useTripStore } from "../../store/useTripStore";
import AddStopButton from "../buttons/addStopButton";
import { useRemoveStop } from "../../hooks/mutations/useRide";

interface DriverProps {
  tripType: string;
  pickup: string;
  destination: string;
  ride_id: string;
  stops: any;
}

interface MatchData {
  status: string;
  trip_id?: string;
  driver_id?: string;
}

export default function SearchingForDriver({
  tripType,
  pickup,
  destination,
  stops,
  ride_id,
}: DriverProps) {
  const { colors } = useTheme();
  const globalStyles = commonStyles(colors);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [isSearching, setIsSearching] = useState(true);
  const [matchData, setmatchData] = useState<MatchData | null>(null);
  const route = useRoute<RouteProp<any>>();
  const { user } = useUserStore();

  useRideMatching(user?.user_id);

  const { mutate: removeStop, isPending } = useRemoveStop(ride_id);

  const handleDelete = (stopId: string) => {
    Alert.alert("Remove Stop", "Are you sure you want to remove this stop?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: () => removeStop(stopId),
      },
    ]);
  };

  const status = useTripStore((state) => state.status);
  const tripData = useTripStore((state) => state.tripData);

  // console.log(stops[0].stop_id);

  useEffect(() => {
    if (status === "DRIVER_EN_ROUTE" && tripData) {
      navigation.replace("DriverArrivalDetails", {
        driverDetails: tripData,
        tripType: tripType,
      });
    }
  }, [status, tripData]);

  // Subtitle rotation logic
  const [subIdx, setSubIdx] = useState(0);
  const subtitles = [
    "Finding drivers nearby...",
    "Contacting closest drivers...",
    "Almost there...",
  ];

  useEffect(() => {
    if (!isSearching || matchData) return;
    const textInterval = setInterval(() => {
      setSubIdx((prev) => (prev + 1) % subtitles.length);
    }, 4000);
    return () => clearInterval(textInterval);
  }, [isSearching, matchData]);

  // Handle hardware/gesture back to kill the search
  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", () => {
      setIsSearching(false);
    });
    return unsubscribe;
  }, [navigation]);

  const handleCancel = () => {
    setIsSearching(false);
    navigation.navigate("CancelRide", { ...route.params });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.lightGray }]}>
      <Text style={[globalStyles.title, styles.headerText]}>
        {matchData ? "Driver Found!" : "Looking for a driver"}
      </Text>
      <View style={[styles.card, { backgroundColor: colors.surfacePrimary }]}>
        <Text style={[globalStyles.subtitle, styles.subtitleText]}>
          {subtitles[subIdx]}
        </Text>

        <Progress.Bar
          indeterminate={true}
          width={null}
          height={6}
          borderWidth={0}
          color={colors.krGreen}
          unfilledColor={colors.lightGray}
        />

        <View
          style={[styles.cardDivider, { borderBottomColor: colors.lightGray }]}
        >
          <RideRouteCard
            pickup={pickup}
            destination={destination}
            stops={stops?.map((s: any) => s.address)}
            showPickupEdit={true}
            showDestinationEdit={true}
            showAddStop={tripType === "Along trip" ? false : true}
            showStops={true}
            onEditPickup={() => {}}
            onEditDestination={() => {}}
            onAddStop={() => {
              navigation.navigate("Trips", {
                screen: "TripBookingStack",
                params: {
                  screen: "AddAStopTripInProgress",
                  params: {
                    rideId: ride_id,
                  },
                },
              });
            }}
            onEditStop={(clickedStopId: string) => {
              handleDelete(clickedStopId);
            }}
          />
        </View>

        {stops && stops.length > 0 && stops.length < 2 && (
          <View style={{ marginBottom: 24, marginTop: -12 }}>
            <AddStopButton
              onPress={() => {
                navigation.navigate("Trips", {
                  screen: "TripBookingStack",
                  params: {
                    screen: "AddAStopTripInProgress",
                    params: {
                      rideId: ride_id,
                    },
                  },
                });
              }}
            />
          </View>
        )}

        <Buttons type="cancel" title="Cancel" onPress={handleCancel} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, width: "100%" },
  headerText: {
    textAlign: "center",
    marginVertical: 16,
    fontSize: FONT_SIZES.TITLE,
  },
  card: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderRadius: 20,
    marginBottom: 16,
  },
  subtitleText: { marginBottom: 12 },
  cardDivider: { borderBottomWidth: 1, marginTop: 12, marginBottom: 32 },
});
