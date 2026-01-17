import React from "react";
import {
  View,
  StyleSheet,
  Modal,
  Pressable,
  Platform,
} from "react-native";
import * as Haptics from "expo-haptics";
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  WithSpringConfig,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, Fonts } from "@/constants/theme";

interface ConfirmModalProps {
  visible: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  onCancel: () => void;
  destructive?: boolean;
}

const springConfig: WithSpringConfig = {
  damping: 15,
  mass: 0.3,
  stiffness: 150,
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function ModalButton({
  onPress,
  label,
  variant,
}: {
  onPress: () => void;
  label: string;
  variant: "confirm" | "cancel" | "destructive";
}) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, springConfig);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, springConfig);
  };

  const handlePress = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress();
  };

  const backgroundColor =
    variant === "destructive"
      ? "#C93838"
      : variant === "confirm"
        ? theme.text
        : "transparent";

  const textColor =
    variant === "cancel" ? theme.text : theme.backgroundRoot;

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.button,
        {
          backgroundColor,
          borderWidth: variant === "cancel" ? 1 : 0,
          borderColor: theme.border,
        },
        animatedStyle,
      ]}
    >
      <ThemedText
        style={[styles.buttonText, { color: textColor }]}
        type="body"
      >
        {label}
      </ThemedText>
    </AnimatedPressable>
  );
}

export function ConfirmModal({
  visible,
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  destructive = false,
}: ConfirmModalProps) {
  const { theme } = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View
          style={[
            styles.modal,
            { backgroundColor: theme.backgroundDefault },
          ]}
        >
          <ThemedText
            style={[styles.title, { fontFamily: Fonts?.serifSemiBold }]}
            type="h4"
          >
            {title}
          </ThemedText>
          <ThemedText
            style={[styles.message, { color: theme.textSecondary }]}
            type="body"
          >
            {message}
          </ThemedText>

          <View style={styles.buttons}>
            <ModalButton
              onPress={onCancel}
              label={cancelText}
              variant="cancel"
            />
            <ModalButton
              onPress={onConfirm}
              label={confirmText}
              variant={destructive ? "destructive" : "confirm"}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing["2xl"],
  },
  modal: {
    width: "100%",
    maxWidth: 340,
    borderRadius: BorderRadius.lg,
    padding: Spacing["2xl"],
  },
  title: {
    textAlign: "center",
    marginBottom: Spacing.sm,
  },
  message: {
    textAlign: "center",
    marginBottom: Spacing["2xl"],
  },
  buttons: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  button: {
    flex: 1,
    height: 48,
    borderRadius: BorderRadius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontWeight: "600",
  },
});
