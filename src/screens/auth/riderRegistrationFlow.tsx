import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Eye, EyeOff, X, Mail, Lock } from "lucide-react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
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
  useRegisterMutation,
  useResendOtp,
  useVerifyOTPMutation,
} from "../../hooks/mutations/useAuth";
import { RegisterPayload, UpdateProfilePayload } from "../../types/auth.types";
import Toast from "react-native-toast-message";

// --- Types ---
type RiderStep = "initial" | "otp" | "password" | "payment" | "success";
type RiderRegistrationRouteParams = {
  resumeStep?: RiderStep;
  userId?: string;
  identifier?: string;
};
type RiderRegistrationFormData = RegisterPayload & {
  identifier: string;
};

export default function RiderRegistrationFlow() {
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
  const route = useRoute();
  const routeParams = route.params as RiderRegistrationRouteParams | undefined;
  const hasRequestedResumeOtp = useRef(false);

  const [formData, setFormData] = useState<RiderRegistrationFormData>({
    identifier: "",
    password: "",
    role: "rider",
  });

  useEffect(() => {
    if (routeParams?.resumeStep === "otp" && routeParams.userId) {
      setUserId(routeParams.userId);
      setStep("otp");
      setCountdown(60);

      if (routeParams.identifier) {
        setFormData((prev) => ({
          ...prev,
          identifier: routeParams.identifier ?? "",
        }));
        setsignUpMethod(
          routeParams.identifier.includes("@") ? "email" : "phone",
        );
      }

      if (!hasRequestedResumeOtp.current) {
        hasRequestedResumeOtp.current = true;
        resendOTP(
          { user_id: routeParams.userId, purpose: "registration" },
          {
            onSuccess: () => setCountdown(60),
          },
        );
      }
    }
  }, [
    resendOTP,
    routeParams?.identifier,
    routeParams?.resumeStep,
    routeParams?.userId,
  ]);

  const handleRegistration = () => {
    // Simple logic to determine if input is email or phone
    const isEmail = formData.identifier.includes("@");
    const payload: RegisterPayload = isEmail
      ? {
          email: formData.identifier,
          password: formData.password,
          role: "rider",
        }
      : {
          phone: formData.identifier,
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
    console.log(otpCode, userId);
    verifyMutation.mutate(
      {
        user_id: userId,
        code: otpCode,
        purpose: "registration",
      },
      {
        onSuccess: (response) => {
          Toast.show({
            type: "tripToast",
            text1: "Account verified",
            text2: response.message || "You can now log in to your account.",
          });

          setTimeout(() => {
            navigation.navigate("Login");
          }, 1200);
        },
      },
    );
  };

  const updateFields = (fields: Partial<RiderRegistrationFormData>) => {
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
            width: "80%",
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
          <TouchableWithoutFeedback
            onPress={Keyboard.dismiss}
            accessible={false}
          >
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
                <View style={styles.header}>
                  <BackButton />
                </View>

                <Text
                  style={[
                    commonStyling.title,
                    styles.mainTitle,
                    {
                      fontSize: 30,
                      fontFamily: "Bold",
                    },
                  ]}
                >
                  Create Account
                </Text>
                <Text style={[commonStyling.subtitle, styles.subTitle]}>
                  Sign up to book safe, reliable rides to your medical
                  appointments.
                </Text>

                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    borderWidth: 1,
                    padding: 16,
                    columnGap: 12,
                    borderRadius: 16,
                    borderColor:
                      signUpMethod === "phone"
                        ? colors.primaryColor
                        : colors.stroke,
                    backgroundColor:
                      signUpMethod === "phone"
                        ? colors.highlightBlue50
                        : colors.surfacePrimary,
                  }}
                  onPress={() => {
                    setsignUpMethod("phone");
                  }}
                >
                  <View
                    style={{
                      height: 40,
                      width: 40,
                      backgroundColor:
                        signUpMethod === "phone"
                          ? colors.primaryColor
                          : colors.lightGray,
                      borderRadius: 50,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Phone
                      color={
                        signUpMethod === "phone" ? "#ffffff" : colors.titleText
                      }
                    />
                  </View>
                  <View>
                    <Text
                      style={[
                        commonStyling.subtitle,
                        {
                          color: colors.titleText,
                          fontFamily: "Medium",
                          marginBottom: 4,
                        },
                      ]}
                    >
                      Phone Number
                    </Text>
                    <Text
                      style={[
                        commonStyling.subtitle,
                        {
                          fontSize: FONT_SIZES.BODY,
                          fontFamily: "Medium",
                        },
                      ]}
                    >
                      We will send you a verification code
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    borderWidth: 1,
                    padding: 16,
                    columnGap: 12,
                    borderRadius: 16,
                    borderColor:
                      signUpMethod === "email"
                        ? colors.primaryColor
                        : colors.stroke,
                    marginTop: 16,
                    marginBottom: 24,
                    backgroundColor:
                      signUpMethod === "email"
                        ? colors.highlightBlue50
                        : colors.surfacePrimary,
                  }}
                  onPress={() => {
                    setsignUpMethod("email");
                  }}
                >
                  <View
                    style={{
                      height: 40,
                      width: 40,
                      backgroundColor:
                        signUpMethod === "email"
                          ? colors.primaryColor
                          : colors.lightGray,
                      borderRadius: 50,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Mail
                      color={
                        signUpMethod === "email" ? "#ffffff" : colors.titleText
                      }
                    />
                  </View>
                  <View>
                    <Text
                      style={[
                        commonStyling.subtitle,
                        {
                          color: colors.titleText,
                          fontFamily: "Medium",
                          marginBottom: 4,
                        },
                      ]}
                    >
                      Email Address
                    </Text>
                    <Text
                      style={[
                        commonStyling.subtitle,
                        {
                          fontSize: FONT_SIZES.BODY,
                          fontFamily: "Medium",
                        },
                      ]}
                    >
                      Sign up with your email
                    </Text>
                  </View>
                </TouchableOpacity>

                {signUpMethod === "phone" && (
                  <Input
                    title="Phone Number"
                    placeholder="(555) 000-0000"
                    value={formData.identifier}
                    onChangeText={(val) => updateFields({ identifier: val })}
                    keyboardType="phone-pad"
                  />
                )}

                {signUpMethod === "email" && (
                  <Input
                    title="Email Address"
                    placeholder="you@example.com"
                    value={formData.identifier}
                    onChangeText={(val) => updateFields({ identifier: val })}
                    keyboardType="email-address"
                  />
                )}
                <Text
                  style={[
                    commonStyling.subtitle,
                    styles.legalText,
                    {
                      fontSize: FONT_SIZES.SMALL,
                    },
                  ]}
                >
                  By signing up, you agree to our{" "}
                  <Text
                    style={{
                      color: colors.primaryColor,
                      fontFamily: "Medium",
                    }}
                  >
                    Terms of Service
                  </Text>{" "}
                  and{" "}
                  <Text
                    style={{
                      color: colors.primaryColor,
                      fontFamily: "Medium",
                    }}
                  >
                    Privacy Policy
                  </Text>
                  . Your health information is protected under HIPAA.
                </Text>
              </View>

              <View>
                <Buttons
                  title="Continue"
                  onPress={() => {
                    setStep("password");
                  }}
                  loading={isPending}
                  rightIcon={!isPending && <RightArrow />}
                />

                <TouchableOpacity
                  style={{ marginTop: 16 }}
                  onPress={() => {
                    navigation.navigate("Login");
                  }}
                >
                  <Text
                    style={[
                      commonStyling.subtitle,
                      styles.footerText,
                      {
                        fontSize: FONT_SIZES.BODY,
                        fontFamily: "SemiBold",
                      },
                    ]}
                  >
                    Already have an account?{" "}
                    <Text
                      style={[
                        styles.linkText,
                        {
                          color: colors.primaryColor,
                        },
                      ]}
                    >
                      Log in
                    </Text>
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
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
                    commonStyling.inputTitle,
                    {
                      fontFamily: "Bold",
                      fontSize: 14,
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
                    commonStyling.inputTitle,
                    {
                      fontFamily: "Bold",
                      fontSize: 14,
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
              onPress={handleRegistration}
              loading={isPending}
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
