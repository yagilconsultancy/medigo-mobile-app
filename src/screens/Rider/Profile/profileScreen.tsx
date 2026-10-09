import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Image,
  Switch,
  Dimensions,
} from "react-native";
import {
  ChevronRight,
  User,
  MapPin,
  Heart,
  Shield,
  Bell,
  HelpCircle,
  Sun,
  LogOut,
  Trash2,
} from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import useTheme from "../../../hooks/useThemes";
import Header from "../../../components/reuseables/header";
import { commonStyles } from "../../../styles/commonStyles";
import { useUserProfile } from "../../../hooks/queries/useUserProfile";
import { useUserStore } from "../../../store/userStore";
import ModalComponent from "../../../components/modals/modal";
import Buttons from "../../../components/buttons/buttons";
import { ProfileSkeleton } from "../../../components/skelentonAnimation/profileSkelenton";
import DeleteAccountModal from "../../../components/modals/deleteAccountModal";
import Toast from "react-native-toast-message";
import Constants from "expo-constants";

const { width } = Dimensions.get("window");

const ProfileScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { colors, toggleTheme, theme } = useTheme();
  const isLight = theme === "light";
  const commonStyling = commonStyles(colors);
  const { data, isLoading } = useUserProfile();
  const logout = useUserStore((state) => state.logout);
  const [showLogoutModal, setshowLogoutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  if (isLoading) {
    return <ProfileSkeleton />;
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

      <Header title="Profile" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* User Profile Info */}
        <View style={styles.profileSection}>
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
          <View>
            <Text
              style={[
                commonStyling.title,
                {
                  fontFamily: "Bold",
                  fontSize: 24,
                },
              ]}
            >
              {data?.data.first_name} {data?.data.last_name}
            </Text>
            <Text
              style={[
                commonStyling.subtitle,
                {
                  fontSize: 14,
                  marginTop: 4,
                },
              ]}
            >
              {data?.data.email ? data?.data.email : data?.data.phone}
            </Text>
          </View>
        </View>

        {/* --- ACCOUNT SECTION --- */}
        <Text
          style={[
            styles.categoryLabel,
            commonStyling.subtitle,
            {
              fontFamily: "SemiBold",
              fontSize: 11,
            },
          ]}
        >
          ACCOUNT
        </Text>
        <View
          style={[
            styles.settingsGroup,
            {
              backgroundColor: colors.surfaceSecondary,
              borderColor: colors.lightPrimaryBlueBorder,
            },
          ]}
        >
          <MenuOption
            icon={<User size={20} color="#64748B" />}
            label="Personal Information"
            onPress={() => {
              navigation.navigate("RiderProfileContentsStack", {
                screen: "PersonalInformationScreen",
              });
            }}
          />
          <View
            style={[
              styles.divider,
              {
                backgroundColor: colors.lightPrimaryBlueBorder,
              },
            ]}
          />
          <MenuOption
            icon={<MapPin size={20} color="#64748B" />}
            label="Saved Locations"
            onPress={() => {
              navigation.navigate("RiderProfileContentsStack", {
                screen: "SavedLocationsScreen",
              });
            }}
          />
          {/* <View
            style={[
              styles.divider,
              {
                backgroundColor: colors.lightPrimaryBlueBorder,
              },
            ]}
          /> */}
          {/* <MenuOption
            icon={<CreditCard size={20} color="#64748B" />}
            label="Payment Methods"
            onPress={() => {
              navigation.navigate("RiderProfileContentsStack", {
                screen: "PaymentMethodsScreen",
              });
            }}
          /> */}
        </View>

        {/* --- SAFETY SECTION --- */}
        <Text
          style={[
            styles.categoryLabel,
            commonStyling.subtitle,
            {
              fontFamily: "SemiBold",
              fontSize: 11,
            },
          ]}
        >
          SAFETY
        </Text>
        <View
          style={[
            styles.settingsGroup,
            {
              backgroundColor: colors.surfaceSecondary,
              borderColor: colors.lightPrimaryBlueBorder,
            },
          ]}
        >
          <MenuOption
            icon={<Heart size={20} color="#64748B" />}
            label="Emergency Contacts"
            onPress={() => {
              navigation.navigate("RiderProfileContentsStack", {
                screen: "EmergencyContactsScreen",
              });
            }}
          />
          <View
            style={[
              styles.divider,
              {
                backgroundColor: colors.lightPrimaryBlueBorder,
              },
            ]}
          />
          <MenuOption
            icon={<Shield size={20} color="#64748B" />}
            label="Safety Center"
            onPress={() => {
              navigation.navigate("RiderProfileContentsStack", {
                screen: "SafetyCenterScreen",
              });
            }}
          />
        </View>

        {/* --- PREFERENCES SECTION --- */}
        <Text
          style={[
            styles.categoryLabel,
            commonStyling.subtitle,
            {
              fontFamily: "SemiBold",
              fontSize: 11,
            },
          ]}
        >
          PREFERENCES
        </Text>
        <View
          style={[
            styles.settingsGroup,
            {
              backgroundColor: colors.surfaceSecondary,
              borderColor: colors.lightPrimaryBlueBorder,
            },
          ]}
        >
          <MenuOption
            icon={<Bell size={20} color="#64748B" />}
            label="Notifications"
            onPress={() => {
              navigation.navigate("RiderProfileContentsStack", {
                screen: "NotificationSettingsScreen",
              });
            }}
          />
        </View>

        {/* --- SUPPORT SECTION --- */}
        {/* <Text
          style={[
            styles.categoryLabel,
            commonStyling.subtitle,
            {
              fontFamily: "SemiBold",
              fontSize: 11,
            },
          ]}
        >
          SUPPORT
        </Text>
        <View
          style={[
            styles.settingsGroup,
            {
              backgroundColor: colors.surfaceSecondary,
              borderColor: colors.lightPrimaryBlueBorder,
            },
          ]}
        >
          <MenuOption
            icon={<HelpCircle size={20} color="#64748B" />}
            label="Help Center"
            onPress={() => {
              navigation.navigate("DriverProfileContentsStack", {
                screen: "HelpCenter",
              });
            }}
          />
        </View> */}

        {/* --- APP PREFERENCES SECTION --- */}
        <Text
          style={[
            styles.categoryLabel,
            commonStyling.subtitle,
            {
              fontFamily: "SemiBold",
              fontSize: 11,
            },
          ]}
        >
          APP PREFERENCES
        </Text>
        <View
          style={[
            styles.settingsGroup,
            {
              backgroundColor: colors.surfaceSecondary,
              borderColor: colors.lightPrimaryBlueBorder,
            },
          ]}
        >
          <View style={styles.toggleRow}>
            <View style={styles.iconCircleYellow}>
              <Sun size={20} color="#F59E0B" />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text
                style={[
                  styles.optionLabel,
                  commonStyling.title,
                  {
                    fontSize: 16,
                  },
                ]}
              >
                Light mode
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
                Currently using {isLight ? "light" : "dark"} theme
              </Text>
            </View>
            <Switch
              value={isLight}
              onValueChange={() => {
                toggleTheme();
              }}
              trackColor={{ false: "#E2E8F0", true: "#3B82F6" }}
            />
          </View>
        </View>

      

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() => {
            setshowLogoutModal(true);
          }}
        >
          <LogOut size={20} color="#EF4444" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
          {/* Delete Account Button */}
        <TouchableOpacity
          style={styles.deleteAccountBtn}
          onPress={() => setShowDeleteModal(true)}
        >
          <Trash2 size={20} color="#EF4444" />
          <Text style={styles.deleteAccountText}>Delete Account</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>MediGo MediGo v{Constants.expoConfig?.version}</Text>
        <Text style={styles.copyrightText}>
          © 2026 MediGo. All rights reserved.
        </Text>
      </ScrollView>

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

      <DeleteAccountModal
        visible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
      />
    </SafeAreaView>
  );
};

