// FlowState — App Data Store
// Handles LocalStorage persistence, task queries, and energy algorithm

const APP_KEY = 'flowstate_data';
const ENERGY_KEY = 'flowstate_energy_today';
const SETUP_KEY = 'flowstate_setup_done';
const DATA_VERSION = 3; // bump to reset stored data on breaking changes

// ── Cloud Sync (JSONBlob) ─────────────────────────────────────────────────────
const SYNC_BLOB_ID = '019e6583-f28d-72f2-ba8a-0c47b53f9a61';
const SYNC_URL = `https://jsonblob.com/api/jsonBlob/${SYNC_BLOB_ID}`;

async function fetchCloudData() {
  try {
    const res = await fetch(SYNC_URL, { headers: { 'Accept': 'application/json' } });
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    return null;
  }
}

function pushCloudData(data) {
  // Non-blocking — fire and forget
  fetch(SYNC_URL, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(data),
  }).catch(() => {});
}

// ── Load / Save ──────────────────────────────────────────────────────────────

const DEMO_DATA = {"tasks":[{"id":"t1","title":"Essay Engels","subject":"English","description":"Schrijf een betoog van minimaal 500 woorden over klimaatverandering. Gebruik minstens 3 bronnen en voeg een bronnenlijst toe.","deadline":"2026-06-02","sessions_total":3,"sessions_done":1,"complexity":"high","priority":"high","subtasks":[{"id":"s1","title":"Bronnen zoeken","done":true},{"id":"s2","title":"Opzet schrijven","done":false},{"id":"s3","title":"Essay schrijven","done":false},{"id":"s4","title":"Nalezen","done":false}],"materials":["leerboek","aantekeningen"],"status":"in_progress","source":"magister","magister_id":"mg_001","created_at":"2026-05-23"},{"id":"t2","title":"Wiskundeopgaven hoofdstuk 5","subject":"Math","description":"Opgaven 5.1 t/m 5.4 — vectoren en matrices. Let op: toon altijd de tussenberekening.","deadline":"2026-06-04","sessions_total":2,"sessions_done":0,"complexity":"medium","priority":"normal","subtasks":[{"id":"s8","title":"Paragraaf 5.1 en 5.2","done":false},{"id":"s9","title":"Paragraaf 5.3 en 5.4","done":false}],"materials":["rekenmachine","schrift"],"status":"pending","source":"magister","magister_id":"mg_002","created_at":"2026-05-23"},{"id":"t3","title":"Samenvatting Geschiedenis hfst 8","subject":"History","description":"Samenvatting van hoofdstuk 8: De Tweede Wereldoorlog. Maximaal 2 A4. Gebruik de koppen uit het boek als structuur.","deadline":"2026-06-06","sessions_total":1,"sessions_done":0,"complexity":"low","priority":"normal","subtasks":[],"materials":["leerboek"],"status":"pending","source":"magister","magister_id":"mg_003","created_at":"2026-05-23"},{"id":"t4","title":"Biologie werkstuk — ecosystemen","subject":"Biology","description":"Kies een ecosysteem naar keuze en beschrijf voedselketens, producenten, consumenten en decomposers. Minimaal 4 pagina's inclusief afbeeldingen.","deadline":"2026-06-13","sessions_total":4,"sessions_done":0,"complexity":"high","priority":"low","subtasks":[{"id":"s5","title":"Ecosysteem kiezen","done":false},{"id":"s6","title":"Onderzoek doen","done":false},{"id":"s7","title":"Verslag schrijven","done":false}],"materials":["leerboek"],"status":"pending","source":"manual","magister_id":null,"created_at":"2026-05-23"},{"id":"t5","title":"Toets Scheikunde — hoofdstuk 6","subject":"Chemistry","description":"Leer atoombouw, moleculen en chemische bindingen. Maak ook de oefentoets achter in het boek.","deadline":"2026-05-30","sessions_total":2,"sessions_done":0,"complexity":"high","priority":"high","subtasks":[{"id":"s10","title":"Atoombouw herhalen","done":false},{"id":"s11","title":"Oefentoets maken","done":false}],"materials":["leerboek","aantekeningen","woordenlijst"],"status":"pending","source":"magister","magister_id":"mg_005","created_at":"2026-05-24"},{"id":"t6","title":"Boekverslag Nederlands","subject":"Dutch","description":"Boekverslag over 'De aanslag' van Harry Mulisch. Gebruik het format van de docent (zie Magister).","deadline":"2026-06-19","sessions_total":3,"sessions_done":0,"complexity":"medium","priority":"normal","subtasks":[{"id":"s12","title":"Boek uitlezen","done":false},{"id":"s13","title":"Aantekeningen verwerken","done":false},{"id":"s14","title":"Verslag schrijven","done":false}],"materials":["boek 'De aanslag'"],"status":"pending","source":"magister","magister_id":"mg_006","created_at":"2026-05-24"}],"settings":{"shortlist_size":5,"session_length_min":45,"break_length_min":10,"reminder_enabled":true,"reminder_time":"18:00","magister_connected":false,"magister_email":null,"blocked_days":{"recurring":["saturday","sunday"],"specific":[]}},"sessions_log":[{"task_id":"t1","date":"2026-05-22"}],"study_days":["2026-05-19","2026-05-20","2026-05-21","2026-05-22","2026-05-23"]};

