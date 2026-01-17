import React, { useState, useCallback, useLayoutEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Pressable,
  Platform,
  Dimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { HeaderButton } from "@react-navigation/elements";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";

import { DrawingCanvas } from "@/components/DrawingCanvas";
import { PenToolbar } from "@/components/PenToolbar";
import { ConfirmModal } from "@/components/ConfirmModal";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, PenSizes, Fonts } from "@/constants/theme";
import { saveNote, deleteNote } from "@/lib/storage";
import { Note, Point, Stroke } from "@/types/note";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

interface CanvasScreenProps {
  navigation: NativeStackNavigationProp<RootStackParamList, "Canvas">;
  route: RouteProp<RootStackParamList, "Canvas">;
}

export default function CanvasScreen({
  navigation,
  route,
}: CanvasScreenProps) {
  const { note: initialNote, isNew } = route.params;
  const { theme } = useTheme();
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();

  const [title, setTitle] = useState(initialNote.title);
  const [strokes, setStrokes] = useState<Stroke[]>(initialNote.strokes);
  const [currentStroke, setCurrentStroke] = useState<Point[]>([]);
  const [selectedColor, setSelectedColor] = useState("penBlack");
  const [selectedSize, setSelectedSize] =
    useState<keyof typeof PenSizes>("medium");
  const [isEraser, setIsEraser] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const hasChanges = useRef(false);

  const screenHeight = Dimensions.get("window").height;
  const toolbarHeight = Spacing.toolbarHeight + insets.bottom;
  const canvasHeight = screenHeight - headerHeight - toolbarHeight;

  const handleSave = useCallback(async () => {
    if (isSaving) return;
    setIsSaving(true);

    try {
      const updatedNote: Note = {
        ...initialNote,
        title: title.trim() || "Untitled",
        strokes,
        updatedAt: new Date().toISOString(),
      };

      await saveNote(updatedNote);

      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }

      navigation.goBack();
    } catch (error) {
      console.error("Error saving note:", error);
    } finally {
      setIsSaving(false);
    }
  }, [initialNote, title, strokes, navigation, isSaving]);

  const handleDelete = useCallback(async () => {
    try {
      await deleteNote(initialNote.id);

      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }

      navigation.goBack();
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  }, [initialNote.id, navigation]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <TextInput
          value={title}
          onChangeText={(text) => {
            setTitle(text);
            hasChanges.current = true;
          }}
          placeholder="Untitled"
          placeholderTextColor={theme.textSecondary}
          style={[
            styles.titleInput,
            {
              color: theme.text,
              fontFamily: Fonts?.serifSemiBold,
            },
          ]}
          returnKeyType="done"
          testID="input-title"
        />
      ),
      headerRight: () => (
        <View style={styles.headerButtons}>
          {!isNew && (
            <HeaderButton
              onPress={() => setShowDeleteModal(true)}
              testID="button-delete"
            >
              <Feather name="trash-2" size={20} color={theme.textSecondary} />
            </HeaderButton>
          )}
          <HeaderButton onPress={handleSave} testID="button-save">
            <Feather name="check" size={22} color={theme.text} />
          </HeaderButton>
        </View>
      ),
    });
  }, [navigation, title, theme, handleSave, isNew]);

  const handleStrokeStart = useCallback(() => {
    hasChanges.current = true;
    setCurrentStroke([]);
  }, []);

  const handleStrokeUpdate = useCallback((point: Point) => {
    setCurrentStroke((prev) => [...prev, point]);
  }, []);

  const handleStrokeEnd = useCallback(() => {
    if (currentStroke.length > 0) {
      const newStroke: Stroke = {
        points: currentStroke,
        color: isEraser
          ? theme.backgroundRoot
          : (theme[selectedColor as keyof typeof theme] as string),
        size: isEraser ? PenSizes.bold * 2 : PenSizes[selectedSize],
      };
      setStrokes((prev) => [...prev, newStroke]);
      setCurrentStroke([]);
    }
  }, [currentStroke, selectedColor, selectedSize, isEraser, theme]);

  const handleColorChange = useCallback((colorKey: string) => {
    setSelectedColor(colorKey);
    setIsEraser(false);
  }, []);

  const handleSizeChange = useCallback((size: keyof typeof PenSizes) => {
    setSelectedSize(size);
    setIsEraser(false);
  }, []);

  const handleEraserToggle = useCallback(() => {
    setIsEraser((prev) => !prev);
  }, []);

  const handleClear = useCallback(() => {
    if (strokes.length > 0) {
      setShowClearModal(true);
    }
  }, [strokes.length]);

  const confirmClear = useCallback(() => {
    setStrokes([]);
    setShowClearModal(false);
    hasChanges.current = true;

    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
  }, []);

  return (
    <View
      style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
    >
      <View style={[styles.canvasWrapper, { marginTop: headerHeight }]}>
        <DrawingCanvas
          strokes={strokes}
          currentStroke={currentStroke}
          penColor={
            isEraser
              ? theme.backgroundRoot
              : (theme[selectedColor as keyof typeof theme] as string)
          }
          penSize={isEraser ? PenSizes.bold * 2 : PenSizes[selectedSize]}
          onStrokeStart={handleStrokeStart}
          onStrokeUpdate={handleStrokeUpdate}
          onStrokeEnd={handleStrokeEnd}
          canvasHeight={canvasHeight}
        />
      </View>

      <View style={[styles.toolbarWrapper, { paddingBottom: insets.bottom }]}>
        <PenToolbar
          selectedColor={selectedColor}
          selectedSize={selectedSize}
          isEraser={isEraser}
          onColorChange={handleColorChange}
          onSizeChange={handleSizeChange}
          onEraserToggle={handleEraserToggle}
          onClear={handleClear}
        />
      </View>

      <ConfirmModal
        visible={showClearModal}
        title="Clear Canvas"
        message="Are you sure you want to clear all your drawings? This cannot be undone."
        confirmText="Clear"
        cancelText="Cancel"
        onConfirm={confirmClear}
        onCancel={() => setShowClearModal(false)}
        destructive
      />

      <ConfirmModal
        visible={showDeleteModal}
        title="Delete Note"
        message="Are you sure you want to delete this note? This cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
        destructive
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  canvasWrapper: {
    flex: 1,
  },
  toolbarWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  titleInput: {
    fontSize: 18,
    fontWeight: "600",
    minWidth: 120,
    textAlign: "center",
  },
  headerButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
});
