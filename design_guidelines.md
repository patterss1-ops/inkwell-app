# Moleskine Note-Taking App - Design Guidelines

## 1. Brand Identity

**Purpose**: A digital sanctuary for handwritten thoughts—combining the tactile elegance of a Moleskine notebook with the convenience of mobile.

**Aesthetic Direction**: **Luxurious/Refined** with editorial restraint. Think premium stationery brand—subtle textures, restrained colors, timeless typography. The app should feel like opening a €20 notebook, not a tech product.

**Memorable Element**: The cream-colored dotted paper texture paired with ink-like pen strokes. When users write, they should feel the quality—smooth, sophisticated, analog warmth in a digital format.

## 2. Navigation Architecture

**Root Navigation**: Stack-Only (no tabs—maintains focus on the writing experience)

**Screen Flow**:
1. **Notes Gallery** (Root) → Displays all saved notes as thumbnails
2. **Canvas Screen** (Push) → Drawing/writing interface
3. **Settings** (Modal) → App preferences and about

## 3. Screen-by-Screen Specifications

### Notes Gallery Screen
**Purpose**: Browse and access saved notes

**Layout**:
- Header: Custom transparent header
  - Left: "Notes" title (elegant serif)
  - Right: Settings icon button
- Main Content: ScrollView with 2-column grid of note cards
  - Each card shows thumbnail preview, title, date
  - Tap card → opens Canvas Screen
  - Empty state when no notes exist
- Floating Action Button (FAB): "+" button for new note
  - Position: bottom-right, 16pt from edges
  - Elevated with subtle shadow

**Safe Area Insets**:
- Top: headerHeight + Spacing.xl
- Bottom: insets.bottom + Spacing.xl (no tab bar)

**Empty State**: Display empty-notes illustration with text "Your first page awaits"

### Canvas Screen
**Purpose**: Write/draw on dotted paper

**Layout**:
- Header: Custom transparent header
  - Left: Back arrow + note title (editable, tap to rename)
  - Right: Save button (auto-saves on exit)
- Main Content: Full-screen canvas
  - Dotted grid background (cream paper)
  - Touch-responsive drawing area
- Floating Toolbar: Bottom-aligned horizontal strip
  - Pen size selector (Fine/Medium/Bold icons)
  - Color palette (5 circular swatches: Black, Blue, Red, Green, Brown)
  - Eraser tool icon
  - Clear canvas icon (with confirmation)

**Safe Area Insets**:
- Top: headerHeight + Spacing.xl
- Bottom: toolbarHeight + Spacing.xl

### Settings Screen (Modal)
**Purpose**: App preferences

**Layout**:
- Header: Default navigation
  - Title: "Settings"
  - Right: Close (X) button
- Main Content: Scrollable form
  - Display name field
  - User avatar (1 preset Moleskine-colored icon)
  - Theme preference toggle (optional)
  - About section (version, links)

**Safe Area Insets**:
- Top: Spacing.xl
- Bottom: insets.bottom + Spacing.xl

## 4. Color Palette

**Primary Colors**:
- Cream Paper: `#F4F1E8` (background, canvas)
- Ink Black: `#2C2C2C` (primary text, default pen)

**Accent Colors** (Pen Palette):
- Moleskine Blue: `#3B5998`
- Classic Red: `#C93838`
- Forest Green: `#2D5C3F`
- Warm Brown: `#8B6F47`

**Neutrals**:
- Soft Gray: `#E8E5DC` (card borders, dividers)
- Charcoal: `#4A4A4A` (secondary text)
- Pure White: `#FFFFFF` (FAB, toolbar background)

**Semantic**:
- Dot Grid: `#D9D4C3` (subtle, low-contrast)

## 5. Typography

**Font Choice**: 
- Headings: **Playfair Display** (serif, refined elegance)
- Body/UI: **Inter** (sans-serif, legible at small sizes)

**Type Scale**:
- Title (Screen Headers): Playfair Display, 28pt, Bold
- Note Title: Playfair Display, 18pt, SemiBold
- Body Text: Inter, 16pt, Regular
- Caption (Dates): Inter, 13pt, Regular, Charcoal
- Button Text: Inter, 15pt, Medium

## 6. Visual Design

**Icons**: Feather icons from @expo/vector-icons
- Navigation: chevron-left, settings, x
- Tools: edit-3 (pen), circle (color swatches), trash-2 (eraser), refresh-cw (clear)
- Actions: plus (FAB)

**Touchable Feedback**: 
- Cards: Scale down 0.98, opacity 0.8
- Buttons: Opacity 0.7
- FAB: Shadow + slight scale-down

**FAB Shadow Specifications**:
- shadowOffset: {width: 0, height: 2}
- shadowOpacity: 0.10
- shadowRadius: 2
- elevation: 3 (Android)

**Dotted Grid Pattern**:
- 20pt spacing between dots
- 2pt dot diameter
- Dot color: #D9D4C3 (barely visible, tactile feel)

## 7. Assets to Generate

1. **icon.png** - App icon featuring stylized Moleskine notebook spine (black elastic band detail) on cream background
   - WHERE USED: Device home screen

2. **splash-icon.png** - Simplified version of app icon for launch screen
   - WHERE USED: App launch/splash screen

3. **empty-notes.png** - Illustration of an open Moleskine notebook with dotted pages, viewed from above
   - WHERE USED: Notes Gallery empty state

4. **user-avatar.png** - Circular avatar with Moleskine cream color and embossed "M" initial
   - WHERE USED: Settings screen default avatar

All assets should use the cream (#F4F1E8), ink black (#2C2C2C), and warm brown (#8B6F47) palette. Style: Minimalist line art with subtle texture, resembling premium stationery branding.