function loadData() {
  const raw = localStorage.getItem(APP_KEY);
  if (raw) return JSON.parse(raw);
  return null;
}

function saveData(data) {
  data._updated_at = Date.now();
  localStorage.setItem(APP_KEY, JSON.stringify(data));
  pushCloudData(data);
}

async function initData() {
  let local = loadData();

  // Reset local if missing or outdated version
  if (!local || (local._version || 0) < DATA_VERSION) {
    local = JSON.parse(JSON.stringify(DEMO_DATA));
    local._version = DATA_VERSION;
    local._updated_at = 0;
    localStorage.removeItem(SETUP_KEY);
    localStorage.removeItem(ENERGY_KEY);
    saveData(local);
  }

  // Sync: fetch cloud data and use whichever is newer
  const cloud = await fetchCloudData();
  if (cloud && (cloud._version || 0) >= DATA_VERSION) {
    const cloudTs = cloud._updated_at || 0;
    const localTs = local._updated_at || 0;
    if (cloudTs > localTs) {
      // Cloud is newer — update local
      localStorage.setItem(APP_KEY, JSON.stringify(cloud));
      return cloud;
    } else if (localTs > cloudTs) {
      // Local is newer — push to cloud
      pushCloudData(local);
    }
  }

  return local;
}

// ── Task Helpers ──────────────────────────────────────────────────────────────

// sessionsRemaining: optional — when provided, urgency also considers session pressure.
// pressure = sessionsRemaining / daysLeft. pressure >= 1 → urgent, >= 0.5 → this_week.
// Calendar usage (no sessions) falls back to date-only logic.
function getUrgency(deadline, sessionsRemaining = 1) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  // Parse deadline as local midnight to avoid UTC-vs-local timezone drift
  const due = new Date(deadline + 'T00:00:00');
  const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
  const pressure = sessionsRemaining / Math.max(1, diffDays);
  if (diffDays <= 1 || pressure >= 1)   return 'urgent';     // 🔴
  if (diffDays <= 7 || pressure >= 0.5) return 'this_week';  // 🟡
  return 'upcoming';                                           // 🟢
}

function urgencyLabel(deadline) {
  const u = getUrgency(deadline);
  const map = { urgent: '🔴 DRINGEND', this_week: '🟡 DEZE WEEK', upcoming: '🟢 AANKOMEND' };
  return map[u];
}

function formatDeadline(deadline) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  // Parse deadline as local midnight to avoid UTC-vs-local timezone drift
  const due = new Date(deadline + 'T00:00:00');
  const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'vandaag';
  if (diffDays === 1) return 'morgen';
  if (diffDays <= 7) return due.toLocaleDateString('nl', { weekday: 'long' });
  return due.toLocaleDateString('nl', { month: 'short', day: 'numeric' });
}

// ── Energy Algorithm ─────────────────────────────────────────────────────────
// Score = urgency_weight × energy_multiplier + priority_bonus
// Energy multiplier: high=1.0, normal=0.8, low=0.5 (low energy → prefer easy tasks)
// Rule: ALL urgent tasks (deadline today or tomorrow) are always included.

