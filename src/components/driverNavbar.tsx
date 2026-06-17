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
  CircleDollarSign,
  MessageSquare,
} from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FONT_SIZES } from "../constants/sizes";
import OverlayBottomSheet, {
  OverlayBottomSheetRef,
} from "./modals/overlayBottomSheet";
import { commonStyles } from "../styles/commonStyles";
import Buttons from "./buttons/buttons";

const { width } = Dimensions.get("window");

export default function DriverNavbar({ state, navigation }: BottomTabBarProps) {
  const { colors } = useTheme();
  const activeIndex = state.index;
  const currentRouteName = state.routes[activeIndex].name;
  const bookRef = useRef<OverlayBottomSheetRef>(null);
  const commonStyling = commonStyles(colors);

  console.log(currentRouteName);

  return (
    <View>
      <SafeAreaView
        edges={["bottom"]}
        style={{ backgroundColor: colors.surfacePrimary }}
      >
        <View
          style={[
            styles.bottomNav,
            {
              borderTopColor: colors.lightPrimaryBlueBorder,
            },
          ]}
        >
          <NavTab
            icon={
              <Home
                color={
                  currentRouteName === "DriverMain"
                    ? colors.primaryColor
                    : colors.subTitleText
                }
                size={24}
              />
            }
            label="Home"
            active={currentRouteName === "DriverMain"}
            onPress={() => {
              navigation.navigate("DriverMain");
            }}
          />
          <NavTab
            icon={
              <Calendar
                color={
                  currentRouteName === "DriverTripsStack"
                    ? colors.primaryColor
                    : colors.subTitleText
                }
                size={24}
              />
            }
            label="My Trips"
            onPress={() => {
              navigation.navigate("DriverTripsStack", {
                screen: "MyTripsScreen",
              });
            }}
            active={currentRouteName === "DriverTripsStack"}
          />
          <NavTab
            icon={
              <CircleDollarSign
                color={
                  currentRouteName === "DriverWalletStack"
                    ? colors.primaryColor
                    : colors.subTitleText
                }
                size={24}
              />
            }
            label="Earnings"
            onPress={() => {
              navigation.navigate("DriverWalletStack", {
                screen: "DriverEarningsDashboard",
              });
            }}
            active={currentRouteName === "DriverWalletStack"}
          />
          <NavTab
            icon={
              <MessageSquare
                color={
                  currentRouteName === "DriverChatStack"
                    ? colors.primaryColor
                    : colors.subTitleText
                }
                size={24}
              />
            }
            label="Chats"
            onPress={() => {
              navigation.navigate("RiderProfileContentsStack", {
                screen: "LiveChatScreen",
              });
            }}
            active={currentRouteName === "DriverChatStack"}
          />
          <NavTab
            icon={
              <User
                color={
                  currentRouteName === "DriverProfileStack"
                    ? colors.primaryColor
                    : colors.subTitleText
                }
                size={24}
              />
            }
            label="Profile"
            onPress={() => {
              navigation.navigate("DriverProfileStack", {
                screen: "DriverProfileScreen",
              });
            }}
            active={currentRouteName === "DriverProfileStack"}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}

const NavTab = ({ icon, label, active = false, onPress }: any) => {
  const { colors } = useTheme();
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
            fontFamily: "Medium",
            color: active ? colors.primaryColor : colors.subTitleText,
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
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    borderTopWidth: 1,
  },
});
