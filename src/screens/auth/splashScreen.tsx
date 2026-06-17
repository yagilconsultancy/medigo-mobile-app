import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ShieldCheck, MapPin, Car, ChevronRight } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import Buttons from "../../components/buttons/buttons";
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
import { useUserStore } from "../../store/userStore";

const { width } = Dimensions.get("window");

type ScreenStep =
  | "splash1"
  | "splash2"
  | "onboarding1"
  | "onboarding2"
  | "onboarding3"
  | "selection";

export default function MediGoApp() {
  const [step, setStep] = useState<ScreenStep>("splash1");
  const { colors, theme } = useTheme();
  const { user } = useUserStore();
  const setUserRegion = useMapStore((state) => state.setUserRegion);
  const setPickup = useRideStore((state) => state.setPickup);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [targetUser, setTargetUser] = useState<any>(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      // Set a maximum wait time of 5 seconds
      const timeout = setTimeout(() => {
        setAuthChecked(true);
        setTargetUser(null);
      }, 5000);

      try {
        const storedUser = await storage.getToken();
        console.log(storedUser);
        setTargetUser(storedUser);
      } catch (e) {
        setTargetUser(null);
      } finally {
        clearTimeout(timeout);
        setAuthChecked(true);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if (step === "splash1") {
      setTimeout(() => setStep("splash2"), 1500);
    } else if (step === "splash2" && authChecked && targetUser) {
      // 4. Role-based Navigation
      const role = user?.data.role?.toLowerCase();

      if (role === "driver") {
        navigation.reset({
          index: 0,
          routes: [{ name: "DriverMainTabs" }],
        });
      } else {
        navigation.reset({
          index: 0,
          routes: [{ name: "RiderMainTabs" }],
        });
      }
    } else if (step === "splash2" && authChecked && !targetUser) {
      setTimeout(() => setStep("onboarding1"), 1500);
    }
  }, [step, authChecked, targetUser]);

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
          <RoleSelection />
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

const RoleSelection = () => {
  const navigation = useNavigation<any>();
  const { colors } = useTheme();
  const commonStyling = commonStyles(colors);
  return (
    <View style={styles.selectionInner}>
      <Text style={[commonStyling.title, styles.titleLeft]}>
        How will you use MediGo?
      </Text>
      <Text style={[commonStyling.subtitle, styles.descriptionLeft]}>
        Select how you'll use MediGo.
      </Text>

      <TouchableOpacity
        style={[
          styles.roleCardPrimary,
          {
            backgroundColor: colors.primaryColor,
          },
        ]}
        onPress={() => navigation.navigate("RiderRegistrationFlow")}
      >
        <View style={styles.iconBoxLight}>
          <Car color="#FFF" size={32} />
        </View>
        <View style={styles.roleRow}>
          <View>
            <Text
              style={[
                commonStyling.title,
                styles.roleTitleLight,
                {
                  fontFamily: "Bold",
                  fontSize: FONT_SIZES.TITLE,
                },
              ]}
            >
              Book a Ride
            </Text>
            <Text style={[commonStyling.subtitle, styles.roleDescLight]}>
              Request safe medical transportation.
            </Text>
          </View>
          <RightArrow color="white" />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.roleCardSecondary,
          {
            borderColor: colors.stroke,
          },
        ]}
        onPress={() => navigation.navigate("WelcomeDriverScreen")}
      >
        <View style={styles.iconBoxBlue}>
          <ShieldCheck color="#3B82F6" size={32} />
        </View>
        <View style={styles.roleRow}>
          <View>
            <Text
              style={[
                commonStyling.title,
                {
                  fontFamily: "Bold",
                  fontSize: FONT_SIZES.TITLE,
                  color: colors.titleText,
                },
              ]}
            >
              Drive with MediGo
            </Text>
            <Text style={[commonStyling.subtitle, styles.roleDescDark]}>
              For pre-approved drivers only.
            </Text>
          </View>
          <RightArrow color={colors.primaryColor} />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.footerContainer}
        onPress={() => {
          navigation.navigate("Login");
        }}
      >
        <Text
          style={[
            commonStyling.subtitle,
            styles.footerText,
            {
              fontSize: FONT_SIZES.BODY,
              fontFamily: "SemiBold",
            },
          ]}
        >
          Already have an account?{" "}
          <Text
            style={[
              styles.linkText,
              {
                color: colors.primaryColor,
              },
            ]}
          >
            Log in
          </Text>
        </Text>
      </TouchableOpacity>
    </View>
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

  footerContainer: { marginTop: "auto", paddingBottom: 20 },
  footerText: { textAlign: "center" },
  linkText: { fontWeight: "700" },
});
