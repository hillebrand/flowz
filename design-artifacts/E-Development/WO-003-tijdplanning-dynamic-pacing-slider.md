# Work Order WO-003 — Tijdplanning & Dynamic Pacing Slider

**Van:** Freya (UX Designer)  
**Aan:** Mimir (Development)  
**Datum:** 2026-06-14  
**Status:** Ready for development  
**Opvolgt:** WO-002 (Pomodoro Flow & Beschikbaarheid — afgerond)

---

## Scope

Introductie van het drie-zone pacing systeem in Flowz: een nieuwe check-in stap met verticale tijdslider, een geïntegreerde shortlist (gecapped op gekozen tijd), en een uitbreiding van de beschikbaarheidsinstellingen met weekcapaciteit en datum-overrides. Tevens een globale stijlcorrectie die de app header en primaire CTA-knoppen uniformeert naar de sky-blue huisstijl.

---

## Product Context

**FlowState / Flowz** — Persoonlijke studieplannings-PWA voor Evelien (15 jaar, VWO 3).  
Kernuitbreiding: Evelien kiest dagelijks haar studietijd via een dynamisch ingekleurde slider. De planning-engine vertaalt haar werklast naar visuele kleurzones (Rood/Oranje/Groen), zodat ze direct ziet of haar tijdskeuze realistisch is — zonder dat de app de controle overneemt.

Zie voor volledige context:
- `design-artifacts/A-Product-Brief/RFC-003-tijdplanning-dynamic-pacing-slider.md`
- `design-artifacts/A-Product-Brief/project-brief.md`
- `design-artifacts/B-Trigger-Map/00-trigger-map.md`
- `design-artifacts/E-Development/WO-001-flowstate-foundation.md`
- `design-artifacts/E-Development/WO-002-pomodoro-flow-en-beschikbaarheid.md`

---

## Deel A — Nieuwe Pagina

| Pagina | Spec | Prioriteit |
|--------|------|-----------|
| 02.2 Tijdkeuze | `C-UX-Scenarios/02-check-in-flow/02.2-tijdkeuze/02.2-tijdkeuze.md` | P1 |

**Samenvatting:** Nieuwe check-in stap tussen 02.1 Energie Check-in en de shortlist. Evelien ziet een verticale slider (0–5 uur, hard maximum) met drie gekleurde zones. De thumb start op de macro-waarde van die dag. Feedback-tekst wisselt per zone (≤100ms). "verder →" is altijd actief.

Referentie-schets: `C-UX-Scenarios/02-check-in-flow/02.2-tijdkeuze/sketches/02.2-tijdkeuze-concept.png`

---

## Deel B — Uitbreidingen op Bestaande Pagina's

### Hernummering check-in flow

> ⚠️ De bestaande `02.2 Shortlist Vandaag` wordt **hernummerd naar 02.3**. Alle interne links en navigatie die verwijzen naar `02.2-shortlist-vandaag.html` dienen bijgewerkt te worden naar `02.3-shortlist-vandaag.html`.

| Pagina | Wijziging | Prioriteit |
|--------|-----------|-----------|
| **02.2 Shortlist → 02.3** | Hernummering (bestandsnaam + alle verwijzingen) | P1 |
| **02.3 Shortlist Vandaag** | Spec: `C-UX-Scenarios/02-check-in-flow/02.3-shortlist-vandaag/02.3-shortlist-vandaag.md` — zie wijzigingen hieronder | P1 |
| **04.2 Beschikbaarheid** | Spec: `C-UX-Scenarios/04-eveliens-instellingen/04.2-beschikbaarheid/04.2-beschikbaarheid.md` — zie wijzigingen hieronder | P2 |

#### 02.3 Shortlist Vandaag — wijzigingen t.o.v. WO-002

| Wijziging | Detail |
|-----------|--------|
| **Geen OPTIONEEL sectie** | De aparte "OPTIONEEL" blok (`#optional-section`) wordt verwijderd. Alle taken verschijnen in één gecombineerde, geprioriteerde lijst. |
| **Takenlijst gecapped** | De lijst toont uitsluitend taken tot het totaal van `sessionStore.selectedMinutes`. Taken die over het budget gaan worden niet getoond — tenzij de slider in de rode zone staat. |
| **Rode zone: kritieke taken altijd zichtbaar** | Als `sessionStore.selectedZone === 'red'`: alle taken met harde deadline en urgentie `'urgent'` worden altijd getoond, ook als ze over het slidertijdbudget gaan. |
| **Deficit UI banner** | Nieuwe banner boven de takenlijst, zichtbaar alleen bij rode zone. Bevat waarschuwingsicoon + tekst (zie spec). Geen sluitknop — banner verdwijnt pas na volgende check-in. |
| **Volgorde in de lijst** | 1. Urgente taken (rode linkerrand, `urgency === 'urgent'`); 2. Overige taken op deadline-urgentie. Volgorde is niet configureerbaar. |

