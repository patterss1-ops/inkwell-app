import { Platform } from "react-native";

// Moleskine-inspired color palette
export const MoleskineColors = {
  // Primary
  creamPaper: "#F4F1E8",
  inkBlack: "#2C2C2C",
  
  // Pen palette
  moleskineBlue: "#3B5998",
  classicRed: "#C93838",
  forestGreen: "#2D5C3F",
  warmBrown: "#8B6F47",
  
  // Neutrals
  softGray: "#E8E5DC",
  charcoal: "#4A4A4A",
  pureWhite: "#FFFFFF",
  
  // Semantic
  dotGrid: "#D9D4C3",
};

export const Colors = {
  light: {
    text: MoleskineColors.inkBlack,
    textSecondary: MoleskineColors.charcoal,
    buttonText: MoleskineColors.pureWhite,
    tabIconDefault: MoleskineColors.charcoal,
    tabIconSelected: MoleskineColors.inkBlack,
    link: MoleskineColors.warmBrown,
    backgroundRoot: MoleskineColors.creamPaper,
    backgroundDefault: MoleskineColors.pureWhite,
    backgroundSecondary: MoleskineColors.softGray,
    backgroundTertiary: "#D9D9D9",
    border: MoleskineColors.softGray,
    dotGrid: MoleskineColors.dotGrid,
    // Pen colors
    penBlack: MoleskineColors.inkBlack,
    penBlue: MoleskineColors.moleskineBlue,
    penRed: MoleskineColors.classicRed,
    penGreen: MoleskineColors.forestGreen,
    penBrown: MoleskineColors.warmBrown,
  },
  dark: {
    text: "#ECEDEE",
    textSecondary: "#9BA1A6",
    buttonText: "#FFFFFF",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: "#ECEDEE",
    link: MoleskineColors.warmBrown,
    backgroundRoot: "#1F2123",
    backgroundDefault: "#2A2C2E",
    backgroundSecondary: "#353739",
    backgroundTertiary: "#404244",
    border: "#404244",
    dotGrid: "#3A3A3A",
    // Pen colors (same in dark mode)
    penBlack: "#ECEDEE",
    penBlue: "#6B8DD6",
    penRed: "#E85858",
    penGreen: "#4D8C6F",
    penBrown: "#B8956F",
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
  "4xl": 40,
  "5xl": 48,
  inputHeight: 48,
  buttonHeight: 52,
  toolbarHeight: 60,
  dotSpacing: 20,
  dotSize: 2,
};

export const BorderRadius = {
  xs: 8,
  sm: 12,
  md: 18,
  lg: 24,
  xl: 30,
  "2xl": 40,
  "3xl": 50,
  full: 9999,
};

export const Typography = {
  h1: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: "700" as const,
  },
  h2: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: "700" as const,
  },
  h3: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "600" as const,
  },
  h4: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: "600" as const,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "400" as const,
  },
  small: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "400" as const,
  },
  caption: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "400" as const,
  },
  link: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "400" as const,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: "Inter_400Regular",
    sansMedium: "Inter_500Medium",
    sansBold: "Inter_700Bold",
    serif: "PlayfairDisplay_400Regular",
    serifSemiBold: "PlayfairDisplay_600SemiBold",
    serifBold: "PlayfairDisplay_700Bold",
  },
  default: {
    sans: "Inter_400Regular",
    sansMedium: "Inter_500Medium",
    sansBold: "Inter_700Bold",
    serif: "PlayfairDisplay_400Regular",
    serifSemiBold: "PlayfairDisplay_600SemiBold",
    serifBold: "PlayfairDisplay_700Bold",
  },
  web: {
    sans: "Inter_400Regular, system-ui, -apple-system, sans-serif",
    sansMedium: "Inter_500Medium, system-ui, -apple-system, sans-serif",
    sansBold: "Inter_700Bold, system-ui, -apple-system, sans-serif",
    serif: "PlayfairDisplay_400Regular, Georgia, serif",
    serifSemiBold: "PlayfairDisplay_600SemiBold, Georgia, serif",
    serifBold: "PlayfairDisplay_700Bold, Georgia, serif",
  },
});

export const Shadows = {
  fab: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  card: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
};

export const PenSizes = {
  fine: 2,
  medium: 4,
  bold: 8,
};

export const PenColors = [
  { name: "Black", key: "penBlack" },
  { name: "Blue", key: "penBlue" },
  { name: "Red", key: "penRed" },
  { name: "Green", key: "penGreen" },
  { name: "Brown", key: "penBrown" },
] as const;
