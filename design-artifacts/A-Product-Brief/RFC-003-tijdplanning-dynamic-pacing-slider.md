# Product Brief: Flowz Tijdplanning & Dynamic Pacing Slider

status: RFC
created: 2026-06-14
updated: 2026-06-14

## Executive Summary

Flowz vereist een intelligent, niet-intrusief pacing- en capaciteitsalgoritme om schijn-urgentie en cognitieve vermoeidheid bij Evelien te voorkomen. In plaats van het dashboard op te splitsen in rigide taaksegmenten, centraliseert deze feature de tijdsplanning rondom een dynamisch ingekleurde check-in slider en één geïntegreerde taaklijst. 

De slider staat bij de dagelijkse check-in standaard gepositioneerd op de vooraf ingestelde macro-capaciteit van die dag. Flowz verplaatst de sliderknop nooit zelfstandig. In plaats daarvan berekent de planning-engine de actuele werklast en kleurt de achterliggende balk dynamisch in drie zones (Rood, Oranje, Groen). Dit geeft Evelien direct visueel inzicht in de consequenties van haar tijdskeuze, terwijl ze de volledige regie behoudt over haar dagplanning.

## The Problem

Wanneer Evelien handmatig extra tijd selecteert, neigt een traditioneel systeem ertoe om haar direct te overspoelen met willekeurige backlogtaken, wat resulteert in een onterecht gevoel van urgentie. Omgekeerd, als ze door onvoorziene omstandigheden minder tijd heeft, raakt het overzicht zoek welke taken cruciaal zijn voor het halen van harde deadlines. 

Rigide taaksegmenten (zoals het labelen van taken als "optioneel") werken in de praktijk contraproductief, omdat ze uitstelgedrag in de hand werken. Het systeem heeft behoefte aan een feedback-loop die inzichtelijk maakt wat de impact van haar beschikbare tijd is op haar voortgang, zonder dat de app de controle overneemt of de interface blokkeert.

## The Solution

De tijdplanning en visualisatie rusten op een gelaagd capaciteitsmodel gekoppeld aan een adaptieve slider:

1. **Macro-planning (De Basis):** Evelien legt in de instellingen per weekdag haar standaard beschikbare tijd vast (bijvoorbeeld Maandag: 1 uur, Zaterdag: 4 uur). Dit fungeert als de initiële startpositie van de sliderknop bij de dagelijkse check-in.
2. **Meso-planning (Kalender-overrides):** Evelien kan specifieke toekomstige datums voorzien van een capaciteits-override (bijv. vakanties of toetsweken). De planning-engine anticipeert hierop door de kleurzones van de slider in de dagen voorafgaand aan de uitzondering proactief aan te passen.
3. **Micro-executie (Dynamische Drie-Zone Slider):** De schaal van de slider is statisch, maar de achtergrondkleuring verschuift dynamisch op basis van de berekende werklast:
   * **Rode zone (Tijdsnood):** De geselecteerde tijd is onvoldoende om naderende deadlines te borgen. De interface toont de tekst: *"Je loopt momenteel achter. Besteed vandaag minimaal X uur om je deadlines te halen."*
   * **Oranje zone (Stabiel tempo):** De geselecteerde tijd is exact effectief om stabiel en rustig naar deadlines toe te werken. De interface toont: *"Je ligt perfect op schema voor je taken."*
   * **Groene zone (Vooruitwerken / Luxe):** Evelien selecteert meer tijd dan strikt noodzakelijk. Omdat huiswerk in sessies is opgedeeld, vertaalt het systeem deze luxe naar een proactieve tijdsbeloning voor de nabije toekomst: *"Je werkt nu alvast vooruit. Dit scheelt je morgen naar verwachting een half uurtje aan huiswerk."*

**Het Dashboard:**
Het dashboard toont één heldere, geïntegreerde lijst met taken. De totale lengte van de lijst is begrensd tot de tijdsduur die Evelien op de slider heeft geselecteerd. Taken met acute tijdsnood worden binnen deze lijst direct rood gemarkeerd. Indien de slider in het rood staat, worden alle kritieke, deadlinedragende taken dwingend getoond en treedt de Deficit UI (waarschuwingsbanner) in werking zonder de doorstroom te blokkeren.

## What Makes This Different

Flowz micromanaget de gebruiker niet. Het algoritme verschuift uitsluitend de betekenis van tijd (de kleurzones) op basis van de wiskundige noodzaak van deadlines, maar laat de uiteindelijke beslissing over aan Evelien. Het vertaalt abstracte taaksessies naar concrete, motiverende voordelen voor de volgende dag (*"morgen een half uurtje minder"*).

