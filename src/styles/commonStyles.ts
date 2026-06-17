import { StyleSheet } from "react-native";
import { ColorsType } from "../theme/colors";
import { FONT_SIZES } from "../constants/sizes";

export const commonStyles = (colors: ColorsType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.surfacePrimary,
      paddingHorizontal: 20,
    },
    title: {
      fontSize: FONT_SIZES.BODYTITLE,
      fontFamily: "Medium",
      color: colors.titleText,
    },
    subtitle: {
      fontSize: FONT_SIZES.SUBTITLE,
      fontFamily: "Regular",
      color: colors.textSecondary,
    },
    input: {
      borderRadius: 5,
      borderWidth: 1,
      marginBottom: 8,
      color: colors.inputText,
      paddingHorizontal: 10,
      fontSize: FONT_SIZES.BODY,
      height: 48,
      textAlignVertical: "center" as const,
      borderColor: colors.stroke,
      fontFamily: "Regular",
    },
    inputTitle: {
      fontSize: FONT_SIZES.SUBTITLE,
      color: colors.titleText,
      marginBottom: 8,
      fontFamily: "Medium",
    },
    overlay: {
      flex: 1,
      backgroundColor: "rgba(191,191,191,0.5)",
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 20,
    },
    dot: {
      fontSize: 22,
      marginRight: 6,
      marginTop: -6,
      color: colors.titleText,
      fontFamily: "Regular",
    },
  });
