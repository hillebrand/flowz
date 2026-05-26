---
design_intent: D
design_status: not-started
---

# 01: Evelien's Eerste Setup

**Project:** EveliensTaakjesApp (FlowState)
**Aangemaakt:** 2026-05-23
**Methode:** Whiteport Design Studio (WDS)

---

## Transactie (Q1)

**Wat dit scenario behandelt:**
Taken overnemen uit Magister naar FlowState — Evelien importeert haar huiswerk, filtert ruis eruit, verrijkt elke taak met de benodigde data, en bevestigt dat alles staat ingevoerd.

---

## Businessdoel (Q2)

**Doel:** Nul blinde vlekken — alle relevante taken staan ingevoerd in FlowState
**Doelstelling:** Vergeetmomenten ≤1x/week; alle taken vóór deadline ingeleverd

---

## Gebruiker & Situatie (Q3)

**Persona:** Evelien de Scholiere (Primair 🎓)
**Situatie:** Evelien (15, VWO 3) komt net thuis uit school, heeft even gegeten en gedronken op de bank, en zit nu aan haar bureau klaar om te beginnen. Ze opent FlowState voor het eerst op haar telefoon.

---

## Drijvende Krachten (Q4)

**Hoop:** Meteen aan het werk kunnen — de app toont haar direct wat ze moet doen, zonder dat ze zelf een planning hoeft te maken.

**Vrees:** Dat ze eerst moet uitzoeken of de planning nog klopt voordat ze kan beginnen — de cognitieve drempel die studeren nu zo zwaar maakt.

> BEPERKING: Één zin per component. Zinsdelen, geen alinea's.

---

## Apparaat & Startpunt (Q5 + Q6)

**Apparaat:** Mobiel (eigen telefoon) — FlowState is een PWA, responsive voor mobiel en desktop, installeerbaar via de browser
**Startpunt:** Evelien opent de PWA voor het eerst op haar telefoon — de app die ze zelf heeft gebouwd. Ze tikt de URL in of heeft hem als shortcut op haar startscherm.

---

## Beste Uitkomst (Q7)

**Gebruikerssucces:**
Alle relevante Magister-taken staan correct ingevoerd in FlowState, verrijkt met sessies, complexiteit en benodigdheden — Evelien hoeft zelf niets na te denken en kan direct aan de slag.

**Businesssucces:**
De database klopt volledig — geen vergeten taken, geen duplicaten — zodat het planningsalgoritme direct een zinvolle shortlist kan samenstellen.

---

## Kortste Route (Q8)

Volledig lineair — geen aftakkingen, geen condities. Minimale stappen.

1. **Welkomst / Eerste start** — Evelien opent de PWA voor het eerst; welkomstscherm met koppeling naar Magister
2. **Magister-sync** — app verbindt met Magister en haalt alle huiswerk op
3. **Importreview** — Evelien ziet de geïmporteerde items en selecteert welke echte taken worden (filtert mededelingen en niet-relevante items eruit)
4. **Taak aanmaken** — per geselecteerde taak: titel, sessies, complexiteit, subtaken, benodigdheden invullen
5. **Takenoverzicht** — alle verrijkte taken staan klaar, nul blinde vlekken bevestigd ✓

---

## Trigger Map Verbindingen

**Persona:** Evelien de Scholiere (Primair 🎓)

**Drijvende krachten aangesproken:**
- ✅ **Want:** Rust — het gevoel dat ze niets vergeten heeft
- ❌ **Fear:** Een proefwerk of opdracht compleet vergeten

**Businessdoel:** Nul blinde vlekken — alle taken ingevoerd; vergeetmomenten ≤1x/week

---

## Scenario Stappen

Stappen worden één voor één uitgewerkt na aanmaak van het scenario. De eerste stap wordt automatisch verwerkt.

| Stap | Map | Doel | Uitstapactie |
|------|-----|------|-------------|
| 01.1 | `01.1-welkomst-eerste-start/` | Welkomstscherm zien + Magister-koppeling starten | Tikt op "Verbind met Magister" |
| 01.2 | `01.2-magister-sync/` | App haalt huiswerk op uit Magister | Sync voltooid → wordt doorgestuurd naar importreview |
| 01.3 | `01.3-importreview/` | Items reviewen en relevante taken selecteren | Tikt op "Zet om naar taken" |
| 01.4 | `01.4-taak-aanmaken/` | Elke taak verrijken met sessies, complexiteit, benodigdheden | Tikt op "Opslaan" per taak |
| 01.5 | `01.5-takenoverzicht/` | Overzicht bevestigt: alle taken staan klaar | Scenario geslaagd ✓ |

**Eerste stap** (01.1) bevat volledige entrycontext (Q3 + Q4 + Q5 + Q6).
**On-step interacties** (die de stap niet verlaten) worden gedocumenteerd als storyboard-items binnen de pagina-spec.