// --- Helpers ---
const MenuOption = ({ icon, label, onPress }: any) => {
  const { colors } = useTheme();
  const commonStyling = commonStyles(colors);

  return (
    <TouchableOpacity style={styles.optionRow} onPress={onPress}>
      <View style={styles.iconWrapper}>{icon}</View>
      <Text
        style={[
          styles.optionLabel,
          commonStyling.title,
          {
            fontSize: 16,
          },
        ]}
      >
        {label}
      </Text>
      <ChevronRight size={18} color="#CBD5E1" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  headerTitle: { fontSize: 18, fontWeight: "800", color: "#1E293B" },

  scrollContent: { paddingHorizontal: 20, paddingBottom: 50 },
  profileSection: {
    marginVertical: 24,
    flexDirection: "row",
    columnGap: 24,
    alignItems: "center",
  },
  avatar: { width: 80, height: 80, borderRadius: 50 },

  categoryLabel: {
    letterSpacing: 1,
    marginTop: 24,
    marginBottom: 12,
  },
  settingsGroup: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: "hidden",
  },
  optionRow: { flexDirection: "row", alignItems: "center", padding: 16 },
  iconWrapper: { width: 24, alignItems: "center" },
  optionLabel: {
    flex: 1,
    marginLeft: 12,
  },
  divider: { height: 1, marginHorizontal: 16 },

  toggleRow: { flexDirection: "row", alignItems: "center", padding: 16 },
  iconCircleYellow: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FEF3C7",
    justifyContent: "center",
    alignItems: "center",
  },
  optionSub: { marginTop: 2 },

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
  deleteAccountBtn: {
    flexDirection: "row",
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "#FEE2E2",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
    gap: 10,
  },
  deleteAccountText: { color: "#EF4444", fontSize: 16, fontWeight: "800" },

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
    marginBottom: 24,
  },
  modalSubtitle: {
    marginBottom: 20,
    marginTop: 16,
  },
});

export default ProfileScreen;