## Who This Serves

* **Evelien:** Zij krijgt direct inzicht in de haalbaarheid van haar planning via kleur en tekst, ervaart rust door een compact dashboard dat aansluit bij haar gekozen slider-tijd, en behoudt de autonomie om bewust te kiezen voor een rode, oranje of groene dag.

## Success Criteria

| Signaal | Meting | Drempelwaarde (Threshold) | Component |
| :--- | :--- | :--- | :--- |
| Correcte zoneberekening | Berekening van de grens tussen Rood en Oranje in de engine | Moet exact overeenkomen met de som van de minimaal vereiste sessieduren voor harde deadlines die dag | `@/lib/planning` |
| Accurate tekstuele feedback | Dynamische tekstweergave bij het handmatig verschuiven van de slider | Tekst past zich direct (binnen 100ms) aan bij het passeren van een zonegrens | `app/(app)/checkin` |
| Geen interfaceblokkades | Succesvolle check-ins wanneer Evelien bewust kiest voor een stand in de rode zone | 100% van de check-ins staat doorstroming naar het dashboard toe | `stores/sessionStore` |
| Compactheid dashboard | Totale tijdsduur van de getoonde taken op het dashboard | Overschrijdt de op de slider gekozen minuten met 0%, tenzij een rode zone-deficit de weergave van kritieke taken dwingt | `stores/dataStore` |

## Scope

### In-scope
* **State & Model Uitbreiding:** Uitbreiden van `DEFAULT_SETTINGS` in de Zustand `dataStore` met de weekmatrix en een `overrides` object voor specifieke datums.
* **Planning Engine (`@/lib/planning/`):** Algoritme dat de drempelwaardes voor de rode, oranje en groene zones berekent op basis van de actuele taken, deadlines en meso-overrides.
* **Check-in UI Slider:** Een NativeWind 4 slider-component waarvan de track-kleuring (Rood/Oranje/Groen) dynamisch wordt gevoed door de engine. De slider opent standaard op de macro-waarde van die dag.
* **Dynamische Feedback-tekst:** Implementatie van de reactieve tekststrings onder de slider die de betekenis van de actuele zonekeuze uitleggen (inclusief de "morgen een half uur minder" logica).
* **Unified Dashboard List:** Eén taaklijst gesorteerd op prioriteit en deadline-tijdsnood (rode taakmarkering), gelimiteerd tot de slider-duur.

### Out-of-scope
* Het automatisch of geforceerd verschuiven van de sliderknop door het systeem zelf.
* Het splitsen van het dashboard in visueel gescheiden secties voor "Must Do" en "Optioneel".
* Integratie met externe kalendersystemen.

## Technical Addendum & Constraints

In lijn met `project-context_15.md` gelden de volgende strikte implementatierules:
* **State Management:** Alle macro-matrix data en kalender-overrides worden opgeslagen in `dataStore.ts`. Synchronisatie verloopt optimistisch en local-first richting de gecentraliseerde Cloudflare Worker URL (`WORKER_URL`).
* **Fonts & UI:** De app is portrait-only. UI-styling maakt exclusief gebruik van NativeWind 4. De Karla custom fonts (`Karla_400Regular`, `Karla_600SemiBold`) mogen onder geen beding via een `className` worden aangeroepen; gebruik altijd de expliciete inline `style={{ fontFamily: 'Karla_...' }}` constructie.
* **TypeScript:** Strict mode is ingeschakeld. Relatieve imports zijn verboden; gebruik uitsluitend absolute path aliases met de `@/` prefix.

### Decisions
* *Beslissing 14-06-2026:* Visuele scheiding tussen Must Do en Optioneel is geschrapt om uitstelgedrag te voorkomen. Urgentie wordt uitsluitend getoond via de bestaande rode taakmarkering binnen één gecombineerde lijst.
* *Beslissing 14-06-2026:* De slider-positie beweegt nooit automatisch mee met de werkdruk. De positieschaling is statisch en start op de macro-waarde; enkel de kleurzones op de achtergrond verschuiven dynamisch om inzicht te bieden.
* *Beslissing 14-06-2026:* De voordelen van de groene zone (vooruitwerken) worden in tekst uitgedrukt als een tijds- of sessiebesparing voor de opvolgende dag om de abstracte aard van huiswerksessies tastbaar te maken.
