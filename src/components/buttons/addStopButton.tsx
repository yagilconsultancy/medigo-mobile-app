import { Text, TouchableOpacity, View } from "react-native";
import useTheme from "../../hooks/useThemes";
import { commonStyles } from "../../styles/commonStyles";
import Add from "../../../assets/icons/add";
import { FONT_SIZES } from "../../constants/sizes";

type AddStopButtonProps = {
  onPress: () => void;
};

function AddStopButton({ onPress }: AddStopButtonProps) {
  const { colors } = useTheme();
  const commonStyling = commonStyles(colors);

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "flex-end",
      }}
    >
      <TouchableOpacity
        style={{
          flexDirection: "row",
          justifyContent: "flex-end",
          alignItems: "center",
          columnGap: 4,
          width: 150,
        }}
        onPress={onPress}
      >
        <View
          style={{
            backgroundColor: colors.stroke,
            width: 20,
            height: 20,
            borderRadius: 50,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Add color={colors.titleText} />
        </View>

        <Text
          style={[
            commonStyling.title,
            {
              fontSize: FONT_SIZES.SMALL,
              fontFamily: "Regular",
            },
          ]}
        >
          Add Stop
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default AddStopButton;
