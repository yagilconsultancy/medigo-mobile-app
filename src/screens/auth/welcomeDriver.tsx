import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Image,
} from "react-native";
import { ChevronLeft, Car, Check, ArrowRight } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Buttons from "../../components/buttons/buttons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import useTheme from "../../hooks/useThemes";
import { commonStyles } from "../../styles/commonStyles";
import BackButton from "../../components/buttons/backButton";

const WelcomeDriverScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { colors, theme } = useTheme();
  const commonStyling = commonStyles(colors);

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

      {/* Header */}
      <View
        style={{
          paddingHorizontal: 16,
          paddingTop: 16,
        }}
      >
        <BackButton />
      </View>

      <View style={styles.content}>
        {/* Main Icon with Badge */}
        <Image
          source={require("../../../assets/images/Container.png")}
          style={{ width: 64, height: 64 }}
        />

        {/* Hero Text */}
        <Text
          style={[
            commonStyling.title,
            styles.mainTitle,
            {
              marginTop: 16,
              fontFamily: "Bold",
              fontSize: 30,
            },
          ]}
        >
          Welcome, Driver
        </Text>
        <Text
          style={[
            commonStyling.subtitle,
            styles.subDescription,
            {
              fontSize: 16,
            },
          ]}
        >
          Join our trusted network of healthcare transportation drivers. All
          drivers are pre-approved and background checked for patient safety.
        </Text>

        {/* Feature Cards */}
        <View style={styles.featureList}>
          {/* Background Verified */}
          <View
            style={[
              styles.featureCard,
              {
                borderColor: colors.lightPrimaryBlueBorder,
              },
            ]}
          >
            <View style={styles.checkCircle}>
              <Check color="#2563EB" size={16} strokeWidth={3} />
            </View>
            <View style={styles.featureTextContent}>
              <Text
                style={[
                  commonStyling.title,
                  {
                    fontSize: 14,
                  },
                ]}
              >
                Background Verified
              </Text>
              <Text
                style={[
                  commonStyling.subtitle,
                  styles.featureDesc,
                  {
                    fontSize: 12,
                  },
                ]}
              >
                All drivers undergo comprehensive background checks
              </Text>
            </View>
          </View>

          {/* Secure & Private */}
          <View
            style={[
              styles.featureCard,
              {
                borderColor: colors.lightPrimaryBlueBorder,
              },
            ]}
          >
            <View style={styles.checkCircle}>
              <Check color="#2563EB" size={16} strokeWidth={3} />
            </View>
            <View style={styles.featureTextContent}>
              <Text
                style={[
                  commonStyling.title,
                  {
                    fontSize: 14,
                  },
                ]}
              >
                Secure & Private
              </Text>
              <Text
                style={[
                  commonStyling.subtitle,
                  styles.featureDesc,
                  {
                    fontSize: 12,
                  },
                ]}
              >
                HIPAA compliant healthcare transportation
              </Text>
            </View>
          </View>

          {/* Professional Network */}
          <View
            style={[
              styles.featureCard,
              {
                borderColor: colors.lightPrimaryBlueBorder,
              },
            ]}
          >
            <View style={styles.checkCircle}>
              <Check color="#2563EB" size={16} strokeWidth={3} />
            </View>
            <View style={styles.featureTextContent}>
              <Text
                style={[
                  commonStyling.title,
                  {
                    fontSize: 14,
                  },
                ]}
              >
                Professional Network
              </Text>
              <Text
                style={[
                  commonStyling.subtitle,
                  styles.featureDesc,
                  {
                    fontSize: 12,
                  },
                ]}
              >
                Join healthcare providers you can trust
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.footer}>
        <Buttons
          title="Activate Driver Account"
          rightIcon={
            <ArrowRight color="#FFF" size={20} style={styles.btnIcon} />
          }
          onPress={() => navigation.navigate("DriverRegistrationFlow")}
        />

        <TouchableOpacity
          style={styles.logInBtn}
          onPress={() => {
            navigation.navigate("Login");
          }}
        >
          <Text
            style={[
              commonStyling.title,
              {
                fontSize: 16,
              },
            ]}
          >
            Log In
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  navHeader: { paddingHorizontal: 24, paddingTop: 12 },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 20 },

  // Icon Branding
  iconContainer: { marginBottom: 32, alignSelf: "flex-start" },
  carIconBox: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
  },
  statusBadge: {
    position: "absolute",
    bottom: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#2563EB",
    borderWidth: 3,
    borderColor: "#FFF",
  },

  // Titles
  mainTitle: {
    marginBottom: 12,
  },
  subDescription: {
    lineHeight: 22,
    marginBottom: 32,
  },

  // Feature Cards
  featureList: { gap: 12 },
  featureCard: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
  },
  checkCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  featureTextContent: { flex: 1 },
  featureDesc: { marginTop: 2, lineHeight: 18 },

  // Footer Buttons
  footer: { padding: 24, gap: 12 },
  activateBtn: {
    height: 56,
    borderRadius: 28,
    backgroundColor: "#2563EB",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  activateBtnText: { color: "#FFF", fontSize: 16, fontWeight: "700" },
  btnIcon: { marginLeft: 8 },
  logInBtn: {
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default WelcomeDriverScreen;
