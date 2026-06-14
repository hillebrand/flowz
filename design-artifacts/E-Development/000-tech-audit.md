# Tech Audit — Flowz Native App

**Datum:** 2026-06-14  
**Auteur:** Mimir (WDS Builder)  
**Codebase root:** `native-app/`  
**Status:** Foundation scaffold — app screens nog niet geïmplementeerd

---

## 1. Stack & Versies

| Package | Versie | Noot |
|---------|--------|------|
| React Native | 0.85.3 | |
| Expo SDK | ~56.0.11 | Gebruik altijd https://docs.expo.dev/versions/v56.0.0/ |
| expo-router | ~56.2.10 | file-based routing, `typedRoutes` niet expliciet in config |
| NativeWind | ^4.2.5 | Geconfigureerd via `babel-preset-expo` + `nativewind/babel` |
| TailwindCSS | ^3.4.19 | |
| Zustand | ^5.0.14 | |
| react-native-reanimated | 4.3.1 | Beschikbaar, nog niet in gebruik |
| expo-secure-store | ~56.0.4 | Gebruikt voor token opslag |
| @expo-google-fonts/karla | ^0.4.2 | 4 gewichten geladen in root layout |
| TypeScript | ~5.9.2 | `strict: true` actief |

**Ontbrekend voor WO-003:**
- Geen slider-bibliotheek geïnstalleerd. Kandidaat: `@miblanchard/react-native-slider` (NativeWind-compatible, ondersteunt custom track rendering). Controleren op Expo SDK 56 compatibiliteit vóór install.

---

## 2. Mapstructuur

```
native-app/
├── app/
│   ├── _layout.tsx          ← root layout: fonts, StatusBar, Stack
│   ├── index.tsx            ← redirect: token? → (app) : (auth)/login
│   ├── (auth)/
│   │   ├── _layout.tsx      ← Stack wrapper, geen auth guard
│   │   ├── login.tsx        ← STUB: placeholder tekst
│   │   ├── register.tsx     ← (niet gelezen, aanwezig)
│   │   ├── forgot-password.tsx
│   │   └── reset-password.tsx
│   └── (app)/
│       ├── _layout.tsx      ← auth guard: geen token → redirect login
│       └── index.tsx        ← STUB: "Shortlist — komt eraan"
├── components/
│   ├── TaskCard.tsx         ← minimale stub: titel tonen
│   ├── TimerRing.tsx        ← circulaire timer display (border-8 border-primary)
│   ├── SubtaskList.tsx      ← (niet gelezen, aanwezig)
│   └── ConfirmModal.tsx     ← (niet gelezen, aanwezig)
├── stores/
│   ├── authStore.ts         ← volledig geïmplementeerd
│   ├── dataStore.ts         ← volledig geïmplementeerd, settings model verouderd
│   └── sessionStore.ts      ← minimaal: alleen Pomodoro session state
├── types/
│   └── index.ts             ← alle domain types, CheckinData model verouderd
├── global.css               ← @tailwind base/components/utilities
├── tailwind.config.js       ← custom tokens, content: app/** + components/**
├── tsconfig.json            ← strict, @/ alias → ./
├── babel.config.js          ← nativewind babel preset
└── package.json
```

**Kritieke observatie:** De `lib/` map bestaat nog niet. Alle business logic voor WO-003 (`@/lib/planning/`) moet worden aangemaakt.

---

## 3. Stores — huidige staat

### `authStore.ts` — volledig
- Token opgeslagen als JSON `{ token, email }` in SecureStore onder `flowz_auth_token`
- `loadToken()` aangeroepen in root layout `useEffect`
- `isLoading: true` initieel — root layout wacht op fonts én token

### `dataStore.ts` — functioneel, model verouderd voor WO-003
```ts
// Huidige DEFAULT_SETTINGS — MOET uitgebreid worden:
const DEFAULT_SETTINGS: Settings = {
  shortlist_size: 5,
  session_length_min: 45,
  break_length_min: 10,
  reminder_enabled: true,
  reminder_time: '18:00',
  magister_connected: false,
  magister_email: null,
  blocked_days: { recurring: ['saturday', 'sunday'], specific: [] },
  // ONTBREEKT: capacity_week, capacity_overrides
};
```
- `fetchData` merge pattern: `{ ...DEFAULT_SETTINGS, ...data.settings }` — veilig voor uitbreiding
- `saveData` is optimistisch: eerst lokaal, dan Worker (sync-fouten zijn stil)

### `sessionStore.ts` — minimaal, uitbreiding nodig
```ts
// Huidige state:
taskId: string | null;
endTimestamp: number | null;
// ONTBREEKT: selectedMinutes, selectedZone
```

---

## 4. Types — huidige staat

