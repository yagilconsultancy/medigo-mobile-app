import React, { memo } from "react";
import { View } from "react-native";
import List from "../reuseables/list";

interface TermsListProps {
  items: React.ReactNode[];
}

const TermsList = memo(({ items }: TermsListProps) => {
  return (
    <View
      style={{
        flexDirection: "column",
        rowGap: 16,
      }}
    >
      {items.map((item, index) => (
        <List key={index} custom={item} />
      ))}
    </View>
  );
});

export default TermsList;
