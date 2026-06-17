import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";
import {
  ChevronLeft,
  PhoneCall,
  UserX,
  Camera,
  Car,
  Clock,
  Shield,
  FileText,
  CheckCircle2,
  ChevronRight,
} from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useTheme from "../../../hooks/useThemes";
import { commonStyles } from "../../../styles/commonStyles";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Header from "../../../components/reuseables/header";
import Buttons from "../../../components/buttons/buttons";

const SafetyCenter = () => {
  const { colors, theme } = useTheme();
  const commonStyling = commonStyles(colors);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const safetyFeatures = [
    {
      id: 1,
      title: "Driver Emergency Line",
      description: "24/7 dedicated driver support",
      icon: <PhoneCall size={20} color="#EF4444" />,
      iconBg: "#FEF2F2",
    },
    {
      id: 2,
      title: "Report Rider Issue",
      description: "Report concerning rider behavior",
      icon: <UserX size={20} color="#EF4444" />,
      iconBg: "#FEF2F2",
    },
    {
      id: 3,
      title: "Dashcam & Photo Verification",
      description: "Document rides for safety",
      icon: <Camera size={20} color="#3B82F6" />,
      iconBg: "#EFF6FF",
    },
    {
      id: 4,
      title: "Vehicle Safety Checklist",
      description: "Pre-trip safety inspection",
      icon: <Car size={20} color="#3B82F6" />,
      iconBg: "#EFF6FF",
    },
    {
      id: 5,
      title: "Break Reminders",
      description: "Prevent driver fatigue",
      icon: <Clock size={20} color="#10B981" />,
      iconBg: "#F0FDF4",
    },
  ];

  const resources = [
    {
      id: 1,
      title: "Driver Safety Training",
      description: "Complete safety certification",
      icon: <Shield size={20} color="#3B82F6" />,
    },
    {
      id: 2,
      title: "Insurance & Coverage",
      description: "Your protection on the road",
      icon: <FileText size={20} color="#3B82F6" />,
    },
    {
      id: 3,
      title: "Background Check Status",
      description: "View your verification status",
      icon: <CheckCircle2 size={20} color="#3B82F6" />,
    },
    {
      id: 4,
      title: "Community Standards",
      description: "Driver code of conduct",
      icon: <FileText size={20} color="#3B82F6" />,
    },
  ];

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
          Safety Features
        </Text>

        {/* Safety Features List */}
        {safetyFeatures.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.listItem,
              {
                borderColor: colors.lightPrimaryBlueBorder,
              },
            ]}
          >
            <View style={[styles.iconCircle, { backgroundColor: item.iconBg }]}>
              {item.icon}
            </View>
            <View style={styles.itemTextContainer}>
              <Text
                style={[
                  commonStyling.title,
                  {
                    fontFamily: "Bold",
                    fontSize: 15,
                  },
                ]}
              >
                {item.title}
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
                {item.description}
              </Text>
            </View>
            <ChevronRight size={18} color="#CBD5E1" />
          </TouchableOpacity>
        ))}

        <Text
          style={[
            styles.sectionLabel,
            commonStyling.title,
            {
              fontSize: 18,
              fontFamily: "Bold",
              marginTop: 32,
            },
          ]}
        >
          Resources
        </Text>

        {/* Resources List */}
        {resources.map((resource) => (
          <TouchableOpacity
            key={resource.id}
            style={[
              styles.listItem,
              {
                borderColor: colors.lightPrimaryBlueBorder,
              },
            ]}
          >
            <View style={[styles.iconCircle, { backgroundColor: "#EFF6FF" }]}>
              {resource.icon}
            </View>
            <View style={styles.itemTextContainer}>
              <Text
                style={[
                  commonStyling.title,
                  {
                    fontFamily: "Bold",
                    fontSize: 15,
                  },
                ]}
              >
                {resource.title}
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
                {resource.description}
              </Text>
            </View>
            <ChevronRight size={18} color="#CBD5E1" />
          </TouchableOpacity>
        ))}

        {/* Need Help Footer */}
        <View
          style={[
            styles.emergencyBox,
            {
              backgroundColor: colors.surfaceBrand,
            },
          ]}
        >
          <Text
            style={{
              fontSize: 14,
              fontFamily: "Bold",
              color: colors.primaryColor,
            }}
          >
            Need Help?
          </Text>
          <Text
            style={[
              styles.emergencySub,
              {
                fontSize: 12,
                color: colors.primaryColor,
                fontFamily: "Regular",
                marginBottom: 16,
              },
            ]}
          >
            Our safety team is available 24/7 to assist you.
          </Text>
          <View
            style={{
              width: "100%",
            }}
          >
            <Buttons
              title="Contact Safety Team"
              onPress={() => {
                navigation.navigate("RiderProfileContentsStack", {
                  screen: "LiveChatScreen",
                });
              }}
            />
          </View>
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
  itemTextContainer: { flex: 1, marginLeft: 16 },
  itemSub: { marginTop: 2 },

  helpBox: {
    marginTop: 24,
    padding: 24,
    borderRadius: 20,
    backgroundColor: "#EFF6FF",
  },
  helpTitle: { fontSize: 15, fontWeight: "800", color: "#1E40AF" },
  helpSub: {
    fontSize: 13,
    color: "#3B82F6",
    marginTop: 8,
    lineHeight: 20,
    fontWeight: "500",
  },
  contactButton: {
    backgroundColor: "#3B82F6",
    width: "100%",
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  contactButtonText: { color: "#FFF", fontSize: 15, fontWeight: "800" },
  emergencyBox: {
    marginTop: 24,
    padding: 24,
    borderRadius: 20,
  },
  emergencySub: {
    marginTop: 8,
    lineHeight: 20,
  },
});

export default SafetyCenter;
