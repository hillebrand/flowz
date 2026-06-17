# Work Order WO-005 — Prototype Migratie: Eerste Setup & Instellingen

**Van:** Freya (UX Designer)  
**Aan:** Mimir (Development)  
**Datum:** 2026-06-17  
**Status:** Ready for development  
**Opvolgt:** WO-004

---

## Scope

Deze Work Order mandateert de migratie van de Eerste Setup flows, Magister Sync, en de hoofd-instellingenpagina vanuit het HTML/JS prototype naar de React Native (`native-app`) codebase.

---

## Deel A — Te Migreren Pagina's

| UX Scenario (Referentie) | Prototype Bestand |
|-------------------------|-------------------|
| 01.1 Welkomst | `prototype/01.1-welkomst.html` |
| 01.2 Magister Sync | `prototype/01.2-magister-sync.html` |
| 01.3 Import Review | `prototype/01.3-import-review.html` |
| 01.4 Taak Aanmaken | `prototype/01.4-taak-aanmaken.html` |
| 01.5 Takenoverzicht | `prototype/01.5-takenoverzicht.html` |
| 03.2 Voortgang | `prototype/03.2-voortgang.html` |
| 04.1 Instellingen | `prototype/04.1-instellingen.html` |
| Auth Flows (00.1 - 00.4) | `prototype/00.*.html` |

---

## Deel B — Technische Migratieregels

1. **Magister Sync Mock:** Aangezien de API er nog niet is, de Magister sync interface bouwen alsof de data lokaal aanwezig is (mock data) zoals het prototype doet.
2. **Setup flow:** Zorg ervoor dat `expo-router` de setup lineair afdwingt bij de eerste keer openen (of test dit als flow in de layout).
3. **Instellingen Form:** Zorg dat 04.1 Instellingen mutaties wegschrijft naar de `useDataStore`. 

---

## Acceptatiecriteria

- [ ] Schermen 01.1 t/m 01.5 zijn native te doorlopen.
- [ ] Scherm 04.1 is native en navigeert succesvol naar de reeds gebouwde 04.2 (Beschikbaarheid).
- [ ] Taak handmatig aanmaken (01.4) functioneert en pusht een taak in de state.
