# Inkwell - Moleskine-Inspired Note-Taking App

## Overview

Inkwell is a digital note-taking application designed to replicate the tactile elegance of a Moleskine notebook. It's a React Native/Expo application with a premium, luxurious aesthetic featuring cream-colored dotted paper textures and ink-like pen strokes. The app provides a handwriting canvas experience where users can create, browse, and manage handwritten notes.

The application follows a stack-only navigation pattern (no tabs) to maintain focus on the writing experience, with three main screens: Notes Gallery, Canvas (drawing interface), and Settings.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React Native with Expo SDK 54, targeting iOS, Android, and Web platforms.

**Navigation**: Stack-based navigation using `@react-navigation/native-stack`. The app deliberately avoids tab navigation to maintain an editorial, focused experience. Main navigation flow: Notes Gallery → Canvas Screen → Settings (modal).

**State Management**: 
- Local component state with React hooks for UI state
- TanStack Query (React Query) for server state management and caching
- AsyncStorage for local data persistence (notes and settings)

**Styling Approach**: 
- StyleSheet-based styling with a Moleskine-inspired design system
- Theming system with light/dark mode support via `useTheme` hook
- Design tokens defined in `client/constants/theme.ts` (colors, spacing, typography, pen sizes)
- Custom fonts: Playfair Display (serif, for headers) and Inter (sans-serif, for body)

**Animation**: React Native Reanimated for smooth, performant animations with spring configurations for micro-interactions.

**Drawing System**: Custom SVG-based drawing canvas using `react-native-svg` with gesture handling via `react-native-gesture-handler`. Strokes are stored as arrays of points with color and size metadata.

### Backend Architecture

**Server**: Express.js (v5) running on Node.js with TypeScript.

**API Design**: RESTful API structure with routes prefixed under `/api`. Currently minimal backend with user-related endpoints scaffolded.

**Database**: 
- Schema defined using Drizzle ORM in `shared/schema.ts`
- PostgreSQL as the target database (configured via `DATABASE_URL`)
- Currently uses in-memory storage (`MemStorage`) as a fallback
- Migrations managed through Drizzle Kit

### Data Storage Solutions

**Local Storage**: AsyncStorage for persisting notes and user settings on the device. Notes include stroke data, metadata, and optional thumbnails.

**Note Data Structure**:
```typescript
interface Note {
  id: string;
  title: string;
  strokes: Stroke[];  // Array of drawing strokes
  createdAt: string;
  updatedAt: string;
  thumbnail?: string;
}
```

### Build System

**Development**: 
- Expo CLI for mobile development with Metro bundler
- Express server runs separately for API endpoints
- Babel with module-resolver for path aliases (`@/` → `./client`, `@shared/` → `./shared`)

**Production**:
- Expo static web build via custom build script (`scripts/build.js`)
- Server bundled with esbuild for deployment

### Path Aliases

- `@/` maps to `./client/` (frontend code)
- `@shared/` maps to `./shared/` (shared types and schemas)

## External Dependencies

### Third-Party Services & APIs

**No external third-party APIs currently integrated**. The app is primarily offline-first with local storage.

### Key Dependencies

**UI & Navigation**:
- `@react-navigation/*` - Navigation framework
- `react-native-gesture-handler` - Touch gesture handling
- `react-native-reanimated` - Animation library
- `react-native-svg` - SVG rendering for drawing canvas
- `expo-blur`, `expo-haptics` - Native effects

**Data & Storage**:
- `@react-native-async-storage/async-storage` - Local persistence
- `drizzle-orm` + `drizzle-zod` - Database ORM and validation
- `pg` - PostgreSQL client
- `@tanstack/react-query` - Server state management

**Development**:
- `typescript` - Type safety
- `eslint` + `prettier` - Code quality
- `esbuild` - Server bundling

### Database Configuration

PostgreSQL connection configured via `DATABASE_URL` environment variable. Drizzle Kit handles schema migrations to the `./migrations` directory.