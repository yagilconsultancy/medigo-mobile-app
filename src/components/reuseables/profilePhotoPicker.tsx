import React from "react";
import { View, Image, TouchableOpacity, Text, StyleSheet } from "react-native";
import Profile from "../../../assets/icons/profile";
import { commonStyles } from "../../styles/commonStyles";
import { FONT_SIZES } from "../../constants/sizes";
import useTheme from "../../hooks/useThemes";
import Add from "../../../assets/icons/add";

interface ProfilePhotoPickerProps {
  onPress: () => void;
  photoUri?: string | null;
}

const ProfilePhotoPicker: React.FC<ProfilePhotoPickerProps> = ({
  onPress,
  photoUri,
}) => {
  const { colors } = useTheme();
  const commonStyling = commonStyles(colors);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPress} style={styles.photoWrapper}>
        <View
          style={[
            styles.image,
            {
              backgroundColor: colors.lightGray,
              borderRadius: 50,
            },
          ]}
        >
          {photoUri ? (
            <Image
              source={{ uri: photoUri }}
              style={styles.previewImage}
              resizeMode="cover"
            />
          ) : (
            <Profile />
          )}
        </View>

        <View
          style={[
            styles.addIcon,
            {
              backgroundColor: colors.titleText,
            },
          ]}
        >
          <Add color={colors.surfacePrimary} />
        </View>
      </TouchableOpacity>

      <View>
        <Text
          style={[
            commonStyling.title,
            {
              fontFamily: "Regular",
              fontSize: FONT_SIZES.SUBTITLE,
            },
          ]}
        >
          Profile picture
        </Text>
        <Text
          style={[
            styles.subText,
            {
              color: colors.inputText,
              marginTop: 4,
            },
          ]}
        >
          Take a selfie or upload a picture
        </Text>
      </View>
    </View>
  );
};

export default ProfilePhotoPicker;

const styles = StyleSheet.create({
  container: {
    marginTop: 32,
    marginBottom: 16,
    flexDirection: "row",
    columnGap: 12,
    alignItems: "center",
  },
  photoWrapper: { position: "relative" },
  image: {
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 60,
  },
  addIcon: {
    position: "absolute",
    top: 0,
    left: 30,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  subText: { fontSize: FONT_SIZES.SMALL },
  previewImage: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
  },
});
