# Design Log — EveliensTaakjesApp

> Dit bestand documenteert afwijkingen van templates en globale designbeslissingen.
> Bijgehouden door Freya (WDS Designer). Niet gecommit.

---

## ~~Beslissing 2026-06-14 — Globale kleurstijl: van Indigo naar Sky Blue~~ INGETROKKEN

> **Ingetrokken 2026-06-14.** De sky-blue header in de referentieschets (`tijdsslider.png`) was een mockup-artefact, geen designintentie. Alle schermen behouden de bestaande witte header (`bg-white border-b border-gray-100`) en indigo primaire kleur. Scherm 02.2 Tijdkeuze gebruikt dezelfde standaard header als alle andere schermen.

---

## Beslissing 2026-06-14 — Slider maximum: 5 uur hard

**Aanleiding:** RFC-003 liet de maximale sliderwaarde open.  
**Besloten:** Slider-maximum = **5 uur**, hard gecodeerd, niet instelbaar door de gebruiker.  
**Reden:** Evelien is scholier (VWO 3); meer dan 5 uur studietijd per dag is niet realistisch en wekt valse druk.

---

## Beslissing 2026-06-14 — Groene zone tekst: generiek, geen dag-referentie

**Aanleiding:** RFC-003 stelde voor "Dit scheelt je morgen naar verwachting een half uur".  
**Besloten:** Tekst wordt: *"je werkt nu alvast vooruit. Je bouwt een buffer op voor je taken."*  
**Reden:** Dag-specifieke berekening ("morgen een half uur") vereist complexe meso-ahead berekening; generieke tekst is eerlijker en minder kwetsbaar voor verkeerde verwachtingen.
