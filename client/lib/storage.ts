import AsyncStorage from "@react-native-async-storage/async-storage";
import { Note } from "@/types/note";

const NOTES_KEY = "inkwell_notes";
const SETTINGS_KEY = "inkwell_settings";

export interface AppSettings {
  displayName: string;
}

const defaultSettings: AppSettings = {
  displayName: "Writer",
};

export async function getAllNotes(): Promise<Note[]> {
  try {
    const data = await AsyncStorage.getItem(NOTES_KEY);
    if (!data) return [];
    const notes = JSON.parse(data) as Note[];
    return notes.sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  } catch (error) {
    console.error("Error loading notes:", error);
    return [];
  }
}

export async function getNote(id: string): Promise<Note | null> {
  try {
    const notes = await getAllNotes();
    return notes.find((n) => n.id === id) || null;
  } catch (error) {
    console.error("Error getting note:", error);
    return null;
  }
}

export async function saveNote(note: Note): Promise<void> {
  try {
    const notes = await getAllNotes();
    const existingIndex = notes.findIndex((n) => n.id === note.id);

    if (existingIndex >= 0) {
      notes[existingIndex] = note;
    } else {
      notes.push(note);
    }

    await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(notes));
  } catch (error) {
    console.error("Error saving note:", error);
    throw error;
  }
}

export async function deleteNote(id: string): Promise<void> {
  try {
    const notes = await getAllNotes();
    const filtered = notes.filter((n) => n.id !== id);
    await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error("Error deleting note:", error);
    throw error;
  }
}

export async function getSettings(): Promise<AppSettings> {
  try {
    const data = await AsyncStorage.getItem(SETTINGS_KEY);
    if (!data) return defaultSettings;
    return { ...defaultSettings, ...JSON.parse(data) };
  } catch (error) {
    console.error("Error loading settings:", error);
    return defaultSettings;
  }
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  try {
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error("Error saving settings:", error);
    throw error;
  }
}
