---
project_name: 'EveliensTaakjesApp'
user_name: 'Evelien'
date: '2026-06-13'
sections_completed: ['technology_stack', 'typescript_rules', 'framework_rules', 'state_management', 'code_organization', 'anti_patterns']
status: 'complete'
rule_count: 32
optimized_for_llm: true
---

# Project Context for AI Agents

_Dit bestand bevat kritieke regels en patronen die AI-agents moeten volgen bij het implementeren van code in dit project. Focus op niet-voor-de-hand-liggende details die agents anders zouden missen._

---

## Technology Stack & Versies

- React Native 0.85.3
- Expo SDK ~56.0.11 — lees ALTIJD https://docs.expo.dev/versions/v56.0.0/ vóór implementatie
- expo-router ~56.2.10 (file-based routing, typedRoutes: true)
- NativeWind 4.2.5 + TailwindCSS 3.4.19
- Zustand 5.0.14
- TypeScript ~5.9.2 (strict mode)
- expo-secure-store ~56.0.4
- expo-linking ~56.0.14
- react-native-reanimated 4.3.1
- @expo-google-fonts/karla 0.4.2
- Backend: Cloudflare Worker op https://flowstate-proxy.flowstate-evelien.workers.dev
- App URL scheme: `flowz://` (OAuth deep link callback)

## Critical Implementation Rules

### TypeScript-regels

- `strict: true` — geen `any`, altijd expliciete types
- Alle domaintypes staan in `@/types/index.ts` — voeg nieuwe types daar toe, importeer via `@/types`
- Path alias `@/` verwijst naar de project root (`native-app/`) — gebruik ALTIJD `@/` i.p.v. relatieve paden
- `void` gebruiken voor bewust onafgehandelde Promises: `void loadToken()` (niet `// @ts-ignore` of negeren)
- TypeScript `as`-casts alleen gebruiken na expliciete runtime-check of bij JSON-parse
- Geen `// @ts-ignore` of `// eslint-disable` zonder uitleg

### Expo Router & React Native

- **Scherm-bestanden** (`app/`) gebruiken `export default` — **component-bestanden** (`components/`) gebruiken named exports
- Route groups: `(auth)` voor unauthenticated, `(app)` voor authenticated — auth guard zit in `(app)/_layout.tsx`
- `typedRoutes: true` is actief — gebruik getypte `href`-waarden (bijv. `"/(auth)/login"`, niet `"/auth/login"`)
- **NativeWind 4 custom fonts**: `fontFamily` werkt NIET via `className` — altijd `style={{ fontFamily: 'Karla_400Regular' }}` naast `className`
- Beschikbare Karla-gewichten: `Karla_400Regular`, `Karla_500Medium`, `Karla_600SemiBold`, `Karla_700Bold`
- Stijlen via NativeWind `className` voor layout/kleur/spacing; `style={{}}` uitsluitend voor fontFamily
- Expo SDK 56 breaking changes kunnen afwijken van online tutorials — raadpleeg altijd https://docs.expo.dev/versions/v56.0.0/
- Orientatie is portrait-only (`"orientation": "portrait"` in app.json)
- Android: `predictiveBackGestureEnabled: false` — geen back-gebaar op Android

### State Management

- Zustand stores in `stores/[naam]Store.ts`, geëxporteerd als `use[Naam]Store`
- **Drie stores**: `authStore` (token/email), `dataStore` (AppData + Worker sync), `sessionStore` (actieve Pomodoro-sessie, in-memory)
- Auth-token opgeslagen via `expo-secure-store` — NOOIT via AsyncStorage of een andere methode
- `dataStore.fetchData(token)` ophalen bij inloggen/app-start; `saveData` optimistisch (eerst lokaal updaten, dan Worker)
- `sessionStore` is puur in-memory — sessie-data gaat verloren bij app-herstart, dit is by design
- Worker URL is gecentraliseerd als constante `WORKER_URL` in `dataStore.ts` — niet herhalen in andere bestanden
- Bij sync-fouten met de Worker: stil falen is acceptabel (persoonlijk gebruik) — geen foutmelding tonen
- `DEFAULT_DATA` en `DEFAULT_SETTINGS` in `dataStore.ts` zijn de bron van waarheid voor lege state — uitbreidingen hier toevoegen

### Code-organisatie & Naamgeving

- **Mapstructuur** (binnen `native-app/`):
  - `app/` — expo-router schermen (route-bestanden)
  - `components/` — herbruikbare UI-componenten (named exports, PascalCase bestandsnamen)
  - `stores/` — Zustand stores
  - `lib/` — business logic (planning, capaciteit, formatting) — nog leeg, hier naartoe migreren
  - `types/` — uitsluitend TypeScript-interfaces/types
- Bestandsnamen schermen: `kebab-case.tsx` (bijv. `forgot-password.tsx`)
- Bestandsnamen componenten: `PascalCase.tsx` (bijv. `TaskCard.tsx`)
- Bestandsnamen stores: `camelCaseStore.ts` (bijv. `authStore.ts`)
- Kleuren: gebruik altijd Tailwind custom tokens (`text-flowz-purple`, `bg-primary`) i.p.v. hardcoded hex
- Tailwind content-paden zijn beperkt tot `app/**` en `components/**` — nieuwe mappen toevoegen aan `tailwind.config.js` indien nodig

### Kritieke Anti-patronen

- **NOOIT** `fontFamily` via NativeWind `className` — werkt niet in NativeWind 4, altijd via `style={{}}`
- **NOOIT** de Cloudflare Worker URL dupliceren — staat centraal in `WORKER_URL` in `dataStore.ts`
- **NOOIT** tokens opslaan in AsyncStorage — uitsluitend `expo-secure-store`
- **NOOIT** relatieve imports gebruiken (`../stores/authStore`) — altijd `@/stores/authStore`
- **NOOIT** nieuwe schermen toevoegen zonder route group (`(auth)` of `(app)`) — anders geen auth guard
- Het `implementatieplan.md` beschrijft een Vue 3-aanpak — dit is **achterhaald**; de native Expo-app (ADR-001) is de huidige richting
- Wachtwoord-reset e-mails worden niet daadwerkelijk verstuurd — de reset-link komt terug via de API response (by design)
- De backend (`cloudflare-worker/`) vereist geen wijzigingen voor nieuwe native app features — alleen aanpassen bij Worker-endpoint wijzigingen
- `react-native-reanimated` is beschikbaar voor animaties — gebruik dit, niet `Animated` van React Native core

---

## Gebruiksrichtlijnen

**Voor AI-agents:**

- Lees dit bestand vóór het implementeren van code
- Volg ALLE regels exact zoals gedocumenteerd
- Bij twijfel: kies de meest restrictieve optie
- Update dit bestand als nieuwe patronen ontstaan

**Voor mensen:**

- Houd dit bestand lean en gefocust op agent-behoeften
- Update bij wijzigingen in de tech stack
- Controleer periodiek op verouderde regels

_Laatst bijgewerkt: 2026-06-13_
