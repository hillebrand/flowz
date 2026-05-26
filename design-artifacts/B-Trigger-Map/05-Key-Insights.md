# Key Insights & Strategische Implicaties

> Hoe de Trigger Map ontwerp- en ontwikkelbeslissingen stuurt

**Document:** Trigger Map — Key Insights
**Aangemaakt:** 2026-05-23
**Status:** COMPLEET

---

## De Flywheel: Rust Drijft Alles

**DE MOTOR (Prioriteit #1) — 100% op tijd ingeleverd:**
- Dit is het enige eindresultaat dat telt
- Tijdlijn: Zichtbaar binnen 2 weken na dagelijks gebruik
- Evelien levert alles op tijd in → rust → vertrouwen in het systeem → meer gebruik
- Dit doel drijft ALLE andere doelstellingen aan

**Gewoontevorming (Prioriteit #2) — Dagelijks gebruik + nul blinde vlekken:**
- Gedreven DOOR de dagelijkse energie-check-in (lage drempel, direct resultaat)
- Nul blinde vlekken + 5/7 dagen gebruik
- Tijdlijn: Eerste maand
- Focus: Het systeem wordt een vertrouwde routine, niet een verplichting

**Rust als uitkomst (Prioriteit #3) — Vergeetmomenten ≤1x/week:**
- Reëel voordeel VOOR Evelien — niet gemeten, maar gevoeld
- Vergeetmomenten dalen van ~5x/week naar ≤1x/week
- Tijdlijn: 4 weken
- **Kernvoordeel:** Evelien voelt controle — ook buiten de studiesessie

---

## Primaire Ontwikkelfocus

1. **Maak Evelien een Geweldige Planner** — Evelien is het enige profiel dat telt; als zij slaagt, slaagt FlowState
2. **Elimineer de Cognitieve Drempel** — Het probleem is niet studeren maar beginnen; de shortlist is de oplossing
3. **Rust als Eindtoestand Ontwerpen** — Niet "klaar zijn" maar "niets vergeten" — een continue toestand, geen moment
4. **Urgentie Zichtbaar Vóór de Crisis** — Evelien voelt urgentie pas als het te laat is; dat moet eerder
5. **Energie als Variabele Behandelen** — Lage energiedagen zijn normaal; het systeem moet daarmee werken, niet ertegen

---

## Kritieke Succesfactoren

- **Volledigheid van invoer:** Als niet alle taken ingevoerd zijn, werkt het systeem niet — dit is de harde voorwaarde voor alles
- **Lage drempel voor dagelijks gebruik:** De energie-check-in moet de eenvoudigste handeling van de dag zijn
- **Beperkte shortlist:** Standaard 3 taken elimineert keuzestress — dit is de kern van het product
- **Vroege urgentie-signalering:** Escalatie-indicator moet waarschuwen ruim vóór de deadline, niet ernaast
- **Vertrouwen in het systeem:** Evelien moet kunnen leunen op de app — de app is pas waardevol als ze stopt met zelf bijhouden

---

## Ontwerp Implicaties

### Inhoudsprioriteiten gebaseerd op Drijvende Krachten:

**Energie-Check-in Scherm moet:**
- Direct en simpel zijn — maximaal één vraag
- Onmiddellijk resulteren in een shortlist
- Geen uitleg nodig — de handeling is de waarde

**Shortlist moet:**
- Maximaal 3 taken tonen (configureerbaar, maar 3 als standaard)
- Laten zien waarom deze 3 (energie + deadline + prioriteit)
- Een duidelijk "klaar voor vandaag" eindtoestand hebben
- Evelien het gevoel geven dat beginnen makkelijk is

**Taakdetailscherm moet:**
- Effort-inschatting vragen bij invoer (aantal sessies)
- Deadline en prioriteit verplicht maken
- Complexiteit optioneel maar zichtbaar aanbieden
- Zo snel mogelijk ingevuld kunnen worden

**Urgentie-Indicator moet:**
- Zichtbaar zijn zonder dat Evelien ernaar hoeft te zoeken
- Vroeg genoeg waarschuwen — niet pas als de deadline morgen is
- Het verschil tonen tussen "op schema" en "risico"
- Niet angstig zijn, maar informatief — controleren, niet alarme

**Dagafsluiting / Overzicht moet:**
- Bevestigen dat de shortlist klaar is
- Rust communiceren — "alles is bewaakt"
- Toestemming geven om te stoppen
- Geen schuld bij onvolledige dag — aanpassing, geen mislukking

---

## Emotionele Transformatiedoelen

- **Van verlies naar controle:** *"Ik weet altijd precies wat er is en of ik op schema zit — ik hoef niet meer te gokken"*
- **Van drempel naar startpunt:** *"Ik open FlowState en ik weet meteen wat ik oppak — er is geen moment van 'wat nu?'"*
- **Van schuldgevoel naar keuze:** *"Op een lage-energiedag doe ik wat ik kan, en dat is genoeg — de app past zich aan"*
- **Van crisis naar vroegwaarschuwing:** *"Ik kom nooit meer op school en hoor dat er iets was dat ik niet wist"*
- **Van onzekerheid naar rust:** *"Ik kan 's avonds stoppen met studeren zonder het gevoel dat ik iets vergeet"*

---

## Ontwerp Focus Statement

**FlowState transformeert Evelien van een scholier die reageert op urgentie naar een scholier die altijd weet wat er is — als een luchtverkeersleider die het systeem bewaakt, niet als een brandweerman die branden blust.**

**Primaire Ontwerpdoelgroep:** Evelien (VWO 3-scholier, 15 jaar)

**Must Address (Kritiek voor Succes):**
1. Proefwerk of opdracht vergeten → Alle taken in app + urgentie-escalatie vóór de crisis
2. Te laat inleveren → Vooruitkijkende capaciteitsplanning + vroege waarschuwing
3. 's Avonds verrast door omvang taak → Effort-inschatting bij invoer + sessiespreiding
4. Geen startsignaal → Beperkte shortlist direct na energie-check-in
5. Rust → Dagafsluiting die bevestigt: "alles is bewaakt"

**Should Address (Ondersteunend):**
1. Lage energiedagen → Energie-check-in matcht taakinspanning
2. Keuzestress bij lange lijst → Shortlist verbergt de rest — slechts 3 taken zichtbaar
3. Voortgangsonzekerheid → Capaciteitsplanning toont of ze op schema zit
4. Motivatiekloof → Gamification-laag (fase 2, niet blokkerend)
5. Handmatige invoer → Magister-koppeling (fase 2, nice-to-have)

---

## Ontwikkelfasen

### **Eerste Oplevering: FlowState MVP**
Focus op het elimineren van de cognitieve drempel en het bieden van rust:
- **Taakinvoer** — Deadline, prioriteit, effort (aantal sessies), complexiteit
- **Energie-check-in** — Dagelijkse vraag bij het openen van de app
- **Shortlist-generator** — 3 taken geselecteerd op energie + deadline + prioriteit
- **Urgentie-escalatie indicator** — Visuele waarschuwing als een deadline in gevaar komt
- **Capaciteitsplanning op de achtergrond** — Is ze op schema voor alle komende deadlines?
- **Sessiespreiding-algoritme** — Grote taken automatisch verdeeld over meerdere dagen
- **Dagafsluiting** — Bevestiging dat de shortlist klaar is

### **Toekomstige Fasen: Extra Lagen**
- **Fase 2:** Gamification / beloningssysteem — extra motivatielaag
- **Fase 3:** Magister-koppeling — automatische taakinvoer vanuit schoolsysteem
- **Fase 4:** Statistieken — inzicht in studeertempo en voortgang over tijd
- **Fase 5:** Meerdere gebruikers — uitbreiding naar klasgenoot en zusje (als gevraagd)

---

## Gerelateerde Documenten

- **[00-trigger-map.md](00-trigger-map.md)** — Visueel overzicht en navigatie
- **[01-Business-Goals.md](01-Business-Goals.md)** — Doelstellingen en metrieken
- **[personas/02-Evelien-de-Scholiere.md](personas/02-Evelien-de-Scholiere.md)** — Primaire persona

---

_Terug naar [Trigger Map](00-trigger-map.md)_
