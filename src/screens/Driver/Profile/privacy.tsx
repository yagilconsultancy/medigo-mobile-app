import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Switch,
  Linking,
} from "react-native";
import {
  Lock,
  Smartphone,
  Key,
  MapPin,
  Eye,
  Share2,
  Download,
  Trash2,
  ShieldCheck,
  ChevronRight,
} from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../../components/reuseables/header";
import useTheme from "../../../hooks/useThemes";
import { commonStyles } from "../../../styles/commonStyles";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useUpdatePrivacy } from "../../../hooks/mutations/useUser";
import { UpdatePrivacyPayload } from "../../../types/user.types";
import { useDriverSettings } from "../../../hooks/queries/useDriverSettings";
import { NotificationsSettingsSkeleton } from "../../../components/skelentonAnimation/notificationSettingsSkelenton";
import { DELETE_ACCOUNT_URL } from "../../../utils/constants";
import Toast from "react-native-toast-message";

// ── Reusable row for API-backed toggles ──────────────────────────────────────
const PrivacyToggleRow = ({
  icon,
  iconBg,
  title,
  sub,
  value,
  onToggle,
}: {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  sub: string;
  value: boolean;
  onToggle: (val: boolean) => void;
}) => {
  const { colors } = useTheme();
  const commonStyling = commonStyles(colors);
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (val: boolean) => {
    setLocalValue(val);
    onToggle(val);
  };

  return (
    <View
      style={[styles.listItem, { borderColor: colors.lightPrimaryBlueBorder }]}
    >
      <View style={[styles.iconCircle, { backgroundColor: iconBg }]}>
        {icon}
      </View>
      <View style={styles.itemTextContainer}>
        <Text
          style={[commonStyling.title, { fontSize: 15, fontFamily: "Bold" }]}
        >
          {title}
        </Text>
        <Text
          style={[styles.itemSub, commonStyling.subtitle, { fontSize: 12 }]}
        >
          {sub}
        </Text>
      </View>
      <Switch
        trackColor={{ false: "#E2E8F0", true: "#3B82F6" }}
        thumbColor="#FFF"
        value={localValue}
        onValueChange={handleChange}
      />
    </View>
  );
};

// ── Reusable row for local-only toggles ──────────────────────────────────────
const LocalToggleRow = ({
  icon,
  iconBg,
  title,
  sub,
  value,
  onToggle,
}: {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  sub: string;
  value: boolean;
  onToggle: () => void;
}) => {
  const { colors } = useTheme();
  const commonStyling = commonStyles(colors);

  return (
    <View
      style={[styles.listItem, { borderColor: colors.lightPrimaryBlueBorder }]}
    >
      <View style={[styles.iconCircle, { backgroundColor: iconBg }]}>
        {icon}
      </View>
      <View style={styles.itemTextContainer}>
        <Text
          style={[commonStyling.title, { fontSize: 15, fontFamily: "Bold" }]}
        >
          {title}
        </Text>
        <Text
          style={[styles.itemSub, commonStyling.subtitle, { fontSize: 12 }]}
        >
          {sub}
        </Text>
      </View>
      <Switch
        trackColor={{ false: "#E2E8F0", true: "#3B82F6" }}
        thumbColor="#FFF"
        value={value}
        onValueChange={onToggle}
      />
    </View>
  );
};