#### 04.2 Beschikbaarheid — wijzigingen t.o.v. WO-002

| Wijziging | Detail |
|-----------|--------|
| **WEEKCAPACITEIT sectie (nieuw)** | Nieuwe kaart boven de bestaande kalenderkaart. Toont 7 dag-cellen (Ma t/m Zo) elk met een stepper (−/waarde/+). Stapgrootte: 15 min. Bereik: 0–300 min (0 = "Vrij", grijs weergegeven). Persisteert in `dataStore.settings.capacity_week` als object `{ monday: 60, tuesday: 60, ... }`. |
| **DATUM-OVERRIDES kalender (uitgebreid)** | De bestaande "blokkeer datum" kalender wordt uitgebreid: een tik op een datum opent een **bottom sheet** met een stepper (0–300 min, stap 15) + "Blokkeren" shortcut-knop (→ stel 0 in). Opslaan persisteert in `dataStore.settings.capacity_overrides` als `{ "2026-06-20": 30, "2026-07-01": 0, ... }`. |
| **Sectietitel hernoemd** | Bestaande sectietitel "Eenmalige geblokkeerde datums" → "Datum-overrides". |
| **Kalender kleurcodering** | Grijs = 0 min (geblokkeerd); paars = custom override actief; ring = vandaag; standaard = weekcapaciteit van toepassing. |
| **Backwards compatibility** | Bestaande `blocked_days.recurring` en `blocked_days.specific` data migreren: recurring weekdagen met waarde in blocked_days → `capacity_week[dag] = 0`; specific dates → `capacity_overrides[datum] = 0`. |

---

## Deel C — Nieuwe Business Logic

### Planning Engine (`@/lib/planning/`)

De map `lib/` bestaat nog niet. Maak aan en exporteer via een barrel (`@/lib/planning`).

| Module | Bestand | Functie |
|--------|---------|---------|
| Zone calculator | `@/lib/planning/zoneCalculator.ts` | `calculateZones(tasks, settings, date): ZoneThresholds` — berekent `thresholdRed` (min) en `thresholdGreen` (min) op basis van taken met harde deadlines + meso-overrides voor de komende dagen |
| Capacity resolver | `@/lib/planning/capacityResolver.ts` | `getCapacityForDate(settings, date): number` — retourneert effectieve minuten voor een datum: capacity_overrides[datum] ?? capacity_week[weekdag] ?? 60 (fallback) |
| Task list builder | `@/lib/planning/taskListBuilder.ts` | `buildDailyList(tasks, selectedMinutes, zone): Task[]` — retourneert de gecapte takenlijst voor 02.3; bij rode zone worden urgente taken altijd toegevoegd ook als ze over het budget gaan |
| Green zone text | `@/lib/planning/feedbackText.ts` | `getSliderFeedback(zone: 'red'\|'orange'\|'green', thresholdRed: number): string` — retourneert de juiste feedback-string voor de huidige zone |

### `DEFAULT_SETTINGS` uitbreiding in `dataStore.ts`

```ts
// Toe te voegen aan DEFAULT_SETTINGS:
capacity_week: {
  monday: 60,
  tuesday: 60,
  wednesday: 60,
  thursday: 60,
  friday: 60,
  saturday: 120,
  sunday: 0,   // standaard geblokkeerd
},
capacity_overrides: {} as Record<string, number>, // dateStr → minuten
```

### `sessionStore` uitbreiding

```ts
// Toe te voegen aan sessionStore state:
selectedMinutes: number;   // gekozen tijd op de slider (in minuten)
selectedZone: 'red' | 'orange' | 'green'; // zone op moment van check-in bevestiging
```

---

## Navigatiestructuur (WO-003 uitbreidingen)

```
02.1 Energie Check-in
  └── verder → 02.2 Tijdkeuze (NIEUW)
        └── verder → 02.3 Shortlist Vandaag (hernummerd van 02.2)
              └── tik taakkaart → 03.1 Taak Detail
                    └── ▶ Start session → 03.3 ... (WO-002 flow, ongewijzigd)

03.5 Sessie Afgerond / 03.6 Pauzetimer
  └── Back to today → 02.3 Shortlist (was 02.2 — links bijwerken)

04.1 Instellingen
  └── Beheer beschikbaarheid → 04.2 Beschikbaarheid (uitgebreid)
        └── ← Terug → 04.1 Instellingen
```

