import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { CreditCard, Shield } from "lucide-react-native";
import useTheme from "../../hooks/useThemes";
import { commonStyles } from "../../styles/commonStyles";
import { FONT_SIZES } from "../../constants/sizes";
import { SafeAreaView } from "react-native-safe-area-context";
import Buttons from "../../components/buttons/buttons";
import BackButton from "../../components/buttons/backButton";
import Input from "../../components/inputs/input";
import RightArrow from "../../../assets/icons/rightArrow";
import SucccessCheckmark from "../../../assets/icons/successCheckmark";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import ModalComponent from "../../components/modals/modal";
import { useAddPaymentMutation } from "../../hooks/mutations/usePayments";

const PaymentMethod = () => {
  const { colors, theme } = useTheme();
  const commonStyling = commonStyles(colors);
  const [showModal, setShowModal] = useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [cardData, setcardData] = useState<any>({
    method_type: "",
    card_number: "",
    expiry_month: "",
    expiry_year: "",
    holder_name: "",
    cvv: "",
  });

  const updateCardFields = (fields: Partial<any>) => {
    setcardData((prev) => ({ ...prev, ...fields }));
  };

  const paymentMutation = useAddPaymentMutation();

  // Inside your component's submit handler for the Payment step
  const handlePaymentSubmit = () => {
    paymentMutation.mutate(cardData, {
      onSuccess: () => {
        setShowModal(true);
      },
      onError: (err) => {
        // You might want to show a specific toast or alert here
        alert(
          "Payment failed: " +
            (err.response?.data?.detail?.[0]?.msg || "Invalid card details"),
        );
      },
    });
  };

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;

    if (showModal) {
      timer = setTimeout(() => {
        setShowModal(false);
        navigation.navigate("RiderMainTabs");
      }, 1500);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [showModal]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.surfacePrimary,
      }}
    >
      <StatusBar
        barStyle={theme === "light" ? "dark-content" : "light-content"}
      />

      {/* Header */}
      <View style={styles.header}>
        <BackButton />

        <TouchableOpacity
          onPress={() => {
            navigation.reset({
              index: 0,
              routes: [{ name: "RiderMainTabs" }],
            });
          }}
        >
          <Text style={[commonStyling.subtitle]}>Skip</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[commonStyling.title, styles.title]}>Payment Method</Text>
        <Text style={[commonStyling.subtitle, styles.subtitle]}>
          Add a payment method to complete your setup.
        </Text>

        <LinearGradient
          colors={["#2F6FED", "#1E4DB7"]}
          style={styles.creditCardVisual}
        >
          <CreditCard color="#FFF" size={32} />
          <Text style={styles.cardDigits}>
            {cardData.card_number
              ? cardData.card_number
              : "**** **** **** ****"}
          </Text>
          <View style={styles.cardRow}>
            <View>
              <Text
                style={[
                  commonStyling.subtitle,
                  styles.cardInfo,
                  {
                    opacity: 0.7,
                    fontSize: FONT_SIZES.BODY,
                    marginBottom: 4,
                  },
                ]}
              >
                Card Holder
              </Text>
              <Text style={[commonStyling.subtitle, styles.cardInfo]}>
                {cardData.holder_name ? cardData.holder_name : "YOUR NAME"}
              </Text>
            </View>

            <View>
              <Text
                style={[
                  commonStyling.subtitle,
                  styles.cardInfo,
                  {
                    opacity: 0.7,
                    fontSize: FONT_SIZES.BODY,
                    marginBottom: 4,
                  },
                ]}
              >
                Expires
              </Text>
              <Text style={[commonStyling.subtitle, styles.cardInfo]}>
                {cardData.expiry_month ? cardData.expiry_month : "05/28"}
              </Text>
            </View>
          </View>
        </LinearGradient>

        <Input
          title="Card Number"
          placeholder="1234 5678 9012 3456"
          value=""
          onChangeText={() => {}}
          value={cardData.card_number}
          onChangeText={(val) => updateCardFields({ card_number: val })}
        />
        <View style={styles.row}>
          <View style={{ flex: 1, marginRight: 10 }}>
            <Input
              title="Expiry date"
              placeholder="mm/yy"
              value={cardData.expiry_month}
              onChangeText={(val) => updateCardFields({ expiry_month: val })}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Input
              title="CVV"
              placeholder="123"
              value={cardData.cvv}
              onChangeText={(val) => updateCardFields({ cvv: val })}
            />
          </View>
        </View>
        <Input
          title="Cardholder Name"
          placeholder="Jhon"
          value={cardData.holder_name}
          onChangeText={(val) => updateCardFields({ holder_name: val })}
        />

        <View
          style={[
            styles.privacyBanner,
            {
              backgroundColor: colors.surfaceBrand,
              marginTop: 32,
            },
          ]}
        >
          <View style={styles.lockIconWrapper}>
            <Shield color="#3B82F6" size={20} />
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
              Secure Payment
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
              Your card information is encrypted and stored securely. We use
              industry-standard PCI compliance.
            </Text>
          </View>
        </View>

        <View
          style={{
            marginTop: 64,
          }}
        >
          <Buttons
            title="Save & Continue"
            onPress={() => {
              handlePaymentSubmit();
            }}
            rightIcon={<RightArrow />}
            loading={paymentMutation.isPending}
          />
        </View>
      </ScrollView>

      <ModalComponent
        title=""
        visible={showModal}
        onClose={() => setShowModal(false)}
      >
        <View style={styles.padlockContainer}>
          <SucccessCheckmark />
        </View>

        <Text
          style={[
            commonStyling.title,
            styles.modalTitle,
            {
              fontFamily: "Bold",
            },
          ]}
        >
          Card Added Successfully
        </Text>

        <Text style={[commonStyling.subtitle, styles.modalSubtitle]}>
          Your card has been securely saved and is ready for future bookings.
        </Text>
      </ModalComponent>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  scrollContent: { paddingHorizontal: 24, paddingBottom: 100 },
  title: { marginTop: 24, fontSize: FONT_SIZES.HERO, fontFamily: "Bold" },
  subtitle: {
    marginTop: 8,
    marginBottom: 24,
    lineHeight: 22,
  },

  row: { flexDirection: "row", marginVertical: 16 },

  creditCardVisual: {
    backgroundColor: "#1E3A8A",
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
  },
  cardDigits: {
    color: "#FFF",
    fontSize: 22,
    fontWeight: "700",
    marginVertical: 20,
    letterSpacing: 2,
  },
  cardRow: { flexDirection: "row", justifyContent: "space-between" },
  cardInfo: { color: "#FFF" },

  modalTitle: {
    marginBottom: 12,
    textAlign: "center",
    marginTop: 16,
  },
  modalSubtitle: {
    marginBottom: 32,
    textAlign: "center",
  },
  padlockContainer: {
    alignItems: "center",
  },
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
});

export default PaymentMethod;
