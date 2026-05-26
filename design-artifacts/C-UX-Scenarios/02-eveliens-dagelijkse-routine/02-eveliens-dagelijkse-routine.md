---
design_intent: D
design_status: not-started
---

# 02: Evelien's Dagelijkse Routine

**Project:** EveliensTaakjesApp (FlowState)
**Aangemaakt:** 2026-05-23
**Methode:** Whiteport Design Studio (WDS)

---

## Transactie (Q1)

**Wat dit scenario behandelt:**
Energie check-in invullen en de aanbevolen shortlist ontvangen — klaar om te beginnen zonder nadenken over wat ze moet oppakken.

---

## Businessdoel (Q2)

**Doel:** App 5x/week gebruikt → gewoontevorming
**Doelstelling:** Nul vergeetmomenten; dagelijks gebruik als drempelvrije gewoonte

---

## Gebruiker & Situatie (Q3)

**Persona:** Evelien de Scholiere (Primair 🎓)
**Situatie:** Evelien (15, VWO 3) is 's avonds aan haar bureau, telefoon in hand, klaar om te studeren. Ze opent FlowState zoals elke avond.

---

## Drijvende Krachten (Q4)

**Hoop:** De shortlist staat direct klaar na de check-in, ze kan meteen beginnen zonder nadenken.

**Vrees:** Dat ze op een lage-energiedag niet weet wat haalbaar is en toch te veel of te weinig oppakt.

---

## Apparaat & Startpunt (Q5 + Q6)

**Apparaat:** Mobiel (PWA) — eigen telefoon
**Startpunt:** Ze opent FlowState op haar telefoon zoals elke avond — de app vraagt meteen naar haar energie.

---

## Beste Uitkomst (Q7)

**Gebruikerssucces:**
Ze ziet een shortlist van 3 taken die perfect matchen met haar energie van vandaag — ze kan direct beginnen.

**Businesssucces:**
Dagelijks gebruik geregistreerd, energie-data voedt het algoritme voor betere planning.

---

## Kortste Route (Q8)

1. **Energie Check-in** — energieniveau invullen (hoog/middel/laag)
2. **Shortlist / Vandaag** — 3 aanbevolen taken + urgentie-escalatie-indicator ✓

---

## Trigger Map Verbindingen

**Persona:** Evelien de Scholiere (Primair 🎓)

**Drijvende krachten aangesproken:**
- ✅ **Want:** Het gevoel dat al het geplande huiswerk voor die dag af is
- ✅ **Want:** Op een lage-energiedag tóch iets nuttigs hebben gedaan
- ❌ **Fear:** Te laat inleveren door slechte planning

**Businessdoel:** App 5x/week gebruikt → gewoontevorming → nul vergeetmomenten

---

## Scenario Stappen

| Stap | Map | Doel | Uitstapactie |
|------|-----|------|-------------|
| 02.1 | `02.1-energie-check-in/` | Energieniveau invullen | Tikt op energieniveau → shortlist genereren |
| 02.2 | `02.2-shortlist-vandaag/` | 3 aanbevolen taken zien en afwerken | Scenario geslaagd ✓ |
