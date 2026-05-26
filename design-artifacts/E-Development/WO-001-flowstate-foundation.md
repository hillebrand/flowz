# Work Order WO-001 — FlowState Foundation

**Van:** Freya (UX Designer)  
**Aan:** Mimir (Development)  
**Datum:** 2026-05-23  
**Status:** Ready for development  

---

## Scope

Bouw de volledige FlowState PWA zoals ontworpen in Phase 4. Alle 10 pagina's zijn gespecificeerd in `design-artifacts/C-UX-Scenarios/`. Dit is de basis-implementatie (geen design system, geen asset generation — dat volgt later).

---

## Product Context

**FlowState** — Een persoonlijke studieplannings-PWA voor middelbare scholieren.  
**Primaire gebruiker:** Evelien, 15 jaar, VWO 3.  
**Kernfunctie:** Magister-integratie + dagelijkse energie-gestuurde shortlist + taakbeheer.  

Zie voor volledig context:
- `design-artifacts/A-Product-Brief/product-brief.md`
- `design-artifacts/B-Trigger-Map/00-trigger-map.md`

---

## Te Bouwen Pagina's

### Scenario 01 — Eerste Setup (eenmalig)

| Pagina | Spec | Prioriteit |
|--------|------|-----------|
| 01.1 Welkomst | `C-UX-Scenarios/01-eveliens-eerste-setup/01.1-welkomst-eerste-start/01.1-welkomst-eerste-start.md` | P1 |
| 01.2 Magister Sync | `C-UX-Scenarios/01-eveliens-eerste-setup/01.2-magister-sync/01.2-magister-sync.md` | P1 |
| 01.3 Import Review | `C-UX-Scenarios/01-eveliens-eerste-setup/01.3-import-review/01.3-import-review.md` | P1 |
| 01.4 Taak Aanmaken | `C-UX-Scenarios/01-eveliens-eerste-setup/01.4-taak-aanmaken/01.4-taak-aanmaken.md` | P1 |
| 01.5 Takenoverzicht | `C-UX-Scenarios/01-eveliens-eerste-setup/01.5-takenoverzicht/01.5-takenoverzicht.md` | P1 |

### Scenario 02 — Dagelijkse Routine (kern gebruik case)

| Pagina | Spec | Prioriteit |
|--------|------|-----------|
| 02.1 Energie Check-in | `C-UX-Scenarios/02-eveliens-dagelijkse-routine/02.1-energie-check-in/02.1-energie-check-in.md` | P1 |
| 02.2 Shortlist / Vandaag | `C-UX-Scenarios/02-eveliens-dagelijkse-routine/02.2-shortlist-vandaag/02.2-shortlist-vandaag.md` | P1 |

### Scenario 03 — Taakbeheer & Voortgang

| Pagina | Spec | Prioriteit |
|--------|------|-----------|
| 03.1 Taak Detail Bewerken | `C-UX-Scenarios/03-eveliens-taakbeheer-en-voortgang/03.1-taak-detail-bewerken/03.1-taak-detail-bewerken.md` | P1 |
| 03.2 Voortgangsinzicht | `C-UX-Scenarios/03-eveliens-taakbeheer-en-voortgang/03.2-voortgangsinzicht/03.2-voortgangsinzicht.md` | P2 |

### Scenario 04 — Instellingen

| Pagina | Spec | Prioriteit |
|--------|------|-----------|
| 04.1 Instellingen | `C-UX-Scenarios/04-eveliens-instellingen/04.1-instellingen/04.1-instellingen.md` | P2 |

---

## Technische Beslissingen (vanuit Phase 3)

| Beslissing | Detail |
|-----------|--------|
| Platform | PWA — Progressive Web App; responsive (mobiel-eerst), installeerbaar via browser |
| Primair platform | Mobile web (telefoon) |
| Taal | English (app UI) |
| Magister-sync | Dagelijks bij openen app; deduplicatie — alleen nieuwe items worden aangeboden |
| Energieniveau | 3 niveaus: Low / Normal / High; bepaalt shortlist samenstelling |
| Shortlist grootte | Standaard 3 taken per dag; instelbaar via 04.1 |

---

## Navigatiestructuur

```
Welkomst (01.1)
  └── Magister Sync (01.2)
        └── Import Review (01.3)
              └── Taak Aanmaken (01.4) [× n taken]
                    └── Takenoverzicht (01.5)

Dagelijkse open:
  Energie Check-in (02.1)
    └── Shortlist / Vandaag (02.2)
          └── Taak Detail Bewerken (03.1) [via tik op taak]

Bottom / side navigation:
  Takenoverzicht (01.5)
  Voortgangsinzicht (03.2)
  Instellingen (04.1)
```

---

## Aandachtspunten voor Mimir

1. **Magister API** — Houd rekening met Magister OAuth flow of credential-based login; deduplicatie-logica vereist lokale opslag van eerder geïmporteerde items.
2. **Energie-algoritme** — Shortlist-generatie houdt rekening met energieniveau + deadline-urgentie; begin met simpele prioritering (urgentie × energie-multiplier).
3. **Page States** — Elke pagina heeft meerdere states (zie spec); implementeer ze allemaal, inclusief leeg/fout-states.
4. **Offline-first** — PWA moet werken zonder netwerk (taken bekijken/afvinken); sync bij herverbinding.
5. **Sessie logging** — "+ Log session" in 03.1 moet taak-voortgang persistent opslaan.

---

## Acceptatiecriteria (minimaal)

- [ ] Eerste setup flow (01.1 → 01.5) werkt end-to-end
- [ ] Dagelijkse routine (02.1 → 02.2) werkt na eerste setup
- [ ] Energie-keuze beïnvloedt shortlist samenstelling
- [ ] Taken afvinken in shortlist werkt persistent
- [ ] Takenoverzicht toont alle taken gesorteerd per urgentie
- [ ] Instellingen worden opgeslagen
- [ ] App is installeerbaar als PWA
