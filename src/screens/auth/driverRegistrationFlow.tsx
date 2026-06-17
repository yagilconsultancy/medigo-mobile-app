import React, { useEffect, useState } from "react";
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
import { Eye, EyeOff, X, Mail, Lock } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import OtpInputField from "../../components/inputs/otpInput";
import useTheme from "../../hooks/useThemes";
import { commonStyles } from "../../styles/commonStyles";
import { FONT_SIZES } from "../../constants/sizes";
import Phone from "../../../assets/icons/phone";
import Input from "../../components/inputs/input";
import Buttons from "../../components/buttons/buttons";
import RightArrow from "../../../assets/icons/rightArrow";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import BackButton from "../../components/buttons/backButton";
import {
  useRegisterDriver,
  useRegisterMutation,
  useResendOtp,
  useVerifyOTPMutation,
} from "../../hooks/mutations/useAuth";
import { RegisterPayload, UpdateProfilePayload } from "../../types/auth.types";

// --- Types ---
type RiderStep = "initial" | "otp" | "password" | "payment" | "success";

export default function DriverRegistrationFlow() {
  const [step, setStep] = useState<RiderStep>("initial");
  const [showPassword, setShowPassword] = useState(false);
  const [signUpMethod, setsignUpMethod] = useState("phone");
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { colors, theme } = useTheme();
  const commonStyling = commonStyles(colors);
  const { mutate, isPending } = useRegisterMutation();
  const [countdown, setCountdown] = useState(60);
  const [userId, setUserId] = useState<string>("");
  const [otpCode, setOtpCode] = useState("");
  const verifyMutation = useVerifyOTPMutation();
  const { mutate: resendOTP, isPending: isPendingResend } = useResendOtp();
  const [inviteToken, setinviteToken] = useState("");

  const [formData, setFormData] = useState<RegisterPayload>({
    identifier: "",
    password: "",
    role: "rider",
  });
  const { mutate: register, isPending: registeringDriver } =
    useRegisterDriver();

  const handleRegister = () => {
    if (!inviteToken || !formData.password) return;

    register(
      { invite_token: inviteToken, password: formData.password },
      {
        onSuccess: (authToken) => {
          // e.g., Save token to secure store, update userStore, and route to onboarding/home
          navigation.navigate("Login");
        },
      },
    );
  };

  const handleRegistration = () => {
    const payload = {
      email: formData.identifier,
      password: formData.password,
      role: "rider",
    };

    mutate(payload, {
      onSuccess: (res) => {
        console.log(res);
        setUserId(res.data.user_id);
        setStep("otp");
      },
    });
    setStep("otp");
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleResend = () => {
    resendOTP(
      { user_id: userId, purpose: "registration" },
      {
        onSuccess: () => setCountdown(60),
      },
    );
  };

  const handleVerifyOTP = () => {
    // console.log(otpCode, userId);
    // verifyMutation.mutate(
    //   {
    //     user_id: userId,
    //     code: otpCode,
    //     purpose: "registration",
    //   },
    //   {
    //     onSuccess: () => navigation.navigate("Login"),
    //   },
    // );

    navigation.navigate("DriverMainTabs");
  };

  const updateFields = (fields: Partial<RegisterPayload>) => {
    setFormData((prev) => ({ ...prev, ...fields }));
  };

  // Reusable Step Header
  const StepHeader = ({ current, total, title, subTitle }: any) => (
    <View style={styles.header}>
      <BackButton />
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
        {step === "initial" && (
          <View
            style={{
              flex: 1,
              paddingHorizontal: 24,
              flexDirection: "column",
              justifyContent: "space-between",
              paddingBottom: 30,
              backgroundColor: colors.surfacePrimary,
              paddingTop: 16,
            }}
          >
            <View>
              <StepHeader
                current={1}
                total={3}
                title="Verify Your Identity"
                subTitle="Enter the invite token that was sent by our medical transportation team."
              />

              <Input
                title="Invite token"
                value={inviteToken}
                onChangeText={(val) => {
                  setinviteToken(val);
                }}
                keyboardType="email-address"
              />
            </View>

            <View>
              <Buttons
                title="Create password"
                onPress={() => {
                  setStep("password");
                }}
                loading={isPending}
                rightIcon={!isPending && <RightArrow />}
              />
            </View>
          </View>
        )}

        {step === "otp" && (
          <View
            style={{
              flex: 1,
              paddingHorizontal: 24,
              flexDirection: "column",
              justifyContent: "space-between",
              paddingBottom: 30,
              backgroundColor: colors.surfacePrimary,
              paddingTop: 16,
            }}
          >
            <View>
              <StepHeader
                current={3}
                total={3}
                title="Enter OTP Code"
                subTitle={`We've sent a 6-digit code to ${formData.identifier}`}
              />
              <View style={styles.otpContainer}>
                <OtpInputField
                  onFilled={(code) => {
                    setOtpCode(code);
                  }}
                />
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={[
                    commonStyling.subtitle,
                    styles.resendText,
                    {
                      fontSize: FONT_SIZES.BODY,
                    },
                  ]}
                >
                  Code expires in{" "}
                  <Text
                    style={{
                      color: colors.primaryColor,
                    }}
                  >
                    {countdown}s
                  </Text>
                </Text>

                <Text
                  style={[
                    commonStyling.subtitle,
                    {
                      color: colors.primaryColor,
                      fontSize: FONT_SIZES.BODY,
                    },
                  ]}
                  onPress={handleResend}
                >
                  {isPendingResend ? "Resending" : "Resend"}
                </Text>
              </View>
            </View>

            <Buttons
              title="Verify and Continue"
              onPress={() => {
                console.log(otpCode);
                handleVerifyOTP();
              }}
              rightIcon={<RightArrow />}
              loading={verifyMutation.isPending}
            />
          </View>
        )}

        {step === "password" && (
          <View
            style={{
              flex: 1,
              paddingHorizontal: 24,
              flexDirection: "column",
              justifyContent: "space-between",
              paddingBottom: 30,
              backgroundColor: colors.surfacePrimary,
              paddingTop: 16,
            }}
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
                    onChangeText={(val) => updateFields({ password: val })}
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
              rightIcon={<RightArrow />}
            />
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 24 },
  header: { marginBottom: 12 },
  backBtn: { marginBottom: 20 },
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
  subTitle: {
    lineHeight: 22,
    marginBottom: 20,
  },
  inputContainer: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: "600", color: "#1A1C1E", marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: "#E5E9EF",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
  },
  passwordWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E9EF",
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  inputFlex: { flex: 1, paddingVertical: 16, fontSize: 16 },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  otpInput: {
    width: 45,
    height: 55,
    borderWidth: 1,
    borderColor: "#E5E9EF",
    borderRadius: 10,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "700",
  },

  btn: { padding: 18, borderRadius: 50, alignItems: "center", marginTop: 10 },
  btnActive: { backgroundColor: "#3B82F6" },
  btnInactive: { backgroundColor: "#BFDBFE" },
  btnText: { color: "#FFF", fontWeight: "700", fontSize: 16 },
  legalText: {
    marginTop: 16,
  },
  row: { flexDirection: "row", marginBottom: 10 },

  resendText: { textAlign: "center" },
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
  footerText: { textAlign: "center" },
  linkText: { fontWeight: "700" },
});
