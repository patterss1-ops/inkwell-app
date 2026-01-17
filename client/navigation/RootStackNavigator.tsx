import React from "react";
import { Pressable } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HeaderButton } from "@react-navigation/elements";
import { Feather } from "@expo/vector-icons";

import NotesGalleryScreen from "@/screens/NotesGalleryScreen";
import CanvasScreen from "@/screens/CanvasScreen";
import SettingsScreen from "@/screens/SettingsScreen";
import { HeaderTitle } from "@/components/HeaderTitle";
import { useScreenOptions } from "@/hooks/useScreenOptions";
import { useTheme } from "@/hooks/useTheme";
import { Note } from "@/types/note";

export type RootStackParamList = {
  NotesGallery: undefined;
  Canvas: { note: Note; isNew: boolean };
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootStackNavigator() {
  const screenOptions = useScreenOptions();
  const { theme } = useTheme();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="NotesGallery"
        component={NotesGalleryScreen}
        options={({ navigation }) => ({
          headerTitle: () => <HeaderTitle title="Inkwell" />,
          headerRight: () => (
            <HeaderButton
              onPress={() => navigation.navigate("Settings")}
              testID="button-settings"
            >
              <Feather name="settings" size={20} color={theme.textSecondary} />
            </HeaderButton>
          ),
        })}
      />
      <Stack.Screen
        name="Canvas"
        component={CanvasScreen}
        options={{
          headerTitle: "",
          headerBackTitle: "Notes",
        }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={({ navigation }) => ({
          presentation: "modal",
          headerTitle: "Settings",
          headerRight: () => (
            <HeaderButton
              onPress={() => navigation.goBack()}
              testID="button-close-settings"
            >
              <Feather name="x" size={22} color={theme.text} />
            </HeaderButton>
          ),
        })}
      />
    </Stack.Navigator>
  );
}
