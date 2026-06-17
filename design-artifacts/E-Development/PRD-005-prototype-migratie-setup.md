# Product Requirements Document (PRD) — WO-005: Prototype Migratie Setup & Instellingen

**Status:** Ready for Build  
**Auteur:** Mimir (Development)  
**Datum:** 2026-06-17  
**Gerelateerd:** WO-005

## 1. Doel & Scope
Deze PRD beschrijft de migratie van de resterende schermen van het HTML prototype: de login/auth flows, de eerste setup flow (incl. Magister), en de algemene instellingen.

## 2. Bestanden & Routing (expo-router)

### 2.1 Auth Flow (`app/(auth)/`)
- `login.tsx`: Inloggen (bestaat als stub). Form handling & `authStore.login()`
- `register.tsx`: Aanmelden.
- `forgot-password.tsx`, `reset-password.tsx`.

### 2.2 Setup Flow (`app/(app)/setup/`)
De setup flow navigeert opeenvolgend. We groeperen ze in een sub-route:
- `welkomst.tsx` (01.1)
- `magister-sync.tsx` (01.2) - Toont (mock) loader en sync state.
- `import-review.tsx` (01.3) - Reviewlijst van gemockte data, die op het einde in de store gepusht wordt.
- `taak-aanmaken.tsx` (01.4) - Form om losse taken toe te voegen. Ook bereikbaar vanuit het dashboard.
- `takenoverzicht.tsx` (01.5) - Lijstweergave van de backlog (voor later hergebruik). Ook het "Einde setup" scherm met navigatie naar `index.tsx`.

### 2.3 Instellingen (`app/(app)/instellingen.tsx`)
- Vervangt `04.1-instellingen.html`.
- Formulier-elementen die direct via `dataStore.saveData` de instellingen wijzigen (bv `break_length_min`, `session_length_min`).
- Navigatieknop naar `beschikbaarheid.tsx`.

## 3. Technische Eisen & Componenten
- **Setup Guard:** Binnen `app/(app)/_layout.tsx` (of index) is een controle nodig of dit de *eerste* start is. Indien ja: redirect naar `setup/welkomst`. Dit kan afgevangen worden met een boolean vlag (`has_completed_setup` of o.b.v. data).
- Alle styling, classes, fonts en SVG-vervangingen als in PRD-004.
- Mock Magister data kan hardcoded in de file zelf, en na acceptatie in `dataStore` gepusht worden.

## 4. Acceptatiecriteria
Zie WO-005.
