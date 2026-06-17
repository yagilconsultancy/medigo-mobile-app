import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { useState } from "react";
import useTheme from "../../hooks/useThemes";
import { commonStyles } from "../../styles/commonStyles";

interface FileUploadInputProps {
  onFileSelected?: (file: DocumentPicker.DocumentPickerAsset) => Promise<void>;
  buttonLabel?: string;
  isUploading?: boolean;
  file: {
    name: string;
  };
  setFile: (value: any) => void;
}

export default function FileUploadInput({
  onFileSelected,
  buttonLabel = "Upload a file",
  isUploading = false,
  file,
  setFile,
}: FileUploadInputProps) {
  const { colors } = useTheme();
  const commonStyling = commonStyles(colors);

  const [isProcessing, setIsProcessing] = useState(false);

  const pickFile = async () => {
    if (isProcessing || isUploading) return;

    const result = await DocumentPicker.getDocumentAsync({
      multiple: false,
      copyToCacheDirectory: true,
    });

    if (!result.canceled) {
      const selected = result.assets[0];
      setFile(selected);

      if (onFileSelected) {
        try {
          setIsProcessing(true);
          await onFileSelected(selected);
        } catch (error) {
          console.error("File upload error:", error);
        } finally {
          setIsProcessing(false);
        }
      }
    }
  };

  const showLoader = isProcessing || isUploading;

  return (
    <View>
      <View
        style={[
          commonStyling.input,
          styles.wrapper,
          {
            borderColor: colors.surfacePrimary,
            opacity: showLoader ? 0.7 : 1,
          },
        ]}
      >
        <Text
          style={[
            styles.fileName,
            {
              color: colors.titleText,
              borderWidth: 1,
              borderColor: colors.gray,
            },
          ]}
        >
          {file?.name ?? "No file selected"}
        </Text>

        <TouchableOpacity
          onPress={pickFile}
          disabled={showLoader}
          style={[
            styles.button,
            {
              backgroundColor: showLoader ? colors.gray : colors.buttonPrimary,
            },
          ]}
        >
          {showLoader ? (
            <ActivityIndicator size="small" color={colors.surfacePrimary} />
          ) : (
            <Text style={{ color: colors.surfacePrimary }}>{buttonLabel}</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 0,
    borderWidth: 1,
    borderRadius: 8,
    overflow: "hidden",
  },
  fileName: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  button: {
    height: "100%",
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
  },
});
