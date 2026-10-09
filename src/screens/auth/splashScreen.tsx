import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  StatusBar,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ShieldCheck, Car } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import Buttons from "../../components/buttons/buttons";
import Input from "../../components/inputs/input";
import authService from "../../api/services/authService";
import RightArrow from "../../../assets/icons/rightArrow";
import { FONT_SIZES } from "../../constants/sizes";
import useTheme from "../../hooks/useThemes";
import { commonStyles } from "../../styles/commonStyles";
import { requestLocationPermission } from "../../services/location";
import { reverseGeocode } from "../../services/geocode";
import { useMapStore } from "../../store/mapStore";
import { useRideStore } from "../../store/useRideStore";
import { storage } from "../../utils/storage";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { syncUserProfile } from "../../utils/syncUserProfile";
import { getPostAuthRoute } from "../../utils/authRouting";

const { width } = Dimensions.get("window");

type ScreenStep =
  | "splash1"
  | "splash2"
  | "onboarding1"
  | "onboarding2"
  | "onboarding3"
  | "selection";

export default function MediGoApp() {
  const route = useRoute<any>();
  // Sent here from the Login screen's "Driver? Activate your account" link:
  // skip the intro and open the role screen on the Driver tab.
  const startRole: Role | undefined = route.params?.startRole;
  const [step, setStep] = useState<ScreenStep>(
    startRole ? "selection" : "splash1",
  );
  const { colors, theme } = useTheme();
  const setUserRegion = useMapStore((state) => state.setUserRegion);
  const setPickup = useRideStore((state) => state.setPickup);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [targetRoute, setTargetRoute] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const checkAuth = async () => {
      try {
        const token = await storage.getToken();

        if (!token) {
          if (!cancelled) setTargetRoute(null);
          return;
        }

        const profile = await syncUserProfile();

        if (!cancelled) {
          setTargetRoute(profile ? getPostAuthRoute(profile) : null);
        }
      } catch (e) {
        if (!cancelled) setTargetRoute(null);
      } finally {
        if (!cancelled) setAuthChecked(true);
      }
    };

    checkAuth();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (step === "splash1") {
      setTimeout(() => setStep("splash2"), 1500);
    } else if (step === "splash2" && authChecked && targetRoute) {
      navigation.reset({
        index: 0,
        routes: [{ name: targetRoute }],
      });
    } else if (step === "splash2" && authChecked && !targetRoute) {
      setTimeout(() => setStep("onboarding1"), 1500);
    }
  }, [step, authChecked, navigation, targetRoute]);

  const handleLocationRequest = async () => {
    const location = await requestLocationPermission();
    if (!location) return;

    const { latitude, longitude } = location.coords;

    const address = await reverseGeocode(latitude, longitude);
    setUserRegion(latitude, longitude, address);

    setPickup({
      address,
      latitude,
      longitude,
    });
  };

  useEffect(() => {
    handleLocationRequest();
  }, []);

  const Pagination = ({ activeIndex }: { activeIndex: number }) => (
    <View style={styles.paginationContainer}>
      {[0, 1, 2].map((i) => (
        <View
          key={i}
          style={[
            styles.dot,
            activeIndex === i ? styles.activeDot : styles.inactiveDot,
            {
              backgroundColor:
                activeIndex === i ? colors.primaryColor : colors.stroke,
            },
          ]}
        />
      ))}
    </View>
  );

  if (step === "splash1" || step === "splash2") {
    return (
      <LinearGradient colors={["#1A3B8E", "#06102B"]} style={styles.fullScreen}>
        <StatusBar barStyle="light-content" />
        {step === "splash2" && (
          <View style={styles.logoContainer}>
            <Image
              source={require("../../../assets/med.png")}
              style={styles.logoPlaceholder}
              resizeMode="contain"
            />
          </View>
        )}
      </LinearGradient>
    );
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

      {step !== "selection" ? (
        <>
          <View style={styles.illustrationArea}>
            {step === "onboarding1" && (
              <Image
                source={require("../../../assets/images/onboarding1.png")}
                style={styles.illustration}
              />
            )}
            {step === "onboarding2" && (
              <Image
                source={require("../../../assets/images/onboarding2.png")}
                style={styles.illustration}
              />
            )}
            {step === "onboarding3" && (
              <Image
                source={require("../../../assets/images/onboarding3.png")}
                style={styles.illustration}
              />
            )}
          </View>

          <View style={styles.contentCard}>
            <Pagination
              activeIndex={
                step === "onboarding1" ? 0 : step === "onboarding2" ? 1 : 2
              }
            />
            <OnboardingContent
              title={
                step === "onboarding1"
                  ? "Safe Medical Rides."
                  : step === "onboarding2"
                    ? "Verified Trusted Drivers"
                    : "Simple Ride Booking"
              }
              desc={
                step === "onboarding1"
                  ? "Reliable transportation to hospitals, clinics, and care centers."
                  : step === "onboarding2"
                    ? "All drivers are pre-approved and background-checked for your safety."
                    : "Request a ride instantly and track your driver in real time."
              }
              btnText={step === "onboarding3" ? "Get Started" : "Continue"}
              onPress={() =>
                setStep(
                  step === "onboarding1"
                    ? "onboarding2"
                    : step === "onboarding2"
                      ? "onboarding3"
                      : "selection",
                )
              }
            />
          </View>
        </>
      ) : (
        <View style={styles.selectionWrapper}>
          <RoleSelection initialRole={startRole} />
        </View>
      )}
    </SafeAreaView>
  );
}