function buildShortlist(tasks, energy, size) {
  const energyMultiplier = { high: 1.0, normal: 0.8, low: 0.5 };
  const urgencyWeight = { urgent: 100, this_week: 50, upcoming: 10 };
  const complexityPenalty = { high: 30, medium: 15, low: 0 };
  const priorityBonus = { high: 40, normal: 0, low: -20 };
  const em = energyMultiplier[energy] || 0.8;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const pending = tasks.filter(t => t.status !== 'done' && !t.needs_enrichment);

  const scored = pending.map(t => {
    const urgency = getUrgency(t.deadline, Math.max(1, t.sessions_total - t.sessions_done));
    const uw = urgencyWeight[urgency];
    const cp = energy === 'low' ? complexityPenalty[t.complexity || 'medium'] : 0;
    const pb = priorityBonus[t.priority || 'normal'];

    // Session pressure bonus: extra score when sessions/day ratio is tight.
    // Rule: 1 session per subject per day → pressure = remaining / available_days
    // Cap at 30 to avoid drowning out other signals.
    const due = new Date(t.deadline + 'T00:00:00');
    const availableDays = Math.max(1, Math.ceil((due - today) / (1000 * 60 * 60 * 24)));
    const remaining = Math.max(0, t.sessions_total - t.sessions_done);
    const pressure = remaining / availableDays; // >1 = overloaded, ~1 = tight, <0.5 = relaxed
    const sessionBonus = Math.min(30, Math.round(pressure * 20));

    const score = (uw - cp + pb + sessionBonus) * em;
    return { ...t, urgency, score };
  });

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    // Tiebreaker: newer tasks first so freshly added tasks surface above older equal-scored tasks
    return (b.created_at || '') > (a.created_at || '') ? 1 : -1;
  });

  // Always include all urgent tasks, then fill up to `size` with the rest
  const urgent = scored.filter(t => t.urgency === 'urgent');
  const rest = scored.filter(t => t.urgency !== 'urgent');
  const filler = rest.slice(0, Math.max(0, size - urgent.length));
  return [...urgent, ...filler];
}

// ── Session / State ───────────────────────────────────────────────────────────

function isSetupDone() {
  return localStorage.getItem(SETUP_KEY) === 'true';
}

function markSetupDone() {
  localStorage.setItem(SETUP_KEY, 'true');
}

function getTodayEnergy() {
  const stored = localStorage.getItem(ENERGY_KEY);
  if (!stored) return null;
  const { energy, date } = JSON.parse(stored);
  if (date === new Date().toISOString().slice(0, 10)) return energy;
  return null; // stale — new day
}

function setTodayEnergy(energy) {
  localStorage.setItem(ENERGY_KEY, JSON.stringify({
    energy,
    date: new Date().toISOString().slice(0, 10)
  }));
}

// ── Capacity Warning ─────────────────────────────────────────────────────────
// Checks three consecutive 5-day windows (now, ~1 week, ~2 weeks ahead).
// Session load in a window starting after S available days:
//   before  = min(R, S)            — sessions that can happen before window
//   after   = max(0, D - S - W)    — days available after window end
//   forced  = max(0, R - before - after)
// Warns on the nearest window that hits the threshold (≥12 sessions).

