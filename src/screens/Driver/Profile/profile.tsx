import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Dimensions,
} from "react-native";
import Constants from "expo-constants";
import {
  User,
  Star,
  ShieldCheck,
  Car,
  FileText,
  HelpCircle,
  ChevronRight,
  MessageCircle,
  Bell,
  Lock,
  Settings,
  LogOut,
} from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../../components/reuseables/header";
import useTheme from "../../../hooks/useThemes";
import { commonStyles } from "../../../styles/commonStyles";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useDriverProfile } from "../../../hooks/queries/useDriverProfile";
import { useUserStore } from "../../../store/userStore";
import ModalComponent from "../../../components/modals/modal";
import Buttons from "../../../components/buttons/buttons";
import { ProfileSkeleton } from "../../../components/skelentonAnimation/profileSkelenton";

const { width } = Dimensions.get("window");

const MenuItem = ({ icon: Icon, title, subtitle, isLast, onPress }: any) => {
  const { colors } = useTheme();
  const commonStyling = commonStyles(colors);

  return (
    <TouchableOpacity
      style={[
        styles.menuItem,
        {
          borderBottomWidth: !isLast ? 1 : 0,
          borderBottomColor: !isLast ? colors.lightPrimaryBlueBorder : "",
        },
      ]}
      onPress={onPress}
    >
      <View
        style={[
          styles.menuIconContainer,
          {
            backgroundColor: colors.surfaceBrand,
          },
        ]}
      >
        <Icon size={20} color={colors.primaryColor} />
      </View>
      <View style={styles.menuTextContainer}>
        <Text
          style={[
            commonStyling.title,
            {
              fontSize: 15,
              fontFamily: "SemiBold",
            },
          ]}
        >
          {title}
        </Text>
        <Text
          style={[
            commonStyling.subtitle,
            {
              fontSize: 12,
              fontFamily: "Medium",
            },
          ]}
        >
          {subtitle}
        </Text>
      </View>
      <ChevronRight size={18} color="#9CA3AF" />
    </TouchableOpacity>
  );
};

