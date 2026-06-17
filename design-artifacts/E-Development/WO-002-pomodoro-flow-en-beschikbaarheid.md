# Work Order WO-002 — Pomodoro Flow & Beschikbaarheid

**Van:** Freya (UX Designer)  
**Aan:** Mimir (Development)  
**Datum:** 2026-05-25  
**Status:** Ready for development  
**Opvolgt:** WO-001 (FlowState Foundation — afgerond)

---

## Scope

Uitbreiding van de FlowState prototype met de volledige Pomodoro studiesessie-flow (03.3–03.6), de beschikbaarheidspagina (04.2), en een reeks uitbreidingen op bestaande WO-001 pagina's. Alle UX specs zijn ontworpen door Freya; het prototype-equivalent is al aanwezig als referentie-implementatie.

---

## Product Context

**FlowState** — Persoonlijke studieplannings-PWA voor Evelien (15 jaar, VWO 3).  
Kernuitbreiding: na het kiezen van een taak op de shortlist kan Evelien nu een volledige Pomodoro-sessie doorlopen — van voorbereiding tot timer, beloning en pauze.

Zie voor volledig context:
- `design-artifacts/A-Product-Brief/product-brief.md`
- `design-artifacts/B-Trigger-Map/00-trigger-map.md`
- `design-artifacts/E-Development/WO-001-flowstate-foundation.md`

---

## Deel A — Nieuwe Pagina's

### Pomodoro Sessie Flow

Deze vier pagina's vormen een aaneengesloten flow en moeten als geheel gebouwd worden.

| Pagina | Spec | Prioriteit |
|--------|------|-----------|
| 03.3 Sessie Voorbereiding | `C-UX-Scenarios/03-eveliens-taakbeheer-en-voortgang/03.3-sessie-voorbereiding/03.3-sessie-voorbereiding.md` | P1 |
| 03.4 Actieve Sessie | `C-UX-Scenarios/03-eveliens-taakbeheer-en-voortgang/03.4-actieve-sessie/03.4-actieve-sessie.md` | P1 |
| 03.5 Sessie Afgerond | `C-UX-Scenarios/03-eveliens-taakbeheer-en-voortgang/03.5-sessie-afgerond/03.5-sessie-afgerond.md` | P1 |
| 03.6 Pauzetimer | `C-UX-Scenarios/03-eveliens-taakbeheer-en-voortgang/03.6-pauzetimer/03.6-pauzetimer.md` | P1 |

### Beschikbaarheid

| Pagina | Spec | Prioriteit |
|--------|------|-----------|
| 04.2 Beschikbaarheid | `C-UX-Scenarios/04-eveliens-instellingen/04.2-beschikbaarheid/04.2-beschikbaarheid.md` | P2 |

---

## Deel B — Uitbreidingen op Bestaande Pagina's

De volgende wijzigingen zijn toevoegingen op pagina's gebouwd in WO-001.

| Pagina | Wijziging | Prioriteit |
|--------|-----------|-----------|
| 01.4 Taak Aanmaken | Voeg **description textarea** toe — vrije tekst voor aantekeningen / beschrijving van de taak | P1 |
| 01.5 Takenoverzicht | Voeg **weergave toggle** toe (lijstweergave ↔ kalenderweergave); kalenderweergave toont taken per dag op een maandgrid; actieve dag gemarkeerd | P2 |
| 02.2 Shortlist Vandaag | Voeg **capaciteitsdruk banner** toe — verschijnt als taken té weinig beschikbare studiedagen hebben; tekst uit `FS.getCapacityWarning()` | P1 |
| 03.1 Taak Detail | Voeg **description veld** toe (lees/schrijf); voeg **"▶ Start session" knop** toe die naar 03.3 navigeert | P1 |
| 04.1 Instellingen | Voeg **pauzetijd instelling** toe (dropdown, minuten); voeg **"Manage blocked days →" link** toe naar 04.2 | P2 |

---

## Navigatiestructuur (WO-002 uitbreidingen)

