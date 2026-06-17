import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  StatusBar,
} from "react-native";
import { ChevronLeft, Phone, Send } from "lucide-react-native";
import { TextInput, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useTheme from "../../../hooks/useThemes";
import { commonStyles } from "../../../styles/commonStyles";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

const ChatHeader = () => {
  const { colors, theme } = useTheme();
  const commonStyling = commonStyles(colors);

  return (
    <View
      style={[
        styles.headerContainer,
        {
          borderBottomColor: colors.lightPrimaryBlueBorder,
        },
      ]}
    >
      <View style={styles.headerTop}>
        <TouchableOpacity style={styles.backButton}>
          <ChevronLeft color="#000" size={24} />
        </TouchableOpacity>

        <View style={styles.userInfo}>
          <View style={styles.avatarPlaceholder}></View>
          <View
            style={{
              marginLeft: 8,
            }}
          >
            <Text
              style={[
                commonStyling.title,
                {
                  fontSize: 15,
                  fontFamily: "Bold",
                },
              ]}
            >
              Sarah Johnson
            </Text>
            <View style={styles.statusRow}>
              <View style={styles.onlineDot} />
              <Text
                style={[
                  commonStyling.subtitle,
                  {
                    fontSize: 12,
                  },
                ]}
              >
                Online
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity>
          <Phone color="#3B82F6" size={24} />
        </TouchableOpacity>
      </View>
      <Text
        style={[
          commonStyling.subtitle,
          styles.tripInfo,
          {
            fontSize: 12,
          },
        ]}
      >
        Trip • Today, 2:30 PM
      </Text>
    </View>
  );
};

const MESSAGES = [
  {
    id: "1",
    text: "Hi! I'm on my way to the pickup location.",
    time: "2:25 PM",
    type: "received",
  },
  {
    id: "2",
    text: "Great! I'll be at the entrance in 2 minutes.",
    time: "2:26 PM",
    type: "sent",
  },
  {
    id: "3",
    text: "Perfect, see you soon!",
    time: "2:28 PM",
    type: "received",
  },
  { id: "4", text: "👍", time: "2:28 PM", type: "sent", isEmoji: true },
  {
    id: "5",
    text: "Thank you for the smooth ride!",
    time: "2:55 PM",
    type: "sent",
  },
];

const MessageBubble = ({ item }: any) => {
  const isSent = item.type === "sent";
  return (
    <View
      style={[
        styles.bubbleWrapper,
        isSent ? styles.sentWrapper : styles.receivedWrapper,
      ]}
    >
      <View
        style={[
          styles.bubble,
          isSent ? styles.sentBubble : styles.receivedBubble,
          item.isEmoji && styles.emojiBubble,
        ]}
      >
        <Text
          style={[
            styles.messageText,
            isSent ? styles.sentText : styles.receivedText,
          ]}
        >
          {item.text}
        </Text>
      </View>
      <Text style={styles.timestamp}>{item.time}</Text>
    </View>
  );
};

export default function ChatDetailScreen() {
  const { colors, theme } = useTheme();
  const commonStyling = commonStyles(colors);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
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
      <ChatHeader />

      {/* Background with dotted pattern */}
      <View style={styles.chatArea}>
        <FlatList
          data={MESSAGES}
          renderItem={({ item }) => <MessageBubble item={item} />}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      </View>

      {/* Input Area */}
      <View
        style={[
          styles.inputContainer,
          {
            borderTopColor: colors.lightPrimaryBlueBorder,
          },
        ]}
      >
        <View style={styles.inputWrapper}>
          <TextInput
            placeholder="Message rider"
            placeholderTextColor="#9CA3AF"
            style={styles.input}
          />
          <TouchableOpacity>
            <Send color="#9CA3AF" size={20} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerContainer: {
    paddingBottom: 15,
    borderBottomWidth: 1,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F9FAFB",
    justifyContent: "center",
    alignItems: "center",
  },
  userInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 15,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EBF2FF",
    justifyContent: "center",
    alignItems: "center",
  },
  statusRow: { flexDirection: "row", alignItems: "center", marginTop: 2 },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#22C55E",
    marginRight: 4,
  },

  tripInfo: {
    textAlign: "center",
    marginTop: 10,
  },

  chatArea: { flex: 1 },
  listContent: { padding: 20 },
  bubbleWrapper: { marginBottom: 15, maxWidth: "80%" },
  sentWrapper: { alignSelf: "flex-end", alignItems: "flex-end" },
  receivedWrapper: { alignSelf: "flex-start" },
  bubble: { padding: 14, borderRadius: 16 },
  sentBubble: { backgroundColor: "#3B82F6", borderBottomRightRadius: 4 },
  receivedBubble: { backgroundColor: "#F3F4F6", borderBottomLeftRadius: 4 },
  emojiBubble: { padding: 10, borderRadius: 12 },
  messageText: { fontSize: 15, lineHeight: 20 },
  sentText: { color: "#FFF" },
  receivedText: { color: "#1F2937" },
  timestamp: { fontSize: 11, color: "#9CA3AF", marginTop: 4 },

  inputContainer: {
    padding: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 25,
    paddingHorizontal: 20,
    height: 50,
  },
  input: { flex: 1, color: "#1F2937", fontSize: 15 },
});
