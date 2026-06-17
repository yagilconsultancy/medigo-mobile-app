import React, { useState } from "react";
import {
  Alert,
  Linking,
  Share,
  StyleSheet,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import {
  AlertTriangle,
  Phone,
  Share2,
  MapPin,
  Bell,
  FileText,
  ShieldCheck,
  ChevronRight,
} from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Location from "expo-location";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import useTheme from "../../../hooks/useThemes";
import { commonStyles } from "../../../styles/commonStyles";
import Header from "../../../components/reuseables/header";
import Buttons from "../../../components/buttons/buttons";
import { WEB_CONFIG } from "../../../utils/constants";

const SafetyCenterScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { colors, theme } = useTheme();
  const commonStyling = commonStyles(colors);
  const [isSharingLocation, setIsSharingLocation] = useState(false);

  const openExternalLink = async (path: string) => {
    const url = `${WEB_CONFIG.PORTFOLIO_BASE_URL}${path}`;

    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error("Open external link error:", error);
      Alert.alert("Unable to open link", "Please try again later.");
    }
  };

  const handleShareLocation = async () => {
    if (isSharingLocation) return;

    setIsSharingLocation(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Location permission required",
          "Please allow location access to share your current location.",
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      const { latitude, longitude } = location.coords;
      const mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;

      await Share.share({
        message: `Here is my current location: ${mapsUrl}`,
        url: mapsUrl,
        title: "Share Location",
      });
    } catch (error) {
      console.error("Share location error:", error);
      Alert.alert(
        "Unable to share location",
        "We could not get your current location. Please try again.",
      );
    } finally {
      setIsSharingLocation(false);
    }
  };

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
      <Header title="Safety Center" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Emergency Banner */}
        <View style={styles.emergencyBanner}>
          <View style={styles.emergencyIconContainer}>
            <AlertTriangle color="#EF4444" size={20} />
          </View>
          <View style={styles.emergencyTextContainer}>
            <Text style={styles.emergencyTitle}>Emergency? Call 911</Text>
            <Text style={styles.emergencySubtext}>
              Medigo is not an emergency service. For life-threatening
              situations, call 911 immediately.
            </Text>
          </View>
        </View>

        {/* Section: During Your Ride */}
        <Text
          style={[
            styles.sectionLabel,
            commonStyling.subtitle,
            {
              fontSize: 13,
              fontFamily: "SemiBold",
            },
          ]}
        >
          During Your Ride
        </Text>
        <View
          style={[
            styles.card,
            {
              borderColor: colors.lightPrimaryBlueBorder,
            },
          ]}
        >
          <SafetyItem
            icon={<Phone size={20} color="#EF4444" />}
            iconBg="#FEF2F2"
            title="Emergency Assistance"
            subtitle="24/7 support line"
            onPress={() => {
              navigation.navigate("RiderProfileContentsStack", {
                screen: "LiveChatScreen",
              });
            }}
          />
          <SafetyItem
            icon={<Share2 size={20} color="#3B82F6" />}
            iconBg="#EFF6FF"
            title="Share Location"
            subtitle={
              isSharingLocation
                ? "Getting your current location..."
                : "Share live location with trusted contacts"
            }
            onPress={handleShareLocation}
            disabled={isSharingLocation}
          />
          {/* <SafetyItem
            icon={<MapPin size={20} color="#3B82F6" />}
            iconBg="#EFF6FF"
            title="Ride Check"
            subtitle="Real-time ride monitoring"
          /> */}
          {/* <SafetyItem
            icon={<Bell size={20} color="#3B82F6" />}
            iconBg="#EFF6FF"
            title="Safety Alerts"
            subtitle="Get notified of safety updates"
            isLast
          /> */}
        </View>

        {/* Section: Resources */}
        <Text
          style={[
            styles.sectionLabel,
            commonStyling.subtitle,
            {
              fontSize: 13,
              fontFamily: "SemiBold",
              marginTop: 24,
            },
          ]}
        >
          Resources
        </Text>
        <View
          style={[
            styles.card,
            {
              borderColor: colors.lightPrimaryBlueBorder,
            },
          ]}
        >
          <SafetyItem
            icon={<FileText size={20} color="#3B82F6" />}
            iconBg="#EFF6FF"
            title="Safety Guidelines"
            subtitle="Best practices for safe rides"
            onPress={() => openExternalLink("/terms-of-service")}
          />
          <SafetyItem
            icon={<ShieldCheck size={20} color="#3B82F6" />}
            iconBg="#EFF6FF"
            title="Safety Policy"
            subtitle="Our commitment to your safety"
            onPress={() => openExternalLink("/privacy-policy")}
            isLast
          />
        </View>

        {/* Support Footer Card */}
        <View
          style={[
            styles.supportCard,
            {
              backgroundColor: colors.surfaceBrand,
            },
          ]}
        >
          <Text
            style={{
              fontSize: 14,
              fontFamily: "SemiBold",
              color: colors.primaryColor,
            }}
          >
            Need Help?
          </Text>
          <Text
            style={[
              styles.supportSubtext,
              commonStyling.subtitle,
              {
                fontSize: 12,
                color: colors.primaryColor,
              },
            ]}
          >
            Our safety team is available 24/7 to assist you.
          </Text>
          <Buttons
            title="Contact Safety Team"
            onPress={() => {
              navigation.navigate("RiderProfileContentsStack", {
                screen: "LiveChatScreen",
              });
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Sub-component for individual list items
const SafetyItem = ({
  icon,
  iconBg,
  title,
  subtitle,
  isLast,
  onPress,
  disabled,
}: any) => {
  const { colors } = useTheme();
  const commonStyling = commonStyles(colors);

  return (
    <TouchableOpacity
      style={[
        styles.itemRow,
        {
          borderBottomWidth: !isLast ? 1 : 0,
          borderBottomColor: colors.lightPrimaryBlueBorder,
        },
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={disabled ? 1 : 0.7}
    >
      <View style={[styles.iconBox, { backgroundColor: iconBg }]}>{icon}</View>
      <View style={styles.itemTextContainer}>
        <Text
          style={[
            commonStyling.title,
            {
              fontSize: 15,
              fontFamily: "Bold",
            },
          ]}
        >
          {title}
        </Text>
        <Text
          style={[
            styles.itemSubtitle,
            commonStyling.subtitle,
            {
              fontSize: 13,
              fontFamily: "Medium",
            },
          ]}
        >
          {subtitle}
        </Text>
      </View>
      <ChevronRight size={18} color={colors.subTitleText} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F8FAFC",
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "800",
    color: "#1E293B",
    marginRight: 44,
  },

  scrollContent: { padding: 20 },

  emergencyBanner: {
    backgroundColor: "#FFF1F2",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#FECACA",
    marginBottom: 24,
  },
  emergencyIconContainer: { marginRight: 12, marginTop: 2 },
  emergencyTextContainer: { flex: 1 },
  emergencyTitle: { fontSize: 15, fontWeight: "800", color: "#B91C1C" },
  emergencySubtext: {
    fontSize: 12,
    color: "#B91C1C",
    marginTop: 4,
    lineHeight: 18,
  },

  sectionLabel: {
    marginBottom: 12,
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: "hidden",
  },

  itemRow: { flexDirection: "row", alignItems: "center", padding: 16 },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  itemTextContainer: { flex: 1, marginLeft: 16 },
  itemSubtitle: { marginTop: 2 },

  supportCard: {
    borderRadius: 20,
    padding: 20,
    marginTop: 32,
    marginBottom: 20,
  },
  supportSubtext: {
    marginTop: 4,
    marginBottom: 16,
  },
  primaryButton: {
    backgroundColor: "#3B82F6",
    height: 52,
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: { color: "#FFF", fontSize: 15, fontWeight: "700" },
});

export default SafetyCenterScreen;
