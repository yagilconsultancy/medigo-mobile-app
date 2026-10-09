import React, { useState } from "react";
import { View, Text, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import ModalComponent from "./modal";
import Buttons from "../buttons/buttons";
import Input from "../inputs/input";
import useTheme from "../../hooks/useThemes";
import { commonStyles } from "../../styles/commonStyles";
import { useDeleteAccount } from "../../hooks/mutations/useUser";
import { useUserStore } from "../../store/userStore";

const { width } = Dimensions.get("window");

interface DeleteAccountModalProps {
  visible: boolean;
  onClose: () => void;
}

const CONFIRM_WORD = "DELETE";

const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
  visible,
  onClose,
}) => {
  const { colors } = useTheme();
  const commonStyling = commonStyles(colors);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const queryClient = useQueryClient();
  const logout = useUserStore((state) => state.logout);
  const { mutateAsync: deleteAccount, isPending } = useDeleteAccount();
  const [confirmText, setConfirmText] = useState("");

  const canDelete = confirmText.trim().toUpperCase() === CONFIRM_WORD;

  const handleClose = () => {
    if (isPending) return;
    setConfirmText("");
    onClose();
  };

  const handleDelete = async () => {
    if (!canDelete || isPending) return;
    try {
      await deleteAccount();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "We couldn't delete your account",
        text2: "Please check your connection and try again.",
      });
      return;
    }

    await logout();
    queryClient.clear();
    setConfirmText("");
    onClose();
    navigation.reset({
      index: 0,
      routes: [{ name: "Auth", params: { screen: "Login" } }],
    });
  };

  return (
    <ModalComponent visible={visible} onClose={handleClose} title="Delete account">
      <Text style={[commonStyling.subtitle, { marginTop: 16, marginBottom: 12 }]}>
        Your account will be disabled right away and you will be signed out.
        Your information is kept securely for up to 5 years for legal and
        safety records, and is then permanently deleted. You will not be able
        to sign in again with this account.
      </Text>

      <Input
        title={`Type ${CONFIRM_WORD} to confirm`}
        placeholder={CONFIRM_WORD}
        value={confirmText}
        onChangeText={setConfirmText}
        disabled={isPending}
      />

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 20,
        }}
      >
        <View style={{ width: width * 0.38 }}>
          <Buttons type="inactive" title="Cancel" onPress={handleClose} />
        </View>
        <View style={{ width: width * 0.38, opacity: canDelete ? 1 : 0.4 }}>
          <Buttons
            type="danger"
            title="Delete"
            loading={isPending}
            onPress={handleDelete}
          />
        </View>
      </View>
    </ModalComponent>
  );
};

export default DeleteAccountModal;
