---
design_intent: D
design_status: not-started
---

# 03: Evelien's Taakbeheer & Voortgang

**Project:** EveliensTaakjesApp (FlowState)
**Aangemaakt:** 2026-05-23
**Methode:** Whiteport Design Studio (WDS)

---

## Transactie (Q1)

**Wat dit scenario behandelt:**
Een bestaande taak bijstellen en controleren of Evelien nog op schema zit voor alle aankomende deadlines.

---

## Businessdoel (Q2)

**Doel:** 100% van taken vóór deadline ingeleverd
**Doelstelling:** Accurate data → betrouwbare capaciteitsplanning → nul te-laat-meldingen

---

## Gebruiker & Situatie (Q3)

**Persona:** Evelien de Scholiere (Primair 🎓)
**Situatie:** Evelien is aan het studeren, merkt dat een taak veel groter is dan gedacht, en wil de effort aanpassen voordat het te laat is.

---

## Drijvende Krachten (Q4)

**Hoop:** Snel kunnen bijstellen en direct zien dat ze nog op schema zit.

**Vrees:** Te laat ontdekken dat de taak niet meer haalbaar is voor de deadline.

---

## Apparaat & Startpunt (Q5 + Q6)

**Apparaat:** Mobiel (PWA) — eigen telefoon
**Startpunt:** Ze tikt op een taak in haar shortlist of takenoverzicht en opent de detail-view.

---

## Beste Uitkomst (Q7)

**Gebruikerssucces:**
Taak bijgesteld met de juiste effort, voortgangsinzicht bevestigt dat ze nog op schema zit voor alle deadlines.

**Businesssucces:**
Accurate data → betrouwbare capaciteitsplanning → hogere kans op 100% op tijd ingeleverd.

---

## Kortste Route (Q8)

1. **Taak detail / bewerken** — effort, deadline of complexiteit aanpassen
2. **Voortgangsinzicht** — updated capaciteitsplanning toont of schema nog haalbaar is ✓

---

## Trigger Map Verbindingen

**Persona:** Evelien de Scholiere (Primair 🎓)

**Drijvende krachten aangesproken:**
- ✅ **Want:** Rust — het gevoel dat ze niets vergeten heeft en alles bewaakt is
- ❌ **Fear:** 's Avonds ontdekken dat een taak veel groter is dan gedacht
- ❌ **Fear:** Een opdracht te laat inleveren

**Businessdoel:** 100% van taken vóór deadline ingeleverd

---

## Scenario Stappen

| Stap | Map | Doel | Uitstapactie |
|------|-----|------|-------------|
| 03.1 | `03.1-taak-detail-bewerken/` | Taak details inzien en effort/deadline aanpassen | Tikt op "Opslaan" → voortgangsinzicht |
| 03.2 | `03.2-voortgangsinzicht/` | Controleren of schema nog haalbaar is | Scenario geslaagd ✓ |
