import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Eye, EyeOff, Lock } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import useTheme from "../../hooks/useThemes";
import { commonStyles } from "../../styles/commonStyles";
import { FONT_SIZES } from "../../constants/sizes";
import Input from "../../components/inputs/input";
import Buttons from "../../components/buttons/buttons";
import RightArrow from "../../../assets/icons/rightArrow";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import BackButton from "../../components/buttons/backButton";
import SucccessCheckmark from "../../../assets/icons/successCheckmark";
import {
  useLogin,
  useRegisterDriver,
  useVerifyDriverInvite,
} from "../../hooks/mutations/useAuth";
import {
  DriverAuthData,
  VerifyDriverInviteResponse,
} from "../../types/auth.types";
import { syncUserProfile } from "../../utils/syncUserProfile";
import { storage } from "../../utils/storage";
import Toast from "react-native-toast-message";

type DriverStep = "invite" | "password" | "success";

const isJwt = (value?: string | null) => value?.split(".").length === 3;

const getErrorMessage = (error: any, fallback: string) => {
  const detail = error?.response?.data?.detail;

  if (Array.isArray(detail)) {
    return detail[0]?.msg || fallback;
  }

  if (typeof detail === "string") {
    return detail;
  }

  return error?.response?.data?.message || error?.message || fallback;
};

const showErrorToast = (title: string, message: string) => {
  Toast.show({
    type: "errorToast",
    text1: title,
    text2: message,
  });
};

const getResponseData = (response: any): DriverAuthData | string | null => {
  if (!response) return null;
  return response?.data ?? response;
};

const isExplicitFailure = (response: any) =>
  typeof response === "object" && response?.success === false;

const getActivationTokens = (response: any) => {
  const data = getResponseData(response);
  const accessToken =
    (typeof data === "object" && data?.access_token) ||
    (typeof data === "object" && data?.token) ||
    response?.access_token ||
    response?.token ||
    (typeof data === "string" && isJwt(data) ? data : null) ||
    (typeof response === "string" && isJwt(response) ? response : null);
  const refreshToken =
    (typeof data === "object" && data?.refresh_token) ||
    response?.refresh_token ||
    null;

  return {
    accessToken: typeof accessToken === "string" ? accessToken : null,
    refreshToken: typeof refreshToken === "string" ? refreshToken : null,
  };
};

const getInviteIdentity = (invite?: VerifyDriverInviteResponse | null) => {
  const data = invite?.data;

  if (!data || typeof data !== "object") return null;

  if (data.email) return { email: data.email };
  if (data.phone) return { phone: data.phone };
  if (data.phone_number) return { phone: data.phone_number };

  return null;
};

