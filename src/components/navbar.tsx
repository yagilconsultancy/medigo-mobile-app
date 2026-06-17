import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import useTheme from "../hooks/useThemes";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { memo, useRef } from "react";
import {
  Plus,
  Home,
  Clock,
  History,
  User,
  Calendar,
  Car,
  X,
} from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FONT_SIZES } from "../constants/sizes";
import OverlayBottomSheet, {
  OverlayBottomSheetRef,
} from "./modals/overlayBottomSheet";
import { commonStyles } from "../styles/commonStyles";
import Buttons from "./buttons/buttons";
import { useRideStore } from "../store/useRideStore";

const { width } = Dimensions.get("window");

export default function Navbar({ state, navigation }: BottomTabBarProps) {
  const { colors } = useTheme();
  const activeIndex = state.index;
  const currentRouteName = state.routes[activeIndex].name;
  const bookRef = useRef<OverlayBottomSheetRef>(null);
  const commonStyling = commonStyles(colors);
  const setScheduledTrip = useRideStore((store) => store.setScheduledTrip);

  console.log(currentRouteName);

  const handleRideOptionPress = (scheduled: boolean) => {
    setScheduledTrip(scheduled);
    bookRef.current?.close();
    navigation.navigate("RiderRideDetailsStack", {
      screen: "BookARide",
      params: { scheduledTrip: scheduled },
    });
  };

  return (
    <View>
      <SafeAreaView
        edges={["bottom"]}
        style={{
          backgroundColor: colors.surfacePrimary,
          borderWidth: 1,
          borderColor: colors.lightPrimaryBlueBorder,
        }}
      >
        <View style={styles.tabBarContainer}>
          <View
            style={[
              styles.tabBar,
              {
                backgroundColor: colors.surfacePrimary,
              },
            ]}
          >
            <TabItem
              icon={
                <Home
                  color={
                    currentRouteName === "Main"
                      ? colors.primaryColor
                      : colors.navbarText
                  }
                  size={22}
                />
              }
              label="Home"
              active={currentRouteName === "Main"}
              onPress={() => {
                navigation.navigate("Main");
              }}
            />
            <TabItem
              icon={
                <Clock
                  color={
                    currentRouteName === "RiderRideStack"
                      ? colors.primaryColor
                      : colors.navbarText
                  }
                  size={22}
                />
              }
              label="My Rides"
              onPress={() => {
                navigation.navigate("RiderRideStack", {
                  screen: "MyRidesScreen",
                });
              }}
              active={currentRouteName === "RiderRideStack"}
            />

            {/* Floating Center Button */}
            <TouchableOpacity
              style={styles.centerBtnOuter}
              onPress={() => {
                bookRef.current?.open();
              }}
            >
              <LinearGradient
                colors={["#2F6FED", "#1E4DB7"]}
                style={styles.centerBtn}
              >
                <View>
                  <Plus color="#FFF" size={32} />
                </View>
              </LinearGradient>
            </TouchableOpacity>

            <TabItem
              icon={
                <History
                  color={
                    currentRouteName === "RiderHistoryStack"
                      ? colors.primaryColor
                      : colors.navbarText
                  }
                  size={22}
                />
              }
              label="History"
              onPress={() => {
                navigation.navigate("RiderHistoryStack", {
                  screen: "RideHistoryScreen",
                });
              }}
              active={currentRouteName === "RiderHistoryStack"}
            />
            <TabItem
              icon={
                <User
                  color={
                    currentRouteName === "RiderProfileStack"
                      ? colors.primaryColor
                      : colors.navbarText
                  }
                  size={22}
                />
              }
              label="Profile"
              onPress={() => {
                navigation.navigate("RiderProfileStack");
              }}
              active={currentRouteName === "RiderProfileStack"}
            />
          </View>
        </View>
      </SafeAreaView>

      <OverlayBottomSheet ref={bookRef} height={400} overlay={true}>
        <View
          style={[
            styles.modalContainer,
            {
              backgroundColor: colors.surfacePrimary,
            },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text
              style={[
                styles.headerTitle,
                commonStyling.title,
                {
                  fontSize: 20,
                  fontFamily: "Bold",
                },
              ]}
            >
              When do you need your ride?
            </Text>
            <TouchableOpacity
              onPress={() => {
                bookRef.current?.close();
              }}
              style={styles.closeBtn}
            >
              <X color="#64748B" size={24} />
            </TouchableOpacity>
          </View>

          {/* Option: Ride Now */}
          <TouchableOpacity
            style={[
              styles.optionCard,
              {
                borderColor: colors.lightPrimaryBlueBorder,
              },
            ]}
            onPress={() => handleRideOptionPress(false)}
          >
            <View style={styles.iconContainer}>
              <Car color="#64748B" size={28} />
            </View>
            <View style={styles.textContainer}>
              <Text
                style={[
                  styles.optionTitle,
                  commonStyling.title,
                  {
                    fontSize: 16,
                    fontFamily: "Bold",
                  },
                ]}
              >
                Ride Now
              </Text>
              <Text
                style={[
                  styles.optionSub,
                  commonStyling.subtitle,
                  {
                    fontSize: 12,
                    fontFamily: "Medium",
                  },
                ]}
              >
                Request a driver for immediate pickup at your current location.
              </Text>
            </View>
          </TouchableOpacity>

          {/* Option: Schedule for Later */}
          <TouchableOpacity
            style={[
              styles.optionCard,
              {
                borderColor: colors.lightPrimaryBlueBorder,
              },
            ]}
            onPress={() => handleRideOptionPress(true)}
          >
            <View style={styles.iconContainer}>
              <Calendar color="#64748B" size={28} />
            </View>
            <View style={styles.textContainer}>
              <Text
                style={[
                  styles.optionTitle,
                  commonStyling.title,
                  {
                    fontSize: 16,
                    fontFamily: "Bold",
                  },
                ]}
              >
                Schedule for Later
              </Text>
              <Text
                style={[
                  styles.optionSub,
                  commonStyling.subtitle,
                  {
                    fontSize: 12,
                    fontFamily: "Medium",
                  },
                ]}
              >
                Choose a date and time for your medical appointment.
              </Text>
            </View>
          </TouchableOpacity>

          {/* Brand Footer */}
          <View style={styles.footer}>
            <View style={styles.greenDot} />
            <Text style={styles.footerText}>
              Trusted medical transportation for seniors
            </Text>
          </View>
        </View>
      </OverlayBottomSheet>
    </View>
  );
}

const TabItem = ({ icon, label, active, onPress, state }: any) => {
  const { colors } = useTheme();
  // const activeIndex = state.index;
  // const currentRouteName = state.routes[activeIndex].name;

  const commonStyling = commonStyles(colors);
  return (
    <TouchableOpacity style={styles.tabItem} onPress={onPress}>
      {icon}
      <Text
        style={[
          styles.tabLabel,
          commonStyling.subtitle,

          {
            fontSize: 12,
            color: active ? colors.primaryColor : colors.titleText,
            fontFamily: "Medium",
          },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    backgroundColor: "transparent",
    position: "absolute",
    bottom: Platform.OS === "ios" ? 20 : 45,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  tabBar: {
    flexDirection: "row",
    width: width,
    height: 70,
    paddingHorizontal: 30,
    alignItems: "center",
    justifyContent: "space-between",
  },
  tabItem: { alignItems: "center", justifyContent: "center" },
  tabLabel: { marginTop: 4 },
  centerBtnOuter: {
    marginTop: -50,
    borderRadius: 50,
    padding: 10,
  },
  centerBtn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 8,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 32,
  },
  headerTitle: {
    maxWidth: "80%",
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
  },
  optionCard: {
    flexDirection: "row",
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    marginBottom: 16,
    alignItems: "center",
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  optionTitle: {
    marginBottom: 6,
  },
  optionSub: {
    lineHeight: 20,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },
  greenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#10B981",
    marginRight: 8,
  },
  footerText: {
    fontSize: 13,
    color: "#94A3B8",
    fontWeight: "500",
  },
});
