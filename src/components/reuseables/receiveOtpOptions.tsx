import React, { ReactNode } from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { FONT_SIZES } from "../../constants/sizes";
import useTheme from "../../hooks/useThemes";

export interface SelectableOption<T extends string = string> {
  id: T;
  label: string;
  icon?: ReactNode;
  leftIcon?: ReactNode;
}

interface SelectableOptionsProps<T extends string> {
  options: SelectableOption<T>[];
  selected: T;
  onSelect: (id: T) => void;
  buttonStyle?: object;
  textStyle?: object;
}

const SelectableOptions = <T extends string>({
  options,
  selected,
  onSelect,
  buttonStyle,
  textStyle,
}: SelectableOptionsProps<T>) => {
  const { colors } = useTheme();

  return (
    <View>
      {options.map((option) => (
        <TouchableOpacity
          key={option.id}
          style={[
            styles.optionButton,
            selected === option.id && {
              backgroundColor: colors.lightGray,
            },
            buttonStyle,
          ]}
          onPress={() => onSelect(option.id)}
        >
          <View style={{ flexDirection: "row", alignItems: "center", columnGap: 8 }}>
            {option.leftIcon}
            <Text
              style={[
                styles.optionText,
                { color: colors.subTitleText },
                textStyle,
              ]}
            >
              {option.label}
            </Text>
          </View>
          {option.icon}
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default SelectableOptions;

const styles = StyleSheet.create({
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 16,
    borderRadius: 8,
  },
  optionText: {
    fontSize: FONT_SIZES.BODY,
    fontFamily: "Regular",
  },
});