export default function DriverProfileScreen() {
  const { user } = useUserStore();
  const { colors, theme } = useTheme();
  const commonStyling = commonStyles(colors);
  const { data: profileData, isLoading } = useDriverProfile();
  const profile = profileData?.data;
  const [showLogoutModal, setshowLogoutModal] = useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const logout = useUserStore((state) => state.logout);

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  return (
    <SafeAreaView
      style={[
        styles.screenContainer,
        {
          backgroundColor: colors.surfacePrimary,
        },
      ]}
    >
      <StatusBar
        barStyle={theme === "light" ? "dark-content" : "light-content"}
      />

      <Header title="Profile" />

      <View>
        <ScrollView contentContainerStyle={{ paddingHorizontal: 20 }}>
          <View
            style={[
              styles.profileHero,
              {
                borderBottomColor: colors.lightPrimaryBlueBorder,
              },
            ]}
          >
            <View style={styles.avatarLarge}>
              <User color="#3B82F6" size={40} />
            </View>
            <View style={{ marginLeft: 20 }}>
              <Text
                style={[
                  commonStyling.title,
                  {
                    fontSize: 20,
                    fontFamily: "Bold",
                  },
                ]}
              >
                {user?.data?.first_name} {user?.data?.last_name}
              </Text>
              <View style={styles.ratingRow}>
                <Star size={16} color="#FBBF24" fill="#FBBF24" />
                <Text
                  style={[
                    styles.ratingVal,
                    commonStyling.title,
                    {
                      fontSize: 16,
                    },
                  ]}
                >
                  {profile?.rating}
                </Text>
                <Text
                  style={[
                    styles.rideCount,
                    commonStyling.subtitle,
                    {
                      fontSize: 14,
                    },
                  ]}
                >
                  ({profile?.total_trips} rides)
                </Text>
              </View>
              {profile?.is_approved && (
                <View style={styles.vBadge}>
                  <ShieldCheck size={12} color="#3B82F6" />
                  <Text
                    style={[
                      styles.vText,
                      {
                        fontSize: 12,
                        fontFamily: "Medium",
                        color: colors.primaryColor,
                      },
                    ]}
                  >
                    Verified
                  </Text>
                </View>
              )}
            </View>
          </View>
          <Text
            style={[
              styles.sectTitle,
              commonStyling.subtitle,
              {
                fontSize: 14,
                fontFamily: "SemiBold",
              },
            ]}
          >
            ACCOUNT
          </Text>
          <View
            style={[
              styles.card,
              {
                borderColor: colors.lightPrimaryBlueBorder,
              },
            ]}
          >
            <MenuItem
              icon={User}
              title="Personal Information"
              subtitle="Name, phone, email"
              onPress={() => {
                navigation.navigate("DriverProfileContentsStack", {
                  screen: "DriverPersonalInformationScreen",
                });
              }}
            />
            <MenuItem
              icon={Car}
              title="Vehicle Details"
              subtitle="Car info and documents"
              onPress={() => {
                navigation.navigate("DriverProfileContentsStack", {
                  screen: "VehicleDetails",
                });
              }}
            />
            {/* <MenuItem
              icon={FileText}
              title="Documents"
              subtitle="License, insurance, permits"
              isLast
              onPress={() => {
                navigation.navigate("DriverProfileContentsStack", {
                  screen: "DocumentsScreen",
                });
              }}
            /> */}
          </View>
          {/* <Text
            style={[
              styles.sectTitle,
              commonStyling.subtitle,
              {
                fontSize: 14,
                fontFamily: "SemiBold",
              },
            ]}
          >
            PAYMENTS
          </Text> */}
          {/* <View
            style={[
              styles.card,
              {
                borderColor: colors.lightPrimaryBlueBorder,
              },
            ]}
          >
            <MenuItem
              icon={CreditCard}
              title="Payout Methods"
              subtitle="Manage bank accounts"
              isLast
              onPress={() => {
                navigation.navigate("DriverProfileContentsStack", {
                  screen: "PayoutMethods",
                });
              }}
            />
          </View> */}
          <Text
            style={[
              styles.sectTitle,
              commonStyling.subtitle,
              {
                fontSize: 14,
                fontFamily: "SemiBold",
              },
            ]}
          >
            SUPPORT & SAFETY
          </Text>
          <View
            style={[
              styles.card,
              {
                borderColor: colors.lightPrimaryBlueBorder,
              },
            ]}
          >
            {/* <MenuItem
              icon={HelpCircle}
              title="Help Center"
              subtitle="FAQs and guides"
              onPress={() => {
                navigation.navigate("DriverProfileContentsStack", {
                  screen: "HelpCenter",
                });
              }}
            /> */}

            <MenuItem
              icon={MessageCircle}
              title="Contact Support"
              subtitle="Get help from our team"
              onPress={() => {
                navigation.navigate("DriverProfileContentsStack", {
                  screen: "ContactSupport",
                });
              }}
            />

            {/* <MenuItem
              icon={ShieldCheck}
              title="Safety Center"
              subtitle="Safety features and resources"
              isLast
              onPress={() => {
                navigation.navigate("DriverProfileContentsStack", {
                  screen: "SafetyCenter",
                });
              }}
            /> */}
          </View>

          <Text
            style={[
              styles.sectTitle,
              commonStyling.subtitle,
              {
                fontSize: 14,
                fontFamily: "SemiBold",
              },
            ]}
          >
            SETTINGS
          </Text>
          <View
            style={[
              styles.card,
              {
                borderColor: colors.lightPrimaryBlueBorder,
              },
            ]}
          >
            <MenuItem
              icon={Bell}
              title="Notifications"
              subtitle="Manage notification settings"
              onPress={() => {
                navigation.navigate("DriverProfileContentsStack", {
                  screen: "NotificationsScreen",
                });
              }}
            />

            <MenuItem
              icon={Lock}
              title="Privacy & Security"
              subtitle="Password and privacy settings"
              onPress={() => {
                navigation.navigate("DriverProfileContentsStack", {
                  screen: "PrivacySecurityScreen",
                });
              }}
            />

            <MenuItem
              icon={Settings}
              title="App Settings"
              subtitle="Language, region, preferences"
              isLast
              onPress={() => {
                navigation.navigate("DriverProfileContentsStack", {
                  screen: "AppSettings",
                });
              }}
            />
          </View>

          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={() => {
              setshowLogoutModal(true);
            }}
          >
            <LogOut size={20} color="#EF4444" />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>

          <Text style={styles.versionText}>
            MediGo v{Constants.expoConfig?.version}
          </Text>
          <Text style={styles.copyrightText}>
            © 2026 MediGo. All rights reserved.
          </Text>
        </ScrollView>
      </View>

      <ModalComponent
        visible={showLogoutModal}
        onClose={() => setshowLogoutModal(false)}
        title="Log out"
      >
        <Text style={[commonStyling.subtitle, styles.modalSubtitle]}>
          Are you sure you want to log out?
        </Text>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 16,
          }}
        >
          <View
            style={{
              width: width * 0.38,
            }}
          >
            <Buttons
              type="inactive"
              title="No"
              onPress={() => {
                setshowLogoutModal(false);
              }}
            />
          </View>
          <View
            style={{
              width: width * 0.38,
            }}
          >
            <Buttons
              type="danger"
              title="Yes"
              onPress={async () => {
                await logout();
                navigation.reset({
                  index: 0,
                  routes: [
                    {
                      name: "Auth",
                      params: { screen: "Login" },
                    },
                  ],
                });

                setshowLogoutModal(false);
              }}
            />
          </View>
        </View>
      </ModalComponent>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screenContainer: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
  },
  headerIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F9FAFB",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitleText: { fontSize: 18, fontWeight: "700", color: "#111827" },
  notifBadge: {
    position: "absolute",
    right: -2,
    top: -2,
    backgroundColor: "#EF4444",
    borderRadius: 8,
    width: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  notifBadgeText: { color: "#FFF", fontSize: 10, fontWeight: "700" },

  chatRow: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 16,
    marginBottom: 8,
  },
  chatRowActive: { backgroundColor: "#F8FAFC" },
  avatarCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#EBF2FF",
    justifyContent: "center",
    alignItems: "center",
  },
  onlineDot: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#22C55E",
    borderWidth: 2,
    borderColor: "#FFF",
  },
  chatContent: { flex: 1, marginLeft: 15 },
  chatHeaderRow: { flexDirection: "row", justifyContent: "space-between" },
  chatName: { fontSize: 16, fontWeight: "700", color: "#111827" },
  chatTime: { fontSize: 12, color: "#9CA3AF" },
  appointmentRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  appointmentText: { fontSize: 12, color: "#9CA3AF", marginLeft: 6 },
  messageRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  messagePreview: { fontSize: 14, color: "#6B7280", flex: 1 },
  unreadBadge: {
    backgroundColor: "#3B82F6",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  unreadText: { color: "#FFF", fontSize: 11, fontWeight: "700" },

  detailHeader: {
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    paddingBottom: 15,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  detailUserInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
  },
  avatarCircleSmall: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#EBF2FF",
    justifyContent: "center",
    alignItems: "center",
  },
  statusRow: { flexDirection: "row", alignItems: "center", marginTop: 2 },
  onlineDotSmall: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#22C55E",
    marginRight: 4,
  },
  statusText: { fontSize: 11, color: "#9CA3AF" },
  callBtn: { padding: 8 },
  tripSub: {
    textAlign: "center",
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 10,
  },
  chatBg: { flex: 1, backgroundColor: "#F9FAFB" }, // Note: Background dots would be an image/SVG
  msgWrapper: { marginBottom: 15, maxWidth: "80%" },
  msgBubble: { padding: 14, borderRadius: 16 },
  sentBubble: { backgroundColor: "#3B82F6", borderBottomRightRadius: 4 },
  receivedBubble: { backgroundColor: "#F3F4F6", borderBottomLeftRadius: 4 },
  msgText: { fontSize: 14, lineHeight: 20 },
  msgTime: { fontSize: 11, color: "#9CA3AF", marginTop: 4, textAlign: "right" },
  inputArea: {
    padding: 20,
    backgroundColor: "#FFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 25,
    paddingHorizontal: 16,
    height: 50,
  },
  textInput: { flex: 1, color: "#111827" },

  profileHero: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 25,
    borderBottomWidth: 1,
    marginBottom: 20,
  },
  avatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#EBF2FF",
    justifyContent: "center",
    alignItems: "center",
  },
  ratingRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  ratingVal: { marginLeft: 4 },
  rideCount: { marginLeft: 4 },
  vBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    marginTop: 8,
    alignSelf: "flex-start",
  },
  vText: { marginLeft: 4 },
  sectTitle: {
    marginBottom: 10,
    marginTop: 10,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 20,
  },
  menuItem: { flexDirection: "row", alignItems: "center", padding: 15 },
  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  menuTextContainer: { flex: 1, marginLeft: 12 },
  logoutBtn: {
    flexDirection: "row",
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "#FEE2E2",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 32,
    gap: 10,
  },
  logoutText: { color: "#EF4444", fontSize: 16, fontWeight: "800" },

  versionText: {
    textAlign: "center",
    fontSize: 12,
    color: "#94A3B8",
    marginTop: 24,
  },
  copyrightText: {
    textAlign: "center",
    fontSize: 11,
    color: "#CBD5E1",
    marginTop: 4,
    marginBottom: 50,
  },
  modalSubtitle: {
    marginBottom: 20,
    marginTop: 16,
  },
});
