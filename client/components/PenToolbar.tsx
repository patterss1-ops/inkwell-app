import React from "react";
import { View, StyleSheet, Pressable, Platform } from "react-native";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  WithSpringConfig,
} from "react-native-reanimated";

import { useTheme } from "@/hooks/useTheme";
import {
  Spacing,
  BorderRadius,
  Shadows,
  PenSizes,
  PenColors,
} from "@/constants/theme";

interface PenToolbarProps {
  selectedColor: string;
  selectedSize: keyof typeof PenSizes;
  isEraser: boolean;
  onColorChange: (colorKey: string) => void;
  onSizeChange: (size: keyof typeof PenSizes) => void;
  onEraserToggle: () => void;
  onClear: () => void;
}

const springConfig: WithSpringConfig = {
  damping: 15,
  mass: 0.3,
  stiffness: 150,
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function ToolButton({
  onPress,
  isSelected,
  children,
  testID,
}: {
  onPress: () => void;
  isSelected?: boolean;
  children: React.ReactNode;
  testID?: string;
}) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.9, springConfig);
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

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      testID={testID}
      style={[
        styles.toolButton,
        {
          backgroundColor: isSelected
            ? theme.backgroundSecondary
            : "transparent",
        },
        animatedStyle,
      ]}
    >
      {children}
    </AnimatedPressable>
  );
}

function ColorSwatch({
  color,
  isSelected,
  onPress,
}: {
  color: string;
  isSelected: boolean;
  onPress: () => void;
}) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.85, springConfig);
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

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.colorSwatch,
        {
          backgroundColor: color,
          borderWidth: isSelected ? 3 : 0,
          borderColor: theme.text,
        },
        animatedStyle,
      ]}
    />
  );
}

function SizeButton({
  size,
  isSelected,
  onPress,
}: {
  size: keyof typeof PenSizes;
  isSelected: boolean;
  onPress: () => void;
}) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);

  const dotSize = size === "fine" ? 6 : size === "medium" ? 10 : 16;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.85, springConfig);
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

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.sizeButton,
        {
          backgroundColor: isSelected
            ? theme.backgroundSecondary
            : "transparent",
        },
        animatedStyle,
      ]}
    >
      <View
        style={[
          styles.sizeDot,
          {
            width: dotSize,
            height: dotSize,
            backgroundColor: theme.text,
          },
        ]}
      />
    </AnimatedPressable>
  );
}

export function PenToolbar({
  selectedColor,
  selectedSize,
  isEraser,
  onColorChange,
  onSizeChange,
  onEraserToggle,
  onClear,
}: PenToolbarProps) {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.backgroundDefault,
          borderTopColor: theme.border,
        },
      ]}
    >
      <View style={styles.section}>
        {(["fine", "medium", "bold"] as const).map((size) => (
          <SizeButton
            key={size}
            size={size}
            isSelected={selectedSize === size && !isEraser}
            onPress={() => onSizeChange(size)}
          />
        ))}
      </View>

      <View style={styles.divider} />

      <View style={styles.section}>
        {PenColors.map((penColor) => (
          <ColorSwatch
            key={penColor.key}
            color={theme[penColor.key as keyof typeof theme] as string}
            isSelected={selectedColor === penColor.key && !isEraser}
            onPress={() => onColorChange(penColor.key)}
          />
        ))}
      </View>

      <View style={styles.divider} />

      <View style={styles.section}>
        <ToolButton
          onPress={onEraserToggle}
          isSelected={isEraser}
          testID="button-eraser"
        >
          <Feather
            name="edit-3"
            size={20}
            color={isEraser ? theme.text : theme.textSecondary}
            style={{ transform: [{ rotate: "180deg" }] }}
          />
        </ToolButton>
        <ToolButton onPress={onClear} testID="button-clear">
          <Feather name="trash-2" size={20} color={theme.textSecondary} />
        </ToolButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderTopWidth: 1,
    gap: Spacing.sm,
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: "#D9D4C3",
    marginHorizontal: Spacing.xs,
  },
  toolButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  colorSwatch: {
    width: 28,
    height: 28,
    borderRadius: BorderRadius.full,
  },
  sizeButton: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  sizeDot: {
    borderRadius: BorderRadius.full,
  },
});
