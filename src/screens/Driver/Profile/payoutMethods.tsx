import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";
import {
  ChevronLeft,
  Plus,
  Landmark,
  CreditCard,
  CheckCircle2,
  Lock,
  MoreVertical,
} from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useTheme from "../../../hooks/useThemes";
import { commonStyles } from "../../../styles/commonStyles";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Header from "../../../components/reuseables/header";
import { usePaymentMethods } from "../../../hooks/queries/usePaymentMethods";

const PayoutMethods = () => {
  const { colors, theme } = useTheme();
  const commonStyling = commonStyles(colors);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { data, isLoading } = usePaymentMethods();

  const paymentMethods = data?.data || [];

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

      <Header title="Payment Methods" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Automatic Payouts Info Box */}
        <View
          style={[
            styles.infoBanner,
            {
              backgroundColor: colors.surfaceBrand,
            },
          ]}
        >
          <Text
            style={[
              styles.infoText,
              {
                fontSize: 14,
                fontFamily: "Regular",
                color: colors.primaryColor,
              },
            ]}
          >
            <Text
              style={{
                fontFamily: "Bold",
              }}
            >
              Automatic Payouts:{" "}
            </Text>
            Your earnings are automatically transferred to your default payment
            method every week.
          </Text>
        </View>

        {/* Add Payment Method Dash Box */}
        <TouchableOpacity
          style={[
            styles.addMethodBox,
            {
              borderColor: colors.primaryColor,
            },
          ]}
          onPress={() =>
            navigation.navigate("Auth", {
              screen: "PaymentMethod",
            })
          }
        >
          <View
            style={[
              styles.plusCircle,
              {
                backgroundColor: colors.surfaceBrand,
              },
            ]}
          >
            <Plus size={20} color={colors.primaryColor} />
          </View>
          <View>
            <Text
              style={{
                fontSize: 15,
                fontFamily: "Bold",
                color: colors.primaryColor,
              }}
            >
              Add Payment Method
            </Text>
            <Text
              style={[
                styles.addMethodSub,
                commonStyling.subtitle,
                {
                  fontSize: 12,
                  fontFamily: "Medium",
                },
              ]}
            >
              Bank account or debit card
            </Text>
          </View>
        </TouchableOpacity>

        <Text
          style={[
            styles.sectionLabel,
            commonStyling.title,
            {
              fontSize: 18,
              fontFamily: "Bold",
            },
          ]}
        >
          Your Payment Methods
        </Text>

        {/* List of Methods */}
        {paymentMethods.length === 0 ? (
          <Text
            style={[
              commonStyling.title,
              {
                fontSize: 15,
                fontFamily: "Bold",
                textAlign: "center",
                marginTop: 16,
              },
            ]}
          >
            No payment method
          </Text>
        ) : (
          <View>
            {paymentMethods.map((method) => (
              <View
                key={method.id}
                style={[
                  styles.methodCard,
                  {
                    borderColor: colors.lightPrimaryBlueBorder,
                  },
                ]}
              >
                <View
                  style={[
                    styles.methodIcon,
                    { backgroundColor: method.iconBg },
                  ]}
                >
                  {method.icon}
                </View>

                <View style={styles.methodDetails}>
                  <View style={styles.nameRow}>
                    <Text
                      style={[
                        commonStyling.title,
                        {
                          fontSize: 15,
                          fontFamily: "Bold",
                        },
                      ]}
                    >
                      {method.name}
                    </Text>
                    {method.isDefault && (
                      <View style={styles.defaultBadge}>
                        <CheckCircle2 size={12} color="#10B981" />
                        <Text style={styles.defaultText}>Default</Text>
                      </View>
                    )}
                  </View>
                  <Text
                    style={[
                      commonStyling.subtitle,
                      {
                        fontSize: 14,
                      },
                    ]}
                  >
                    {method.detail}
                  </Text>

                  {method.expiry && (
                    <Text
                      style={[
                        commonStyling.subtitle,
                        {
                          fontSize: 12,
                          marginTop: 4,
                        },
                      ]}
                    >
                      {method.expiry}
                    </Text>
                  )}

                  {method.isVerified && (
                    <View style={styles.verifiedRow}>
                      <CheckCircle2 size={12} color="#10B981" />
                      <Text style={styles.verifiedText}>Verified</Text>
                    </View>
                  )}
                </View>
                <TouchableOpacity style={styles.moreButton}>
                  <MoreVertical size={20} color={colors.titleText} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* Security Notice */}
        <View
          style={[
            styles.securityBox,
            {
              borderWidth: 1,
              borderColor: colors.lightPrimaryBlueBorder,
            },
          ]}
        >
          <View style={styles.lockIconCircle}>
            <Lock size={16} color="#64748B" />
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={[
                styles.securityTitle,
                commonStyling.title,
                {
                  fontSize: 14,
                  fontFamily: "Bold",
                },
              ]}
            >
              Secure & Protected
            </Text>
            <Text
              style={[
                styles.securityText,
                commonStyling.subtitle,
                {
                  fontSize: 12,
                },
              ]}
            >
              Your payment information is encrypted and securely stored. We
              never share your financial details with passengers.
            </Text>
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

  infoBanner: {
    padding: 18,
    borderRadius: 16,
    marginBottom: 24,
  },
  infoText: { lineHeight: 20 },

  addMethodBox: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderRadius: 16,
    borderStyle: "dashed",
    borderWidth: 1,
    gap: 16,
    marginBottom: 32,
  },
  plusCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  addMethodSub: { marginTop: 2 },

  sectionLabel: {
    marginBottom: 20,
  },

  methodCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  methodIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  methodDetails: { flex: 1, marginLeft: 16 },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },

  defaultBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  defaultText: { fontSize: 11, fontWeight: "800", color: "#10B981" },

  verifiedRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 6,
  },
  verifiedText: { fontSize: 11, fontWeight: "700", color: "#10B981" },

  moreButton: { padding: 8 },

  securityBox: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
    padding: 20,
    borderRadius: 16,
  },
  lockIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  securityTitle: {
    marginBottom: 4,
  },
  securityText: {
    lineHeight: 18,
  },
});

export default PayoutMethods;
