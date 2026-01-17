import React from "react";
import { View, StyleSheet, Image } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, Fonts } from "@/constants/theme";

interface EmptyStateProps {
  title: string;
  subtitle?: string;
}

export function EmptyState({ title, subtitle }: EmptyStateProps) {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/empty-notes.png")}
        style={styles.image}
        resizeMode="contain"
      />
      <ThemedText
        style={[styles.title, { fontFamily: Fonts?.serifSemiBold }]}
        type="h4"
      >
        {title}
      </ThemedText>
      {subtitle ? (
        <ThemedText
          style={[styles.subtitle, { color: theme.textSecondary }]}
          type="body"
        >
          {subtitle}
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing["3xl"],
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: Spacing["2xl"],
    opacity: 0.9,
  },
  title: {
    textAlign: "center",
    marginBottom: Spacing.sm,
  },
  subtitle: {
    textAlign: "center",
  },
});