const OnboardingContent = ({ title, desc, btnText, onPress }: any) => {
  const { colors } = useTheme();
  const commonStyling = commonStyles(colors);

  return (
    <View style={styles.innerContent}>
      <Text style={[commonStyling.title, styles.title]}>{title}</Text>
      <Text style={[commonStyling.subtitle, styles.description]}>{desc}</Text>

      <View style={{ width: "100%" }}>
        <Buttons title={btnText} onPress={onPress} rightIcon={<RightArrow />} />
      </View>
    </View>
  );
};

type Role = "rider" | "driver";

const DRIVER_NOT_ACTIVATED_MESSAGE =
  "Your account isn't activated yet. Please email support@getmedigo.com to start your application.";

/**
 * One entry screen for everyone. A Rider | Driver switch decides what is shown:
 *  - Rider: Sign up and Log in.
 *  - Driver: no sign up. The driver enters their email and the system checks
 *    whether an admin has activated the account.
 */
const RoleSelection = ({ initialRole }: { initialRole?: Role }) => {
  const navigation = useNavigation<any>();
  const { colors } = useTheme();
  const commonStyling = commonStyles(colors);

  const [role, setRole] = useState<Role>(initialRole ?? "rider");
  const [driverEmail, setDriverEmail] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [driverMessage, setDriverMessage] = useState<string | null>(null);

  const handleDriverContinue = async () => {
    const email = driverEmail.trim().toLowerCase();
    setDriverMessage(null);

    if (!email || !email.includes("@")) {
      setDriverMessage("Enter the email address your driver account uses.");
      return;
    }

    setIsChecking(true);
    try {
      const result = await authService.checkDriverActivation(email);
      const step = result?.data?.next_step;

      if (step === "set_password") {
        navigation.navigate("DriverActivation", { email });
      } else if (step === "login") {
        navigation.navigate("Login", { email });
      } else {
        setDriverMessage(result?.data?.message || DRIVER_NOT_ACTIVATED_MESSAGE);
      }
    } catch (e: any) {
      setDriverMessage(
        e?.response?.data?.message ||
          "We couldn't reach MediGo. Check your connection and try again.",
      );
    } finally {
      setIsChecking(false);
    }
  };

  const Segment = ({ value, label }: { value: Role; label: string }) => {
    const active = role === value;
    return (
      <TouchableOpacity
        style={[
          styles.segment,
          active && { backgroundColor: colors.primaryColor },
        ]}
        onPress={() => {
          setRole(value);
          setDriverMessage(null);
        }}
        accessibilityRole="button"
        accessibilityState={{ selected: active }}
      >
        <Text
          style={[
            commonStyling.subtitle,
            styles.segmentText,
            { color: active ? "#FFF" : colors.titleText },
          ]}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView
      style={styles.selectionInner}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <Text style={[commonStyling.title, styles.titleLeft]}>
        Welcome to MediGo
      </Text>
      <Text style={[commonStyling.subtitle, styles.descriptionLeft]}>
        Choose how you'll use MediGo.
      </Text>

      <View style={[styles.segmentWrap, { borderColor: colors.stroke }]}>
        <Segment value="rider" label="Rider" />
        <Segment value="driver" label="Driver" />
      </View>

      {role === "rider" ? (
        <View>
          <View style={styles.panelHeader}>
            <View style={styles.iconBoxBlue}>
              <Car color="#3B82F6" size={32} />
            </View>
            <Text
              style={[
                commonStyling.title,
                styles.panelTitle,
                { color: colors.titleText },
              ]}
            >
              Book safe medical rides
            </Text>
            <Text style={[commonStyling.subtitle, styles.panelText]}>
              Request reliable transportation to hospitals, clinics, and care
              centers.
            </Text>
          </View>

          <Buttons
            title="Sign up"
            onPress={() => navigation.navigate("RiderRegistrationFlow")}
            rightIcon={<RightArrow />}
          />
          <View style={{ height: 12 }} />
          <Buttons
            title="Log in"
            type="outline"
            onPress={() => navigation.navigate("Login")}
          />
        </View>
      ) : (
        <View>
          <View style={styles.panelHeader}>
            <View style={styles.iconBoxBlue}>
              <ShieldCheck color="#3B82F6" size={32} />
            </View>
            <Text
              style={[
                commonStyling.title,
                styles.panelTitle,
                { color: colors.titleText },
              ]}
            >
              Drive with MediGo
            </Text>
            <Text style={[commonStyling.subtitle, styles.panelText]}>
              For pre-approved drivers only. Enter the email your driver
              account was created with.
            </Text>
          </View>

          <Input
            title="Email address"
            placeholder="you@example.com"
            value={driverEmail}
            keyboardType="email-address"
            onChangeText={(val) => {
              setDriverEmail(val);
              setDriverMessage(null);
            }}
            disabled={isChecking}
          />

          {driverMessage ? (
            <View
              style={[
                styles.driverNotice,
                { backgroundColor: colors.highlightBlue50 },
              ]}
            >
              <Text
                style={[
                  commonStyling.subtitle,
                  {
                    color: colors.primaryColor,
                    fontSize: 14,
                    lineHeight: 20,
                  },
                ]}
              >
                {driverMessage}
              </Text>
            </View>
          ) : null}

          <View style={{ marginTop: 20 }}>
            <Buttons
              title="Continue"
              onPress={handleDriverContinue}
              loading={isChecking}
              rightIcon={<RightArrow />}
            />
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  fullScreen: { flex: 1, justifyContent: "center", alignItems: "center" },
  container: { flex: 1 },
  logoContainer: { alignItems: "center" },
  logoPlaceholder: { width: 330, height: 330 },
  splashText: {
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
    marginTop: 10,
  },
  illustrationArea: { flex: 1, justifyContent: "center", alignItems: "center" },
  illustration: {
    width: width,
    height: width * 0.7,
    resizeMode: "contain",
  },

  selectionWrapper: { flex: 1, paddingHorizontal: 30, paddingTop: 30 },
  selectionInner: { flex: 1 },

  contentCard: { paddingHorizontal: 30, paddingBottom: 40 },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 30,
  },
  dot: { height: 6, borderRadius: 3, marginHorizontal: 3 },
  activeDot: { width: 20 },
  inactiveDot: { width: 6 },

  innerContent: { alignItems: "center" },
  title: {
    fontSize: FONT_SIZES.HERO,
    textAlign: "center",
    marginBottom: 15,
    fontFamily: "Bold",
  },
  description: {
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 40,
  },

  titleLeft: {
    fontSize: FONT_SIZES.HERO,
    fontFamily: "Bold",
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  descriptionLeft: {
    alignSelf: "flex-start",
    marginBottom: 32,
  },

  roleCardPrimary: {
    width: "100%",
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    minHeight: 200,
  },
  roleCardSecondary: {
    width: "100%",
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 30,
    height: 200,
  },
  roleRow: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
  },

  iconBoxLight: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 8,
    height: 64,
    width: 64,
    justifyContent: "center",
    alignItems: "center",
  },
  iconBoxBlue: {
    backgroundColor: "#E8F1FF",
    height: 64,
    width: 64,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },

  roleTitleLight: { color: "#FFF" },
  roleDescLight: { color: "rgba(255,255,255,0.8)", marginTop: 8 },
  roleDescDark: { marginTop: 8 },

  segmentWrap: {
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 14,
    padding: 4,
    marginBottom: 28,
  },
  segment: {
    flex: 1,
    height: 48,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  segmentText: { fontFamily: "Bold", fontSize: 16 },
  panelHeader: { alignItems: "flex-start", marginBottom: 24 },
  panelTitle: { fontFamily: "Bold", fontSize: FONT_SIZES.TITLE, marginTop: 16 },
  panelText: { marginTop: 8, lineHeight: 22 },
  driverNotice: {
    marginTop: 16,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2F6FED33",
  },
  footerContainer: { marginTop: "auto", paddingBottom: 20 },
  footerText: { textAlign: "center" },
  linkText: { fontWeight: "700" },
});
