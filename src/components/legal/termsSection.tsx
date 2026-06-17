import React, { memo } from "react";
import { Text, View } from "react-native";
import { FONT_SIZES } from "../../constants/sizes";

interface TermsSectionProps {
  title: string;
  titleSize?: number;
  children: React.ReactNode;
  commonStyling: any;
  marginTop?: number;
}

const TermsSection = memo(
  ({
    title,
    titleSize = FONT_SIZES.TITLE2,
    children,
    commonStyling,
    marginTop = 24,
  }: TermsSectionProps) => {
    return (
      <View style={{ marginTop }}>
        <Text style={[commonStyling.title, { fontSize: titleSize }]}>
          {title}
        </Text>
        {children}
      </View>
    );
  }
);

export default TermsSection;