### Verouderd voor WO-003: `CheckinData`
```ts
// Huidig:
interface CheckinData {
  energy: 'low' | 'normal' | 'high' | null;
  time: 'low' | 'normal' | 'high' | null;  // ← VEROUDERD: was tijdsbucket
  date: string;
}
// Nieuw (WO-003): time vervangen door selectedMinutes: number
```

### Verouderd voor WO-003: `Settings`
```ts
// blocked_days model vervangen door capacity_week + capacity_overrides
blocked_days: { recurring: string[]; specific: string[] }; // ← VEROUDERD
// Nieuw:
capacity_week: Record<string, number>;        // { monday: 60, ... }
capacity_overrides: Record<string, number>;   // { "2026-06-20": 30 }
```

### `DailyPlan` — aanwezig in types maar nog niet in gebruik in native app
Prototype-logica zit in `design-artifacts/E-Development/prototype/shared/app.js` — nog niet gemigreerd naar `@/lib/`.

---

## 5. Routing

```
app/index.tsx              → redirect op basis van token
app/(auth)/login.tsx       → stub
app/(app)/index.tsx        → STUB — wordt de shortlist (02.3)
```

**Implicaties voor WO-003:**
- `(app)/index.tsx` wordt de shortlist (02.3 Shortlist Vandaag)
- Nieuwe schermen nodig:
  - `app/(app)/checkin.tsx` — 02.1 Energie Check-in
  - `app/(app)/tijdkeuze.tsx` — 02.2 Tijdkeuze (nieuwe slider stap)
  - `app/(app)/beschikbaarheid.tsx` — 04.2 Beschikbaarheid (uitbreiding)
- Check-in guard: `(app)/_layout.tsx` moet checken of check-in vandaag al gedaan is

---

## 6. NativeWind & Styling

- **Tailwind content paths:** `./app/**` en `./components/**` — nieuwe mappen (`lib/`) hoeven hier niet bij
- **Custom tokens beschikbaar:** `primary` (#6366f1), `primary-dark`, `flowz-purple`, `flowz-nav`
- **fontFamily-regel:** Karla fonts zijn geladen via `useFonts` in root layout. Gebruik **uitsluitend** `style={{ fontFamily: 'Karla_400Regular' }}` — NativeWind fontFamily className werkt niet in v4
- **reanimated:** Geïnstalleerd (`4.3.1`), beschikbaar voor slider-animaties en zone-transitie

---

## 7. Prototype → Native: migratiegap

De prototype-HTML-bestanden in `design-artifacts/E-Development/prototype/` bevatten volledige business logic in `shared/app.js` (FS-namespace). **Niets hiervan is gemigreerd** naar de native app. De native app is een clean scaffold zonder implementatie.

WO-003 bouwt alle logica opnieuw in TypeScript in `@/lib/planning/`.

---

## 8. Bevindingen & Risico's

| # | Bevinding | Impact | Actie |
|---|-----------|--------|-------|
| 1 | `lib/` map bestaat niet | Planning engine kan niet gebouwd worden | Aanmaken als onderdeel van WO-003 |
| 2 | `CheckinData.time` is tijdsbucket, niet minuten | Breaking change in checkin flow | Type aanpassen + `dataStore.setCheckin` contract bijwerken |
| 3 | `Settings` mist `capacity_week` + `capacity_overrides` | Slider heeft geen data om op te starten | `DEFAULT_SETTINGS` uitbreiden + migratie logica |
| 4 | `sessionStore` mist `selectedMinutes` + `selectedZone` | Shortlist kan niet cappen op slider-tijd | `sessionStore` uitbreiden |
| 5 | Geen slider-bibliotheek geïnstalleerd | 02.2 Tijdkeuze kan niet gebouwd worden | Installeren vóór implementatie van 02.2 |
| 6 | `(app)/index.tsx` is een stub | Shortlist bestaat niet | Implementeren als 02.3 |
| 7 | Tailwind `content` mist `lib/` | Geen impact — lib bevat geen JSX | Geen actie nodig |
| 8 | `typedRoutes` niet in `app.json`/`tsconfig` | Route-type inferentie werkt mogelijk niet | Controleren bij implementatie |

---

## 9. Implementatievolgorde (aanbevolen)

Op basis van afhankelijkheden:

```
1. Types uitbreiden (Settings, CheckinData, nieuw: ZoneThresholds)
2. DEFAULT_SETTINGS uitbreiden + migratiefunctie
3. sessionStore uitbreiden (selectedMinutes, selectedZone)
4. lib/planning/ aanmaken (capacityResolver → zoneCalculator → taskListBuilder → feedbackText)
5. Slider-bibliotheek installeren + testen op Expo 56
6. app/(app)/tijdkeuze.tsx bouwen (02.2)
7. app/(app)/index.tsx implementeren als shortlist (02.3)
8. app/(app)/beschikbaarheid.tsx bouwen (04.2 uitbreiding)
9. Check-in guard in (app)/_layout.tsx
```
