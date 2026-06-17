import React, { useRef, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { X, Landmark, Check } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useTheme from "../../../hooks/useThemes";
import { commonStyles } from "../../../styles/commonStyles";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Buttons from "../../../components/buttons/buttons";
import OverlayBottomSheet, {
  OverlayBottomSheetRef,
} from "../../../components/modals/overlayBottomSheet";
import { useWalletBalance } from "../../../hooks/queries/useWalletBalance";
import { formatPrice } from "../../../utils/formatPrice";
import { useRequestWithdrawal } from "../../../hooks/mutations/usePayments";
import { useGetWithdrawalFee } from "../../../hooks/queries/useGetWithdrawalFee";

const WithdrawEarnings = () => {
  const { colors, theme } = useTheme();
  const commonStyling = commonStyles(colors);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [amount, setAmount] = useState("0");
  const percentages = ["25%", "50%", "75%", "Max"];
  const [selectedPercent, setSelectedPercent] = useState("25%");
  const withdrawRef = useRef<OverlayBottomSheetRef>(null);
  const { data: walletBalance, isLoading: isWalletLoading } =
    useWalletBalance();
  const { data, isLoading, isError } = useGetWithdrawalFee(amount);
  const { mutate, isPending } = useRequestWithdrawal();

  console.log(data);

  const handleWithdrawalSubmit = () => {
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) return;

    mutate(
      { amount: parsedAmount },
      {
        onSuccess: () => {
          alert("Your withdrawal request is processing successfully.");
          setAmount("");
          withdrawRef.current?.open();
        },
        onError: (err) => {
          alert(`Withdrawal failed: ${err.message}`);
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
      <StatusBar
        barStyle={theme === "light" ? "dark-content" : "light-content"}
      />

      {/* Header */}
      <View style={styles.header}>
        <Text
          style={[
            commonStyling.title,
            {
              fontSize: 20,
              fontFamily: "Bold",
            },
          ]}
        >
          Withdraw Earnings
        </Text>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => {
            navigation.goBack();
          }}
        >
          <X color="#0F172A" size={24} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* Balance Display */}
        <View style={styles.balanceSection}>
          <Text
            style={[
              styles.balanceLabel,
              commonStyling.subtitle,
              {
                fontSize: 12,
                fontFamily: "Medium",
              },
            ]}
          >
            AVAILABLE BALANCE
          </Text>
          <Text
            style={[
              styles.balanceAmount,
              {
                fontSize: 44,
                fontFamily: "Bold",
                color: colors.primaryColor,
              },
            ]}
          >
            {formatPrice(walletBalance?.data.available_balance)}
          </Text>
        </View>

        {/* Input Field */}
        <Text
          style={[
            styles.inputLabel,
            commonStyling.title,
            {
              fontSize: 14,
              fontFamily: "SemiBold",
            },
          ]}
        >
          Enter amount
        </Text>
        <View
          style={[
            styles.inputContainer,
            {
              borderColor: colors.lightPrimaryBlueBorder,
            },
          ]}
        >
          <Text style={styles.currencySymbol}>$</Text>
          <TextInput
            style={[
              styles.textInput,
              commonStyling.title,
              {
                fontSize: 20,
                fontFamily: "SemiBold",
              },
            ]}
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
          />
        </View>

        {/* Percentage Chips */}
        <View style={styles.chipContainer}>
          {percentages.map((percent) => (
            <TouchableOpacity
              key={percent}
              onPress={() => setSelectedPercent(percent)}
              style={[
                styles.chip,
                {
                  borderColor:
                    selectedPercent === percent
                      ? colors.primaryColor
                      : colors.lightPrimaryBlueBorder,
                  backgroundColor:
                    selectedPercent === percent
                      ? colors.primaryColor
                      : colors.surfacePrimary,
                },
              ]}
            >
              <Text
                style={[
                  {
                    fontSize: 14,
                    fontFamily: "SemiBold",
                    color:
                      selectedPercent === percent
                        ? "#ffffff"
                        : colors.subTitleText,
                  },
                ]}
              >
                {percent}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View
          style={[
            styles.divider,
            {
              backgroundColor: colors.lightPrimaryBlueBorder,
            },
          ]}
        />

        {/* Fee Summary */}
        <View style={styles.feeRow}>
          <Text
            style={[
              commonStyling.subtitle,
              {
                fontSize: 14,
              },
            ]}
          >
            Transaction fee
          </Text>
          <Text
            style={[
              commonStyling.title,
              {
                fontSize: 14,
                fontFamily: "SemiBold",
              },
            ]}
          >
            {isLoading ? (
              <ActivityIndicator />
            ) : (
              formatPrice(data?.data.transaction_fee, true)
            )}
          </Text>
        </View>

        <View
          style={[
            styles.receiveCard,
            {
              backgroundColor: colors.surfaceBrand,
              borderWidth: 1,
              borderColor: colors.lightPrimaryBlueBorder,
            },
          ]}
        >
          <Text
            style={{
              fontSize: 14,
              fontFamily: "SemiBold",
              color: colors.primaryColor,
            }}
          >
            You will receive
          </Text>
          <Text
            style={{
              fontSize: 18,
              fontFamily: "Bold",
              color: colors.primaryColor,
            }}
          >
            {formatPrice(data?.data.net_amount, true)}
          </Text>
        </View>
      </View>

      {/* Footer Button */}
      <View style={styles.footer}>
        <Buttons
          title="Withdraw Now"
          onPress={() => {
            handleWithdrawalSubmit();
          }}
          loading={isPending}
        />
      </View>

      <OverlayBottomSheet ref={withdrawRef} height={500} overlay={true}>
        <View style={styles.sheetContent}>
          {/* Success Icon */}
          <View style={styles.iconContainer}>
            <View style={styles.circleBg}>
              <Check color="#10B981" size={48} strokeWidth={3} />
            </View>
          </View>

          {/* Success Message */}
          <Text
            style={[
              styles.title,
              commonStyling.title,
              {
                fontSize: 24,
                fontFamily: "Bold",
              },
            ]}
          >
            Withdrawal Successful!
          </Text>
          <Text
            style={[
              styles.subTitle,
              commonStyling.subtitle,
              {
                fontSize: 16,
              },
            ]}
          >
            $536.44 is on the way to your bank
          </Text>

          {/* Transaction Details Card */}
          <View
            style={[
              styles.detailsCard,
              {
                borderColor: colors.lightPrimaryBlueBorder,
              },
            ]}
          >
            <View style={styles.detailRow}>
              <Text
                style={[
                  commonStyling.subtitle,
                  {
                    fontSize: 14,
                  },
                ]}
              >
                Expected arrival
              </Text>
              <Text
                style={[
                  commonStyling.title,
                  {
                    fontSize: 14,
                    fontFamily: "SemiBold",
                  },
                ]}
              >
                1-2 business days
              </Text>
            </View>

            <View
              style={[
                styles.divider,
                {
                  backgroundColor: colors.lightPrimaryBlueBorder,
                  marginTop: 24,
                },
              ]}
            />

            <View style={styles.detailRow}>
              <Text
                style={[
                  commonStyling.subtitle,
                  {
                    fontSize: 14,
                  },
                ]}
              >
                Destination
              </Text>
              <Text
                style={[
                  commonStyling.title,
                  {
                    fontSize: 14,
                    fontFamily: "SemiBold",
                  },
                ]}
              >
                Chase ****4242
              </Text>
            </View>
          </View>

          <View
            style={{
              width: "100%",
              marginTop: 24,
            }}
          >
            <Buttons
              title="Done"
              onPress={() => {
                withdrawRef.current?.close();
              }}
            />
          </View>
        </View>
      </OverlayBottomSheet>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    height: 64,
    justifyContent: "space-between",
  },

  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },

  content: { padding: 24 },
  balanceSection: { marginBottom: 32 },
  balanceLabel: {
    letterSpacing: 0.5,
  },
  balanceAmount: {
    marginTop: 8,
  },

  inputLabel: {
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 64,
    borderRadius: 16,
    paddingHorizontal: 20,
    borderWidth: 1,
  },
  currencySymbol: {
    fontSize: 20,
    fontWeight: "600",
    color: "#94A3B8",
    marginRight: 12,
  },
  textInput: { flex: 1 },

  chipContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    marginBottom: 24,
  },
  chip: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 4,
    borderWidth: 1,
  },

  divider: { height: 1, marginBottom: 24 },
  sectionLabel: {
    letterSpacing: 0.5,
    marginBottom: 16,
  },

  bankCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  bankIconBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#3B82F6",
    justifyContent: "center",
    alignItems: "center",
  },
  bankInfo: { flex: 1, marginLeft: 16 },

  bankDetails: { marginTop: 2 },

  feeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
    marginBottom: 12,
  },

  receiveCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderRadius: 16,
  },

  footer: { padding: 24, position: "absolute", bottom: 20, width: "100%" },
  sheetContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  iconContainer: { marginBottom: 32 },
  circleBg: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#D1FAE5",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    textAlign: "center",
    marginBottom: 12,
  },
  subTitle: {
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
  },
  detailsCard: {
    width: "100%",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

export default WithdrawEarnings;
