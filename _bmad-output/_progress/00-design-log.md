# Design Log — FlowState (EveliensTaakjesApp)

---

## Current

### Phase 5: Agentic Development — WO-001 gebouwd en geverifieerd ✅

**Status:** Alle 15 prototype-pagina's gebouwd. WO-001 acceptatiecriteria geverifieerd (2026-05-25). Service worker toegevoegd — app is installeerbaar als PWA. WO-002 nog aanmaken voor nieuwe pagina's (03.3–03.6, 04.2).

**Volgende stap:** WO-002 aanmaken (Pomodoro-flow + beschikbaarheid), of doorgaan naar Phase 6/7.

---

## Phase 2: Trigger Mapping — Workshops voltooid, documenten nog niet gegenereerd

**Status:** Alle 4 workshops doorlopen (Workshop modus, één tegelijk). Feature Impact Analyse nog niet gedaan. Trigger Map documenten (trigger-map.md, persona's, mermaid) nog niet gegenereerd.

**Volgende stap:** Feature Impact Analyse (optioneel) of direct Trigger Map documenten genereren.

---

## Workshop Resultaten

### Visie & Doelstellingen

**Visie:** *De app waarmee huiswerk maken volledig onder controle is — je weet altijd wat je moet doen, wanneer, en of je op schema zit.*

**Doelstellingen (geprioriteerd):**
1. Alle bekende huiswerk- en leertaken worden ingevoerd in de app — 100% van wat er is *(voorwaarde voor alles)*
2. 100% van de opdrachten wordt op tijd ingeleverd — van bijna allemaal te laat naar nul gemiste deadlines, zichtbaar binnen 2 schoolweken na dagelijks gebruik
3. FlowState wordt op minimaal 5 van de 7 schooldagen per week geopend, binnen 4 weken na eerste gebruik
4. Het aantal vergeetmomenten op school daalt van ~5x per week naar maximaal 1x per week, binnen 4 weken na dagelijks gebruik

---

### Doelgroep & Persona

**Primaire (en enige) doelgroep:** Evelien

**Persona: Evelien**
*15 jaar, VWO 3, middelbare scholier*

Evelien studeert na school — in de kapel op school of thuis aan haar bureau — en werkt in Pomodoro-sessies van ongeveer een uur. Ze is gemotiveerd om goede cijfers te halen en over te gaan naar VWO 4, maar loopt steeds vast op twee drempels: de motivatie om überhaupt te beginnen, en zodra ze begint — uitzoeken waar te starten.

Ze vertrouwt nu op de Magister-app, maar die biedt geen bruikbaar overzicht: opdrachten worden als losse regels getoond met afgekapte inhoud, er is geen prioritering mogelijk zonder elke taak individueel te openen. Magister toont *wat* er is, maar helpt niet beslissen *wat eerst*. Het gevolg: opdrachten die te laat worden ingeleverd, en een achterstandsgevoel dat pas voelbaar is als het al te laat is.

---

### Drijvende Krachten

**Positieve drijfveren:**
1. Het gevoel dat al het geplande huiswerk voor die dag af is
2. Een goed cijfer halen na goede voorbereiding
3. Rust — het gevoel dat ze niets vergeten heeft, ook op school
4. Op een lage-energiedag tóch iets nuttigs hebben gedaan

**Negatieve drijfveren:**
1. 's Avonds ontdekken dat een taak veel groter is dan gedacht en niet meer haalbaar
2. Voor de klas moeten bekennen dat je een huiswerkopdracht niet hebt gemaakt
3. Een handmatige planning die niet meer klopt en te veel werk is om aan te passen
4. Het gevoel dat de berg huiswerk steeds groter wordt en nooit meer wegwerkt
5. Een proefwerk of opdracht compleet vergeten
6. Een opdracht te laat inleveren met alle gevolgen van dien

---

### Prioritering Drijvende Krachten

**🔴 Must address:**
1. Rust — het gevoel dat ze niets vergeten heeft *(positief)*
2. Een proefwerk of opdracht compleet vergeten *(vermijden)*
3. Een opdracht te laat inleveren *(vermijden)*

**🟡 Should address:**
4. Het gevoel dat al het geplande huiswerk voor die dag af is *(positief)*
5. Het gevoel dat de berg steeds groter wordt *(vermijden)*

**🟢 Could address:**
6. 's Avonds ontdekken dat een taak groter is dan gedacht *(vermijden)*
7. Een handmatige planning die niet meer klopt *(vermijden)*
8. Op een lage-energiedag tóch iets nuttigs doen *(positief)*
9. Voor de klas moeten bekennen dat je het niet hebt gemaakt *(vermijden)*
10. Een goed cijfer halen na goede voorbereiding *(positief)*

---

### Ontwerp Focus Statement

**Primaire groep:** Evelien — VWO 3, 15 jaar

**Must address:**
- Geef haar rust: altijd weten dat niets vergeten is
- Voorkom vergeten proefwerken en opdrachten
- Voorkom te laat inleveren

**Should address:**
- Geef het gevoel van "vandaag klaar"
- Voorkom het gevoel van een steeds grotere berg

**Could address (als tijd het toelaat):**
- Vroeg signaleren dat een taak groter is dan gedacht
- Handmatige planning overbodig maken
- Lage-energiedagen zinvol invullen
- Sociale schaamte voorkomen
- Goede cijfers zichtbaar koppelen aan voorbereiding

---

---

### 2026-05-23 — Phase 2: Trigger Map Compleet

**Agent:** Saga (Trigger Mapping — Documentation Synthesis pad)
**Persona's:** 1 (Evelien de Scholiere — primair)
**Business Goals:** 4 SMART-doelstellingen

**Artifacts aangemaakt:**
- `design-artifacts/B-Trigger-Map/00-trigger-map.md` — Visueel overzicht met Mermaid diagram en navigatie
- `design-artifacts/B-Trigger-Map/01-Business-Goals.md` — Visie, SMART-doelstellingen en flywheel
- `design-artifacts/B-Trigger-Map/personas/02-Evelien-de-Scholiere.md` — Primaire persona met 6 drijvende krachten (3 wants + 3 fears) elk met FlowState Belofte/Antwoord
- `design-artifacts/B-Trigger-Map/05-Key-Insights.md` — Strategische implicaties, ontwerprregels, emotionele transformatiedoelen

**Samenvatting:** Eén primaire doelgroep (Evelien, 15, VWO 3) volledig uitgewerkt. Kernprobleem: niet studeren maar beginnen — de cognitieve drempel vóór de studiesessie. Drie strategische ontwerprregels: elimineer keuzestress via beperkte shortlist, maak urgentie vroeg zichtbaar, ontwerp rust als eindtoestand (niet "klaar zijn" maar "niets vergeten"). Feature Impact Analyse bewust overgeslagen (niet nodig bij één doelgroep).

**Volgende stap:** Phase 3 — UX Scenarios (Freya)

---

### 2026-05-23 — Phase 3: UX Scenarios Compleet

**Agent:** WDS Scenario Facilitator (GitHub Copilot)
**Scenario's:** 4 scenario's met 10 pagina's totale coverage
**Kwaliteit:** Excellent (alle scenario's ≥ 6/7 op alle dimensies)

**Artifacts aangemaakt:**
- `design-artifacts/C-UX-Scenarios/00-ux-scenarios.md` — Scenario-index met coverage matrix
- `design-artifacts/C-UX-Scenarios/01-eveliens-eerste-setup/01-eveliens-eerste-setup.md` — Evelien's Eerste Setup (P1)
- `design-artifacts/C-UX-Scenarios/01-eveliens-eerste-setup/01.1-welkomst-eerste-start/01.1-welkomst-eerste-start.md` — Stap 01.1
- `design-artifacts/C-UX-Scenarios/02-eveliens-dagelijkse-routine/02-eveliens-dagelijkse-routine.md` — Evelien's Dagelijkse Routine (P1)
- `design-artifacts/C-UX-Scenarios/02-eveliens-dagelijkse-routine/02.1-energie-check-in/02.1-energie-check-in.md` — Stap 02.1
- `design-artifacts/C-UX-Scenarios/02-eveliens-dagelijkse-routine/02.2-shortlist-vandaag/02.2-shortlist-vandaag.md` — Stap 02.2
- `design-artifacts/C-UX-Scenarios/03-eveliens-taakbeheer-en-voortgang/03-eveliens-taakbeheer-en-voortgang.md` — Evelien's Taakbeheer & Voortgang (P2)
- `design-artifacts/C-UX-Scenarios/03-eveliens-taakbeheer-en-voortgang/03.1-taak-detail-bewerken/03.1-taak-detail-bewerken.md` — Stap 03.1
- `design-artifacts/C-UX-Scenarios/03-eveliens-taakbeheer-en-voortgang/03.2-voortgangsinzicht/03.2-voortgangsinzicht.md` — Stap 03.2
- `design-artifacts/C-UX-Scenarios/04-eveliens-instellingen/04-eveliens-instellingen.md` — Evelien's Instellingen (P3)
- `design-artifacts/C-UX-Scenarios/04-eveliens-instellingen/04.1-instellingen/04.1-instellingen.md` — Stap 04.1

**Samenvatting:** Vier scenario's uitgewerkt die samen alle 10 pagina's van FlowState dekken. Kernbeslissing: scenario 01 beschrijft de ideale Magister-importflow (niet MVP handmatige invoer) zodat Freya direct de gewenste eindervaring kan ontwerpen. De pagina-inventaris groeide van 8 naar 10 views door toevoeging van Magister-sync en Importreview als aparte pagina's. FlowState vastgesteld als PWA (responsive, mobiel + desktop).

**Volgende stap:** Phase 4 — UX Design (Freya), Scenario 03 volgende

---

## Design Loop Status — Phase 4

| Pagina | Scenario | Status | Datum |
|--------|----------|--------|-------|
| 02.1 Energie Check-in | 02 Dagelijkse Routine | ✅ Compleet | 2026-05-23 |
| 02.2 Shortlist / Vandaag | 02 Dagelijkse Routine | ✅ Compleet | 2026-05-23 |
| 01.1 Welkomst Eerste Start | 01 Eerste Setup | ✅ Compleet | 2026-05-23 |
| 01.2 Magister Sync | 01 Eerste Setup | ✅ Compleet | 2026-05-23 |
| 01.3 Import Review | 01 Eerste Setup | ✅ Compleet | 2026-05-23 |
| 01.4 Taak Aanmaken | 01 Eerste Setup | ✅ Compleet | 2026-05-23 |
| 01.5 Takenoverzicht | 01 Eerste Setup | ✅ Compleet | 2026-05-23 |
| 03.1 Taak Detail Bewerken | 03 Taakbeheer | ✅ Compleet | 2026-05-23 |
| 03.2 Voortgangsinzicht | 03 Taakbeheer | ✅ Compleet | 2026-05-23 |
| 04.1 Instellingen | 04 Instellingen | ✅ Compleet | 2026-05-23 |

---

## Phase 5 Build Status — WO-001

| Pagina | Scenario | Status | Datum |
|--------|----------|--------|-------|
| 01.1 Welkomst | 01 Eerste Setup | ✅ Built | 2026-05-23 |
| 01.2 Magister Sync | 01 Eerste Setup | ✅ Built | 2026-05-23 |
| 01.3 Import Review | 01 Eerste Setup | ✅ Built | 2026-05-23 |
| 01.4 Taak Aanmaken | 01 Eerste Setup | ✅ Built | 2026-05-23 |
| 01.5 Takenoverzicht | 01 Eerste Setup | ✅ Built | 2026-05-24 |
| 02.1 Energie Check-in | 02 Dagelijkse Routine | ✅ Built | 2026-05-24 |
| 02.2 Shortlist / Vandaag | 02 Dagelijkse Routine | ✅ Built | 2026-05-24 |
| 03.1 Taak Detail | 03 Taakbeheer | ✅ Built | 2026-05-24 |
| 03.2 Voortgangsinzicht | 03 Taakbeheer | ✅ Built | 2026-05-24 |
| 04.1 Instellingen | 04 Instellingen | ✅ Built | 2026-05-24 |
| 03.3 Sessie Voorbereiding | 03 Taakbeheer (WO-001 ext.) | ✅ Built | 2026-05-24 |
| 03.4 Actieve Sessie | 03 Taakbeheer (WO-001 ext.) | ✅ Built | 2026-05-24 |
| 03.5 Sessie Afgerond | 03 Taakbeheer (WO-001 ext.) | ✅ Built | 2026-05-24 |
| 03.6 Pauzetimer | 03 Taakbeheer (WO-001 ext.) | ✅ Built | 2026-05-24 |
| 04.2 Beschikbaarheid | 04 Instellingen (WO-001 ext.) | ✅ Built | 2026-05-24 |

**WO-001 Acceptatiecriteria verificatie (2026-05-25):**
- ✅ Eerste setup flow (01.1 → 01.5) werkt end-to-end
- ✅ Dagelijkse routine (02.1 → 02.2) werkt na eerste setup
- ✅ Energie-keuze beïnvloedt shortlist samenstelling (energy multiplier: high/normal/low)
- ✅ Taken afvinken in shortlist werkt persistent (saveData na elke toggle)
- ✅ Takenoverzicht toont alle taken gesorteerd per urgentie (🔴/🟡/🟢)
- ✅ Instellingen worden opgeslagen (saveData in 04.1)
- ✅ App is installeerbaar als PWA (manifest.json + sw.js toegevoegd 2026-05-25)

---

## Key Decisions

| Datum | Beslissing | Fase | Door |
|-------|-----------|------|------|
| 2026-05-23 | Scenario 01 beschrijft ideale Magister-importflow (Optie B), niet MVP handmatige invoer | Phase 3: Scenarios | Evelien + Copilot |
| 2026-05-23 | FlowState wordt een PWA — responsive, mobiel + desktop, installeerbaar via browser | Phase 3: Scenarios | Evelien |
| 2026-05-23 | Magister-sync is dagelijks terugkerend — deduplicatie: alleen nieuwe items worden aangeboden | Phase 3: Scenarios | Evelien |
| 2026-05-23 | Pagina-inventaris uitgebreid van 8 naar 10 views (+Magister-sync, +Importreview) | Phase 3: Scenarios | Evelien + Copilot |
| 2026-05-23 | "Nieuwe taak" hernoemd naar "Taak aanmaken" | Phase 3: Scenarios | Evelien |

---

## Backlog

- ~~Feature Impact Analyse (optioneel)~~ — Overgeslagen (één doelgroep, niet nodig)
- ~~Trigger Map documenten genereren~~ — Compleet (2026-05-23)
- ~~Phase 3: UX Scenarios~~ — Compleet (2026-05-23)
- ~~Phase 4: UX Design~~ — Compleet (2026-05-23) — alle 10 pagina's ontworpen
- ~~Phase 5: Agentic Development~~ — WO-001 compleet + geverifieerd (2026-05-25)
- ~~Phase 5: WO-002 aanmaken~~ — WO-002 aangemaakt (2026-05-25)
- Phase 6: Asset Generation (optioneel voor MVP)
- Phase 7: Design System (optioneel voor MVP)
