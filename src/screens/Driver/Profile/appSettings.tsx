import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Switch,
} from "react-native";
import {
  Globe,
  Ruler,
  Moon,
  Volume2,
  Map,
  Navigation,
  Zap,
  ChevronRight,
} from "lucide-react-native";
import Constants from "expo-constants";
import { SafeAreaView } from "react-native-safe-area-context";
import useTheme from "../../../hooks/useThemes";
import { commonStyles } from "../../../styles/commonStyles";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Header from "../../../components/reuseables/header";

const AppSettings = () => {
  const { colors, theme, toggleTheme } = useTheme();
  const commonStyling = commonStyles(colors);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const isLight = theme === "light";

  const [settings, setSettings] = useState({
    darkMode: !isLight,
    soundEffects: true,
    voiceNavigation: true,
    autoAccept: false,
  });

  const toggleSwitch = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const SettingItem = ({ icon, title, sub, rightContent, onPress }: any) => {
    const { colors, theme } = useTheme();
    const commonStyling = commonStyles(colors);
    return (
      <TouchableOpacity
        style={[
          styles.listItem,
          {
            borderColor: colors.lightPrimaryBlueBorder,
          },
        ]}
        onPress={onPress}
        disabled={!onPress}
      >
        <View
          style={[
            styles.iconCircle,
            {
              backgroundColor: colors.surfaceBrand,
            },
          ]}
        >
          {icon}
        </View>
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
              styles.itemSub,
              commonStyling.subtitle,
              {
                fontSize: 12,
                fontFamily: "Medium",
              },
            ]}
          >
            {sub}
          </Text>
        </View>
        {rightContent}
      </TouchableOpacity>
    );
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

      <Header title="App Settings" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* SECTION: General */}
        <Text
          style={[
            styles.sectionLabel,
            commonStyling.title,
            {
              fontSize: 18,
              fontFamily: "Bold",
            },
          ]}
        >
          General
        </Text>
        <SettingItem
          icon={<Globe size={20} color="#3B82F6" />}
          title="Language"
          sub="App display language"
          rightContent={
            <View style={styles.rightAction}>
              <Text
                style={[
                  commonStyling.subtitle,
                  {
                    fontSize: 14,
                    fontFamily: "Medium",
                  },
                ]}
              >
                English (US)
              </Text>
              <ChevronRight size={18} color={colors.subTitleText} />
            </View>
          }
        />
        <SettingItem
          icon={<Ruler size={20} color="#3B82F6" />}
          title="Distance Unit"
          sub="Miles or kilometers"
          rightContent={
            <View style={styles.rightAction}>
              <Text
                style={[
                  commonStyling.subtitle,
                  {
                    fontSize: 14,
                    fontFamily: "Medium",
                  },
                ]}
              >
                Km
              </Text>
              <ChevronRight size={18} color={colors.subTitleText} />
            </View>
          }
        />

        {/* SECTION: Appearance */}
        <Text
          style={[
            styles.sectionLabel,
            commonStyling.title,
            {
              fontSize: 18,
              fontFamily: "Bold",
            },
          ]}
        >
          Appearance
        </Text>
        <View
          style={[
            styles.listItem,
            {
              borderColor: colors.lightPrimaryBlueBorder,
            },
          ]}
        >
          <View
            style={[
              styles.iconCircle,
              {
                backgroundColor: colors.surfaceBrand,
              },
            ]}
          >
            <Moon size={20} color={colors.primaryColor} />
          </View>
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
              Dark Mode
            </Text>
            <Text
              style={[
                styles.itemSub,
                commonStyling.subtitle,
                {
                  fontSize: 12,
                  fontFamily: "Medium",
                },
              ]}
            >
              Use dark theme
            </Text>
          </View>
          <Switch
            trackColor={{ false: "#E2E8F0", true: "#3B82F6" }}
            thumbColor="#FFF"
            onValueChange={() => {
              toggleTheme();
            }}
            value={!isLight}
          />
        </View>
        <View
          style={[
            styles.listItem,
            {
              borderColor: colors.lightPrimaryBlueBorder,
            },
          ]}
        >
          <View style={[styles.iconCircle, { backgroundColor: "#FFFBEB" }]}>
            <Volume2 size={20} color="#F59E0B" />
          </View>
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
              Sound Effects
            </Text>
            <Text
              style={[
                styles.itemSub,
                commonStyling.subtitle,
                {
                  fontSize: 12,
                  fontFamily: "Medium",
                },
              ]}
            >
              In-app sounds and alerts
            </Text>
          </View>
          <Switch
            trackColor={{ false: "#E2E8F0", true: "#3B82F6" }}
            thumbColor="#FFF"
            onValueChange={() => toggleSwitch("soundEffects")}
            value={settings.soundEffects}
          />
        </View>

        {/* SECTION: Navigation */}
        <Text
          style={[
            styles.sectionLabel,
            commonStyling.title,
            {
              fontSize: 18,
              fontFamily: "Bold",
            },
          ]}
        >
          Navigation
        </Text>
        <SettingItem
          icon={<Map size={20} color="#3B82F6" />}
          title="Map Type"
          sub="Choose map display style"
          rightContent={
            <View style={styles.rightAction}>
              <Text
                style={[
                  commonStyling.subtitle,
                  {
                    fontSize: 14,
                    fontFamily: "Medium",
                  },
                ]}
              >
                Standard
              </Text>
              <ChevronRight size={18} color={colors.subTitleText} />
            </View>
          }
        />
        <View
          style={[
            styles.listItem,
            {
              borderColor: colors.lightPrimaryBlueBorder,
            },
          ]}
        >
          <View
            style={[
              styles.iconCircle,
              {
                backgroundColor: colors.surfaceBrand,
              },
            ]}
          >
            <Navigation size={20} color={colors.primaryColor} />
          </View>
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
              Voice Navigation
            </Text>
            <Text
              style={[
                styles.itemSub,
                commonStyling.subtitle,
                {
                  fontSize: 12,
                  fontFamily: "Medium",
                },
              ]}
            >
              Turn-by-turn voice guidance
            </Text>
          </View>
          <Switch
            trackColor={{ false: "#E2E8F0", true: "#3B82F6" }}
            thumbColor="#FFF"
            onValueChange={() => toggleSwitch("voiceNavigation")}
            value={settings.voiceNavigation}
          />
        </View>

        {/* SECTION: Driver Preferences */}
        <Text
          style={[
            styles.sectionLabel,
            commonStyling.title,
            {
              fontSize: 18,
              fontFamily: "Bold",
            },
          ]}
        >
          Driver Preferences
        </Text>
        <View
          style={[
            styles.listItem,
            {
              borderColor: colors.lightPrimaryBlueBorder,
            },
          ]}
        >
          <View style={[styles.iconCircle, { backgroundColor: "#F0FDF4" }]}>
            <Zap size={20} color="#10B981" />
          </View>
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
              Auto-Accept Rides
            </Text>
            <Text
              style={[
                styles.itemSub,
                commonStyling.subtitle,
                {
                  fontSize: 12,
                  fontFamily: "Medium",
                },
              ]}
            >
              Automatically accept ride requests
            </Text>
          </View>
          <Switch
            trackColor={{ false: "#E2E8F0", true: "#3B82F6" }}
            thumbColor="#FFF"
            onValueChange={() => toggleSwitch("autoAccept")}
            value={settings.autoAccept}
          />
        </View>

        {/* Footer Info */}
        <View style={[styles.footer]}>
          <Text
            style={[
              commonStyling.subtitle,
              {
                fontSize: 12,
              },
            ]}
          >
            MediGo Driver
          </Text>
          <Text
            style={[
              styles.versionText,
              commonStyling.subtitle,
              {
                fontSize: 14,
                fontFamily: "SemiBold",
              },
            ]}
          >
            Version {Constants.expoConfig?.version}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    height: 60,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: { fontSize: 18, fontWeight: "800", color: "#1E293B" },

  scrollContent: { padding: 20 },
  sectionLabel: {
    marginTop: 12,
    marginBottom: 16,
  },

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

  rightAction: { flexDirection: "row", alignItems: "center", gap: 8 },

  footer: {
    marginTop: 20,
    marginBottom: 40,
    alignItems: "center",
    padding: 24,
    borderRadius: 20,
  },
  versionText: {
    marginVertical: 4,
  },
});

export default AppSettings;
