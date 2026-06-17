import React from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import useTheme from "../../hooks/useThemes";
import { commonStyles } from "../../styles/commonStyles";
import Money from "../../../assets/icons/money";
import { FONT_SIZES } from "../../constants/sizes";

interface ModeOfPaymentProps {
  amount?: string | number;
}

const ModeOfPayment: React.FC<ModeOfPaymentProps> = ({ amount }) => {
  const { colors } = useTheme();
  const commonStyling = commonStyles(colors);

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginVertical: 16,
      }}
    >
      <View style={styles.container}>
        <Money />
        <View>
          {amount !== undefined && (
            <Text
              style={[
                commonStyling.title,
                {
                  fontSize: FONT_SIZES.SUBTITLE,
                  fontFamily: "Regular",
                },
              ]}
            >
              {amount}
            </Text>
          )}

          <Text
            style={[
              commonStyling.title,
              {
                fontSize: FONT_SIZES.SUBTITLE,
                fontFamily: "Regular",
              },
            ]}
          >
            Cash
          </Text>
        </View>
      </View>

      <View style={styles.container}>
        <TouchableOpacity
          style={[
            styles.changeButton,
            {
              backgroundColor: colors.lightGray,
              borderColor: colors.gray,
            },
          ]}
        >
          <Text style={[commonStyling.subtitle]}>Change</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ModeOfPayment;

const styles = StyleSheet.create({
  car: {
    width: 150,
    height: 100,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 12,
  },
  changeButton: {
    borderWidth: 1,
    paddingHorizontal: 8,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
  },
});
