import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Check, Eye, EyeOff } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Buttons from "../../components/buttons/buttons";
import BackButton from "../../components/buttons/backButton";
import OtpInputField from "../../components/inputs/otpInput";
import RightArrow from "../../../assets/icons/rightArrow";
import useTheme from "../../hooks/useThemes";
import { commonStyles } from "../../styles/commonStyles";
import authService from "../../api/services/authService";

const MIN_PASSWORD_LENGTH = 8;
const REDIRECT_DELAY_MS = 2500;

const getErrorMessage = (error: any) => {
  const data = error?.response?.data;
  if (typeof data?.detail === "string") return data.detail;
  if (Array.isArray(data?.detail)) return data.detail[0]?.msg;
  return (
    data?.message ||
    "Something went wrong. Please check your connection and try again."
  );
};

/**
 * Driver activation: the driver was approved by an admin and received a
 * welcome email with an activation code. They enter the code and choose their
 * own password, then are sent to the login screen.
 */
export default function DriverActivation() {
  const { colors } = useTheme();
  const commonStyling = commonStyles(colors);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const route = useRoute<any>();
  const email: string = route.params?.email ?? "";

  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const goToLogin = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "Login", params: { email, activated: true } }],
    });
  };

  // After success, show the confirmation briefly, then open the login screen.
  useEffect(() => {
    if (!done) return;
    const timer = setTimeout(goToLogin, REDIRECT_DELAY_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  const handleActivate = async () => {
    setError(null);
    setNotice(null);

    if (code.length !== 6) {
      setError("Enter the 6-digit activation code from your email.");
      return;
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`Choose a password of at least ${MIN_PASSWORD_LENGTH} characters.`);
      return;
    }

    setIsSubmitting(true);
    try {
      await authService.completeDriverActivation({ email, otp: code, password });
      setDone(true);
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    setError(null);
    setNotice(null);
    setIsResending(true);
    try {
      await authService.requestDriverActivationCode(email);
      setNotice(`If your account is ready, a new code was sent to ${email}.`);
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setIsResending(false);
    }
  };

  if (done) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.surfacePrimary }]}
      >
        <View style={styles.successWrap}>
          <View style={styles.successCircle}>
            <Check color="#FFF" size={36} strokeWidth={3} />
          </View>
          <Text
            style={[
              commonStyling.title,
              { fontFamily: "Bold", fontSize: 28, textAlign: "center" },
            ]}
          >
            Account activated
          </Text>
          <Text
            style={[
              commonStyling.subtitle,
              { textAlign: "center", marginTop: 8, lineHeight: 22 },
            ]}
          >
            Your driver account is ready. Log in with your new password.
          </Text>
          <View style={{ width: "100%", marginTop: 32 }}>
            <Buttons
              title="Go to Log in"
              onPress={goToLogin}
              rightIcon={<RightArrow />}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.surfacePrimary }]}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <BackButton />

          <Text
            style={[
              commonStyling.title,
              { marginTop: 16, fontSize: 30, fontFamily: "Bold" },
            ]}
          >
            Activate your account
          </Text>
          <Text
            style={[commonStyling.subtitle, { marginTop: 8, lineHeight: 22 }]}
          >
            We emailed a 6-digit activation code to {email}. Enter it below and
            choose your own password.
          </Text>

          <View style={styles.field}>
            <Text style={[commonStyling.inputTitle, styles.fieldTitle]}>
              Activation code
            </Text>
            <OtpInputField
              onTextChange={setCode}
              onFilled={setCode}
              disabled={isSubmitting}
            />
          </View>

          <View style={styles.field}>
            <Text style={[commonStyling.inputTitle, styles.fieldTitle]}>
              Create password
            </Text>
            <View style={[styles.passwordWrapper, { borderColor: colors.stroke }]}>
              <TextInput
                secureTextEntry={!showPassword}
                style={[
                  styles.inputFlex,
                  commonStyling.subtitle,
                  { color: colors.inputText },
                ]}
                value={password}
                placeholder="Choose a password"
                placeholderTextColor={colors.gray}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isSubmitting}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword((v) => !v)}>
                {showPassword ? (
                  <EyeOff size={20} color="#6C7278" />
                ) : (
                  <Eye size={20} color="#6C7278" />
                )}
              </TouchableOpacity>
            </View>
            <Text style={[commonStyling.subtitle, styles.hint]}>
              At least {MIN_PASSWORD_LENGTH} characters, with upper and lower
              case letters, a number and a symbol.
            </Text>
          </View>

          {error ? (
            <Text style={[styles.message, { color: colors.red }]}>{error}</Text>
          ) : null}
          {notice ? (
            <Text style={[styles.message, { color: colors.primaryColor }]}>
              {notice}
            </Text>
          ) : null}

          <View style={{ marginTop: 8 }}>
            <Buttons
              title="Activate account"
              onPress={handleActivate}
              loading={isSubmitting}
              rightIcon={<RightArrow />}
            />
          </View>

          <TouchableOpacity
            style={{ marginTop: 16, alignItems: "center" }}
            onPress={isResending ? undefined : handleResend}
          >
            <Text
              style={[
                commonStyling.subtitle,
                { fontFamily: "SemiBold", color: colors.primaryColor },
              ]}
            >
              {isResending ? "Sending..." : "Didn't get a code? Resend"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: 24, paddingBottom: 40 },
  field: { marginTop: 28 },
  fieldTitle: { fontFamily: "Bold", fontSize: 14, marginBottom: 8 },
  passwordWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 16,
  },
  inputFlex: { flex: 1, paddingVertical: 16, fontSize: 16 },
  hint: { fontSize: 12, marginTop: 8, lineHeight: 18 },
  message: { marginTop: 16, fontSize: 14, lineHeight: 20 },
  successWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  successCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#16A34A",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
});
