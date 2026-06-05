# Flowz — Implementatieplan

**Project:** EveliensTaakjesApp / Flowz  
**Opgesteld:** 2026-06-02  
**Status:** Klaar voor uitvoering  

---

## Achtergrond

Het prototype van Flowz is volledig gebouwd en geverifieerd (WO-001 ✅, WO-002 pagina's aanwezig). Het prototype bestaat uit 21 statische HTML-pagina's met vanilla JavaScript, en een Cloudflare Worker backend die al live is op `https://flowstate-proxy.flowstate-evelien.workers.dev`.

De volgende stap is de **daadwerkelijke implementatie**: het prototype herbouwen als een moderne Vue 3-applicatie met TypeScript, herbruikbare componenten en een proper bouwproces.

---

## Tech Stack

| Onderdeel | Keuze |
|-----------|-------|
| Framework | Vue 3 (Composition API) |
| Build tool | Vite 5 |
| Taal | TypeScript 5 |
| State management | Pinia |
| Routing | Vue Router 4 |
| CSS | TailwindCSS v3 (PostCSS, niet CDN) |
| PWA | vite-plugin-pwa |
| Hosting | Surge.sh (`flowstate-app.surge.sh`) |
| Backend | Cloudflare Worker (geen wijzigingen nodig) |

---

## Pagina-inventaris

### Auth (4 pagina's)
| Pagina | View |
|--------|------|
| 00.1 Login | `LoginView.vue` |
| 00.2 Registreren | `RegisterView.vue` |
| 00.3 Wachtwoord vergeten | `ForgotPasswordView.vue` |
| 00.4 Wachtwoord resetten | `ResetPasswordView.vue` |

### Eerste setup — eenmalig (5 pagina's)
| Pagina | View |
|--------|------|
| 01.1 Welkomst | `WelcomeView.vue` |
| 01.2 Magister Sync | `MagisterSyncView.vue` |
| 01.3 Import Review | `ImportReviewView.vue` |
| 01.4 Taak Aanmaken | `CreateTaskView.vue` |
| 01.5 Takenoverzicht | `TaskOverviewView.vue` |

### Dagelijkse routine (2 pagina's)
| Pagina | View |
|--------|------|
| 02.1 Energie Check-in | `EnergyCheckinView.vue` |
| 02.2 Shortlist Vandaag | `ShortlistView.vue` |

### Taakbeheer & Pomodoro (6 pagina's)
| Pagina | View |
|--------|------|
| 03.1 Taak Detail | `TaskDetailView.vue` |
| 03.2 Voortgangsinzicht | `ProgressView.vue` |
| 03.3 Sessie Voorbereiding | `SessionPrepView.vue` |
| 03.4 Actieve Sessie | `ActiveSessionView.vue` |
| 03.5 Sessie Afgerond | `SessionDoneView.vue` |
| 03.6 Pauzetimer | `BreakTimerView.vue` |

### Instellingen (2 pagina's)
| Pagina | View |
|--------|------|
| 04.1 Instellingen | `SettingsView.vue` |
| 04.2 Beschikbaarheid | `AvailabilityView.vue` |

### Overig (1 pagina)
| Pagina | View |
|--------|------|
| 05.1 Afgeronde Taken | `CompletedTasksView.vue` |

**Totaal: 20 views** (index.html wordt router entry point)

---

## Gedeelde Componenten

| Component | Gebruikt op |
|-----------|-------------|
| `NavDrawer.vue` | Alle hoofdpagina's |
| `TaskCard.vue` | 01.5, 02.2, 03.1 |
| `ProgressDots.vue` | 03.1, 03.5 |
| `UrgencyBadge.vue` | 01.5, 02.2 |
| `SubtaskList.vue` | 03.1, 03.4 |
| `TimerDisplay.vue` | 03.4, 03.6 |
| `CalendarGrid.vue` | 01.5, 04.2 |
| `ConfirmModal.vue` | 04.2, instellingen |

---

## Projectstructuur

```
flowstate/
├── src/
│   ├── components/          ← gedeelde componenten
│   ├── views/               ← pagina-componenten
│   │   ├── auth/
│   │   ├── setup/
│   │   ├── daily/
│   │   ├── tasks/
│   │   └── settings/
│   ├── stores/              ← Pinia (auth, data, session)
│   ├── lib/                 ← business logic (planning, capacity, formatting)
│   ├── router/              ← routes + auth guard
│   ├── App.vue
│   └── main.ts
├── public/                  ← icons, manifest
├── vite.config.ts
├── tailwind.config.ts
└── package.json
```

---

## Bouwfasen

### Milestone 1 — Fundament (~3 uur)
Projectskeleton, TailwindCSS configuratie, TypeScript types, Pinia stores, Vue Router met auth guard, business logic migratie uit `shared/app.js`, `NavDrawer.vue`.

**Deliverable:** lege app die navigeert naar login bij opstarten.

### Milestone 2 — Auth flow (~2 uur)
Vier auth-pagina's gebouwd en gekoppeld aan de bestaande Cloudflare Worker API.

**Deliverable:** inloggen en registreren werkt; token wordt opgeslagen; redirect naar app na login.

### Milestone 3 — Setup flow (~3 uur)
Vijf setup-pagina's inclusief Magister-import en handmatig taak aanmaken. Bevat description textarea (WO-002) en kalenderweergave toggle op 01.5 (WO-002).

**Deliverable:** complete eerste-setup flow 01.1 → 01.5 werkt end-to-end.

### Milestone 4 — Dagelijkse routine (~2 uur)
Energie check-in en shortlist. Bevat capaciteitsdruk banner (WO-002).

**Deliverable:** dagelijkse routine 02.1 → 02.2 werkt; energie beïnvloedt shortlist.

### Milestone 5 — Taakbeheer & Pomodoro (~4 uur)
Taak detail (met description + ▶ Start session), volledige Pomodoro-flow (03.3–03.6), voortgangsinzicht en afgeronde taken.

**Deliverable:** volledige Pomodoro-sessie doorloopbaar; sessies worden persistent opgeslagen.

### Milestone 6 — Instellingen (~2 uur)
Instellingenpagina (met pauzetijd instelling) en beschikbaarheidskalender (weekdag toggles + maandkalender).

**Deliverable:** instellingen opgeslagen; geblokkeerde dagen beïnvloeden planning.

### Milestone 7 — PWA & Deployment (~1 uur)
Service worker, offline caching, `npm run deploy` script, productie build op mobiel getest.

**Deliverable:** app installeerbaar als PWA op telefoon; live op `https://flowstate-app.surge.sh`.

---

## Planning & Schatting

| Milestone | Inhoud | Schatting |
|-----------|--------|-----------|
| 1 | Fundament | ~3 uur |
| 2 | Auth flow | ~2 uur |
| 3 | Setup flow | ~3 uur |
| 4 | Dagelijkse routine | ~2 uur |
| 5 | Taakbeheer & Pomodoro | ~4 uur |
| 6 | Instellingen | ~2 uur |
| 7 | PWA & Deployment | ~1 uur |
| **Totaal** | | **~17 uur** |

---

## Backend

De Cloudflare Worker is volledig operationeel en vereist **geen wijzigingen**:

- **URL:** `https://flowstate-proxy.flowstate-evelien.workers.dev`
- **CORS:** `https://flowstate-app.surge.sh` ✅
- **KV namespace:** geconfigureerd ✅
- **Functionaliteit:** Magister proxy, user auth, data sync

**Bekende beperking:** wachtwoord-reset e-mails worden niet daadwerkelijk verstuurd (de reset-link wordt teruggegeven via de API). Voor persoonlijk gebruik aanvaardbaar. Toekomstige verbetering: Resend.com integratie toevoegen aan de worker.

---

## Referentiemateriaal

| Soort | Locatie |
|-------|---------|
| Prototype (visuele referentie) | `design-artifacts/E-Development/prototype/` |
| Business logic (te migreren) | `design-artifacts/E-Development/prototype/shared/app.js` |
| UX specs | `design-artifacts/C-UX-Scenarios/` |
| Work Orders | `design-artifacts/E-Development/WO-001-*.md`, `WO-002-*.md` |
| Backend | `cloudflare-worker/src/worker.js` |
