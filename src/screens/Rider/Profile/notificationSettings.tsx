import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Switch,
} from "react-native";
import {
  ChevronLeft,
  Bell,
  MessageSquare,
  DollarSign,
  Star,
} from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import useTheme from "../../../hooks/useThemes";
import { commonStyles } from "../../../styles/commonStyles";
import Header from "../../../components/reuseables/header";
import { useDriverSettings } from "../../../hooks/queries/useDriverSettings";
import { useUpdateNotifications } from "../../../hooks/mutations/useUser";
import { UpdateNotificationsPayload } from "../../../types/user.types";

const NotificationSettingsScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { colors, theme } = useTheme();
  const commonStyling = commonStyles(colors);
  // Same /users/me/settings endpoint the driver app uses; it serves any user.
  const { data } = useDriverSettings();
  const serverSettings = data?.data as
    | Partial<Record<keyof UpdateNotificationsPayload, boolean>>
    | undefined;
  const { mutate: updateNotify } = useUpdateNotifications();
  // Optimistic values so a switch moves instantly; dropped once the save settles.
  const [pending, setPending] = useState<UpdateNotificationsPayload>({});

  const valueOf = (key: keyof UpdateNotificationsPayload) =>
    pending[key] ?? !!serverSettings?.[key];

  const toggleSetting = (key: keyof UpdateNotificationsPayload) => {
    const next = !valueOf(key);
    setPending((prev) => ({ ...prev, [key]: next }));
    updateNotify(
      { [key]: next },
      {
        onSettled: () =>
          setPending((prev) => {
            const { [key]: _removed, ...rest } = prev;
            return rest;
          }),
      },
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
      <Header title="Notifications" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ESSENTIAL SECTION */}
        <Text
          style={[
            styles.categoryLabel,
            commonStyling.subtitle,
            {
              fontSize: 11,
              fontFamily: "SemiBold",
            },
          ]}
        >
          ESSENTIAL
        </Text>

        <NotificationToggle
          icon={<Bell size={20} color={colors.primaryColor} />}
          bgColor={colors.surfaceBrand}
          title="Ride Updates"
          sub="Driver assignment, arrival, and trip updates"
          value={valueOf("push_ride_updates")}
          onToggle={() => toggleSetting("push_ride_updates")}
        />

        <NotificationToggle
          icon={<MessageSquare size={20} color={colors.primaryColor} />}
          bgColor={colors.surfaceBrand}
          title="Messages"
          sub="Messages from drivers and support"
          value={valueOf("push_chat_messages")}
          onToggle={() => toggleSetting("push_chat_messages")}
        />

        <NotificationToggle
          icon={<DollarSign size={20} color={colors.primaryColor} />}
          bgColor={colors.surfaceBrand}
          title="Payment Notifications"
          sub="Email receipts for your rides"
          value={valueOf("email_ride_receipts")}
          onToggle={() => toggleSetting("email_ride_receipts")}
        />

        {/* MARKETING SECTION */}
        <Text
          style={[
            styles.categoryLabel,
            commonStyling.subtitle,
            {
              fontSize: 11,
              fontFamily: "SemiBold",
              marginTop: 32,
            },
          ]}
        >
          MARKETING
        </Text>

        <NotificationToggle
          icon={<Star size={20} color="#64748B" />}
          bgColor="#F1F5F9"
          title="Promotions & Offers"
          sub="Special deals, discounts, and rewards"
          value={valueOf("push_promotions")}
          onToggle={() => toggleSetting("push_promotions")}
        />

        {/* Footer Banner */}
        <View
          style={[
            styles.footerBanner,
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
            Stay Informed
          </Text>
          <Text
            style={[
              styles.bannerSub,
              commonStyling.subtitle,
              {
                fontSize: 12,
                color: colors.primaryColor,
              },
            ]}
          >
            We recommend keeping essential notifications enabled to ensure the
            best experience during your rides.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// --- Sub-component for Toggle Rows ---
const NotificationToggle = ({
  icon,
  bgColor,
  title,
  sub,
  value,
  onToggle,
}: any) => {
  const { colors, theme } = useTheme();
  const commonStyling = commonStyles(colors);
  return (
    <View style={styles.toggleRow}>
      <View style={[styles.iconCircle, { backgroundColor: bgColor }]}>
        {icon}
      </View>
      <View style={styles.textContent}>
        <Text
          style={[
            commonStyling.title,
            {
              fontSize: 16,
              fontFamily: "SemiBold",
            },
          ]}
        >
          {title}
        </Text>
        <Text
          style={[
            styles.optionSub,
            commonStyling.subtitle,
            {
              fontSize: 14,
            },
          ]}
        >
          {sub}
        </Text>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: "#E2E8F0", true: "#3B82F6" }}
        thumbColor="#FFFFFF"
        ios_backgroundColor="#E2E8F0"
      />
    </View>
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

  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },

  categoryLabel: {
    letterSpacing: 1,
    marginTop: 20,
    marginBottom: 16,
  },

  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  textContent: { flex: 1, marginLeft: 16, marginRight: 8 },
  optionSub: { marginTop: 4, lineHeight: 18 },

  footerBanner: {
    padding: 16,
    borderRadius: 16,
    marginTop: 16,
  },
  bannerSub: { marginTop: 6, lineHeight: 18 },
});

export default NotificationSettingsScreen;
