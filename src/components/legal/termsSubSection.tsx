import React, { memo } from "react";
import { Text, View } from "react-native";
import { FONT_SIZES } from "../../constants/sizes";

interface TermsSubSectionProps {
  title: string;
  content: string;
  commonStyling: any;
}

const TermsSubSection = memo(
  ({ title, content, commonStyling }: TermsSubSectionProps) => {
    return (
      <View>
        <Text
          style={[
            commonStyling.title,
            { fontSize: FONT_SIZES.SUBTITLE, marginTop: 16 },
          ]}
        >
          {title}
        </Text>
        <Text style={[commonStyling.subtitle, { marginTop: 16 }]}>
          {content}
        </Text>
      </View>
    );
  }
);

export default TermsSubSection;
