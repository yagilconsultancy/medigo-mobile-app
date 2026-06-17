import { TouchableOpacity, Image, Alert } from "react-native";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import Camera from "../../../assets/icons/camera";
import useTheme from "../../hooks/useThemes";

interface UploadImageProps {
  onImageSelected?: (uri: string) => void;
}

function UploadImage({ onImageSelected }: UploadImageProps) {
  const { colors } = useTheme();
  const [imageUri, setImageUri] = useState<string | null>(null);

  const pickImage = async () => {
    // Request permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "Sorry, we need camera roll permissions to upload images."
      );
      return;
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"], // Use array instead of MediaTypeOptions
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      const uri = result.assets[0].uri;
      setImageUri(uri);

      // Call the callback if provided
      if (onImageSelected) {
        onImageSelected(uri);
      }
    }
  };

  return (
    <TouchableOpacity
      onPress={pickImage}
      style={{
        borderColor: colors.stroke,
        backgroundColor: colors.surfacePrimary,
        borderWidth: 1,
        height: 70,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {imageUri ? (
        <Image
          source={{ uri: imageUri }}
          style={{
            width: "100%",
            height: "100%",
          }}
          resizeMode="cover"
        />
      ) : (
        <Camera />
      )}
    </TouchableOpacity>
  );
}

export default UploadImage;
