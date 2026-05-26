# Copilot Instructions — EveliensTaakjesApp

## Project Overview

This is a **BMad-method** project for **EveliensTaakjesApp** — a digital product being designed and built using the AI-agent orchestration framework. The project owner is **Evelien**. All documents are produced in **Dutch (Nederlands)**; the product itself targets **English** language users.

The IDE integration is **GitHub Copilot**. Agent files live in `.github/agents/`; each agent file loads its full skill from `.agents/skills/<skill-name>/SKILL.md`.

---

## Active Modules

| Module | Purpose | Version |
|--------|---------|---------|
| `core` | Base BMad skills (brainstorming, help, review, etc.) | 6.7.1 |
| `bmm` | Software-development agent team (Mary, John, Sally, Winston, Amelia, Paige) | 6.7.1 |
| `cis` | Creative Intelligence Suite (Sophia, Maya, Carson, Dr. Quinn, Victor, Caravaggio) | v0.2.1 |
| `wds` | Web Design Studio workflow (Saga, Freya, Mimir) | v0.4.3 |
| `bmb` | BMad Builder — for building/editing skills | v1.8.1 |

---

## WDS Workflow (primary delivery pipeline)

The project follows the **WDS v6** methodology. Phases must be executed in order; prerequisites are enforced.

| Phase | Name | Owner | Output folder |
|-------|------|-------|---------------|
| 0 | Alignment & Signoff | Saga | `design-artifacts/A-Product-Brief/` |
| 1 | Product Brief | Saga | `design-artifacts/A-Product-Brief/` |
| 2 | Trigger Mapping | Saga | `design-artifacts/B-Trigger-Map/` |
| 3 | UX Scenarios | Freya | `design-artifacts/C-UX-Scenarios/` |
| 4 | UX Design | Freya | `design-artifacts/C-UX-Scenarios/` (page specs) |
| 5 | Agentic Development | Mimir | `design-artifacts/E-Development/` |
| 6 | Asset Generation | Freya | — |
| 7 | Design System | Freya | — |
| 8 | Product Evolution | Mimir | — |

**Prerequisites (hard blocks):**
- Freya cannot start until `design-artifacts/A-Product-Brief/product-brief.md` AND `design-artifacts/B-Trigger-Map/00-trigger-map.md` exist.
- Mimir cannot write code or a PRD without at least one Work Order from Freya.
- Mimir on an existing codebase cannot PRD without `design-artifacts/E-Development/000-tech-audit.md`.

---

## Agent Domain Contracts

Agents own strict domains — never do work outside your domain, name the right agent and offer to hand off instead.

| Agent | Owns | Never does |
|-------|------|-----------|
| **Saga** | Discovery: Phases 0–2 | Design, code, scenarios |
| **Freya** | Design: Phases 3–4, 6–7 | Discovery, code, PRDs |
| **Mimir** | Build: Phase 5, 8 | Discovery, design, code without a Work Order |

**Handoff protocol:**
- Saga → Freya: run `/wrap freya` when Product Brief + Trigger Map are complete.
- Freya → Mimir: run `/wrap mimir` or `/handoff mimir` when a Work Order is ready.
- Mimir → Freya: run `/handoff freya` on completion or when blocked on a design decision.

---

## WDS Scaffold Scripts

All WDS structural output is produced via Node.js scripts (no external dependencies). **Agents supply content as CLI flags; scripts own all structural decisions — never write raw page-spec markdown directly.**

Run all scripts from the project root:

```bash
# Initialize a scenario folder
node _bmad/wds/scripts/wds-init-scenario.js \
  --scenario "01 New User Onboarding" \
  --description "New user first visit to account creation"

# Initialize a page spec (run after scenario init)
node _bmad/wds/scripts/wds-init-page.js \
  --page "01 Start" \
  --scenario "01 New User Onboarding" \
  --platform "Mobile web" \
  --visibility "Public"

# Wire navigation links (run after all pages in a scenario exist)
node _bmad/wds/scripts/wds-nav.js --scenario "01 New User Onboarding"
node _bmad/wds/scripts/wds-nav.js --all

# Append a UI object to a page spec
node _bmad/wds/scripts/wds-add-object.js \
  --page "C-UX-Scenarios/01-new-user-onboarding/01-start/01-start.md" \
  --section "Hero" \
  --object "Primary Headline" \
  --component "H1 heading" \
  --en "Welcome" \
  --behavior "Static display"

# Append a spacing entry
node _bmad/wds/scripts/wds-add-spacing.js \
  --page "C-UX-Scenarios/01-new-user-onboarding/01-start/01-start.md" \
  --direction v --type space --size xl \
  --reason "major section boundary between hero and features"

# Validate a single page spec
node _bmad/wds/scripts/wds-validate.js \
  --page "C-UX-Scenarios/01-new-user-onboarding/01-start/01-start.md"

# Validate all page specs
node _bmad/wds/scripts/wds-validate.js --all
```

Object IDs are auto-derived by the scripts (kebab-case, prefixed with page name). Do not invent IDs manually.

---

## Configuration System

Three-layer config merge (last wins):

| File | Scope | Committed |
|------|-------|-----------|
| `_bmad/config.toml` | Installer-managed base — **read-only**, overwritten on every install | ✅ |
| `_bmad/custom/config.toml` | Team overrides — deep-merge over base | ✅ |
| `_bmad/custom/config.user.toml` | Personal overrides — gitignored | ❌ |

To permanently change an install setting, re-run the BMad installer — do not hand-edit `_bmad/config.toml`.

---

## Output Folder Conventions

| Folder | Contents |
|--------|---------|
| `design-artifacts/` | All WDS design output (A–E folders created by Saga/Freya) |
| `_bmad-output/` | BMM agent output (planning, implementation artifacts) |
| `docs/` | Project knowledge base (reference docs, research) |
| `_progress/` | Machine-local session state — **not committed** |
| `progress/` | Agent session state files (`[agent].md`, `project-index.md`) — not committed |

---

## Model Selection (WDS agents)

| Task type | Model |
|-----------|-------|
| Code, build, deploy, implement | Opus |
| High-stakes / production / compliance | Opus |
| Long or complex multi-step tasks | Opus |
| Strategy, spec, dialog, UX, analysis | Sonnet |
| Simple, low-stakes, short | Haiku |

Agents prefix next actions with `MODEL:[Haiku|Sonnet|Opus]` when relevant.

---

## Quality Rules (all agents)

- **One task at a time.** Complete and verify before moving on.
- **Read the template before writing.** Every artifact has a template — load it, follow it exactly.
- **No plausible-looking wrong output.** If you cannot follow the template exactly, stop and say so.
- **Decisions are documented.** Deviations from a template go in the design log (`_progress/00-design-log.md`).
- **Conventional commits required.** No force push, no skipping hooks.
- **Mimir:** never mark a requirement done without browser verification.
- **Freya:** never design without a Trigger Map.
- **No agent writes to `progress/` directly** — only through the memory tool.
