import React from "react";
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import useTheme from "../../hooks/useThemes";
import { commonStyles } from "../../styles/commonStyles";
import { ChevronLeft } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type HeaderProps = {
  title: string;
  icon?: React.ReactNode;
  rightText?: React.ReactNode;
};

export default function Header({ title, icon, rightText }: HeaderProps) {
  const { colors } = useTheme();
  const commonStyling = commonStyles(colors);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  return (
    <View style={styles.header}>
      {/* Left Action */}
      <TouchableOpacity
        style={[
          styles.backButton,
          { backgroundColor: colors.surfaceSecondary },
        ]}
        onPress={() => navigation.goBack()}
        hitSlop={30}
      >
        {icon ? icon : <ChevronLeft color={colors.titleText} size={24} />}
      </TouchableOpacity>

      {/* Centered Title Container */}
      <View style={styles.titleContainer} pointerEvents="none">
        <Text
          style={[
            commonStyling.title,
            {
              fontFamily: "Bold",
              color: colors.titleText,
              textAlign: "center",
            },
          ]}
          numberOfLines={1}
        >
          {title}
        </Text>
      </View>

      {/* Right Action */}
      <View style={styles.rightActionContainer}>{rightText}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    minHeight: 60,
  },
  titleContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 10,
    bottom: 20,
    justifyContent: "center",
    alignItems: "center",
    zIndex: -1,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  rightActionContainer: {
    minWidth: 40,
    alignItems: "flex-end",
    justifyContent: "center",
    zIndex: 1,
  },
});
