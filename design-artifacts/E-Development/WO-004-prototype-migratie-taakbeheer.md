# Work Order WO-004 — Prototype Migratie: Taakbeheer & Pomodoro Flow

**Van:** Freya (UX Designer)  
**Aan:** Mimir (Development)  
**Datum:** 2026-06-17  
**Status:** Ready for development  
**Opvolgt:** WO-003 (Tijdplanning)

---

## Scope

Deze Work Order mandateert de migratie van de taakbeheer- en Pomodoro-flow van het HTML/JS prototype naar de React Native (`native-app`) codebase. De MVP voor deze flow is al gespecificeerd in eerdere Work Orders (WO-001 en WO-002), maar was nog niet geconverteerd naar native componenten.

---

## Deel A — Te Migreren Pagina's

Alle onderstaande pagina's hebben een direct HTML-equivalent in `design-artifacts/E-Development/prototype/`. Die HTML bestanden dienen als de referentie voor UI, styling (Tailwind classes) en lay-out.

| UX Scenario (Referentie) | Prototype Bestand |
|-------------------------|-------------------|
| 03.1 Taak Detail | `prototype/03.1-taak-detail.html` |
| 03.3 Sessie Voorbereiding | `prototype/03.3-sessie-voorbereiding.html` |
| 03.4 Actieve Sessie | `prototype/03.4-actieve-sessie.html` |
| 03.5 Sessie Afgerond | `prototype/03.5-sessie-afgerond.html` |
| 03.6 Pauzetimer | `prototype/03.6-pauzetimer.html` |
| 05.1 Afgeronde Taken | `prototype/05.1-afgeronde-taken.html` |

---

## Deel B — Technische Migratieregels

1. **Styling & NativeWind:** Vertaal HTML/Tailwind classes 1-op-1 naar de `className` prop in React Native `<View>` en `<Text>` componenten via NativeWind. Let op `fontFamily`, deze moet verplicht inline via `style={{ fontFamily: 'Karla_...' }}` zoals gespecificeerd in de Tech Audit.
2. **Icons:** Vertaal de SVG-icoontjes uit het prototype naar Lucide React Native of Heroicons voor React Native. 
3. **State Management:** Sluit de flows aan op de reeds bestaande Zustand stores (`dataStore` en `sessionStore`).
4. **Navigatie:** Gebruik `expo-router` voor navigatie tussen de schermen. 

---

## Acceptatiecriteria

- [ ] Alle pagina's (03.1 t/m 03.6 + 05.1) uit de lijst zijn gebouwd in `app/(app)/` als `.tsx` bestanden.
- [ ] De Pomodoro timer loopt accuraat af (setInterval) in React Native.
- [ ] Overgangen tussen "Voorbereiding" -> "Actieve Sessie" -> "Pauzetimer" verlopen via `expo-router`.
- [ ] UI is visueel identiek aan het HTML-prototype.
