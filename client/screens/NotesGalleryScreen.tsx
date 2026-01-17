import React, { useState, useCallback } from "react";
import { View, StyleSheet, FlatList, RefreshControl } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useHeaderHeight } from "@react-navigation/elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { NoteCard } from "@/components/NoteCard";
import { FAB } from "@/components/FAB";
import { EmptyState } from "@/components/EmptyState";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useTheme } from "@/hooks/useTheme";
import { Spacing } from "@/constants/theme";
import { getAllNotes } from "@/lib/storage";
import { Note } from "@/types/note";
import { RootStackParamList } from "@/navigation/RootStackNavigator";
import { v4 as uuidv4 } from "uuid";

interface NotesGalleryScreenProps {
  navigation: NativeStackNavigationProp<RootStackParamList, "NotesGallery">;
}

export default function NotesGalleryScreen({
  navigation,
}: NotesGalleryScreenProps) {
  const { theme } = useTheme();
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();

  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadNotes = useCallback(async () => {
    try {
      const allNotes = await getAllNotes();
      setNotes(allNotes);
    } catch (error) {
      console.error("Error loading notes:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadNotes();
    }, [loadNotes])
  );

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    loadNotes();
  }, [loadNotes]);

  const handleNewNote = useCallback(() => {
    const newNote: Note = {
      id: uuidv4(),
      title: "Untitled",
      strokes: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    navigation.navigate("Canvas", { note: newNote, isNew: true });
  }, [navigation]);

  const handleOpenNote = useCallback(
    (note: Note) => {
      navigation.navigate("Canvas", { note, isNew: false });
    },
    [navigation]
  );

  const renderItem = useCallback(
    ({ item }: { item: Note }) => (
      <NoteCard note={item} onPress={() => handleOpenNote(item)} />
    ),
    [handleOpenNote]
  );

  const keyExtractor = useCallback((item: Note) => item.id, []);

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: theme.backgroundRoot,
            paddingTop: headerHeight,
          },
        ]}
      >
        <LoadingSpinner />
      </View>
    );
  }

  return (
    <View
      style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
    >
      <FlatList
        data={notes}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={[
          styles.listContent,
          {
            paddingTop: headerHeight + Spacing.xl,
            paddingBottom: insets.bottom + Spacing.xl + 80,
          },
          notes.length === 0 && styles.emptyListContent,
        ]}
        scrollIndicatorInsets={{ bottom: insets.bottom }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={theme.textSecondary}
            progressViewOffset={headerHeight}
          />
        }
        ListEmptyComponent={
          <EmptyState
            title="Your first page awaits"
            subtitle="Tap the + button to start writing"
          />
        }
        showsVerticalScrollIndicator={false}
      />

      <FAB
        onPress={handleNewNote}
        testID="button-new-note"
        icon="plus"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
  },
  emptyListContent: {
    flex: 1,
  },
  row: {
    justifyContent: "space-between",
  },
});
