# Product Requirements Document (PRD) — WO-003: Tijdplanning & Dynamic Pacing Slider

**Status:** Ready for Build  
**Auteur:** Mimir (Development)  
**Datum:** 2026-06-17  
**Gerelateerd:** WO-003, RFC-003, 000-tech-audit

## 1. Doel & Scope
Dit PRD vertaalt Freya's Work Order WO-003 en de Product Brief (RFC-003) naar technische development requirements. De feature introduceert een dynamisch "drie-zone" pacing systeem met een visuele slider voor de dagelijkse check-in, een gecapte shortlist en uitgebreide beschikbaarheidsinstellingen.

## 2. Architectuur & Data Model

### 2.1 State Management (`stores/dataStore.ts`)
De `DEFAULT_SETTINGS` moet uitgebreid worden met:
- `capacity_week`: `Record<string, number>` (Ma t/m Zo, default 60 min, za 120, zo 0).
- `capacity_overrides`: `Record<string, number>` (YYYY-MM-DD -> minuten).
Migratie van oude `blocked_days` is nodig bij de eerste laadactie.

### 2.2 Sessie Status (`stores/sessionStore.ts`)
Uitbreiden met:
- `selectedMinutes: number` (De gekozen tijd).
- `selectedZone: 'red' | 'orange' | 'green'` (Berekende zone).

### 2.3 Planning Engine (`@/lib/planning/`)
- `capacityResolver.ts`: Bepaalt de fallback-vrije minuten per datum.
- `zoneCalculator.ts`: Berekent de drempels voor de slider (Rood vs Oranje vs Groen).
- `taskListBuilder.ts`: Stelt de lijst samen gecapt op `selectedMinutes`.
- `feedbackText.ts`: Genereert de dynamische string (bv. "Je ligt perfect op schema").

## 3. Interface Requirements

### 3.1 Pagina: 02.2 Tijdkeuze (`app/(app)/tijdkeuze.tsx`)
- **Slider-component:** Installeren van `@miblanchard/react-native-slider` (Expo SDK 56 compatible).
- **Logica:** Thumb start op macro-waarde (uit `capacityResolver`). Beweegt alleen door touch.
- **Kleurzones:** Achtergrond track toont de grenzen van de zones berekend door `zoneCalculator`.
- **Feedback:** Tekst past zich <100ms aan bij zone wijzigingen.

### 3.2 Pagina: 02.3 Shortlist Vandaag (`app/(app)/index.tsx`)
- **Geen "Optioneel" sectie meer:** Unified lijst.
- **Limiet:** Toont taken tot max `selectedMinutes` uit de store.
- **Deficit Banner:** Zichtbaar als `selectedZone === 'red'`, dwingt urgente taken te tonen.

### 3.3 Pagina: 04.2 Beschikbaarheid (`app/(app)/beschikbaarheid.tsx`)
- **Weekcapaciteit:** 7 dagen steppers, 15 min increments (0-300 min).
- **Overrides:** Kalender (bottom sheet) voor afwijkende dagen.

## 4. Acceptatiecriteria
Zie WO-003 sectie "Acceptatiecriteria" voor de letterlijke eisen per functionaliteit (P1/P2 randvoorwaarden zijn 1:1 overgenomen voor de build).

## 5. Technische Spelregels
- Strict TypeScript. Geen relative imports (enkel `@/`).
- NativeWind V4 + Karla fonts uitsluitend via `style={{ fontFamily: 'Karla_...' }}`.
- Reanimated voor soepele animaties.

