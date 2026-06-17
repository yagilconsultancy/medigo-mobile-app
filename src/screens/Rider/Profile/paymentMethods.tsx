import React from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { ChevronRight, Plus, CreditCard, Lock } from "lucide-react-native";
import { usePaymentMethods } from "../../../hooks/queries/usePaymentMethods";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import useTheme from "../../../hooks/useThemes";
import { commonStyles } from "../../../styles/commonStyles";
import Header from "../../../components/reuseables/header";

const BrandLogo = ({ type }: { type: "paypal" | "apple" }) => (
  <View
    style={[
      styles.brandLogo,
      type === "paypal" ? styles.bgBlue : styles.bgBlack,
    ]}
  >
    <Text style={styles.brandText}>{type === "paypal" ? "PayPal" : "Pay"}</Text>
  </View>
);

const PaymentMethodsScreen = () => {
  const { data, isLoading } = usePaymentMethods();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { colors, theme } = useTheme();
  const commonStyling = commonStyles(colors);

  const paymentMethods = data?.data || [];

  // Helper to format brand names and handle icons
  const getBrandDetails = (brand: string) => {
    const b = brand?.toLowerCase();
    if (b === "visa") return { label: "Visa", color: "#1A1F71" };
    if (b === "mastercard") return { label: "Mastercard", color: "#EB001B" };
    return { label: brand, color: "#64748B" };
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.surfacePrimary }]}
    >
      <StatusBar
        barStyle={theme === "light" ? "dark-content" : "light-content"}
      />
      <Header title="Payment Methods" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* SAVED CARDS SECTION */}
        <Text
          style={[
            styles.categoryLabel,
            commonStyling.subtitle,
            { fontSize: 13, fontFamily: "SemiBold" },
          ]}
        >
          Saved Cards
        </Text>

        <View
          style={[
            styles.cardGroup,
            { borderColor: colors.lightPrimaryBlueBorder },
          ]}
        >
          {isLoading ? (
            <ActivityIndicator
              style={{ padding: 20 }}
              color={colors.primaryColor}
            />
          ) : paymentMethods.length > 0 ? (
            paymentMethods.map((method, index) => {
              const brand = getBrandDetails(method.brand);
              const isLast = index === paymentMethods.length - 1;

              return (
                <React.Fragment key={method.id}>
                  <TouchableOpacity
                    style={styles.paymentRow}
                    onPress={() =>
                      navigation.navigate("PaymentDetailsScreen", {
                        id: method.id,
                      })
                    }
                  >
                    <View
                      style={[
                        styles.iconContainer,
                        { backgroundColor: colors.homelightPrimaryBlue50 },
                      ]}
                    >
                      <CreditCard size={20} color={brand.color} />
                    </View>

                    <View style={styles.textContent}>
                      <View style={styles.titleRow}>
                        <Text
                          style={[
                            commonStyling.title,
                            { fontSize: 15, fontFamily: "SemiBold" },
                          ]}
                        >
                          {brand.label} •••• {method.last_four}
                        </Text>
                        {method.is_default && (
                          <View style={styles.defaultBadge}>
                            <Text style={styles.defaultText}>DEFAULT</Text>
                          </View>
                        )}
                      </View>
                      <Text
                        style={[
                          commonStyling.subtitle,
                          { fontSize: 13, fontFamily: "Medium", marginTop: 2 },
                        ]}
                      >
                        {method.holder_name}
                      </Text>
                    </View>
                    <ChevronRight size={18} color="#CBD5E1" />
                  </TouchableOpacity>

                  {!isLast && (
                    <View
                      style={[
                        styles.divider,
                        { backgroundColor: colors.lightPrimaryBlueBorder },
                      ]}
                    />
                  )}
                </React.Fragment>
              );
            })
          ) : (
            <Text
              style={{
                padding: 20,
                textAlign: "center",
                color: colors.subTitleText,
              }}
            >
              No cards saved yet.
            </Text>
          )}
        </View>

        {/* ADD PAYMENT SECTION */}
        <Text
          style={[
            styles.categoryLabel,
            commonStyling.subtitle,
            { fontSize: 13, fontFamily: "SemiBold" },
          ]}
        >
          Add Payment Method
        </Text>
        <TouchableOpacity
          style={[
            styles.addMethodCard,
            { borderColor: colors.lightPrimaryBlueBorder },
          ]}
          onPress={() =>
            navigation.navigate("Auth", {
              screen: "PaymentMethod",
            })
          }
        >
          <View style={styles.plusWrapper}>
            <Plus size={20} color="#3B82F6" />
          </View>
          <Text
            style={[
              styles.addMethodText,
              commonStyling.title,
              { fontFamily: "SemiBold", fontSize: 15 },
            ]}
          >
            Add Credit or Debit Card
          </Text>
          <ChevronRight size={18} color="#CBD5E1" />
        </TouchableOpacity>

        <Text
          style={[
            styles.categoryLabel,
            commonStyling.subtitle,
            {
              fontSize: 13,
              fontFamily: "SemiBold",
            },
          ]}
        >
          Other Options
        </Text>
        <View
          style={[
            styles.cardGroup,
            {
              borderColor: colors.lightPrimaryBlueBorder,
            },
          ]}
        >
          {/* PayPal */}
          <TouchableOpacity style={styles.paymentRow}>
            <BrandLogo type="paypal" />
            <View style={styles.textContent}>
              <Text
                style={[
                  commonStyling.title,
                  {
                    fontSize: 15,
                    fontFamily: "SemiBold",
                  },
                ]}
              >
                PayPal
              </Text>
              <Text
                style={[
                  commonStyling.subtitle,
                  {
                    fontSize: 13,
                    fontFamily: "Medium",
                    marginTop: 2,
                  },
                ]}
              >
                Link your PayPal account
              </Text>
            </View>
            <ChevronRight size={18} color="#CBD5E1" />
          </TouchableOpacity>

          <View
            style={[
              styles.divider,
              {
                backgroundColor: colors.lightPrimaryBlueBorder,
              },
            ]}
          />

          {/* Apple Pay */}
          <TouchableOpacity style={styles.paymentRow}>
            <BrandLogo type="apple" />
            <View style={styles.textContent}>
              <Text
                style={[
                  commonStyling.title,
                  {
                    fontSize: 15,
                    fontFamily: "SemiBold",
                  },
                ]}
              >
                Apple Pay
              </Text>
              <Text
                style={[
                  commonStyling.subtitle,
                  {
                    fontSize: 13,
                    fontFamily: "Medium",
                    marginTop: 2,
                  },
                ]}
              >
                Fast and secure checkout
              </Text>
            </View>
            <ChevronRight size={18} color="#CBD5E1" />
          </TouchableOpacity>
        </View>

        {/* Security Footer */}
        <View style={styles.securityFooter}>
          <Lock size={14} color="#94A3B8" />
          <View style={styles.securityTextContainer}>
            <Text
              style={[
                commonStyling.subtitle,
                { fontSize: 12, fontFamily: "SemiBold" },
              ]}
            >
              Secure Payment
            </Text>
            <Text
              style={[commonStyling.subtitle, { fontSize: 12, marginTop: 2 }]}
            >
              Your payment information is encrypted and PCI-compliant.
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
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  headerTitle: { fontSize: 18, fontWeight: "800", color: "#1E293B" },

  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  categoryLabel: {
    marginTop: 24,
    marginBottom: 12,
  },

  cardGroup: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: "hidden",
  },
  paymentRow: { flexDirection: "row", alignItems: "center", padding: 16 },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  textContent: { flex: 1, marginLeft: 12 },
  titleRow: { flexDirection: "row", alignItems: "center" },

  divider: { height: 1, marginHorizontal: 16 },

  defaultBadge: {
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 10,
  },
  defaultText: { color: "#22C55E", fontSize: 10, fontWeight: "800" },

  addMethodCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
  },
  plusWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
  },
  addMethodText: {
    flex: 1,
    marginLeft: 12,
  },

  brandLogo: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  bgBlue: { backgroundColor: "#0070BA" },
  bgBlack: { backgroundColor: "#000000" },
  brandText: { color: "#FFF", fontSize: 10, fontWeight: "900" },

  securityFooter: { flexDirection: "row", marginTop: 32, paddingHorizontal: 4 },
  securityTextContainer: { marginLeft: 10, flex: 1 },
});

export default PaymentMethodsScreen;