function getCapacityWarning(tasks, settings) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const pending = tasks.filter(t => t.status !== 'done');
  const blocked = (settings.blocked_days && settings.blocked_days.specific) || [];
  const recurringBlocked = (settings.blocked_days && settings.blocked_days.recurring) || ['saturday', 'sunday'];
  const dayNames = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];

  function isAvailable(dateStr) {
    const d = new Date(dateStr + 'T00:00:00');
    if (recurringBlocked.includes(dayNames[d.getDay()])) return false;
    if (blocked.includes(dateStr)) return false;
    return true;
  }

  // Count available study days between today (inclusive) and a deadline (exclusive)
  function availableDaysUntil(deadline) {
    let count = 0;
    const cur = new Date(today);
    const due = new Date(deadline + 'T00:00:00');
    while (cur < due) {
      if (isAvailable(cur.toISOString().slice(0, 10))) count++;
      cur.setDate(cur.getDate() + 1);
    }
    return count;
  }

  // Return the calendar date of the (n+1)th available day (0-based offset n)
  function availableDayAt(n) {
    const cur = new Date(today);
    let found = -1;
    for (let i = 0; i < 365; i++) {
      if (isAvailable(cur.toISOString().slice(0, 10))) {
        found++;
        if (found === n) return new Date(cur);
      }
      cur.setDate(cur.getDate() + 1);
    }
    return null;
  }

  // Compute session load forced into a 5-day window that starts after S available days
  const WINDOW = 5;
  const BUSY_THRESHOLD = 12;

  function sessionsInWindow(s) {
    let total = 0;
    for (const t of pending) {
      const r = Math.max(0, t.sessions_total - t.sessions_done);
      if (r === 0) continue;
      const d = availableDaysUntil(t.deadline);
      const before = Math.min(r, s);
      const after  = Math.max(0, d - s - WINDOW);
      total += Math.max(0, r - before - after);
    }
    return total;
  }

  // Per-task check: fewer available days than sessions needed → immediate alert
  for (const t of pending) {
    const remaining = t.sessions_total - t.sessions_done;
    if (remaining <= 0) continue;
    const days = availableDaysUntil(t.deadline);
    if (days < remaining) {
      return `📅 "${t.title}" — te weinig tijd voor ${remaining} sessie${remaining !== 1 ? 's' : ''}`;
    }
  }

  // Check windows at offsets 0, 5, 10 available days
  const offsets = [
    { s: 0,  label: 'nu' },
    { s: 5,  label: 'over een week' },
    { s: 10, label: 'over twee weken' },
  ];

  for (const { s, label } of offsets) {
    const load = sessionsInWindow(s);
    if (load >= BUSY_THRESHOLD) {
      // For future windows, add the calendar date of window start for context
      if (s === 0) {
        return `📅 Drukke periode — ${load} sessies in ${WINDOW} dagen`;
      }
      const windowStart = availableDayAt(s);
      const dateLabel = windowStart
        ? windowStart.toLocaleDateString('nl', { day: 'numeric', month: 'short' })
        : label;
      return `📅 Drukke periode ${label} (${dateLabel}) — ${load} sessies`;
    }
  }

  return null;
}

// ── Active Session (sessionStorage) ──────────────────────────────────────────

function getActiveSession() {
  const raw = sessionStorage.getItem('flowstate_active_session');
  return raw ? JSON.parse(raw) : null;
}

function setActiveSession(taskId, sessionNumber) {
  sessionStorage.setItem('flowstate_active_session', JSON.stringify({
    taskId,
    sessionNumber,
    startedAt: Date.now()
  }));
}

function clearActiveSession() {
  sessionStorage.removeItem('flowstate_active_session');
}



function calcStreak(studyDays) {
  if (!studyDays || studyDays.length === 0) return 0;
  const today = new Date().toISOString().slice(0, 10);
  const sorted = [...studyDays].sort().reverse();
  let streak = 0;
  let check = new Date();
  check.setHours(0, 0, 0, 0);
  for (const day of sorted) {
    const checkStr = check.toISOString().slice(0, 10);
    if (day === checkStr) {
      streak++;
      check.setDate(check.getDate() - 1);
    } else break;
  }
  return streak;
}

// ── Greeting ─────────────────────────────────────────────────────────────────

function getGreeting(name) {
  const h = new Date().getHours();
  if (h < 12) return `Goedemorgen, ${name} ☀️`;
  if (h < 17) return `Goedemiddag, ${name} 👋`;
  return `Goedenavond, ${name} 🌙`;
}

// ── Navigation ───────────────────────────────────────────────────────────────

function navigate(page) {
  window.location.href = page;
}

// Export for modules (also works as globals via <script>)
window.FS = {
  initData, loadData, saveData,
  getUrgency, urgencyLabel, formatDeadline,
  buildShortlist,
  isSetupDone, markSetupDone,
  getTodayEnergy, setTodayEnergy,
  getCapacityWarning,
  getActiveSession, setActiveSession, clearActiveSession,
  calcStreak,
  getGreeting,
  navigate
};
