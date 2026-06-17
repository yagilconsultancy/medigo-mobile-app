import React from "react";
import { Clock } from "lucide-react-native";
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import {
  ChevronLeft,
  Bell,
  Home,
  Calendar,
  CircleDollarSign,
  MessageCircle,
  User,
} from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useTheme from "../../../hooks/useThemes";
import { commonStyles } from "../../../styles/commonStyles";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Header from "../../../components/reuseables/header";
import { useChatConversations } from "../../../hooks/queries/useChatConversations";
import { ChatsSkeleton } from "../../../components/skelentonAnimation/chatsSkelenton";

const ChatItem = ({ item, isActive }: any) => {
  const { colors, theme } = useTheme();
  const commonStyling = commonStyles(colors);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  return (
    <TouchableOpacity
      style={[
        styles.itemContainer,
        {
          backgroundColor: isActive
            ? colors.surfaceElevated
            : colors.surfacePrimary,
        },
      ]}
      onPress={() => {
        navigation.navigate("DriverChatDetailsStack", {
          screen: "ChatDetailsScreen",
        });
      }}
    >
      <View style={styles.avatarContainer}>
        <View style={styles.avatarPlaceholder}></View>
        {isActive && <View style={styles.onlineIndicator} />}
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.headerRow}>
          <Text
            style={[
              commonStyling.title,
              {
                fontSize: 15,
                fontFamily: "Bold",
              },
            ]}
          >
            {item.name}
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
            {item.timeAgo}
          </Text>
        </View>

        <View style={styles.appointmentRow}>
          <Clock size={14} color="#9CA3AF" />
          <Text
            style={[
              commonStyling.subtitle,
              styles.appointmentText,
              {
                fontSize: 12,
                fontFamily: "Medium",
              },
            ]}
          >
            {item.appointment}
          </Text>
        </View>

        <View style={styles.messageRow}>
          <Text
            style={[
              styles.messageText,
              commonStyling.title,
              {
                fontSize: 14,
                fontFamily: "Medium",
              },
            ]}
            numberOfLines={1}
          >
            {item.message}
          </Text>
          {item.unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{item.unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function ChatsScreen() {
  const { colors, theme } = useTheme();
  const commonStyling = commonStyles(colors);
  const { data, isLoading, refetch } = useChatConversations();
  const conversations = data?.data || [];

  if (isLoading) {
    return <ChatsSkeleton />;
  }

  console.log(conversations);

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

      <Header title="Chats" />
      {conversations && conversations.length === 0 && (
        <View
          style={[
            {
              justifyContent: "center",
              alignItems: "center",
              marginTop: 24,
            },
          ]}
        >
          <Text style={commonStyling.subtitle}>No Chats</Text>
        </View>
      )}
      {/* List */}
      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <ChatItem item={item} isActive={index === 0} />
        )}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: { fontSize: 20, fontWeight: "700", color: "#1F2937" },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "#F9FAFB",
  },
  notificationContainer: { padding: 5 },
  notificationBadge: {
    position: "absolute",
    right: 2,
    top: 2,
    backgroundColor: "#EF4444",
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationBadgeText: { color: "white", fontSize: 10, fontWeight: "bold" },

  listContent: { paddingHorizontal: 16, paddingTop: 10 },
  itemContainer: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 16,
    marginBottom: 8,
  },
  avatarContainer: { position: "relative" },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#EBF2FF",
    justifyContent: "center",
    alignItems: "center",
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#22C55E",
    borderWidth: 2,
    borderColor: "#F8FAFC",
  },
  contentContainer: { flex: 1, marginLeft: 16 },
  headerRow: { flexDirection: "row", justifyContent: "space-between" },
  appointmentRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  appointmentText: { marginLeft: 6 },
  messageRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  messageText: { flex: 1 },
  badge: {
    backgroundColor: "#3B82F6",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
  },
  badgeText: { color: "white", fontSize: 11, fontWeight: "bold" },

  tabBar: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    paddingVertical: 10,
    backgroundColor: "#FFF",
  },
  tabItem: { flex: 1, alignItems: "center" },
  tabLabel: { fontSize: 11, marginTop: 4 },
});