---

## Technische Beslissingen & Aandachtspunten

| Beslissing | Detail |
|-----------|--------|
| Slider maximum | Hard gecodeerd op 300 minuten (5 uur) — niet instelbaar |
| Slider bibliotheek | Gebruik `@miblanchard/react-native-slider` of een NativeWind-compatible alternatief; track moet segmenteerbaar zijn voor drie kleuren; raadpleeg Expo SDK 56 docs voor compatibiliteit |
| Zone-berekening timing | `calculateZones()` aanroepen bij mount van 02.2; resultaat opslaan in component state; niet in store (dagelijks vers berekend) |
| Feedback-tekst animatie | Zone-overgang bij slider drag: tekst wisselt binnen ≤100ms; gebruik `react-native-reanimated` voor smooth transitie |
| `selectedMinutes` persistentie | Opslaan in `sessionStore` bij drukken op "verder →" in 02.2; beschikbaar in 02.3 en `taskListBuilder` |
| Meso-lookahead | `zoneCalculator` kijkt maximaal 14 dagen vooruit voor meso-overrides; sliders van toekomstige dagen met lage capaciteit verhogen de drempelwaarden vandaag |
| Backwards compatibility | Bestaande `blocked_days` data migreren naar `capacity_week` / `capacity_overrides` bij eerste app-start na update (eenmalige migratie in `dataStore.fetchData`) |
| `fontFamily` | Alle nieuwe componenten gebruiken `style={{ fontFamily: 'Karla_...' }}` — nooit via `className` |
| Relatieve imports verboden | Gebruik uitsluitend `@/lib/planning`, `@/stores/sessionStore`, etc. |
| Prototype als referentie | `design-artifacts/E-Development/prototype/` — vergelijk edge cases (vrije dag, lege lijst, alles gedaan) |

---

## Acceptatiecriteria

### P1 — Planning Engine

- [ ] `getCapacityForDate(settings, date)` retourneert `capacity_overrides[date]` als aanwezig, anders `capacity_week[weekdag]`, anders 60 min als fallback
- [ ] `calculateZones()` retourneert `thresholdRed` exact gelijk aan de som van minimaal vereiste sessieduren voor harde deadlines die vandaag afgedekt moeten worden
- [ ] `buildDailyList()` geeft nooit meer taken terug dan `selectedMinutes` toelaat, tenzij urgente taken in rode zone
- [ ] Planning engine draait in strict TypeScript — geen `any`

### P1 — 02.2 Tijdkeuze

- [ ] Slider opent standaard op macro-waarde van vandaag (`getCapacityForDate(settings, today)`)
- [ ] Slider-thumb beweegt **nooit automatisch** — alleen door gebruikersinteractie
- [ ] Kleurzones op de track zijn correct verdeeld op basis van `ZoneThresholds`
- [ ] Tijdsweergave (getal + eenheid) zweeft rechts van de thumb en heeft de kleur van de huidige zone
- [ ] Feedback-tekst wisselt binnen ≤100ms bij passeren van een zonegrens
- [ ] "verder →" is altijd actief, ook in rode zone — geen blokkering
- [ ] `sessionStore.selectedMinutes` en `sessionStore.selectedZone` worden opgeslagen bij tik op "verder →"

### P1 — 02.3 Shortlist Vandaag

- [ ] Geen "OPTIONEEL" sectie zichtbaar
- [ ] Totale tijdsduur van getoonde taken overschrijdt `selectedMinutes` niet (tenzij rode zone + urgente taken)
- [ ] Deficit UI banner zichtbaar als `selectedZone === 'red'`; banner afwezig bij oranje of groene zone
- [ ] 100% van de check-ins staat doorstroming naar het dashboard toe — geen blokkering
- [ ] Alle bestaande states (vrije dag, leeg, alles gedaan, bijna klaar) functioneren correct

### P2 — 04.2 Beschikbaarheid

- [ ] Weekcapaciteit stepper slaat op bij elke wijziging; persisteert in `capacity_week`
- [ ] Dagwaarde 0 toont "Vrij" (grijs); hogere waarden tonen "X min"
- [ ] Bottom sheet opent bij tik op toekomstige datum; stepper en "Blokkeren" werken correct
- [ ] Datum-overrides persisteren in `capacity_overrides`; kalender toont correcte kleurcodering
- [ ] Backwards compatibility: bestaande `blocked_days` data is correct gemigreerd na update

