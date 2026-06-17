import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Dimensions,
  StatusBar,
  ActivityIndicator,
  Alert,
} from "react-native";
import {
  ChevronLeft,
  Check,
} from "lucide-react-native";
import Toast from "react-native-toast-message";
import { SafeAreaView } from "react-native-safe-area-context";
import useTheme from "../../../hooks/useThemes";
import { commonStyles } from "../../../styles/commonStyles";
import OverlayBottomSheet, {
  OverlayBottomSheetRef,
} from "../../../components/modals/overlayBottomSheet";
import Buttons from "../../../components/buttons/buttons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useCreateRide } from "../../../hooks/mutations/useRide";
import { CreateRideRequest } from "../../../types/rides.types";
import { useUserProfile } from "../../../hooks/queries/useUserProfile";
import { useFareEstimate } from "../../../hooks/queries/useFareEstimates";
import { useGetFareEstimateMutation } from "../../../hooks/queries/useGetBaseFareEstimate";
import ServiceType, { APPOINTMENT_TYPES } from "./serviceType";
import TripStructure from "./tripStructure";
import ChooseARide from "./chooseARide";
import ReviewScreen from "./review";
import { useStripe } from "@stripe/stripe-react-native";
import { useCreatePaymentIntent } from "../../../hooks/mutations/usePayments";
import { useRideStore } from "../../../store/useRideStore";
import { useQueryClient } from "@tanstack/react-query";
import { useSavedLocations } from "../../../hooks/queries/useSavedLocations";

const { width } = Dimensions.get("window");

