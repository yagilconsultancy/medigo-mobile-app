import React, { ReactNode } from "react";
import {
  Modal,
  View,
  TouchableOpacity,
  Pressable,
  StyleSheet,
  Text,
} from "react-native";
// 1. Import Reanimated components
import Animated, {
  FadeIn,
  FadeOut,
  ZoomInUp,
  ZoomOutDown,
} from "react-native-reanimated";
import CloseIcon from "../../../assets/icons/close";
import useTheme from "../../hooks/useThemes";
import { commonStyles } from "../../styles/commonStyles";

interface ModalComponentProps {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  title: string;
  titleColor?: string;
}

const ModalComponent: React.FC<ModalComponentProps> = ({
  visible,
  onClose,
  children,
  title,
  titleColor,
}) => {
  const { colors } = useTheme();
  const commonStyling = commonStyles(colors);

  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
    >
      {/* 2. Animate the backdrop fade separately */}
      <Animated.View
        entering={FadeIn.duration(200)}
        exiting={FadeOut.duration(200)}
        style={[commonStyling.overlay, StyleSheet.absoluteFill]}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

        {/* 3. The "Fast Spring" Content */}
        <Animated.View
          entering={ZoomInUp.springify().mass(0.5).damping(15).stiffness(120)}
          exiting={ZoomOutDown.duration(150)}
          style={[
            styles.modalContent,
            { backgroundColor: colors.surfacePrimary },
          ]}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              style={[
                commonStyling.title,
                {
                  color: titleColor ? titleColor : colors.titleText,
                },
              ]}
            >
              {title}
            </Text>
            <TouchableOpacity onPress={onClose} hitSlop={20}>
              <CloseIcon color={colors.titleText} />
            </TouchableOpacity>
          </View>

          <View>{children}</View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    maxWidth: 400,
    paddingVertical: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 1,
    borderRadius: 16,
    width: "100%",
    paddingHorizontal: 20,
  },
});

export default ModalComponent;
