import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";
import LoadingSpinner from "../../../components/reuseables/loadingSpinner";
import useTheme from "../../../hooks/useThemes";

const LIVE_CHAT_URL = "https://tawk.to/chat/6a0b5308de55301c35d0c97d/1jou3ombc";

const LiveChatScreen = () => {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <WebView
          source={{
            uri: LIVE_CHAT_URL,
          }}
          style={{ flex: 1 }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          sharedCookiesEnabled={true}
          thirdPartyCookiesEnabled={true}
          allowsInlineMediaPlayback={true}
          mediaPlaybackRequiresUserAction={false}
          setSupportMultipleWindows={false}
          startInLoadingState={true}
          originWhitelist={["*"]}
          renderLoading={() => (
            <View style={styles.loadingContainer}>
              <LoadingSpinner color={colors.krGreen} />
            </View>
          )}
          onError={(e) => console.log("LiveChat WebView error:", e.nativeEvent)}
          onHttpError={(e) =>
            console.log("LiveChat WebView HTTP error:", e.nativeEvent)
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});

export default LiveChatScreen;
