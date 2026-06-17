import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StatusBar,
} from "react-native";
import {
  ChevronLeft,
  Search,
  DollarSign,
  Car,
  FileText,
  Navigation,
  MessageSquare,
  Settings,
  ChevronRight,
  Headset,
} from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useTheme from "../../../hooks/useThemes";
import { commonStyles } from "../../../styles/commonStyles";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Header from "../../../components/reuseables/header";
import Buttons from "../../../components/buttons/buttons";

const HelpCenter = () => {
  const { colors, theme } = useTheme();
  const commonStyling = commonStyles(colors);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const topics = [
    {
      id: 1,
      title: "Earnings & Payments",
      articles: 12,
      icon: <DollarSign size={22} color={colors.primaryColor} />,
      bg: "#EFF6FF",
    },
    {
      id: 2,
      title: "Accepting & Completing Rides",
      articles: 8,
      icon: <Car size={22} color={colors.primaryColor} />,
      bg: "#EFF6FF",
    },
    {
      id: 3,
      title: "Documents & Verification",
      articles: 6,
      icon: <FileText size={22} color={colors.primaryColor} />,
      bg: "#EFF6FF",
    },
    {
      id: 4,
      title: "Navigation & Routes",
      articles: 5,
      icon: <Navigation size={22} color={colors.primaryColor} />,
      bg: "#EFF6FF",
    },
    {
      id: 5,
      title: "Communicating with Riders",
      articles: 4,
      icon: <MessageSquare size={22} color={colors.primaryColor} />,
      bg: "#EFF6FF",
    },
    {
      id: 6,
      title: "Account & Settings",
      articles: 7,
      icon: <Settings size={22} color={colors.primaryColor} />,
      bg: "#EFF6FF",
    },
  ];

  const popularArticles = [
    { title: "How do I get paid?", category: "Earnings" },
    { title: "What to do if a rider cancels?", category: "Rides" },
    { title: "Updating my vehicle information", category: "Account" },
    { title: "Understanding the rating system", category: "Rides" },
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

      <Header title="Help Center" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Search Bar */}
        <View
          style={[
            styles.searchContainer,
            {
              borderWidth: 1,
              borderColor: colors.lightPrimaryBlueBorder,
            },
          ]}
        >
          <Search size={20} color={colors.titleText} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for help..."
            placeholderTextColor={colors.titleText}
          />
        </View>

        <Text
          style={[
            styles.sectionTitle,
            commonStyling.title,
            {
              fontSize: 18,
              fontFamily: "Bold",
            },
          ]}
        >
          Browse by Topic
        </Text>

        {/* Topics Grid */}
        <View style={styles.grid}>
          {topics.map((topic) => (
            <TouchableOpacity
              key={topic.id}
              style={[
                styles.topicCard,
                {
                  borderColor: colors.lightPrimaryBlueBorder,
                },
              ]}
            >
              <View
                style={[
                  styles.iconCircle,
                  { backgroundColor: colors.surfaceBrand },
                ]}
              >
                {topic.icon}
              </View>
              <Text
                style={[
                  styles.topicTitle,
                  commonStyling.title,
                  {
                    fontSize: 14,
                    fontFamily: "Bold",
                  },
                ]}
              >
                {topic.title}
              </Text>
              <Text
                style={[
                  styles.articleCount,
                  commonStyling.subtitle,
                  {
                    fontSize: 12,
                    fontFamily: "Medium",
                  },
                ]}
              >
                {topic.articles} articles
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text
          style={[
            styles.sectionTitle,
            commonStyling.title,
            {
              fontSize: 18,
              fontFamily: "Bold",
              marginTop: 16,
            },
          ]}
        >
          Popular Articles
        </Text>

        {/* Articles List */}
        {popularArticles.map((article, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.articleItem,
              {
                borderBottomColor: colors.lightPrimaryBlueBorder,
              },
            ]}
          >
            <View>
              <Text
                style={[
                  commonStyling.title,
                  {
                    fontSize: 15,
                    fontFamily: "SemiBold",
                  },
                ]}
              >
                {article.title}
              </Text>
              <Text
                style={[
                  styles.articleCategory,
                  commonStyling.subtitle,
                  {
                    fontSize: 12,
                    fontFamily: "Medium",
                  },
                ]}
              >
                {article.category}
              </Text>
            </View>
            <ChevronRight size={20} color={colors.titleText} />
          </TouchableOpacity>
        ))}

        {/* Contact Support Footer */}
        <View
          style={[
            styles.supportBox,
            {
              backgroundColor: colors.surfaceBrand,
            },
          ]}
        >
          <Text
            style={[
              styles.supportTitle,
              {
                fontSize: 14,
                fontFamily: "Bold",
                color: colors.primaryColor,
              },
            ]}
          >
            Can't find what you're looking for?
          </Text>
          <Text
            style={[
              styles.supportSub,
              {
                fontSize: 12,
                color: colors.primaryColor,
                fontFamily: "Regular",
                marginBottom: 16,
              },
            ]}
          >
            Our support team is here to help you with any questions.
          </Text>
          <View
            style={{
              width: "100%",
            }}
          >
            <Buttons
              title="Contact Support"
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

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 50,
    marginBottom: 24,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    color: "#1E293B",
    fontWeight: "500",
  },

  sectionTitle: {
    marginBottom: 16,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  topicCard: {
    width: "48%",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  topicTitle: {
    lineHeight: 20,
  },
  articleCount: {
    marginTop: 4,
  },

  articleItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
  },

  articleCategory: {
    marginTop: 4,
  },

  supportBox: {
    marginTop: 32,
    padding: 24,
    borderRadius: 20,
    alignItems: "center",
  },
  supportTitle: {
    textAlign: "center",
  },
  supportSub: {
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
  },
});

export default HelpCenter;
