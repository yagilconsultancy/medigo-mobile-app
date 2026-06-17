import React, { useState, useEffect } from "react";
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
  Bell,
  MapPin,
  MessageSquare,
  CircleDollarSign,
  LineChart,
  AlertTriangle,
  Smartphone,
  Mail,
  MessageCircle,
} from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useTheme from "../../../hooks/useThemes";
import { commonStyles } from "../../../styles/commonStyles";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Header from "../../../components/reuseables/header";
import { useDriverSettings } from "../../../hooks/queries/useDriverSettings";
import { UpdateNotificationsPayload } from "../../../types/user.types";
import { useUpdateNotifications } from "../../../hooks/mutations/useUser";
import { NotificationsSettingsSkeleton } from "../../../components/skelentonAnimation/notificationSettingsSkelenton";

// ← Move OUTSIDE the parent component so it never remounts on re-render
const NotificationRow = ({
  icon,
  title,
  sub,
  value,
  onToggle,
  iconBg,
}: {
  icon: React.ReactNode;
  title: string;
  sub: string;
  value: boolean;
  onToggle: (val: boolean) => void;
  iconBg: string;
}) => {
  const { colors } = useTheme();
  const commonStyling = commonStyles(colors);

  // ← Local optimistic state so toggle feels instant
  const [localValue, setLocalValue] = useState(value);

  // Sync with server data when it changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (val: boolean) => {
    setLocalValue(val); // instant UI update
    onToggle(val); // then call API
  };

  return (
    <View
      style={[
        styles.settingRow,
        { borderColor: colors.lightPrimaryBlueBorder },
      ]}
    >
      <View style={[styles.iconBox, { backgroundColor: iconBg }]}>{icon}</View>
      <View style={styles.rowContent}>
        <Text
          style={[commonStyling.title, { fontSize: 15, fontFamily: "Bold" }]}
        >
          {title}
        </Text>
        <Text style={[styles.rowSub, commonStyling.subtitle, { fontSize: 12 }]}>
          {sub}
        </Text>
      </View>
      <Switch
        trackColor={{ false: "#E2E8F0", true: "#3B82F6" }}
        thumbColor="#FFF"
        onValueChange={handleChange}
        value={localValue}
      />
    </View>
  );
};

const NotificationsScreen = () => {
  const { colors, theme } = useTheme();
  const commonStyling = commonStyles(colors);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const { data, isLoading } = useDriverSettings();
  const settings = data?.data;
  const { mutate: updateNotify } = useUpdateNotifications();

  if (isLoading) {
    return <NotificationsSettingsSkeleton />;
  }

  const handleToggle = (
    key: keyof UpdateNotificationsPayload,
    value: boolean,
  ) => {
    updateNotify({ [key]: value });
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.surfacePrimary }]}
    >
      <StatusBar
        barStyle={theme === "light" ? "dark-content" : "light-content"}
      />
      <Header title="Notifications" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text
          style={[
            styles.sectionLabel,
            commonStyling.title,
            { fontSize: 18, fontFamily: "Bold" },
          ]}
        >
          Ride Notifications
        </Text>
        <NotificationRow
          icon={<Bell size={20} color="#3B82F6" />}
          iconBg="#EFF6FF"
          title="Ride Requests"
          sub="New ride requests in your area"
          value={!!settings?.push_ride_requests}
          onToggle={(val) => handleToggle("push_ride_requests", val)}
        />
        <NotificationRow
          icon={<MapPin size={20} color="#3B82F6" />}
          iconBg="#EFF6FF"
          title="Ride Updates"
          sub="Trip changes and cancellations"
          value={!!settings?.push_ride_updates}
          onToggle={(val) => handleToggle("push_ride_updates", val)}
        />
        <NotificationRow
          icon={<MessageSquare size={20} color="#3B82F6" />}
          iconBg="#EFF6FF"
          title="Messages"
          sub="New messages from riders"
          value={!!settings?.push_chat_messages}
          onToggle={(val) => handleToggle("push_chat_messages", val)}
        />

        <Text
          style={[
            styles.sectionLabel,
            commonStyling.title,
            { fontSize: 18, fontFamily: "Bold" },
          ]}
        >
          Earnings & Performance
        </Text>
        <NotificationRow
          icon={<CircleDollarSign size={20} color="#10B981" />}
          iconBg="#F0FDF4"
          title="Earnings Updates"
          sub="Weekly summaries and payouts"
          value={!!settings?.push_earnings}
          onToggle={(val) => handleToggle("push_earnings", val)}
        />
        <NotificationRow
          icon={<LineChart size={20} color="#F59E0B" />}
          iconBg="#FFFBEB"
          title="Promotions & Bonuses"
          sub="Surge pricing and bonus opportunities"
          value={!!settings?.push_promotions}
          onToggle={(val) => handleToggle("push_promotions", val)}
        />

        <Text
          style={[
            styles.sectionLabel,
            commonStyling.title,
            { fontSize: 18, fontFamily: "Bold" },
          ]}
        >
          Safety & Support
        </Text>
        <NotificationRow
          icon={<AlertTriangle size={20} color="#EF4444" />}
          iconBg="#FEF2F2"
          title="Safety Alerts"
          sub="Important safety updates"
          value={!!settings?.safety_alerts}
          onToggle={(val) => handleToggle("safety_alerts", val)}
        />
        <NotificationRow
          icon={<Bell size={20} color="#3B82F6" />}
          iconBg="#EFF6FF"
          title="App Updates"
          sub="New features and improvements"
          value={!!settings?.app_updates}
          onToggle={(val) => handleToggle("app_updates", val)}
        />

        <Text
          style={[
            styles.sectionLabel,
            commonStyling.title,
            { fontSize: 18, fontFamily: "Bold" },
          ]}
        >
          Notification Channels
        </Text>
        <NotificationRow
          icon={<Smartphone size={20} color="#3B82F6" />}
          iconBg="#FFF"
          title="Push Notifications"
          sub="Receive alerts on this device"
          value={!!settings?.push_notifications}
          onToggle={(val) => handleToggle("push_notifications", val)}
        />
        <NotificationRow
          icon={<Mail size={20} color="#3B82F6" />}
          iconBg="#FFF"
          title="Email Notifications"
          sub="Receive updates via email"
          value={!!settings?.email_weekly_summary}
          onToggle={(val) => handleToggle("email_weekly_summary", val)}
        />
        <NotificationRow
          icon={<MessageCircle size={20} color="#3B82F6" />}
          iconBg="#FFF"
          title="SMS Notifications"
          sub="Receive text message alerts"
          value={!!settings?.sms_ride_updates}
          onToggle={(val) => handleToggle("sms_ride_updates", val)}
        />

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20 },
  sectionLabel: {
    marginTop: 8,
    marginBottom: 20,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  rowContent: { flex: 1, marginLeft: 16, marginRight: 8 },
  rowSub: { marginTop: 4 },
});

export default NotificationsScreen;
