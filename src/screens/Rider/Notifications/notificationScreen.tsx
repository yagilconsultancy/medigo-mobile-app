import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Shield,
  Info,
  Banknote,
  Gift,
  Bell,
} from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import useTheme from "../../../hooks/useThemes";
import { commonStyles } from "../../../styles/commonStyles";
import Header from "../../../components/reuseables/header";
import { FONT_SIZES } from "../../../constants/sizes";
import { useNotifications } from "../../../hooks/queries/useNotifications";
import { formatDistanceToNow } from "date-fns";
import { NotificationsSkeleton } from "../../../components/skelentonAnimation/notificationsSkelenton";
import { useUserStore } from "../../../store/userStore";

const NotificationsScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { user } = useUserStore();
  const { colors, theme } = useTheme();
  const commonStyling = commonStyles(colors);
  const [unreadOnly, setUnreadOnly] = useState(false);
  const { data, isLoading } = useNotifications({
    limit: 20,
  });

  // Helper to get Icon and Color based on type
  const getNotificationStyles = (type: string) => {
    switch (type?.toLowerCase()) {
      case "ride":
        return { icon: <Calendar size={20} color="#3B82F6" />, bg: "#EFF6FF" };
      case "payment":
        return { icon: <Banknote size={20} color="#10B981" />, bg: "#ECFDF5" };
      case "safety":
        return { icon: <Shield size={20} color="#8B5CF6" />, bg: "#F5F3FF" };
      case "promo":
        return { icon: <Gift size={20} color="#F59E0B" />, bg: "#FFFBEB" };
      default:
        return { icon: <Info size={20} color="#3B82F6" />, bg: "#EFF6FF" };
    }
  };

  if (isLoading) {
    return <NotificationsSkeleton />;
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.surfacePrimary }]}
    >
      <StatusBar
        barStyle={theme === "light" ? "dark-content" : "light-content"}
      />
      <Header title="Notifications" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text
          style={[
            styles.description,
            commonStyling.subtitle,
            { paddingHorizontal: 20 },
          ]}
        >
          View all notifications for your rides and account here
        </Text>

        {isLoading ? (
          <ActivityIndicator
            size="large"
            color={colors.primaryColor}
            style={{ marginTop: 50 }}
          />
        ) : data?.data && data.data.length > 0 ? (
          data.data.map((item) => {
            const { icon, bg } = getNotificationStyles(item.notification_type);

            return (
              <NotificationItem
                key={item.id}
                icon={icon}
                iconBg={bg}
                title={item.title}
                description={item.body}
                // Formatting "2026-03-17..." to "2 hours ago"
                time={formatDistanceToNow(new Date(item.created_at), {
                  addSuffix: true,
                })}
                unread={!item.is_read}
                onPress={() => {
                  // Handle navigation based on item.data or type
                  if (
                    item.data.screen === "ride_detail" &&
                    user.data.role === "rider"
                  )
                    navigation.navigate("RiderRideDetailsStack", {
                      screen: "RideDetails",
                      params: {
                        id: item.data.ride_id,
                      },
                    });
                }}
              />
            );
          })
        ) : (
          <View>
            <Text
              style={[
                commonStyling.subtitle,
                { marginTop: 16, textAlign: "center" },
              ]}
            >
              No notifications yet
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

// --- Reusable Notification Item ---
const NotificationItem = ({
  icon,
  iconBg,
  title,
  description,
  time,
  unread,
  onPress,
}: any) => {
  const { colors } = useTheme();
  const commonStyling = commonStyles(colors);

  return (
    <TouchableOpacity
      style={[
        styles.itemWrapper,
        {
          backgroundColor: colors.surfaceElevated,
          paddingHorizontal: 20,
          borderBottomColor: colors.lightPrimaryBlueBorder,
        },
      ]}
      onPress={onPress}
    >
      <View style={[styles.iconContainer, { backgroundColor: iconBg }]}>
        {icon}
      </View>
      <View style={styles.textWrapper}>
        <View style={styles.titleRow}>
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
          {unread && <View style={styles.unreadDot} />}
        </View>
        <Text
          style={[
            styles.itemDescription,
            commonStyling.subtitle,
            {
              fontSize: 14,
              fontFamily: "Medium",
            },
          ]}
          numberOfLines={2}
        >
          {description}
        </Text>
        <Text
          style={[
            styles.itemDescription,
            commonStyling.subtitle,
            {
              fontSize: FONT_SIZES.SMALL,
            },
          ]}
        >
          {time}
        </Text>
      </View>
      <ChevronRight color="#94A3B8" size={18} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },

  scrollContent: { paddingBottom: 40 },
  description: { marginBottom: 24 },
  sectionTitle: {
    marginTop: 12,
    marginBottom: 16,
  },

  itemWrapper: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  textWrapper: { flex: 1, marginLeft: 16, marginRight: 8 },
  titleRow: { flexDirection: "row", alignItems: "center" },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#3B82F6",
    marginLeft: 8,
  },
  itemDescription: {
    marginTop: 4,
    lineHeight: 20,
  },
  timeText: { fontSize: 12, color: "#94A3B8", marginTop: 8 },
});

export default NotificationsScreen;
