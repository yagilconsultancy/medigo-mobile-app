import React from "react";
import { View, StyleSheet } from "react-native";
import TabButton from "./tabButton";
import useTheme from "../../hooks/useThemes";

export interface TabItem {
  label: string;
  value: string;
}

interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (value: string) => void;
}

export default function Tabs({ tabs, activeTab, onChange }: TabsProps) {
  const { colors } = useTheme();
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.lightGray,
        },
      ]}
    >
      {tabs.map((tab) => (
        <TabButton
          key={tab.value}
          label={tab.label}
          active={activeTab === tab.value}
          onPress={() => onChange(tab.value)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 4,
    borderRadius: 40,
    marginBottom: 16,
  },
});
