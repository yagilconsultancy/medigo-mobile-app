import { Eye, EyeOff, Info } from "lucide-react-native";
import { useState } from "react";
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
import Toast from "react-native-toast-message";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import BackButton from "../../components/buttons/backButton";
import Buttons from "../../components/buttons/buttons";
import OtpInputField from "../../components/inputs/otpInput";
import { FONT_SIZES } from "../../constants/sizes";
import useTheme from "../../hooks/useThemes";
import { useResetPassword } from "../../hooks/mutations/useAuth";
import { commonStyles } from "../../styles/commonStyles";

type ResetPasswordRouteParams = {
  ResetPasswordScreen: {
    userId: string;
    identifier?: string;
    message?: string;
  };
};

function ResetPasswordScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const route =
    useRoute<RouteProp<ResetPasswordRouteParams, "ResetPasswordScreen">>();
  const commonStyling = commonStyles(colors);
  const { userId, identifier, message } = route.params ?? {};
  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { mutate: resetPassword, isPending } = useResetPassword();

  const showErrorToast = (message: string) => {
    Toast.show({
      type: "errorToast",
      text1: "Error",
      text2: message,
    });
  };

  const handleSubmit = () => {
    if (isPending) return;

    if (!userId) {
      showErrorToast("Please request a new password reset code.");
      navigation.navigate("ForgotPassword");
      return;
    }

    if (otpCode.length !== 6) {
      showErrorToast("Please enter the 6-digit code sent to you.");
      return;
    }

    if (!newPassword) {
      showErrorToast("Please enter your new password.");
      return;
    }

    if (newPassword.length < 8) {
      showErrorToast("Your new password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      showErrorToast("Please confirm your password.");
      return;
    }

    resetPassword(
      {
        user_id: userId,
        code: otpCode,
        new_password: newPassword,
      },
      {
        onSuccess: () => {
          navigation.navigate("Login");
        },
      },
    );
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: colors.surfacePrimary,
        },
      ]}
    >
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View>
            <View style={styles.header}>
              <BackButton />

              <Text
                style={[
                  commonStyling.title,
                  styles.mainTitle,
                  {
                    marginTop: 16,
                    fontSize: 30,
                    fontFamily: "Bold",
                  },
                ]}
              >
                Reset Password
              </Text>
              <Text style={[commonStyling.subtitle, styles.subTitle]}>
                Enter the OTP sent to {identifier || "your account"} and choose
                a new password.
              </Text>
            </View>

            <View
              style={[
                styles.notice,
                {
                  backgroundColor: colors.highlightBlue50,
                  borderColor: colors.lightPrimaryBlueBorder,
                },
              ]}
            >
              <Info size={20} color={colors.primaryColor} />
              <Text
                style={[
                  commonStyling.subtitle,
                  styles.noticeText,
                  {
                    color: colors.primaryColor,
                  },
                ]}
              >
                {message || "OTP sent for password reset."}
              </Text>
            </View>

            <View style={styles.inputContainer}>
              <Text style={[commonStyling.inputTitle, styles.inputTitle]}>
                OTP Code
              </Text>
              <OtpInputField
                onTextChange={setOtpCode}
                onFilled={setOtpCode}
                disabled={isPending}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={[commonStyling.inputTitle, styles.inputTitle]}>
                New Password
              </Text>
              <View
                style={[
                  styles.passwordWrapper,
                  {
                    borderColor: colors.stroke,
                  },
                ]}
              >
                <TextInput
                  secureTextEntry={!showNewPassword}
                  style={[
                    styles.inputFlex,
                    commonStyling.subtitle,
                    {
                      color: colors.inputText,
                    },
                  ]}
                  value={newPassword}
                  placeholder="Enter new password"
                  placeholderTextColor={colors.gray}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isPending}
                  onChangeText={setNewPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowNewPassword(!showNewPassword)}
                  disabled={isPending}
                >
                  {showNewPassword ? (
                    <EyeOff size={20} color={colors.navbarText} />
                  ) : (
                    <Eye size={20} color={colors.navbarText} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={[commonStyling.inputTitle, styles.inputTitle]}>
                Confirm Password
              </Text>
              <View
                style={[
                  styles.passwordWrapper,
                  {
                    borderColor: colors.stroke,
                  },
                ]}
              >
                <TextInput
                  secureTextEntry={!showConfirmPassword}
                  style={[
                    styles.inputFlex,
                    commonStyling.subtitle,
                    {
                      color: colors.inputText,
                    },
                  ]}
                  value={confirmPassword}
                  placeholder="Re-enter new password"
                  placeholderTextColor={colors.gray}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isPending}
                  onChangeText={setConfirmPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isPending}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} color={colors.navbarText} />
                  ) : (
                    <Eye size={20} color={colors.navbarText} />
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.footer}>
            <Buttons
              title="Reset Password"
              onPress={handleSubmit}
              loading={isPending}
            />
            <TouchableOpacity
              style={styles.loginLink}
              onPress={() => navigation.navigate("Login")}
              disabled={isPending}
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
                Back to login
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: "space-between",
    paddingBottom: 30,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  header: {
    marginBottom: 24,
  },
  mainTitle: {
    marginBottom: 8,
  },
  subTitle: {
    lineHeight: 22,
  },
  notice: {
    alignItems: "flex-start",
    borderRadius: 8,
    borderWidth: 1,
    columnGap: 8,
    flexDirection: "row",
    marginBottom: 24,
    padding: 14,
  },
  noticeText: {
    flex: 1,
    fontFamily: "Medium",
    fontSize: 13,
    lineHeight: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputTitle: {
    fontFamily: "Bold",
    fontSize: 14,
  },
  passwordWrapper: {
    alignItems: "center",
    borderRadius: 5,
    borderWidth: 1,
    flexDirection: "row",
    height: 48,
    paddingHorizontal: 10,
  },
  inputFlex: {
    flex: 1,
    fontFamily: "Regular",
    fontSize: FONT_SIZES.BODY,
    paddingVertical: 0,
  },
  footer: {
    marginTop: 12,
  },
  loginLink: {
    marginTop: 20,
  },
  footerText: {
    textAlign: "center",
  },
});

export default ResetPasswordScreen;
