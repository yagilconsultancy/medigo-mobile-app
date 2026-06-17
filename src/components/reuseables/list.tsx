import React, { ReactNode } from "react";
import { View, Text } from "react-native";
import { commonStyles } from "../../styles/commonStyles";
import useTheme from "../../hooks/useThemes";

interface ListItemProps {
  title?: string;
  custom?: ReactNode;
}

export default function List({ title, custom }: ListItemProps) {
  const { colors } = useTheme();
  const commonStyling = commonStyles(colors);

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "flex-start",
        columnGap: 4,
        marginTop: 2,
      }}
    >
      <Text style={commonStyling.dot}>•</Text>
      {custom ? (
        custom
      ) : (
        <Text
          style={[
            commonStyling.subtitle,
            {
              width: "90%",
            },
          ]}
        >
          {title}
        </Text>
      )}
    </View>
  );
}
