import { Image, Text, View } from "react-native";
import Buttons from "../../../components/buttons/buttons";
import useTheme from "../../../hooks/useThemes";
import { commonStyles } from "../../../styles/commonStyles";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

function CompletedRide() {
  const { colors, theme } = useTheme();
  const commonStyling = commonStyles(colors);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  
  return (
    <View
      style={{
        flex: 1,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        width: "100%",
      }}
    >
      <Image
        source={require("../../../../assets/images/tick.png")}
        style={{
          width: 100,
          height: 100,
        }}
        resizeMode="contain"
      />
      <Text
        style={[
          commonStyling.title,
          {
            fontSize: 24,
            fontFamily: "SemiBold",
            marginVertical: 8,
          },
        ]}
      >
        Trip Completed
      </Text>
      <Text
        style={[
          commonStyling.title,
          {
            fontSize: 16,
            width: 250,
            textAlign: "center",
          },
        ]}
      >
        Sarah has been dropped off safely
      </Text>
      <Buttons
        title="Done"
        onPress={() => {
          navigation.reset({
            index: 0,
            routes: [{ name: "DriverMainTabs" }],
          });
        }}
      />
    </View>
  );
}

export default CompletedRide;
