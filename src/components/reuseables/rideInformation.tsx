import { Image, StyleSheet, Text, View } from "react-native";
import useTheme from "../../hooks/useThemes";
import { commonStyles } from "../../styles/commonStyles";
import { FONT_SIZES } from "../../constants/sizes";
import NavbarProfile from "../../../assets/icons/navbarProfile";
import { formatPrice } from "../../utils/formatPrice";

interface RideInformationProps {
  image: any;
  category: string;
  price: string;
  riders: number;
}

export default function RideInformation({
  category,
  price,
}: RideInformationProps) {
  const { colors } = useTheme();
  const commonStyling = commonStyles(colors);

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingBottom: 8,
      }}
    >
      <Image
        source={require("../../../assets/images/soloCar.png")}
        style={styles.carImage}
      />

      <View
        style={{
          alignItems: "flex-end",
        }}
      >
        <Text
          style={[
            commonStyling.title,
            {
              fontSize: FONT_SIZES.BUTTON,
            },
          ]}
        >
          {category}
        </Text>
        <Text
          style={[
            commonStyling.subtitle,
            {
              fontSize: FONT_SIZES.BODY,
              color: colors.titleText,
            },
          ]}
        >
          {formatPrice(price, true)}
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            columnGap: 4,
          }}
        >
          <NavbarProfile width={10} color="#bfbfbf" />
          <Text
            style={[
              commonStyling.subtitle,
              {
                fontSize: FONT_SIZES.SMALL,
                color: colors.inputText,
              },
            ]}
          >
            4 riders
          </Text>
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  card: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
  },
  carImage: {
    width: 120,
    height: 70,
    resizeMode: "contain",
    borderRadius: 10,
  },
});
