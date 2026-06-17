# Voorbereiding: Work Order voor Native App Migratie

## Bestaande UI / Prototype vs Native App Status
Uit eerdere analyse van Mimir:

**Wel in de native app gebouwd (WO-001 t/m WO-003 features):**
- 02.1 Energie Check-in (`checkin.tsx`)
- 02.2 Tijdkeuze (`tijdkeuze.tsx`)
- 02.3 Shortlist Vandaag (`index.tsx` in `app/(app)`)
- 04.2 Beschikbaarheid (`beschikbaarheid.tsx`)

**NOG TE MIGREREN vanuit Prototype:**
1. **Scenario 01 (Eerste Setup):**
   - 01.1 Welkomst
   - 01.2 Magister Sync
   - 01.3 Import Review
   - 01.4 Taak Aanmaken
   - 01.5 Takenoverzicht
2. **Scenario 03 (Taakbeheer & Voortgang - waaronder de Pomodoro flow):**
   - 03.1 Taak Detail
   - 03.2 Voortgang
   - 03.3 Sessie Voorbereiding
   - 03.4 Actieve Sessie
   - 03.5 Sessie Afgerond
   - 03.6 Pauzetimer
3. **Scenario 04 (Instellingen):**
   - 04.1 Instellingen
4. **Scenario 05 / Overig:**
   - 05.1 Afgeronde taken
   - Login, Registratie, Wachtwoord flows (00.1 t/m 00.4)

Freya zal Work Orders aanmaken om Mimir aan te sturen voor deze migratie.