const toTitleCase = (value?: string | null) => {
  if (!value) return "";

  return value
    .split("_")
    .join(" ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const normalizeServiceType = (tripType?: string | null) =>
  tripType === "transport_only" ? "Transport Only" : "Transport + Care Assistant";

const normalizeTripStructure = (tripStructure?: string | null) =>
  tripStructure === "round_trip" ? "Round Trip" : "One Way";

const getTripStructurePayloadValue = (
  tripStructure: string,
): "one_way" | "round_trip" =>
  tripStructure === "Round Trip" ? "round_trip" : "one_way";

const getTripTypePayloadValue = (serviceType: string) =>
  serviceType === "Transport Only"
    ? "transport_only"
    : "transport_care_assistant";

const isDialysisVisit = (visitType: string) => visitType === "dialysis";

const normalizeAssistance = (assistance?: string | null) => {
  const normalized = assistance?.toLowerCase();

  if (normalized === "minimal") return "Minimal";
  if (normalized === "full") return "Full";

  return "none";
};

const formatLocalDate = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

const parseLocalDate = (dateString: string) => {
  const [year, month, day] = dateString.split("-").map(Number);

  return new Date(year, month - 1, day);
};

const getDateFromRide = (scheduledAt?: string | null) => {
  if (!scheduledAt) return formatLocalDate(new Date());

  return formatLocalDate(new Date(scheduledAt));
};

const getTimeFromRide = (scheduledAt?: string | null) => {
  if (!scheduledAt) return null;

  const scheduledDate = new Date(scheduledAt);
  const hours = String(scheduledDate.getHours()).padStart(2, "0");
  const minutes = String(scheduledDate.getMinutes()).padStart(2, "0");

  return `${hours}:${minutes}`;
};

const getDateOffsetString = (offsetDays: number) => {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);

  return formatLocalDate(date);
};

const getScheduledDate = (date: string, time: string) => {
  const [year, month, day] = date.split("-").map(Number);
  const [hours, minutes] = time.split(":").map(Number);

  return new Date(year, month - 1, day, hours, minutes, 0);
};

const toNumber = (value: number | string | undefined | null) => {
  const numericValue = typeof value === "string" ? Number(value) : value;

  return Number.isFinite(numericValue) ? Number(numericValue) : 0;
};

const truncateToTwoDecimals = (value: number) =>
  Math.trunc((value + Number.EPSILON) * 100) / 100;


const getEstimateChargeTotal = (estimate?: any) =>
  truncateToTwoDecimals(
    toNumber(estimate?.total_fare)
  );


const formatPriceNoRound = (value: number | string | undefined | null) => {
  const truncatedValue = truncateToTwoDecimals(toNumber(value));

  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    currencyDisplay: "narrowSymbol",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
    .format(truncatedValue)
    .replace("$", "C$");
};

const getErrorMessage = (error: any, fallback: string) => {
  const detail = error?.response?.data?.detail;

  if (Array.isArray(detail)) {
    return detail[0]?.msg || fallback;
  }

  return error?.response?.data?.message || detail || error?.message || fallback;
};

const BookARide = () => {
  const [step, setStep] = useState(1);
  const totalSteps = 4;
  const { colors, theme } = useTheme();
  const pickup = useRideStore((state) => state.pickup);
  const setPickup = useRideStore((state) => state.setPickup);
  const destination = useRideStore((state) => state.destination);
  const setDestination = useRideStore((state) => state.setDestination);
  const storeScheduledTrip = useRideStore((state) => state.scheduledTrip);
  const { data: savedLocations } = useSavedLocations();
  const { data: user } = useUserProfile();
  const {
    mutate: fetchEstimates,
    isPending: isPendingBaseFareEstimate,
    data: estimateResults,
  } = useGetFareEstimateMutation();

  const commonStyling = commonStyles(colors);
  const successRef = useRef<OverlayBottomSheetRef>(null);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const route = useRoute<any>();
  const rebookRide = route.params?.rebookRide;
  const isScheduledTrip =
    route.params?.scheduledTrip !== undefined
      ? Boolean(route.params.scheduledTrip)
      : storeScheduledTrip;
  const [serviceType, setServiceType] = useState("Transport Only");
  const [appointmentType, setAppointmentType] = useState(
    APPOINTMENT_TYPES[0].visit_type,
  );
  const [selectedVehicleDisplayName, setSelectedVehicleDisplayName] =
    useState("");
  const [tripStructure, setTripStructure] = useState("One Way");
  const [passenger, setPassenger] = useState("Myself");
  const [rideType, setRideType] = useState("ambulatory");
  const [loadingPickup, setloadingPickup] = useState(false);
  const [loadingDestination, setloadingDestination] = useState(false);
  const [assistance, setassistance] = useState("none");
  const [additionalNotes, setadditionalNotes] = useState("");
  const [passengerFirstName, setPassengerFirstName] = useState("");
  const [passengerLastName, setPassengerLastName] = useState("");
  const [passengerPhone, setPassengerPhone] = useState("");
  const [date, setDate] = useState(formatLocalDate(new Date()));
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  useEffect(() => {
    if (rebookRide) return;

    setDate(isScheduledTrip ? getDateOffsetString(1) : getDateOffsetString(0));
  }, [isScheduledTrip, rebookRide]);
  const [showPicker, setShowPicker] = useState(false);
    

  const getThirtyMinsFromNow = () => {
    const now = new Date();

    // 1. Add 30 minutes to the current date object
    now.setMinutes(now.getMinutes() + 30);

    // 2. Format with padding
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");

    return `${hours}:${minutes}`;
  };

  const [time, setTime] = useState(getThirtyMinsFromNow());

  const [showTimePicker, setShowTimePicker] = useState(false);
  const [pickUpForm, setpickUpForm] = useState({
    label: "",
    address: pickup?.address ?? "",
    latitude: pickup?.latitude ?? 0,
    longitude: pickup?.longitude ?? 0,
  });
  const [destinationForm, setdestinationForm] = useState({
    label: "",
    address: destination?.address ?? "",
    latitude: destination?.latitude ?? 0,
    longitude: destination?.longitude ?? 0,
  });
  const [rideId, setrideId] = useState("");
  const [loadingPayment, setloadingPayment] = useState(false);
  const {
    mutate: getEstimate,
    data: estimateData,
    isPending: loadingEstimates,
  } = useFareEstimate();
  const estimate = estimateData?.data.estimates;
  const estimateChargeTotal = getEstimateChargeTotal(estimateResults?.data);

  useEffect(() => {
    if (!rebookRide) return;

    const pickupPoint = {
      address: rebookRide.pickup_address ?? "",
      latitude: rebookRide.pickup_latitude ?? 0,
      longitude: rebookRide.pickup_longitude ?? 0,
    };
    const destinationPoint = {
      address: rebookRide.destination_address ?? "",
      latitude: rebookRide.destination_latitude ?? 0,
      longitude: rebookRide.destination_longitude ?? 0,
    };
    const rebookTime = getTimeFromRide(rebookRide.scheduled_at);

    setPickup(pickupPoint);
    setDestination(destinationPoint);
    setpickUpForm((prev) => ({ ...prev, ...pickupPoint }));
    setdestinationForm((prev) => ({ ...prev, ...destinationPoint }));
    setServiceType(normalizeServiceType(rebookRide.trip_type));
    setAppointmentType(
      rebookRide.visit_type ?? APPOINTMENT_TYPES[0].visit_type,
    );
    setTripStructure(normalizeTripStructure(rebookRide.trip_structure));
    setRideType(rebookRide.ride_type || "ambulatory");
    setSelectedVehicleDisplayName(toTitleCase(rebookRide.ride_type));
    setassistance(normalizeAssistance(rebookRide.assistance_level));
    setadditionalNotes(rebookRide.special_instructions ?? "");
    setPassengerFirstName(rebookRide.passenger_first_name ?? "");
    setPassengerLastName(rebookRide.passenger_last_name ?? "");
    setPassengerPhone(rebookRide.passenger_phone ?? "");
    setDate(getDateFromRide(rebookRide.scheduled_at));

    if (rebookTime) {
      setTime(rebookTime);
    }
  }, [rebookRide, setDestination, setPickup]);

  useEffect(() => {
    if (passenger !== "Myself" || !user?.data.phone || passengerPhone) return;

    setPassengerPhone(user.data.phone);
  }, [passenger, passengerPhone, user?.data.phone]);

  useEffect(() => {
    if (!pickup?.address) return;

    setpickUpForm((prev) => ({
      ...prev,
      address: pickup.address,
      latitude: pickup.latitude ?? 0,
      longitude: pickup.longitude ?? 0,
    }));
  }, [pickup?.address, pickup?.latitude, pickup?.longitude]);

  useEffect(() => {
    if (pickup?.address || pickUpForm.address || !savedLocations?.data?.length) {
      return;
    }

    const defaultPickup = savedLocations.data.find(
      (location) => location.is_default,
    );

    if (!defaultPickup) return;

    const point = {
      address: defaultPickup.address,
      latitude: defaultPickup.latitude,
      longitude: defaultPickup.longitude,
    };

    setPickup(point);
    setpickUpForm((prev) => ({
      ...prev,
      ...point,
    }));
  }, [
    pickup?.address,
    pickUpForm.address,
    savedLocations?.data,
    setPickup,
  ]);

  const baseFareEstimatePayload = () => ({
    pickup_address: pickUpForm.address,
    pickup_longitude: pickUpForm.longitude,
    pickup_latitude: pickUpForm.latitude,
    destination_address: destinationForm.address,
    destination_longitude: destinationForm.longitude,
    destination_latitude: destinationForm.latitude,
    scheduled_at: getScheduledDate(date, time).toISOString(),
    trip_structure: getTripStructurePayloadValue(tripStructure),
    is_dialysis_trip: isDialysisVisit(appointmentType),
  });

  const fareEstimatePayload = (selectedRideType = rideType) => ({
    pickup_address: pickUpForm.address,
    pickup_latitude: pickUpForm.latitude,
    pickup_longitude: pickUpForm.longitude,
    destination_address: destinationForm.address,
    destination_longitude: destinationForm.longitude,
    destination_latitude: destinationForm.latitude,
    scheduled_at: getScheduledDate(date, time).toISOString(),
    use_highway_407: false,
    is_dialysis_trip: isDialysisVisit(appointmentType),
    ride_type: selectedRideType.toLowerCase(),
    trip_type: getTripTypePayloadValue(serviceType),
    trip_structure: getTripStructurePayloadValue(tripStructure),
  });

  const handleCalculateFare = (onSuccess?: () => void) => {
    fetchEstimates(fareEstimatePayload(), {
      onSuccess,
      onError: (error: any) => {
        Alert.alert(
          "Fare Estimate Error",
          error?.response?.data?.message ||
            error?.response?.data?.detail ||
            "We could not calculate your fare. Please try again.",
        );
      },
    });
  };

  // 3. The Button Trigger function
  const handleGetEstimate = () => {
    if (!pickUpForm.address || !destinationForm.address) return;

    getEstimate(baseFareEstimatePayload(), {
      onError: (error: any) => {
        Alert.alert(
          "Fare Estimate Error",
          error?.response?.data?.message ||
            error?.response?.data?.detail ||
            "We could not load ride options. Please try again.",
        );
      },
    });
  };

  const updatePickUPFormFields = (fields: Partial<any>) => {
    setpickUpForm((prev) => ({ ...prev, ...fields }));
  };
  const updateDestinationFormFields = (fields: Partial<any>) => {
    setdestinationForm((prev) => ({ ...prev, ...fields }));
  };
  const onDestinationPlaceSelected = (data: any) => {
    setdestinationForm((prev) => ({
      ...prev,
      address: data.address,
      latitude: data.latitude,
      longitude: data.longitude,
    }));
  };
  const onPickUpPlaceSelected = (data: any) => {
    setpickUpForm((prev) => ({
      ...prev,
      address: data.address,
      latitude: data.latitude,
      longitude: data.longitude,
    }));
  };

  const togglePicker = () => {
    setShowPicker(true);
  };

  const nextStep = () =>
    step === 3
      ? handleCalculateFare(() => setStep(4))
      : step === 4
        ? handleConfirmBooking()
        : step < totalSteps
          ? setStep(step + 1)
          : null;
  const handleBackPress = () => {
    if (step > 1) {
      setStep(step - 1);
      return;
    }

    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }

    navigation.navigate("RiderMainTabs");
  };

  const renderProgressBar = () => (
    <View style={styles.progressContainer}>
      {[...Array(totalSteps)].map((_, i) => (
        <View
          key={i}
          style={[
            styles.progressStep,
            { backgroundColor: i + 1 <= step ? "#2E66E7" : "#E5EAF5" },
          ]}
        />
      ))}
    </View>
  );

  const { mutate, isPending } = useCreateRide({ showSuccessAlert: false });
  const selectedAppointmentType =
    APPOINTMENT_TYPES.find(
      (appointment) => appointment.visit_type === appointmentType,
    ) ?? APPOINTMENT_TYPES[0];

  const handleConfirmBooking = () => {
    if (!user?.data.id) {
      Alert.alert("Booking Error", "We could not identify the passenger.");
      return;
    }

    if (!estimateResults?.data) {
      Alert.alert("Booking Error", "Please review the fare estimate first.");
      return;
    }
    // check if booking has been made
    if(rideId){
     return openStripePayment(rideId);
    }
    const scheduledDate = getScheduledDate(date, time);
    const passengerIsRider = passenger === "Myself";

    const payload: CreateRideRequest = {
      ride_type: rideType.toLowerCase(),
      trip_type: getTripTypePayloadValue(serviceType),
      trip_structure: getTripStructurePayloadValue(tripStructure),
      pickup_address: pickUpForm.address,
      pickup_latitude: pickUpForm.latitude,
      pickup_longitude: pickUpForm.longitude,
      destination_address: destinationForm.address,
      destination_latitude: destinationForm.latitude,
      destination_longitude: destinationForm.longitude,
      scheduled_at: scheduledDate.toISOString(),
      ...(passengerIsRider ? { passenger_id: user.data.id } : {}),
      passenger_first_name: passengerIsRider
        ? user.data.first_name
        : passengerFirstName.trim(),
      passenger_last_name: passengerIsRider
        ? user.data.last_name
        : passengerLastName.trim(),
      passenger_phone: passengerPhone.trim(),
      visit_type: selectedAppointmentType.visit_type,
      appointment_time: scheduledDate.toISOString(),
      special_instructions: additionalNotes || "",
      assistance_level: assistance,
      is_dialysis_trip: isDialysisVisit(selectedAppointmentType.visit_type),
      booking_channel: "mobile_app",
    };
    mutate(payload, {
      onSuccess: (response) => {
        const createdRideId = response.data.id;

        setrideId(createdRideId);
        Toast.show({
          type: "tripToast",
          text1: "Ride booked successfully",
          text2: "Complete payment to confirm your booking.",
        });
        openStripePayment(createdRideId);
      },
      onError: (error: any) => {
        console.error(
          "Failed to Create Ride:",
          error?.response?.data || error.message,
        );

        Alert.alert(
          "Booking Error",
          error?.response?.data?.message ||
            error?.response?.data?.detail ||
            "We could not book this ride. Please try again.",
        );
      },
    });
  };

  const { mutateAsync: getPaymentIntent } = useCreatePaymentIntent();

  const queryClient = useQueryClient();

  const showPaymentErrorToast = (message: string) => {
    Toast.show({
      type: "errorToast",
      text1: "Payment failed",
      text2: message,
    });
  };

  const openStripePayment = async (createdRideId = rideId) => {
    setloadingPayment(true);

    if (!estimateResults?.data.total_fare) {
      showPaymentErrorToast("We could not confirm this ride's fare.");
      setloadingPayment(false);
      return;
    }

    try {
      const response = await getPaymentIntent({
        amount: estimateResults?.data.total_fare,
        currency: "cad", // or your target currency
        description: "Wallet Funding",
        order_id: createdRideId,
      });

      const { payment_intent, ephemeral_key, customer } = response.data;

      const { error } = await initPaymentSheet({
        merchantDisplayName: "MediGo",
        customerId: customer,
        customerEphemeralKeySecret: ephemeral_key,
        paymentIntentClientSecret: payment_intent,
        allowsDelayedPaymentMethods: true,
        defaultBillingDetails: {
          name: user?.data.first_name,
        },
      });

      if (error) {
        showPaymentErrorToast(
          error.message || "We could not initialize the payment sheet.",
        );
        return;
      }

      const { error: presentError } = await presentPaymentSheet();

      if (presentError) {
        const isCanceled =
          presentError.code === "Canceled" ||
          presentError.code === "CanceledError";

        showPaymentErrorToast(
          isCanceled
            ? "Payment was canceled. You can try again when ready."
            : presentError.message || "Payment could not be completed.",
        );
      } else {
        // Payment successful
        await queryClient.invalidateQueries({
          queryKey: ["my-rides"],
        });
        successRef.current?.open();
        // optional immediate refetch
        await queryClient.refetchQueries({
          queryKey: ["my-rides"],
        });
      }
    } catch (e) {
      console.error(e);
      showPaymentErrorToast(
        getErrorMessage(
          e,
          "We could not start payment for this ride. Please try again.",
        ),
      );
    } finally {
      setloadingPayment(false);
    }
  };

  const minDateString = getDateOffsetString(1);
  const today = getDateOffsetString(0);
  const datePickerMinDate = isScheduledTrip ? minDateString : today;
  const datePickerMaxDate = isScheduledTrip ? undefined : today;

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <ServiceType
            serviceType={serviceType}
            setServiceType={setServiceType}
            setAppointmentType={setAppointmentType}
            appointmentType={appointmentType}
          />
        );
      case 2:
        return (
          <TripStructure
            setTripType={setTripStructure}
            tripType={tripStructure}
            pickUpForm={pickUpForm}
            togglePicker={togglePicker}
            updatePickUPFormFields={updatePickUPFormFields}
            onPickUpPlaceSelected={onPickUpPlaceSelected}
            loadingPickup={loadingPickup}
            setloadingPickup={setloadingPickup}
            destinationForm={destinationForm}
            updateDestinationFormFields={updateDestinationFormFields}
            onDestinationPlaceSelected={onDestinationPlaceSelected}
            loadingDestination={loadingDestination}
            setloadingDestination={setloadingDestination}
            date={date}
            showPicker={showPicker}
            setShowPicker={setShowPicker}
            setDate={setDate}
            minDateString={datePickerMinDate}
            maxDateString={datePickerMaxDate}
            showTimePicker={showTimePicker}
            setShowTimePicker={setShowTimePicker}
            time={time}
            setTime={setTime}
            parseLocalDate={parseLocalDate}
            formatLocalDate={formatLocalDate}
            passenger={passenger}
            setPassenger={setPassenger}
            passengerFirstName={passengerFirstName}
            setPassengerFirstName={setPassengerFirstName}
            passengerLastName={passengerLastName}
            setPassengerLastName={setPassengerLastName}
            passengerPhone={passengerPhone}
            setPassengerPhone={setPassengerPhone}
            assistance={assistance}
            setassistance={setassistance}
            additionalNotes={additionalNotes}
            setadditionalNotes={setadditionalNotes}
          />
        );
      case 3:
        return (
          <ChooseARide
            loadingEstimates={loadingEstimates}
            estimate={estimate}
            selectedVehicleDisplayName={selectedVehicleDisplayName}
            setSelectedVehicleDisplayName={setSelectedVehicleDisplayName}
            setRideType={setRideType}
          />
        );
      case 4:
        return (
          // <RecurringRide
          //   recurring={recurring}
          //   setRecurring={setRecurring}
          //   frequency={frequency}
          //   setFrequency={setFrequency}
          //   toggleRecurringStartDatePicker={toggleRecurringStartDatePicker}
          //   recurringStartdate={recurringStartdate}
          //   showrecurringStartDatePicker={showrecurringStartDatePicker}
          //   setrecurringStartDate={setrecurringStartDate}
          //   setShowrecurringStartDatePicker={setShowrecurringStartDatePicker}
          //   endType={endType}
          //   setEndType={setEndType}
          //   toggleRecurringEndDatePicker={toggleRecurringEndDatePicker}
          //   recurringEnddate={recurringEnddate}
          //   showrecurringEndDatePicker={showrecurringEndDatePicker}
          //   setrecurringEndDate={setrecurringEndDate}
          //   setShowrecurringEndDatePicker={setShowrecurringEndDatePicker}
          // />
          <ReviewScreen
            tripType={tripStructure}
            appointment={selectedAppointmentType.label}
            serviceType={serviceType}
            vehicle={selectedVehicleDisplayName}
            pickup={pickUpForm.address}
            destination={destinationForm.address}
            rideType={rideType}
            assistance={assistance}
            notes={additionalNotes}
            date={date}
            time={time}
            accessibilityFee={estimateResults?.data.accessibility_fee}
            attendantFee={estimateResults?.data.attendant_fee}
            baseFare={estimateResults?.data.base_fare}
            careAssistantFee={estimateResults?.data.care_assistant_fee}
            distanceCharge={estimateResults?.data.distance_charge}
            waitTimeCharge={estimateResults?.data.wait_time_charge}
            surcharge={estimateResults?.data.surcharges_total}
            highway407Toll={estimateResults?.data.highway_407_toll}
            insuranceGatewayFee={estimateResults?.data.insurance_gateway_fee}
            flatSurcharge={estimateResults?.data.flat_surcharge}
            totalFare={estimateResults?.data.total_fare}
          />
        );

      default:
        return (
          <View style={styles.placeholder}>
            <Text>Step {step} Implementation</Text>
          </View>
        );
    }
  };

  const renderStepHeader = () =>
    step < 4 ? (
      <View>
        <Text
          style={[
            styles.mainTitle,
            commonStyling.title,
            {
              fontSize: 24,
              fontFamily: "Bold",
            },
          ]}
        >
          Book a Ride
        </Text>
        <Text
          style={[
            styles.stepIndicator,
            commonStyling.subtitle,
            {
              fontSize: 14,
            },
          ]}
        >
          Step {step} of {totalSteps} - {getStepName(step)}
        </Text>
        {renderProgressBar()}
      </View>
    ) : null;

  const handleContinuePress = () => {
    if (step === 2 && !pickUpForm.address) {
      Alert.alert("Please enter pickup location");
      return;
    } else if (step === 2 && !destinationForm.address) {
      Alert.alert("Please enter destination location");
      return;
    } else if (step === 2 && !passengerPhone.trim()) {
      Alert.alert("Please enter passenger phone number");
      return;
    } else if (
      step === 2 &&
      passenger === "Someone Else" &&
      (!passengerFirstName.trim() || !passengerLastName.trim())
    ) {
      Alert.alert("Please enter passenger first and last name");
      return;
    } else if (step === 2) {
      handleGetEstimate();
      nextStep();
    } else if (step === 3 && !selectedVehicleDisplayName) {
      Alert.alert("Please select a ride option");
      return;
    } else {
      nextStep();
    }
  };

  const renderContinueButton = () => (
    <TouchableOpacity
      style={styles.continueButton}
      onPress={handleContinuePress}
    >
      {isPending || loadingPayment || isPendingBaseFareEstimate ? (
        <ActivityIndicator />
      ) : (
        <Text style={styles.continueText}>
          {step === 3 ? "Review" : step === 4 ? `Pay (c$${estimateResults?.data.total_fare})` : "Continue"}
        </Text>
      )}
    </TouchableOpacity>
  );

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
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <ChevronLeft color="#000" size={24} />
        </TouchableOpacity>
      </View>

      {step === 1 ? (
        <ScrollView
          style={styles.serviceTypeScroll}
          contentContainerStyle={styles.serviceTypeScrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
          alwaysBounceVertical={false}
          keyboardShouldPersistTaps="handled"
        >
          {renderStepHeader()}
          {renderStepContent()}
        </ScrollView>
      ) : (
        <FlatList
          data={[step]}
          keyExtractor={(item) => String(item)}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
          alwaysBounceVertical={false}
          keyboardShouldPersistTaps="handled"
          renderItem={() => (
            <>
              {renderStepHeader()}
              {renderStepContent()}
            </>
          )}
        />
      )}

      <View
        style={[
          styles.footer,
          {
            backgroundColor: colors.surfacePrimary,
            borderTopColor: colors.lightPrimaryBlueBorder,
          },
        ]}
      >
        {renderContinueButton()}
      </View>

      <OverlayBottomSheet ref={successRef} height={500} overlay={true}>
        <View style={styles.content}>
          {/* Success Icon with Glow Effect */}
          <View>
            <View style={styles.iconGlow}>
              <View style={styles.checkmarkCircle}>
                <Check color="#FFF" size={48} strokeWidth={3} />
              </View>
            </View>
          </View>

          {/* Status Text */}
          <Text
            style={[
              styles.title,
              commonStyling.title,
              {
                fontSize: 26,
                fontFamily: "Bold",
                marginTop: 16,
              },
            ]}
          >
            Payment Successful
          </Text>
          <Text
            style={[
              styles.statusInfo,
              commonStyling.subtitle,
              {
                fontSize: 15,
              },
            ]}
          >
            Your booking status is pending.
          </Text>
          <Text
            style={[
              styles.statusDetail,
              commonStyling.subtitle,
              {
                fontSize: 15,
              },
            ]}
          >
            You will get confirmation and driver's details soon.
          </Text>

          {/* Amount Paid Card */}
          <View
            style={[
              styles.amountCard,
              {
                backgroundColor: colors.cardBackground,
              },
            ]}
          >
            <Text
              style={[
                styles.amountLabel,
                commonStyling.subtitle,
                {
                  fontSize: 12,
                  fontFamily: "SemiBold",
                },
              ]}
            >
              AMOUNT PAID
            </Text>
            <Text
              style={{
                fontSize: 32,
                fontFamily: "Bold",
                color: "#10B981",
              }}
            >
              {formatPriceNoRound(estimateChargeTotal)}
            </Text>
          </View>

          <View
            style={{
              width: "100%",
            }}
          >
            <Buttons
              title="View Ride Status"
              onPress={() => {
                navigation.navigate("RiderRideDetailsStack", {
                  screen: "RideStatus",
                  params: {
                    rideId: rideId,
                  },
                });
              }}
            />
          </View>
        </View>
      </OverlayBottomSheet>
    </SafeAreaView>
  );
};

