import { Eye, EyeOff } from "lucide-react-native";
import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useTheme from "../../../hooks/useThemes";
import Buttons from "../../../components/buttons/buttons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { commonStyles } from "../../../styles/commonStyles";
import BackButton from "../../../components/buttons/backButton";
import { useChangePassword } from "../../../hooks/mutations/useAuth";

function ChangePassword() {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const { colors } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const commonStyling = commonStyles(colors);
  const [oldPassword, setoldPassword] = useState("");
  const [newPassword, setnewPassword] = useState("");

  const { mutate: performChange, isPending } = useChangePassword();

  const handleSave = () => {
    if (!oldPassword || !newPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    performChange(
      {
        current_password: oldPassword,
        new_password: newPassword,
      },
      {
        onSuccess: () => {
          navigation.goBack();
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
      <View
        style={{
          flex: 1,
          paddingHorizontal: 24,
          flexDirection: "column",
          justifyContent: "space-between",
          paddingBottom: 30,
          paddingTop: 16,
        }}
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
              Change Password
            </Text>
          </View>

          <View>
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
                Old Password
              </Text>
              <View style={styles.passwordWrapper}>
                <TextInput
                  secureTextEntry={!showOldPassword}
                  style={[styles.inputFlex, commonStyling.subtitle]}
                  value={oldPassword}
                  placeholder="Enter your password"
                  onChangeText={(val) => {
                    setoldPassword(val);
                  }}
                />
                <TouchableOpacity
                  onPress={() => setShowOldPassword(!showOldPassword)}
                >
                  {showOldPassword ? (
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
                New Password
              </Text>
              <View style={styles.passwordWrapper}>
                <TextInput
                  secureTextEntry={!showNewPassword}
                  style={[styles.inputFlex, commonStyling.subtitle]}
                  value={newPassword}
                  placeholder="Enter your password"
                  onChangeText={(val) => {
                    setnewPassword(val);
                  }}
                />
                <TouchableOpacity
                  onPress={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? (
                    <EyeOff size={20} color="#6C7278" />
                  ) : (
                    <Eye size={20} color="#6C7278" />
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
        <View>
          <Buttons
            title="Change Password"
            onPress={handleSave}
            loading={isPending}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 24 },
  header: { marginBottom: 24 },
  backBtn: { marginBottom: 20 },
  stepIndicator: {
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginBottom: 12,
  },
  stepText: { color: "#3B82F6", fontSize: 12, fontWeight: "700" },
  mainTitle: {
    marginBottom: 8,
  },
  subTitle: {
    lineHeight: 22,
  },
  inputContainer: { marginBottom: 20 },
  label: { marginBottom: 8 },
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
    borderRadius: 4,
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
    marginBottom: 24,
  },
  row: { flexDirection: "row", marginBottom: 10 },

  resendText: { textAlign: "center" },
  // footerContainer: { marginTop: "auto", paddingBottom: 20 },
  footerText: { textAlign: "center" },
  linkText: { fontWeight: "700" },
});

export default ChangePassword;
