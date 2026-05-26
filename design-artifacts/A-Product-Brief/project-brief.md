# Product Brief — FlowState (EveliensTaakjesApp)

**Project:** EveliensTaakjesApp
**App naam:** FlowState
**Status:** In progress
**Laatste update:** 2026-05-20

---

## Visie

Bouw een slimme planningsapp voor studenten die uitstelgedrag aanpakt door het denkwerk volledig uit handen te nemen — de app combineert deadline, prioriteit, sessiespreiding en dagelijkse energie tot één concreet actieplan per studiesessie, zodat je nooit meer hoeft te puzzelen over wat je oppakt.

**Kerngedachten uit de ontdekkingsgesprekken:**
- Het probleem zit niet in het studeren zelf, maar in de cognitieve drempel *ervóór* — uitzoeken wat je gaat doen is al genoeg om te gaan uitstellen
- De energie-check-in is de slimme differentiator: hoge energie → complexe taken, lage energie → eenvoudigere taken
- Het planningsalgoritme combineert vier variabelen: deadline, prioriteit, sessiespreiding (taken worden opgeknipt over meerdere sessies) en dagelijks energieniveau
- Gamification (beloningssysteem via de winkel) geeft extra motivatie
- Magister-koppeling (mogelijk) elimineert handmatige taakinvoer vanuit de school

---

## Positionering

**Positionering Statement:**
Voor studenten zoals Evelien en haar directe omgeving die hun taken bijhouden maar steeds vastlopen op "wat pak ik nú op?", is FlowState een slimme studieplanningsapp die actief adviseert welke taak je het beste kunt doen op basis van je energie, deadlines, prioriteit en sessiespreiding. Anders dan passieve to-do tools zoals Todoist of een schoolagenda, toont FlowState ook of je op schema zit of in tijdsnood dreigt te komen — en maakt studeren leuker met gamification.

**Componenten:**

- **Doelgroep:** Middelbare scholieren / studenten (Evelien + kleine kring: klasgenoot, zusje)
- **Behoefte:** Weten wat je nú moet oppakken zonder zelf te hoeven nadenken, en zien of je nog op schema zit
- **Productcategorie:** Persoonlijke studieplanningsapp
- **Kernvoordeel:** Actief advies + voortgangsinzicht in plaats van passief lijstbeheer
- **Alternatieven:** Todoist, schoolagenda, Google Tasks, Notion, papieren planner
- **Differentiator:** Combineert energieniveau + deadline + prioriteit + sessiespreiding tot één concreet advies per sessie, plus gamification en voortgangswaarschuwing

**Strategische rationale:**
Dit is een persoonlijk hulpmiddel, niet een commercieel product — de positionering hoeft dus geen markt te overtuigen, maar definieert wél de scope en keuzes. De focus op actief advies en voortgangsinzicht onderscheidt FlowState fundamenteel van elke bestaande tool die Evelien al kent.

---

## Doelgebruikers

**Primaire gebruiker:** Evelien — middelbare scholier

**Gedragspatroon:**
- Studeert 's avonds; start pas als urgentie voelbaar is
- Weet welk vak en stof er zijn, maar mist startsignaal en voortgangsinzicht
- Mist urgentie soms totdat het te laat is
- Energieniveaus wisselen regelmatig — lage energiedagen zijn normaal

**Frustraties:**
- Geen duidelijk startsignaal zonder urgentie
- Urgentie pas herkennen als het al crisis is
- Energie slecht kunnen matchen aan taakinspanning

**Doelen:**
- Studeren zonder het gevoel dat je iets vergeet of achterloopt
- Op lage energiedagen tóch zinvol bezig kunnen zijn

**Scope:** Geen secundaire gebruikers — volledige focus op Evelien.

---

## Product Concept

**Kern structureel idee:** Energiebewuste studiequeue met vooruitkijkende capaciteitsplanning

Na een dagelijkse energie-check-in toont de app een bewust beperkt lijstje (standaard 3 taken, instelbaar) samengesteld op basis van energie, deadline, prioriteit en sessiespreiding. De app berekent op de achtergrond of het huidige studeertempo haalbaar is voor alle deadlines — niet alleen vandaag, maar over de hele komende periode. Urgentie escaleert zichtbaar als taken structureel worden uitgesteld. De gebruiker heeft vrijheid van keuze, maar ziet altijd de gevolgen.

**Implementatieprincipe:** Dagelijkse check-in → beperkte shortlist → geïnformeerde keuzevrijheid

**Rationale:** Beperkte keuze elimineert keuzestress; vooruitkijkende planning maakt urgentie zichtbaar vóórdat het crisis wordt.

**Features die hieruit voortvloeien:**
- Energie check-in (dagelijks)
- Shortlist-generator (configureerbaar, standaard 3)
- Urgentie-escalatie-indicator
- Capaciteitsplanning op de achtergrond
- Sessiespreiding-algoritme
- Gamification (beloningssysteem)
- Magister-koppeling (optioneel)

---

## Business Model

**Model:** Geen — persoonlijk gebruik

**Rationale:** FlowState wordt gebouwd voor Evelien zelf en een kleine kring (klasgenoot, zusje). Er is geen commercieel doel, geen monetisering, geen abonnementen.

**Implicaties voor het product:**
- Geen betalingssysteem nodig
- Geen onboarding voor onbekenden
- Geen marketing of acquisitiekanalen
- Gebruikersbeheer is minimaal (kleine vaste kring)
- Geen juridische vereisten rondom betalingen of consumentenrecht

---

## Succescriteria

**Primair:** Evelien loopt niet meer achter met huiswerk — ook niet-becijferde opdrachten worden op tijd gemaakt *(zichtbaar binnen 1–2 weken)*

**Secundair:** Betere cijfers als gevolg van consistenter studeren *(zichtbaar na proefwerken)*

**Onderliggend gevoel:** minder deadline-paniek, meer gevoel van controle, huiswerk voelt niet meer als een onoverkomelijke berg

---

## Concurrentie & Alternatieven

**Alternatieven:** Todoist, schoolagenda, Notion, Google Tasks, of gewoon niks doen

**Do-nothing:** stress en achterlopen — de status quo

**Waarom alternatieven tekortschieten:** Passieve lijstjes die niet adviseren, geen energiebewustheid, geen vooruitkijkende capaciteitsplanning, geen voortgangswaarschuwing

**Unfair advantage:** Magister-koppeling — taken automatisch importeren vanuit het schoolsysteem. Geen enkele generieke tool bouwt dit ooit. Elimineert handmatige invoer volledig.

---

## Randvoorwaarden

**Timeline:** Zo snel mogelijk — geen vaste datum, maar urgentie is hoog

**Tech:** Volledig open — geen platform- of stackvoorkeur

**MVP scope (v1):**
- Taken invoeren met: deadline, prioriteit, complexiteit, effort (aantal sessies)
- Dagelijkse energie-check-in
- Energiebewuste shortlist + voortgangswaarschuwing ("wat doe ik nu?")

**Fase 2 (niet-blokkerend):**
- Gamification / beloningssysteem
- Magister-koppeling *(wenselijk, technisch complex)*

**Flexibel:** alles buiten de MVP-kern is uitgesteld, niet geschrapt

---