```
03.1 Taak Detail
  └── ▶ Start session → 03.3 Sessie Voorbereiding
        └── Let's go → 03.4 Actieve Sessie
              └── Timer op 0 / Finish early → 03.5 Sessie Afgerond
                    ├── Take a break → 03.6 Pauzetimer
                    │     └── Skip break / Timer op 0 → 02.2 Shortlist
                    └── Back to today → 02.2 Shortlist

04.1 Instellingen
  └── Manage blocked days → 04.2 Beschikbaarheid
        └── ← Back → 04.1 Instellingen
```

---

## Technische Beslissingen & Aandachtspunten

| Beslissing | Detail |
|-----------|--------|
| Sessie state | Gebruik `FS.setActiveSession(taskId, sessionNumber)` / `FS.getActiveSession()` / `FS.clearActiveSession()` voor sessie overdracht tussen pagina's |
| Timer implementatie | Gebruik `setInterval` (1s tick); sla starttijd op in sessionStorage om timer-waarde te herberekenen bij tab-wisseling of terugkeer op de pagina |
| Sessieduur | Haal op uit `data.settings.session_length_min`; standaard 25 min |
| Pauzetijd | Haal op uit `data.settings.break_length_min`; standaard 5 min |
| Sessie opslaan | Na afronden: increment `task.sessions_done` en append datum aan `data.study_days` array; roep `FS.saveData()` aan |
| Beschikbaarheidsdagen | Opslaan als `data.settings.blocked_days.recurring` (array van weekdagnamen) en `data.settings.blocked_days.specific` (array van ISO-datumstrings) |
| Capaciteitsdruk | `FS.getCapacityWarning(tasks, settings)` retourneert een string of `null`; toon alleen als niet-null |
| Screen wake lock | Overweeg `navigator.wakeLock.request('screen')` op 03.4 zodat het scherm actief blijft tijdens de sessie |
| Bestaande prototype | De HTML-bestanden in `design-artifacts/E-Development/prototype/` zijn de referentie-implementatie — vergelijk implementatie met het prototype voor edge cases |

---

## Acceptatiecriteria

### Pomodoro Flow (P1)
- [ ] "▶ Start session" op 03.1 opent 03.3 met correcte taaknaam en sessienummer
- [ ] 03.3 toont benodigdheden als de taak `materials` heeft; sectie verborgen als leeg
- [ ] 03.4 toont een aftellende timer op basis van `settings.session_length_min`
- [ ] 03.4 toont de eerste niet-afgeronde subtaak; tik markeert subtaak als done en toont volgende
- [ ] "Finish early" navigeert naar 03.5
- [ ] Timer op 0 navigeert automatisch naar 03.5
- [ ] 03.5 toont bijgewerkte progress dots inclusief zojuist voltooide sessie
- [ ] 03.5 "Task complete!" variant verschijnt als alle sessies afgerond zijn
- [ ] "Take a break" navigeert naar 03.6 met `settings.break_length_min` als startwaarde
- [ ] 03.6 "Skip break" en timer op 0 navigeren beide naar 02.2
- [ ] Na afronden sessie: `sessions_done` opgehoogd en studiedag opgeslagen persistent

### Beschikbaarheid (P2)
- [ ] 04.2 toegankelijk via link in 04.1
- [ ] Weekdag toggles laden bestaande `blocked_days.recurring` waarden; wijzigingen persistent opgeslagen
- [ ] Kalender toont huidige maand; tik op dag blokkeert/deblokkeert; opgeslagen in `blocked_days.specific`
- [ ] Maandnavigatie werkt (max. 6 maanden vooruit; geen verleden)
- [ ] "Clear all specific dates" met bevestiging verwijdert alle eenmalige datums
- [ ] Planningsalgoritme (`FS.getCapacityWarning`) houdt rekening met bijgewerkte geblokkeerde dagen

### Uitbreidingen bestaande pagina's (P1/P2)
- [ ] 01.4: description veld opgeslagen in `task.description`
- [ ] 01.5: weergave toggle schakelt tussen lijst en kalender; kalender toont taken per dag
- [ ] 02.2: capaciteitsdruk banner verschijnt alleen als `getCapacityWarning()` niet-null is
- [ ] 03.1: description veld laadt en slaat `task.description` op; "▶ Start session" navigeert correct
- [ ] 04.1: pauzetijd opgeslagen als `settings.break_length_min`; beschikbaarheidslink werkt
