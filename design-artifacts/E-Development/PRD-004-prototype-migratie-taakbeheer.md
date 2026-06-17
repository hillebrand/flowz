# Product Requirements Document (PRD) — WO-004: Prototype Migratie Taakbeheer & Pomodoro

**Status:** Ready for Build  
**Auteur:** Mimir (Development)  
**Datum:** 2026-06-17  
**Gerelateerd:** WO-004

## 1. Doel & Scope
Deze PRD beschrijft de migratie van de taakbeheer- en Pomodoro-flow van het HTML prototype naar de React Native codebase (`native-app`). Het betreft puur een vertaalslag van de UX en UI; de bedrijfslogica achter de Pomodoro timer wordt nu in React hooks (zoals `useEffect` en `setInterval`) en in de `sessionStore` geïmplementeerd.

## 2. Bestanden & Routing (expo-router)

De volgende schermen worden toegevoegd aan de `app/(app)/` route:

1. `taak-detail/[id].tsx` (vervangt `03.1-taak-detail.html`)
2. `sessie-voorbereiding.tsx` (vervangt `03.3-sessie-voorbereiding.html`)
3. `actieve-sessie.tsx` (vervangt `03.4-actieve-sessie.html`)
4. `sessie-afgerond.tsx` (vervangt `03.5-sessie-afgerond.html`)
5. `pauzetimer.tsx` (vervangt `03.6-pauzetimer.html`)
6. `afgeronde-taken.tsx` (vervangt `05.1-afgeronde-taken.html`)

## 3. Technische vereisten per pagina

### 3.1 Taak Detail (`taak-detail/[id].tsx`)
- **Data:** Taak ophalen via `useDataStore` o.b.v. `id` param.
- **Actie:** "Start session" knop navigeert naar `sessie-voorbereiding` en zet `sessionStore.taskId`.
- **UI:** Form fields voor description, weergave van details. Bewaren updates de store in.

### 3.2 Sessie Voorbereiding (`sessie-voorbereiding.tsx`)
- **Data:** Leest `taskId` uit `sessionStore`.
- **Actie:** "Let's go" knop navigeert naar `actieve-sessie` en roept `sessionStore.startSession()` aan met de `session_length_min` uit de settings.

### 3.3 Actieve Sessie (`actieve-sessie.tsx`)
- **Timer:** Een `useEffect` met `setInterval` (1000ms) berekent het verschil tussen `sessionStore.endTimestamp` en `Date.now()`.
- **Logica:** Zodra de timer 0 bereikt (of op "Finish early" wordt gedrukt), routeert de app naar `sessie-afgerond`.
- **UI:** Gebruikt de bestaande of nieuwe `TimerRing` component.

### 3.4 Sessie Afgerond (`sessie-afgerond.tsx`)
- **Data:** Bij laden de `sessions_done` van de taak verhogen en wegschrijven naar de `useDataStore` (+ log toevoegen).
- **Actie:** "Take a break" knop navigeert naar `pauzetimer.tsx`.

### 3.5 Pauzetimer (`pauzetimer.tsx`)
- **Timer:** Zelfde `setInterval` mechanisme als actieve sessie, maar dan ingesteld met `break_length_min`.
- **Actie:** Na afloop (of "Skip") terug naar `index.tsx` (02.3 Shortlist Vandaag).

## 4. UI Vertaalregels
- Vertaal `class="bg-indigo-500"` naar `className="bg-primary"`.
- Voeg `style={{ fontFamily: 'Karla_400Regular' }}` of `Karla_700Bold` toe aan elke `<Text>`.
- Gebruik componenten van `lucide-react-native` voor iconen (Play, Pause, Check, ArrowLeft, etc.).

## 5. Acceptatiecriteria
Zie WO-004.
