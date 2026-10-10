import React, { Component, ErrorInfo, ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import * as Updates from "expo-updates";

type Props = { children: ReactNode };
type State = { hasError: boolean };

// Last line of defence: if a screen crashes while rendering, show a calm
// message with a way back instead of a blank white screen.
export default class AppErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Unhandled render error:", error.message, info.componentStack);
  }

  private restart = async () => {
    try {
      await Updates.reloadAsync();
    } catch {
      this.setState({ hasError: false });
    }
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <View style={styles.container}>
        <Text style={styles.title}>Something went wrong</Text>
        <Text style={styles.body}>
          The app hit an unexpected problem. Your rides and payments are safe.
          Please restart the app to continue.
        </Text>
        <Pressable
          accessibilityRole="button"
          onPress={this.restart}
          style={({ pressed }) => [styles.button, pressed && styles.pressed]}
        >
          <Text style={styles.buttonText}>Restart app</Text>
        </Pressable>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0A1E3F",
    marginBottom: 12,
    textAlign: "center",
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
    color: "#4A5B78",
    textAlign: "center",
    marginBottom: 28,
  },
  button: {
    minHeight: 52,
    paddingHorizontal: 32,
    borderRadius: 999,
    backgroundColor: "#E10600",
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: { opacity: 0.85 },
  buttonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
});