const getStepName = (s: number) => {
  const names = ["Service Type", "Trip Structure", "Vehicle Type"];
  return names[s - 1];
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingVertical: 10 },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 100 },
  serviceTypeScroll: {
    marginBottom: 124,
  },
  serviceTypeScrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 0,
  },
  mainTitle: {
    marginTop: 32,
  },
  stepIndicator: { marginTop: 4 },
  progressContainer: { flexDirection: "row", marginTop: 16, marginBottom: 32 },
  progressStep: { flex: 1, height: 4, borderRadius: 2, marginRight: 6 },

  footer: {
    position: "absolute",
    bottom: 20,
    width: width,
    padding: 24,
    borderTopWidth: 1,
  },
  continueButton: {
    backgroundColor: "#2E66E7",
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#2E66E7",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  continueText: { color: "#FFF", fontSize: 16, fontWeight: "700" },
  placeholder: { height: 300, alignItems: "center", justifyContent: "center" },

  title: { fontSize: 24, fontWeight: "800", color: "#0F172A" },

  iconGlow: {
    width: 106,
    height: 106,
    borderRadius: 60,
    backgroundColor: "rgba(16, 185, 129, 0.1)", // Light emerald glow
    justifyContent: "center",
    alignItems: "center",
  },
  checkmarkCircle: {
    width: 96,
    height: 96,
    borderRadius: 50,
    backgroundColor: "#10B981", // Emerald 500
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },

  statusInfo: {
    textAlign: "center",
    lineHeight: 24,
  },
  statusDetail: {
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 16,
  },

  amountCard: {
    width: "100%",
    borderRadius: 24,
    paddingVertical: 32,
    alignItems: "center",
    marginBottom: 24,
  },
  amountLabel: {
    letterSpacing: 1,
    marginBottom: 8,
  },

  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default BookARide;