// ── Main Screen ───────────────────────────────────────────────────────────────
const PrivacySecurityScreen = () => {
  const { colors, theme } = useTheme();
  const commonStyling = commonStyles(colors);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { data, isLoading } = useDriverSettings();
  const settingsValue = data?.data;
  const { mutate: updatePrivacy } = useUpdatePrivacy();

  // Local-only toggles (not yet wired to API)
  const [localSettings, setLocalSettings] = useState({
    twoFactor: true,
    historyVisibility: false,
    phoneSharing: true,
  });

  const handleDeleteAccount = async () => {
    // launch the url
    try {
      await Linking.openURL(DELETE_ACCOUNT_URL);
    } catch (error) {
      // show toast error
       Toast.show({
        text1: "Error opening URL",
        type: "error",
      });
    }
  };

  const toggleLocal = (key: keyof typeof localSettings) => {
    setLocalSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handlePrivacyToggle = (
    key: keyof UpdatePrivacyPayload,
    value: boolean,
  ) => {
    updatePrivacy({ [key]: value });
  };

  if (isLoading) {
    return <NotificationsSettingsSkeleton />;
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.surfacePrimary }]}
    >
      <StatusBar
        barStyle={theme === "light" ? "dark-content" : "light-content"}
      />
      <Header title="Privacy & Security" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Security ── */}
        <Text
          style={[
            styles.sectionLabel,
            commonStyling.title,
            { fontSize: 18, fontFamily: "Bold" },
          ]}
        >
          Security
        </Text>

        <TouchableOpacity
          style={[
            styles.listItem,
            { borderColor: colors.lightPrimaryBlueBorder },
          ]}
          onPress={() =>
            navigation.navigate("DriverProfileContentsStack", {
              screen: "ChangePassword",
            })
          }
        >
          <View
            style={[
              styles.iconCircle,
              { backgroundColor: colors.surfaceBrand },
            ]}
          >
            <Lock size={20} color={colors.primaryColor} />
          </View>
          <View style={styles.itemTextContainer}>
            <Text
              style={[
                commonStyling.title,
                { fontSize: 15, fontFamily: "Bold" },
              ]}
            >
              Change Password
            </Text>
            <Text
              style={[styles.itemSub, commonStyling.subtitle, { fontSize: 12 }]}
            >
              Update your account password
            </Text>
          </View>
          <ChevronRight size={18} color="#CBD5E1" />
        </TouchableOpacity>

        <LocalToggleRow
          icon={<Smartphone size={20} color="#10B981" />}
          iconBg="#F0FDF4"
          title="Two-Factor Authentication"
          sub="Extra security for your account"
          value={localSettings.twoFactor}
          onToggle={() => toggleLocal("twoFactor")}
        />

        {/* <TouchableOpacity
          style={[
            styles.listItem,
            { borderColor: colors.lightPrimaryBlueBorder },
          ]}
        >
          <View
            style={[
              styles.iconCircle,
              { backgroundColor: colors.surfaceBrand },
            ]}
          >
            <Key size={20} color={colors.primaryColor} />
          </View>
          <View style={styles.itemTextContainer}>
            <Text
              style={[
                commonStyling.title,
                { fontSize: 15, fontFamily: "Bold" },
              ]}
            >
              Active Sessions
            </Text>
            <Text
              style={[styles.itemSub, commonStyling.subtitle, { fontSize: 12 }]}
            >
              Manage logged-in devices
            </Text>
          </View>
          <ChevronRight size={18} color="#CBD5E1" />
        </TouchableOpacity> */}

        {/* ── Privacy ── */}
        <Text
          style={[
            styles.sectionLabel,
            commonStyling.title,
            { fontSize: 18, fontFamily: "Bold" },
          ]}
        >
          Privacy
        </Text>

        <PrivacyToggleRow
          icon={<MapPin size={20} color={colors.primaryColor} />}
          iconBg={colors.surfaceBrand}
          title="Share Location"
          sub="Share your location during rides"
          value={!!settingsValue?.share_location_with_rider}
          onToggle={(val) =>
            handlePrivacyToggle("share_location_with_rider", val)
          }
        />

        <LocalToggleRow
          icon={<Eye size={20} color={colors.primaryColor} />}
          iconBg={colors.surfaceBrand}
          title="Ride History Visibility"
          sub="Allow riders to see your trip count"
          value={localSettings.historyVisibility}
          onToggle={() => toggleLocal("historyVisibility")}
        />

        <LocalToggleRow
          icon={<Share2 size={20} color={colors.primaryColor} />}
          iconBg={colors.surfaceBrand}
          title="Phone Number Sharing"
          sub="Share phone with riders during trips"
          value={localSettings.phoneSharing}
          onToggle={() => toggleLocal("phoneSharing")}
        />

        {/* ── Data & Account ── */}
        <Text
          style={[
            styles.sectionLabel,
            commonStyling.title,
            { fontSize: 18, fontFamily: "Bold" },
          ]}
        >
          Data & Account
        </Text>

        <TouchableOpacity
          style={[
            styles.listItem,
            { borderColor: colors.lightPrimaryBlueBorder },
          ]}
        >
          <View
            style={[
              styles.iconCircle,
              { backgroundColor: colors.surfaceBrand },
            ]}
          >
            <Download size={20} color={colors.primaryColor} />
          </View>
          <View style={styles.itemTextContainer}>
            <Text
              style={[
                commonStyling.title,
                { fontSize: 15, fontFamily: "Bold" },
              ]}
            >
              Download Your Data
            </Text>
            <Text
              style={[styles.itemSub, commonStyling.subtitle, { fontSize: 12 }]}
            >
              Get a copy of your account data
            </Text>
          </View>
          <ChevronRight size={18} color="#CBD5E1" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.listItem,
            { borderColor: colors.lightPrimaryBlueBorder },
          ]}
          onPress={() => handleDeleteAccount()}
        >
          <View style={[styles.iconCircle, { backgroundColor: "#FEF2F2" }]}>
            <Trash2 size={20} color="#EF4444" />
          </View>
          <View style={styles.itemTextContainer}>
            <Text
              style={[
                commonStyling.title,
                { fontSize: 15, fontFamily: "Bold" },
              ]}
            >
              Delete Account
            </Text>
            <Text
              style={[styles.itemSub, commonStyling.subtitle, { fontSize: 12 }]}
            >
              Permanently delete your account
            </Text>
          </View>
          <ChevronRight size={18} color="#CBD5E1" />
        </TouchableOpacity>

        {/* ── Footer ── */}
        <View
          style={[styles.footerNote, { backgroundColor: colors.surfaceBrand }]}
        >
          <ShieldCheck
            size={20}
            color={colors.primaryColor}
            style={{ marginTop: 2 }}
          />
          <View style={{ flex: 1 }}>
            <Text
              style={[
                styles.footerTitle,
                {
                  fontSize: 14,
                  fontFamily: "Bold",
                  color: colors.primaryColor,
                },
              ]}
            >
              Your Privacy Matters
            </Text>
            <Text
              style={[
                styles.footerText,
                {
                  fontSize: 12,
                  fontFamily: "Regular",
                  color: colors.primaryColor,
                },
              ]}
            >
              We take your privacy seriously. Your data is encrypted and never
              shared without your explicit consent. Learn more in our Privacy
              Policy.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 20 },
  sectionLabel: { marginTop: 12, marginBottom: 16 },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  itemTextContainer: { flex: 1, marginLeft: 16, marginRight: 8 },
  itemSub: { marginTop: 4 },
  footerNote: {
    flexDirection: "row",
    gap: 12,
    padding: 20,
    borderRadius: 16,
    marginTop: 12,
    marginBottom: 30,
  },
  footerTitle: { marginBottom: 4 },
  footerText: { lineHeight: 18 },
});

export default PrivacySecurityScreen;
