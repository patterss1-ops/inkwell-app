import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Image,
  ScrollView,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/Button";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, Fonts } from "@/constants/theme";
import { getSettings, saveSettings, AppSettings } from "@/lib/storage";

export default function SettingsScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();

  const [displayName, setDisplayName] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const settings = await getSettings();
    setDisplayName(settings.displayName);
  };

  const handleSave = useCallback(async () => {
    if (saving) return;
    setSaving(true);

    try {
      await saveSettings({ displayName: displayName.trim() || "Writer" });

      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error("Error saving settings:", error);
    } finally {
      setSaving(false);
    }
  }, [displayName, saving]);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: headerHeight + Spacing.xl,
          paddingBottom: insets.bottom + Spacing.xl,
        },
      ]}
    >
      <View style={styles.avatarSection}>
        <Image
          source={require("../../assets/images/user-avatar.png")}
          style={styles.avatar}
          resizeMode="cover"
        />
      </View>

      <View style={styles.formSection}>
        <ThemedText
          style={[styles.label, { color: theme.textSecondary }]}
          type="small"
        >
          DISPLAY NAME
        </ThemedText>
        <TextInput
          value={displayName}
          onChangeText={setDisplayName}
          placeholder="Your name"
          placeholderTextColor={theme.textSecondary}
          style={[
            styles.input,
            {
              backgroundColor: theme.backgroundDefault,
              color: theme.text,
              borderColor: theme.border,
            },
          ]}
          testID="input-display-name"
        />
      </View>

      <Button
        onPress={handleSave}
        disabled={saving}
        style={[styles.saveButton, { backgroundColor: theme.text }]}
      >
        {saved ? "Saved!" : saving ? "Saving..." : "Save Changes"}
      </Button>

      <View style={styles.aboutSection}>
        <ThemedText
          style={[styles.sectionTitle, { fontFamily: Fonts?.serifSemiBold }]}
          type="h4"
        >
          About Inkwell
        </ThemedText>
        <ThemedText
          style={[styles.aboutText, { color: theme.textSecondary }]}
          type="body"
        >
          A digital sanctuary for handwritten thoughts. Combining the tactile
          elegance of a Moleskine notebook with the convenience of mobile.
        </ThemedText>
        <ThemedText
          style={[styles.version, { color: theme.textSecondary }]}
          type="caption"
        >
          Version 1.0.0
        </ThemedText>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.lg,
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: Spacing["3xl"],
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: BorderRadius.full,
  },
  formSection: {
    marginBottom: Spacing["2xl"],
  },
  label: {
    marginBottom: Spacing.sm,
    fontWeight: "500",
    letterSpacing: 0.5,
  },
  input: {
    height: Spacing.inputHeight,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.lg,
    fontSize: 16,
    borderWidth: 1,
  },
  saveButton: {
    marginBottom: Spacing["4xl"],
  },
  aboutSection: {
    paddingTop: Spacing["2xl"],
    borderTopWidth: 1,
    borderTopColor: "#E8E5DC",
  },
  sectionTitle: {
    marginBottom: Spacing.md,
  },
  aboutText: {
    marginBottom: Spacing.lg,
    lineHeight: 24,
  },
  version: {
    textAlign: "center",
  },
});