export default function DriverRegistrationFlow() {
  const [step, setStep] = useState<DriverStep>("invite");
  const [showPassword, setShowPassword] = useState(false);
  const [inviteCode, setInviteCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [verifiedInvite, setVerifiedInvite] =
    useState<VerifyDriverInviteResponse | null>(null);
  const [registrationResponse, setRegistrationResponse] = useState<any>(null);

  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { colors, theme } = useTheme();
  const commonStyling = commonStyles(colors);
  const { mutate: verifyInvite, isPending: verifyingInvite } =
    useVerifyDriverInvite();
  const { mutate: register, isPending: registeringDriver } =
    useRegisterDriver();
  const { mutate: login, isPending: loggingIn } = useLogin();

  const routeToDriverDashboard = async () => {
    await syncUserProfile();

    navigation.reset({
      index: 0,
      routes: [{ name: "DriverMainTabs" }],
    });
  };

  const handleVerifyInvite = () => {
    const trimmedInviteCode = inviteCode.trim();

    if (!trimmedInviteCode) {
      showErrorToast("Invite code required", "Enter your invitation code.");
      return;
    }

    verifyInvite(
      { invite_token: trimmedInviteCode },
      {
        onSuccess: (response) => {
          if (isExplicitFailure(response)) {
            showErrorToast(
              "Invite verification failed",
              response.message ||
                "Invalid or expired invitation token. Please check the code and try again.",
            );
            return;
          }

          setInviteCode(trimmedInviteCode);
          setVerifiedInvite(response);
          setStep("password");
        },
        onError: (error) => {
          showErrorToast(
            "Invite verification failed",
            getErrorMessage(
              error,
              "Invalid or expired invitation token. Please check the code and try again.",
            ),
          );
        },
      },
    );
  };

  const handleRegister = () => {
    if (!password || password.length < 8) {
      showErrorToast("Invalid password", "Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      showErrorToast("Password mismatch", "Both password fields must match.");
      return;
    }

    register(
      { invite_token: inviteCode, password },
      {
        onSuccess: (response) => {
          if (isExplicitFailure(response)) {
            showErrorToast(
              "Registration failed",
              (typeof response === "object" && response?.message) ||
                "Registration failed. Please check your invite token and try again.",
            );
            return;
          }

          setRegistrationResponse(response);
          setStep("success");
        },
        onError: (error) => {
          showErrorToast(
            "Registration failed",
            getErrorMessage(
              error,
              "Registration failed. Please check your invite token and try again.",
            ),
          );
        },
      },
    );
  };

  const handleContinueToDashboard = async () => {
    const { accessToken, refreshToken } =
      getActivationTokens(registrationResponse);

    if (accessToken) {
      await storage.setToken(accessToken);

      if (refreshToken) {
        await storage.setRefreshToken(refreshToken);
      }

      await routeToDriverDashboard();
      return;
    }

    const identity = getInviteIdentity(verifiedInvite);

    if (!identity) {
      showErrorToast(
        "Login failed",
        "Account created, but login details were not returned. Please log in with your new password.",
      );
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
      return;
    }

    login(
      { ...identity, password },
      {
        onSuccess: routeToDriverDashboard,
        onError: (error) => {
          showErrorToast(
            "Login failed",
            getErrorMessage(
              error,
              "Account created, but automatic login failed. Please log in with your new password.",
            ),
          );
        },
      },
    );
  };

  const StepHeader = ({ current, total, title, subTitle }: any) => (
    <View style={styles.header}>
      {step !== "success" ? <BackButton /> : null}
      <View style={styles.stepIndicator}>
        <Text style={styles.stepText}>
          Step {current} of {total}
        </Text>
      </View>
      <Text
        style={[
          commonStyling.title,
          styles.mainTitle,
          {
            marginTop: 16,
            fontFamily: "Bold",
            fontSize: 30,
          },
        ]}
      >
        {title}
      </Text>
      <Text
        style={[
          commonStyling.subtitle,
          styles.subTitle,
          {
            fontSize: 16,
            width: "90%",
          },
        ]}
      >
        {subTitle}
      </Text>
    </View>
  );

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
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        {step === "invite" && (
          <View
            style={[
              styles.screen,
              {
                backgroundColor: colors.surfacePrimary,
              },
            ]}
          >
            <View>
              <StepHeader
                current={1}
                total={3}
                title="Verify Your Identity"
                subTitle="Enter the activation code provided by your admin."
              />

              <Input
                title="Activation code"
                value={inviteCode}
                onChangeText={setInviteCode}
                keyboardType="default"
              />
            </View>

            <Buttons
              title="Verify invite code"
              onPress={handleVerifyInvite}
              loading={verifyingInvite}
              rightIcon={!verifyingInvite && <RightArrow />}
            />
          </View>
        )}

        {step === "password" && (
          <View
            style={[
              styles.screen,
              {
                backgroundColor: colors.surfacePrimary,
              },
            ]}
          >
            <View>
              <StepHeader
                current={2}
                total={3}
                title="Create Password"
                subTitle="Secure your account with a strong password."
              />
              <View style={styles.inputContainer}>
                <Text
                  style={[
                    styles.label,
                    {
                      color: colors.titleText,
                    },
                  ]}
                >
                  Password
                </Text>
                <View style={styles.passwordWrapper}>
                  <TextInput
                    secureTextEntry={!showPassword}
                    style={[styles.inputFlex, commonStyling.subtitle]}
                    placeholder="Enter password"
                    value={password}
                    onChangeText={setPassword}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff size={20} color="#6C7278" />
                    ) : (
                      <Eye size={20} color="#6C7278" />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text
                  style={[
                    styles.label,
                    {
                      color: colors.titleText,
                    },
                  ]}
                >
                  Confirm Password
                </Text>
                <View style={styles.passwordWrapper}>
                  <TextInput
                    secureTextEntry={!showPassword}
                    style={[styles.inputFlex, commonStyling.subtitle]}
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff size={20} color="#6C7278" />
                    ) : (
                      <Eye size={20} color="#6C7278" />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              <View
                style={[
                  styles.privacyBanner,
                  {
                    backgroundColor: colors.surfaceBrand,
                  },
                ]}
              >
                <View style={styles.lockIconWrapper}>
                  <Lock size={16} color="#3B82F6" fill="#3B82F6" />
                </View>
                <View style={styles.bannerTextContainer}>
                  <Text
                    style={[
                      styles.bannerTitle,
                      commonStyling.title,
                      {
                        color: colors.primaryColor,
                        fontSize: FONT_SIZES.BODY,
                      },
                    ]}
                  >
                    Encryption & Security
                  </Text>
                  <Text
                    style={[
                      styles.bannerSub,
                      commonStyling.subtitle,
                      {
                        color: colors.lightPrimaryBlue,
                        fontSize: FONT_SIZES.BODY,
                      },
                    ]}
                  >
                    Your password is encrypted using industry-standard security
                    protocols. Minimum 8 characters required.
                  </Text>
                </View>
              </View>
            </View>

            <Buttons
              title="Create Account"
              onPress={handleRegister}
              loading={registeringDriver}
              rightIcon={!registeringDriver && <RightArrow />}
            />
          </View>
        )}

        {step === "success" && (
          <View
            style={[
              styles.screen,
              styles.successScreen,
              {
                backgroundColor: colors.surfacePrimary,
              },
            ]}
          >
            <View style={styles.successContent}>
              <View style={styles.successIcon}>
                <SucccessCheckmark />
              </View>

              <Text
                style={[
                  commonStyling.title,
                  styles.mainTitle,
                  styles.successTitle,
                  {
                    marginTop: 16,
                    fontFamily: "Bold",
                    fontSize: 30,
                  },
                ]}
              >
                Account Created
              </Text>
              <Text
                style={[
                  commonStyling.subtitle,
                  styles.subTitle,
                  styles.successSubtitle,
                  {
                    fontSize: 16,
                    width: "90%",
                  },
                ]}
              >
                Your driver account has been created successfully.
              </Text>
            </View>

            <Buttons
              title="Continue to dashboard"
              onPress={handleContinueToDashboard}
              loading={loggingIn}
              rightIcon={!loggingIn && <RightArrow />}
            />
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  screen: {
    flex: 1,
    paddingHorizontal: 24,
    flexDirection: "column",
    justifyContent: "space-between",
    paddingBottom: 30,
    paddingTop: 16,
  },
  header: { marginBottom: 12 },
  stepIndicator: {
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginBottom: 12,
    marginTop: 24,
  },
  stepText: { color: "#3B82F6", fontSize: 12, fontWeight: "700" },
  mainTitle: {
    marginBottom: 8,
  },
  textTitle: {
     lineHeight: 22,
    marginBottom: 20,
  },
  subTitle: {
    lineHeight: 22,
    marginBottom: 20,
  },
  inputContainer: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: "600", color: "#1A1C1E", marginBottom: 8 },
  passwordWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E9EF",
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  inputFlex: { flex: 1, paddingVertical: 16, fontSize: 16 },
  privacyBanner: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 16,
    marginTop: 4,
    alignItems: "flex-start",
  },
  lockIconWrapper: { marginTop: 2 },
  bannerTextContainer: { flex: 1, marginLeft: 12 },
  bannerTitle: { color: "#1E3A8A" },
  bannerSub: { color: "#3B82F6", marginTop: 4, lineHeight: 18 },
  successScreen: {
    justifyContent: "space-between",
  },
  successContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  successIcon: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    backgroundColor: "#DFF7E2",
    marginBottom: 16,
  },
  successTitle: {
    textAlign: "center",
  },
  successSubtitle: {
    textAlign: "center",
  },
});
