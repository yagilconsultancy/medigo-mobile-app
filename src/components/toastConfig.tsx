import React, { Fragment } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Toast, { BaseToastProps } from "react-native-toast-message";
import CloseIcon from "../../assets/icons/close";
import ProfileSetUp from "../../assets/icons/profileSetup";
import CheckMark from "../../assets/icons/checkmark";
import ConfirmTopUpWallet from "../../assets/icons/confirmTopUpWallet";
import SuccessfulProfileSetup from "../../assets/icons/successfulProfileSetup";
import FilledWallet from "../../assets/icons/filledWallet";
import { FONT_SIZES } from "../constants/sizes";
import Attention from "../../assets/icons/attention";

type TripToastProps = BaseToastProps & {
  text1?: any;
  text2?: any;
  props?: Record<string, any>;
  onPress: () => void;
};

export const toastConfig = {
  tripToast: ({ text1, text2 }: TripToastProps) => {
    return (
      <View style={styles.container}>
        {/* Left Icon */}
        <View style={styles.iconWrap}>
          <CheckMark />
        </View>

        <View style={styles.container2}>
          {/* Texts */}
          <View style={styles.textWrap}>
            <Text style={styles.title}>{text1}</Text>
            {text2 ? <Text style={styles.subtitle}>{text2}</Text> : null}
          </View>

          {/* Close */}
          <TouchableOpacity
            onPress={() => Toast.hide()}
            style={styles.closeBtn}
          >
            <CloseIcon color="#111" size={12} />
          </TouchableOpacity>
        </View>
      </View>
    );
  },

  walletFundingSuccessful: ({ text1, text2 }: TripToastProps) => {
    return (
      <View style={styles.container}>
        {/* Left Icon */}
        <View style={styles.iconWrap}>
          <FilledWallet color="#000000" />
        </View>

        <View style={styles.container2}>
          {/* Texts */}
          <View style={styles.textWrap}>
            <Text style={styles.title}>{text1}</Text>
            <Text style={styles.subtitle}>{text2}</Text>
          </View>

          {/* Close */}
          <TouchableOpacity
            onPress={() => Toast.hide()}
            style={styles.closeBtn}
          >
            <CloseIcon color="#111" size={12} />
          </TouchableOpacity>
        </View>
      </View>
    );
  },

  errorToast: ({ text1, text2 }: TripToastProps) => {
    return (
      <View style={styles.errorContainer}>
        <View style={styles.iconWrap}>
          <Attention />
        </View>

        <View style={styles.container2}>
          <View style={styles.textWrap}>
            <Text style={styles.title}>{text1}</Text>
            {text2 ? <Text style={styles.subtitle}>{text2}</Text> : null}
          </View>

          <TouchableOpacity
            onPress={() => Toast.hide()}
            style={styles.closeBtn}
          >
            <CloseIcon color="#111" size={12} />
          </TouchableOpacity>
        </View>
      </View>
    );
  },

  successfulProfileSetup: () => {
    return (
      <View style={styles.container}>
        {/* Left Icon */}
        <View style={styles.iconWrap}>
          <SuccessfulProfileSetup />
        </View>

        <View style={styles.container2}>
          {/* Texts */}
          <View style={styles.textWrap}>
            <Text style={styles.title}>Profile setup successful</Text>
            <Text style={styles.subtitle}>
              Your account is now fully ready for your next trip.
            </Text>
          </View>

          {/* Close */}
          <TouchableOpacity
            onPress={() => Toast.hide()}
            style={styles.closeBtn}
          >
            <CloseIcon color="#111" size={12} />
          </TouchableOpacity>
        </View>
      </View>
    );
  },

  setUpProfile: (props: TripToastProps) => {
    const { onPress } = props;
    return (
      <TouchableOpacity onPress={onPress} style={styles.setUpProfileContainer}>
        {/* Left Icon */}
        <View style={styles.iconWrap}>
          <ProfileSetUp />
        </View>

        <View style={styles.setUpProfileContainer2}>
          {/* Texts */}
          <View style={styles.textWrap}>
            <Text style={styles.title}>Setup your profile</Text>
            <Text style={styles.subtitle}>
              Finish your profile setup and create your trip pin to keep your
              rides secure.{" "}
              <Text
                style={{
                  textDecorationLine: "underline",
                  fontFamily: "Medium",
                  marginLeft: 16,
                  color: "#2d2d2d",
                }}
              >
                Tap to complete setup.
              </Text>
            </Text>
          </View>

          {/* Close */}
          <TouchableOpacity
            onPress={() => Toast.hide()}
            style={styles.closeBtn}
          >
            <CloseIcon color="#111" size={12} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  },

  confirmingTopUp: (props: TripToastProps) => {
    const { onPress } = props;
    return (
      <TouchableOpacity onPress={onPress} style={styles.setUpProfileContainer}>
        {/* Left Icon */}
        <View
          style={[
            styles.iconWrap,
            {
              backgroundColor: "white",
              padding: 5,
              borderRadius: 50,
            },
          ]}
        >
          <ConfirmTopUpWallet />
        </View>

        <View style={styles.setUpProfileContainer2}>
          {/* Texts */}
          <View style={styles.textWrap}>
            <Text style={styles.title}>Confirming your payment</Text>
            <Text style={styles.subtitle}>
              Hang tight, we’re verifying your transfer, it takes few minutes.
              You will get notified once your payment has been confirmed.
            </Text>
          </View>

          {/* Close */}
          <TouchableOpacity
            onPress={() => Toast.hide()}
            style={styles.closeBtn}
          >
            <CloseIcon color="#111" size={12} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  },
};

const styles = StyleSheet.create({
  container: {
    width: "90%",
    alignSelf: "center",
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: "#DFF7E2",
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#17B42F",
    marginTop: 20,
    alignItems: "center",
  },
  errorContainer: {
    width: "90%",
    alignSelf: "center",
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: "#FFE9E9",
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#EF4444",
    marginTop: 20,
    alignItems: "center",
  },
  setUpProfileContainer: {
    width: "90%",
    alignSelf: "center",
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: "#FDF5EA",
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#BE7D25",
    marginTop: 20,
    alignItems: "center",
  },
  routeContainer: {
    width: "90%",
    alignSelf: "center",
    flexDirection: "row",
    paddingVertical: 10,
    paddingLeft: 14,
    paddingRight: 32,
    borderRadius: 12,
    marginTop: 10,
    alignItems: "center",
  },
  container2: {
    width: "85%",
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "flex-start",
  },
  setUpProfileContainer2: {
    width: "85%",
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "flex-start",
  },
  iconWrap: {
    marginRight: 16,
    marginTop: 2,
    backgroundColor: "white",
    padding: 8,
    borderRadius: 50,
  },

  textWrap: {
    flex: 1,
  },

  title: {
    fontSize: FONT_SIZES.SUBTITLE,
    color: "#2D2D2D",
    marginBottom: 4,
    fontFamily: "Medium",
  },

  subtitle: {
    fontSize: FONT_SIZES.SMALL,
    color: "#5A5A5A",
    fontFamily: "Regular",
  },

  closeBtn: {
    padding: 4,
    marginLeft: 10,
  },
});
