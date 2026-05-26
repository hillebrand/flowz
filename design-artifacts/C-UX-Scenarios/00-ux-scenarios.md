# UX Scenarios: FlowState (EveliensTaakjesApp)

> Scenario outlines die Trigger Map personas verbinden met concrete gebruikersreizen

**Aangemaakt:** 2026-05-23
**Auteur:** Evelien met GitHub Copilot (WDS Scenario Facilitator)
**Methode:** Whiteport Design Studio (WDS)

---

## Scenario Samenvatting

| ID | Scenario | Persona | Pages | Prioriteit | Status |
|----|----------|---------|-------|------------|--------|
| 01 | Evelien's Eerste Setup | Evelien de Scholiere | 5 | ⭐ P1 | ✅ Uitgewerkt |
| 02 | Evelien's Dagelijkse Routine | Evelien de Scholiere | 2 | ⭐ P1 | ✅ Uitgewerkt |
| 03 | Evelien's Taakbeheer & Voortgang | Evelien de Scholiere | 2 | P2 | ✅ Uitgewerkt |
| 04 | Evelien's Instellingen | Evelien de Scholiere | 1 | P3 | ✅ Uitgewerkt |

---

## Scenario's

### [01: Evelien's Eerste Setup](01-eveliens-eerste-setup/01-eveliens-eerste-setup.md)
**Persona:** Evelien de Scholiere — Fear: een opdracht compleet vergeten
**Pages:** Welkomst / Eerste start, Magister-sync, Importreview, Taak aanmaken, Takenoverzicht
**Gebruikerswaarde:** Alle taken staan in FlowState, nul blinde vlekken, klaar om te plannen
**Businesswaarde:** Gevulde database → planningsalgoritme kan direct een zinvolle shortlist samenstellen

---

### [02: Evelien's Dagelijkse Routine](02-eveliens-dagelijkse-routine/02-eveliens-dagelijkse-routine.md)
**Persona:** Evelien de Scholiere — Want: gevoel van "vandaag klaar"
**Pages:** Energie Check-in, Shortlist / Vandaag
**Gebruikerswaarde:** Direct startsignaal, shortlist klaar na check-in, geen keuzestress
**Businesswaarde:** Dagelijks gebruik = gewoontevorming = kern-KPI bereikt

---

### [03: Evelien's Taakbeheer & Voortgang](03-eveliens-taakbeheer-en-voortgang/03-eveliens-taakbeheer-en-voortgang.md)
**Persona:** Evelien de Scholiere — Fear: 's avonds verrast door taakgrootte
**Pages:** Taak detail / bewerken, Voortgangsinzicht
**Gebruikerswaarde:** Taak bijgesteld, capaciteitsplanning bevestigt dat ze op schema zit
**Businesswaarde:** Accurate data → betrouwbare planning → hogere kans op 100% op tijd

---

### [04: Evelien's Instellingen](04-eveliens-instellingen/04-eveliens-instellingen.md)
**Persona:** Evelien de Scholiere — Want: app die past bij haar ritme
**Pages:** Instellingen
**Gebruikerswaarde:** App voelt persoonlijker en past bij haar dagelijkse studieritme
**Businesswaarde:** Hogere retentie door personalisatie → gewoontevorming

---

## Pagina Coverage Matrix

| Pagina | Scenario | Rol in de flow |
|--------|----------|----------------|
| Welkomst / Eerste start | 01 | PWA eerste keer openen, Magister-koppeling starten |
| Magister-sync | 01 | App haalt huiswerk op uit Magister |
| Importreview | 01 | Items reviewen, relevante taken selecteren |
| Taak aanmaken | 01 | Taak verrijken met sessies, complexiteit, benodigdheden |
| Takenoverzicht | 01 | Alle taken bevestigd — nul blinde vlekken |
| Energie Check-in | 02 | Dagelijks energieniveau invullen |
| Shortlist / Vandaag | 02 | 3 aanbevolen taken + urgentie-escalatie-indicator |
| Taak detail / bewerken | 03 | Effort, deadline of complexiteit aanpassen |
| Voortgangsinzicht | 03 | Capaciteitsplanning — ben je nog op schema? |
| Instellingen | 04 | Shortlist-grootte en voorkeuren instellen |

**Coverage: 10/10 pagina's toegewezen aan scenario's**

---

## Architectuurbeslissing

**FlowState = PWA** — responsive webapplicatie, installeerbaar op mobiel (eigen telefoon) en bruikbaar op desktop. Geen native app.

---

## Volgende Fase

Deze scenario-outlines voeden **Phase 4: UX Design** waar elke pagina krijgt:
- Gedetailleerde pagina-specificaties
- Wireframe schetsen
- Component definities
- Interactie details

---

_Gegenereerd met het Whiteport Design Studio framework_
