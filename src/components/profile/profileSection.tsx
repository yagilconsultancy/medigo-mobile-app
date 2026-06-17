import React, { memo } from "react";
import { Text, View, StyleSheet, Animated } from "react-native";
import DetailItem from "../../components/reuseables/detailItem";
import ToolTipArrow from "../../../assets/icons/tooltipArrow";
import { FONT_SIZES } from "../../constants/sizes";

interface MenuItem {
  title: string;
  iconLeft: React.ReactNode;
  iconRight?: React.ReactNode;
  onPress?: () => void;
  theme?: string;
  showTooltip?: boolean;
  tooltipText?: string;
}

interface ProfileSectionProps {
  title: string;
  items: MenuItem[];
  colors: any;
  commonStyling: any;
  titleColor?: string;
  toolTip?: boolean;
  subtitle?: string;
}

function ProfileSection({
  title,
  items,
  colors,
  commonStyling,
  titleColor,
  toolTip,
  subtitle,
}: ProfileSectionProps) {
  return (
    <View>
      <Text
        style={[
          commonStyling.subtitle,
          styles.sectionTitle,
          { color: titleColor || colors.titleText },
        ]}
      >
        {title}
      </Text>

      <View
        style={[styles.menuContainer, { backgroundColor: colors.lightGray }]}
      >
        {items.map((item, index) => (
          <View key={index} style={{ position: "relative" }}>
            <DetailItem
              title={item.title}
              iconLeft={item.iconLeft}
              iconRight={item.iconRight}
              onPress={item.onPress}
              colors={colors}
              theme={item.theme || colors.titleText}
              profileScreen={true}
            />

            {item.title === subtitle && toolTip && (
              <Animated.View style={[styles.tooltipContainer]}>
                <View
                  style={[
                    styles.tooltipBox,
                    {
                      top: -85,
                      left: 50,
                    },
                  ]}
                >
                  <Text style={styles.tooltipText}>Coming Soon</Text>

                  <View
                    style={{
                      position: "absolute",
                      bottom: -10,
                      right: 50,
                    }}
                  >
                    <ToolTipArrow />
                  </View>
                </View>
              </Animated.View>
            )}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    marginBottom: 4,
    marginTop: 16,
  },
  menuContainer: {
    marginTop: 8,
    padding: 16,
    borderRadius: 8,
  },
  tooltipWrapper: {
    position: "absolute",
    top: 0,
    right: 0,
    zIndex: 1000,
  },

  tooltipContainer: {
    zIndex: 999,
  },

  tooltipBox: {
    backgroundColor: "#111",
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
    width: 110,
    position: "absolute",
    zIndex: 999,
  },

  tooltipText: {
    color: "white",
    fontSize: FONT_SIZES.SMALL,
    textAlign: "center",
  },

  arrow: {
    alignSelf: "center",
    width: 0,
    height: 0,
    marginTop: 6,
    borderLeftWidth: 7,
    borderRightWidth: 7,
    borderTopWidth: 7,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "#111", // Arrow color
  },
});

export default memo(ProfileSection);
