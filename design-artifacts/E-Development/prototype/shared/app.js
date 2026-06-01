// FlowState — App Data Store
// Handles LocalStorage persistence, task queries, and energy algorithm

const APP_KEY = 'flowstate_data';
const ENERGY_KEY = 'flowstate_energy_today';
const SETUP_KEY = 'flowstate_setup_done';
const DATA_VERSION = 3; // bump to reset stored data on breaking changes

// ── Auth ─────────────────────────────────────────────────────────────────────

const WORKER_URL = 'https://flowstate-proxy.flowstate-evelien.workers.dev';
const AUTH_TOKEN_KEY = 'flowstate_auth_token';

function getAuthToken() { return localStorage.getItem(AUTH_TOKEN_KEY); }
function setAuthToken(token) { localStorage.setItem(AUTH_TOKEN_KEY, token); }
function clearAuthToken() { localStorage.removeItem(AUTH_TOKEN_KEY); }
function isLoggedIn() { return !!getAuthToken(); }

// ── Cloud Sync ────────────────────────────────────────────────────────────────

async function fetchCloudData() {
  const token = getAuthToken();
  if (!token) return null;
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);
    const r = await fetch(`${WORKER_URL}/data`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (r.status === 401) { clearAuthToken(); return null; }
    if (!r.ok) return null;
    return await r.json();
  } catch { return null; }
}

async function fetchCloudEmail() {
  const token = getAuthToken();
  if (!token) return null;
  try {
    const r = await fetch(`${WORKER_URL}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!r.ok) return null;
    const { email } = await r.json();
    if (email) localStorage.setItem('flowstate_user_email', email);
    return email;
  } catch { return null; }
}

async function pushCloudData(data) {
  const token = getAuthToken();
  if (!token) return;
  try {
    await fetch(`${WORKER_URL}/data`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  } catch { /* silent — local save already succeeded */ }
}

// ── Background sync on visibility change ─────────────────────────────────────
// When the user switches back to the app (e.g. from desktop to phone), check
// if cloud has newer data and reload the page if so.
document.addEventListener('visibilitychange', async () => {
  if (document.visibilityState !== 'visible') return;
  if (!getAuthToken()) return;
  try {
    const cloud = await fetchCloudData();
    if (!cloud || (cloud._version || 0) < DATA_VERSION) return;
    const local = loadData();
    const cloudTs = cloud._updated_at || 0;
    const localTs = local ? (local._updated_at || 0) : 0;
    if (cloudTs > localTs) {
      localStorage.setItem(APP_KEY, JSON.stringify(cloud));
      window.location.reload();
    }
  } catch { /* silent */ }
});

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
  pushCloudData(data); // fire-and-forget; cloud failure never blocks local save
}

async function initData() {
  // Redirect to login if not authenticated (except on auth pages themselves)
  if (!getAuthToken()) {
    const path = window.location.pathname;
    if (!path.includes('00.1-login') && !path.includes('00.2-registreren')) {
      window.location.replace('00.1-login.html');
      // Wait briefly for the navigation to commit, then resolve with null
      // so callers don't hang forever if navigation is slow.
      await new Promise(resolve => setTimeout(resolve, 2000));
      return null;
    }
  }

  let local = loadData();
  const needsFresh = !local || (local._version || 0) < DATA_VERSION;

  // Fetch email from server (token already knows who we are — no need to store it in data)
  fetchCloudEmail();

  if (needsFresh) {
    // New device or outdated data — fetch cloud FIRST to avoid overwriting real data
    const cloud = await fetchCloudData();
    if (cloud && (cloud._version || 0) >= DATA_VERSION) {
      const pendingName = localStorage.getItem('flowstate_pending_name');
      if (pendingName) {
        cloud.settings.name = pendingName;
        localStorage.removeItem('flowstate_pending_name');
        pushCloudData(cloud);
      }
      localStorage.setItem(APP_KEY, JSON.stringify(cloud));
      _resetRecurringTasksIfNewDay(cloud);
      return cloud;
    }
    // No cloud data — brand new account, start fresh
    local = JSON.parse(JSON.stringify(DEMO_DATA));
    local._version = DATA_VERSION;
    local._updated_at = 0;
    const pendingName = localStorage.getItem('flowstate_pending_name');
    if (pendingName) {
      local.settings.name = pendingName;
      localStorage.removeItem('flowstate_pending_name');
    }
    localStorage.removeItem(SETUP_KEY);
    localStorage.removeItem(ENERGY_KEY);
    saveData(local);
    return local;
  }

  // Local data exists — sync with cloud
  const cloud = await fetchCloudData();
  if (cloud && (cloud._version || 0) >= DATA_VERSION) {
    const cloudTs = cloud._updated_at || 0;
    const localTs = local._updated_at || 0;
    if (cloudTs > localTs) {
      localStorage.setItem(APP_KEY, JSON.stringify(cloud));
      _resetRecurringTasksIfNewDay(cloud);
      return cloud;
    } else if (localTs > cloudTs) {
      pushCloudData(local);
    }
  } else if (!cloud) {
    pushCloudData(local);
  }

  _resetRecurringTasksIfNewDay(local);
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

// Returns an HTML badge string for a task type, or '' for Huiswerk/null.
function taskTypeBadge(type) {
  if (!type || type === 'Huiswerk') return '';
  const styles = {
    'Proefwerk': 'bg-red-50 text-red-600',
    'Mondeling': 'bg-purple-50 text-purple-600',
    'Opdracht':  'bg-indigo-50 text-indigo-600',
  };
  const cls = styles[type] || 'bg-indigo-50 text-indigo-600';
  return `<span class="text-xs ${cls} px-1.5 py-0.5 rounded font-medium flex-shrink-0">${type}</span>`;
}

// ── Daily Plan ────────────────────────────────────────────────────────────────
// Distributes sessions evenly across available days, respecting per-task deadlines.
// Rule: max 1 session per task per day.
//
// Algorithm:
//   pressure  = remaining_sessions / available_days_until_deadline
//   dailyTarget = max(forcedCount, ceil(totalRemaining / totalAvailableDays))
//   required  = top dailyTarget tasks sorted by pressure
//   optional  = next task (only for energy normal/high; low=easy tasks only)
//
// Self-correcting: as sessions are logged, pressure updates daily.

function buildDailyPlan(tasks, settings, energy) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = today.toISOString().slice(0, 10);

  const blocked          = (settings?.blocked_days?.specific)   || [];
  const recurringBlocked = (settings?.blocked_days?.recurring)  || ['saturday', 'sunday'];
  const dayNames = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];

  function isAvailable(dateStr) {
    const d = new Date(dateStr + 'T00:00:00');
    if (recurringBlocked.includes(dayNames[d.getDay()])) return false;
    if (blocked.includes(dateStr)) return false;
    return true;
  }

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

  const todayAvailable = isAvailable(todayStr);

  // Recurring tasks that are due today and not yet completed
  const recurringToday = todayAvailable
    ? tasks.filter(t => t.recurring && isRecurringDueToday(t) && t.last_completed !== todayStr && t.status !== 'done')
    : [];

  // Score every regular (non-recurring) pending task by deadline pressure
  const pending = tasks.filter(t => !t.recurring && t.status !== 'done' && !t.needs_enrichment);
  const scored = pending.map(t => {
    const remaining = Math.max(0, t.sessions_total - t.sessions_done);
    const days      = Math.max(1, availableDaysUntil(t.deadline));
    const pressure  = remaining / days;
    return { ...t, remaining, availableDays: days, pressure };
  }).filter(t => t.remaining > 0);

  scored.sort((a, b) => {
    if (Math.abs(b.pressure - a.pressure) > 0.0001) return b.pressure - a.pressure;
    // Tiebreak: soonest deadline first
    return a.deadline < b.deadline ? -1 : 1;
  });

  if (scored.length === 0 && recurringToday.length === 0 || !todayAvailable) {
    return { required: [...recurringToday], optional: null, dailyTarget: recurringToday.length, todayAvailable };
  }

  // Total load and available capacity
  const totalRemaining = scored.reduce((s, t) => s + t.remaining, 0);
  const latestDeadline = scored.reduce((max, t) => t.deadline > max ? t.deadline : max, todayStr);
  const totalDays      = Math.max(1, availableDaysUntil(latestDeadline));

  // forced = tasks that cannot skip today (remaining == availableDays)
  const forcedCount = scored.filter(t => t.remaining >= t.availableDays).length;
  const baseTarget  = Math.ceil(totalRemaining / totalDays);
  const dailyTarget = Math.max(1, forcedCount, baseTarget);

  const required   = [...recurringToday, ...scored.slice(0, dailyTarget)];
  const candidates = scored.slice(dailyTarget);

  // Optional session: skip for low energy unless task is simple
  let optional = null;
  if (candidates.length > 0) {
    if (energy === 'low') {
      optional = candidates.find(t => (t.complexity || 'medium') === 'low') || null;
    } else {
      optional = candidates[0];
    }
  }

  return { required, optional, dailyTarget, todayAvailable };
}

// Returns local calendar date as "YYYY-MM-DD" — use this everywhere instead of toISOString()
function getDayKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// Returns true if a session for taskId was already logged today
function hasSessionToday(taskId, sessions_log) {
  const today = getDayKey();
  return (sessions_log || []).some(s => s.task_id === taskId && s.date === today);
}

// ── Recurring Tasks ───────────────────────────────────────────────────────────

// Returns true if a recurring task is scheduled for today based on its period setting.
function isRecurringDueToday(task) {
  const type = task.recurring_type || 'daily';
  const todayDay = new Date().getDay(); // 0=Sun, 1=Mon, ..., 6=Sat

  if (type === 'daily') return true;

  if (type === 'interval') {
    const interval = task.recurring_interval || 2;
    if (!task.last_completed) return true;
    const last = new Date(task.last_completed + 'T00:00:00');
    const now = new Date(); now.setHours(0, 0, 0, 0); last.setHours(0, 0, 0, 0);
    return Math.round((now - last) / 86400000) >= interval;
  }

  if (type === 'weekly') {
    return todayDay === (task.recurring_weekday ?? todayDay);
  }

  if (type === 'weekdays') {
    return (task.recurring_weekdays || []).includes(todayDay);
  }

  return true;
}

// Returns a short Dutch label for the recurring period (e.g. "Om de 3 dagen", "Iedere maandag").
function getRecurringLabel(task) {
  const type = task.recurring_type || 'daily';
  const DAY_NAMES = ['zondag','maandag','dinsdag','woensdag','donderdag','vrijdag','zaterdag'];
  const DAY_SHORT = ['zo','ma','di','wo','do','vr','za'];
  if (type === 'daily') return '↻ Dagelijks';
  if (type === 'interval') {
    const n = task.recurring_interval || 2;
    return n === 2 ? '↻ Om de dag' : `↻ Om de ${n} dagen`;
  }
  if (type === 'weekly') {
    const day = task.recurring_weekday ?? new Date().getDay();
    return `↻ Iedere ${DAY_NAMES[day]}`;
  }
  if (type === 'weekdays') {
    const days = (task.recurring_weekdays || []).sort((a, b) => a - b);
    return '↻ ' + days.map(d => DAY_SHORT[d]).join(', ');
  }
  return '↻ Herhalend';
}

// Resets recurring tasks that are due today and were completed on a previous day.
// Called from initData() so it runs on every page load, on every device.
function _resetRecurringTasksIfNewDay(data) {
  const today = getDayKey();
  let changed = false;
  for (const task of (data.tasks || [])) {
    if (!task.recurring) continue;
    if (task.last_completed && task.last_completed !== today) {
      if (isRecurringDueToday(task)) {
        task.sessions_done = 0;
        task.status = 'pending';
        task.last_completed = null;
        if (task.subtasks) task.subtasks.forEach(s => { s.done = false; });
        changed = true;
      }
      // else: not due today — leave as done so it stays hidden from shortlist
    }
  }
  if (changed) saveData(data);
}

// Centralized session-completion helper — handles regular and recurring tasks.
// Mutates task in-place; caller must call saveData(data) afterward.
function applySessionDone(task) {
  task.sessions_done = Math.min(task.sessions_total, (task.sessions_done || 0) + 1);
  if (task.sessions_done >= task.sessions_total) {
    task.status = 'done';
    if (task.recurring) task.last_completed = getDayKey();
  } else {
    task.status = 'in_progress';
  }
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

// Shared calendar helpers used by both capacity functions below.
function _buildCapacityHelpers(settings) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const blocked          = (settings.blocked_days && settings.blocked_days.specific)  || [];
  const recurringBlocked = (settings.blocked_days && settings.blocked_days.recurring) || ['saturday', 'sunday'];
  const dayNames = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];

  function isAvailable(dateStr) {
    const d = new Date(dateStr + 'T00:00:00');
    if (recurringBlocked.includes(dayNames[d.getDay()])) return false;
    if (blocked.includes(dateStr)) return false;
    return true;
  }

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

  return { today, isAvailable, availableDaysUntil, availableDayAt };
}

// Returns IDs of tasks that have fewer available study days than sessions remaining.
function getCapacityPressuredTaskIds(tasks, settings) {
  const { availableDaysUntil } = _buildCapacityHelpers(settings);
  const ids = [];
  for (const t of tasks.filter(t => t.status !== 'done' && !t.recurring)) {
    const remaining = t.sessions_total - t.sessions_done;
    if (remaining <= 0) continue;
    if (availableDaysUntil(t.deadline) < remaining) ids.push(t.id);
  }
  return ids;
}

function getCapacityWarning(tasks, settings) {
  const { availableDaysUntil, availableDayAt } = _buildCapacityHelpers(settings);
  // Recurring tasks have no deadline — exclude from all capacity calculations
  const pending = tasks.filter(t => t.status !== 'done' && !t.recurring);

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
    if (availableDaysUntil(t.deadline) < remaining) {
      return '📅 Er zijn taken waarvoor je te weinig tijd hebt.';
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
  return getStreakStatus(studyDays).streak;
}

// Returns { streak, studiedToday } using local calendar days.
// Grace period: if studied yesterday but not today, streak stays alive.
function getStreakStatus(studyDays) {
  if (!studyDays || studyDays.length === 0) return { streak: 0, studiedToday: false };
  const unique = [...new Set(studyDays)].sort().reverse();
  const todayStr     = getDayKey();
  const yesterdayStr = getDayKey(new Date(Date.now() - 86400000));
  const studiedToday = unique[0] === todayStr;
  const startStr = studiedToday ? todayStr
                 : unique[0] === yesterdayStr ? yesterdayStr
                 : null;
  if (!startStr) return { streak: 0, studiedToday: false };
  let streak = 0;
  // Parse as local noon to avoid any DST/rollover issues when subtracting days
  let checkMs = new Date(`${startStr}T12:00:00`).getTime();
  for (const day of unique) {
    if (day === getDayKey(new Date(checkMs))) {
      streak++;
      checkMs -= 86400000;
    } else break;
  }
  return { streak, studiedToday };
}

// ── Gamification ─────────────────────────────────────────────────────────────

function getStreakMessage(streak, studiedToday) {
  if (streak === 0) return 'No cap, begin vandaag — elke dag telt 👀';
  if (!studiedToday) return `Aye, studeer vandaag om je ${streak}-daagse streak te saven! ⚡`;
  if (streak === 1)  return 'W move! Dag 1 zit erop, let\'s go 🔥';
  if (streak === 2)  return 'Twee op een rij — wat een vibe 🚀';
  if (streak < 5)   return `${streak} dagen non-stop, slay! Je hebt écht dat ritme ⚡`;
  if (streak < 7)   return `${streak} dagen?! Bestie dat is fire 🌟`;
  if (streak < 14)  return `${streak} dagen aan een stuk — dat is geen fluke, dat ben jij 🏆`;
  if (streak < 21)  return 'Twee weken! Echt niet normaal meer 👑';
  if (streak < 30)  return 'Drie weken non-stop, dat is main character energy 🔥';
  return `${streak} dagen! Certified studeerheld, periodt 👑🔥`;
}

const _COMPLIMENTS = [
  'Slay! Weer een sessie erop 🎉',
  'No cap, je bent écht aan het groeien 📈',
  'W sessie! Elke keer een beetje beter 💪',
  'Bestie, je hersenen bedanken je later 🧠',
  'Periodt! Weer een stap dichter bij je doel 🚀',
  'Lowkey trots op je rn ⭐',
  'That\'s the move — consistent blijven 🔑',
  'You ate! Serieus goed bezig 🔥',
];
function getCompletionCompliment() {
  return _COMPLIMENTS[Math.floor(Math.random() * _COMPLIMENTS.length)];
}

const XP_PER_SESSION = 10;
const LEVELS = [
  { level: 1, name: 'Beginner',     minXP: 0   },
  { level: 2, name: 'Leerling',     minXP: 50  },
  { level: 3, name: 'Studeer-held', minXP: 150 },
  { level: 4, name: 'Kenner',       minXP: 300 },
  { level: 5, name: 'Meester',      minXP: 500 },
];

function calcXP(sessions_log) {
  return (sessions_log || []).length * XP_PER_SESSION;
}

function getLevel(xp) {
  let current = LEVELS[0];
  for (const l of LEVELS) { if (xp >= l.minXP) current = l; }
  const nextIdx = LEVELS.findIndex(l => l.level === current.level) + 1;
  const next = LEVELS[nextIdx] || null;
  const progress = next
    ? Math.min(100, Math.round(((xp - current.minXP) / (next.minXP - current.minXP)) * 100))
    : 100;
  return { ...current, xp, nextLevel: next, progress };
}

function showConfetti() {
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:9998;pointer-events:none';
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  const colors = ['#6366f1','#f59e0b','#10b981','#ef4444','#8b5cf6','#ec4899','#06b6d4','#f97316'];
  const particles = Array.from({ length: 100 }, () => ({
    x: Math.random() * canvas.width,
    y: -20 - Math.random() * canvas.height * 0.5,
    w: 7 + Math.random() * 8,
    h: 5 + Math.random() * 6,
    color: colors[Math.floor(Math.random() * colors.length)],
    r: Math.random() * Math.PI * 2,
    dr: (Math.random() - 0.5) * 0.15,
    vy: 3 + Math.random() * 4,
    vx: (Math.random() - 0.5) * 2.5,
  }));
  const start = Date.now();
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.y += p.vy; p.x += p.vx; p.r += p.dr;
      ctx.save();
      ctx.translate(p.x + p.w / 2, p.y + p.h / 2);
      ctx.rotate(p.r);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });
    if (Date.now() - start < 3500) requestAnimationFrame(draw);
    else canvas.remove();
  }
  draw();
}

// Persist daily plan in localStorage so the list stays stable across app reopens.
// The plan is locked for the day; only the display of completed tasks may change.
function saveTodayPlan(plan) {
  localStorage.setItem('fs_daily_plan', JSON.stringify({
    date:          getDayKey(),
    requiredIds:   plan.required.map(t => t.id),
    optionalId:    plan.optional ? plan.optional.id : null,
    todayAvailable: plan.todayAvailable,
    dailyTarget:   plan.dailyTarget,
  }));
}

function loadTodayPlan(tasks) {
  try {
    const raw = localStorage.getItem('fs_daily_plan');
    if (!raw) return null;
    const saved = JSON.parse(raw);
    if (saved.date !== getDayKey()) return null;
    const taskMap = new Map(tasks.map(t => [t.id, t]));

    // Re-inject recurring tasks due today that haven't been completed yet
    const today = getDayKey();
    const recurringToday = tasks.filter(t => t.recurring && isRecurringDueToday(t) && t.last_completed !== today && t.status !== 'done');

    // Only restore non-recurring tasks from cache
    const cachedRequired = (saved.requiredIds || [])
      .map(id => taskMap.get(id))
      .filter(t => t && !t.recurring);

    const required = [...recurringToday, ...cachedRequired];
    const optional = saved.optionalId ? (taskMap.get(saved.optionalId) || null) : null;
    return { required, optional, todayAvailable: saved.todayAvailable, dailyTarget: saved.dailyTarget };
  } catch { return null; }
}


function showToast(msg) {
  const existing = document.getElementById('fs-toast');
  if (existing) existing.remove();
  const el = document.createElement('div');
  el.id = 'fs-toast';
  el.textContent = msg;
  el.style.cssText = [
    'position:fixed', 'bottom:80px', 'left:50%', 'transform:translateX(-50%)',
    'background:#1f2937', 'color:#fff', 'padding:10px 20px', 'border-radius:999px',
    'font-size:14px', 'font-weight:500', 'z-index:9999',
    'box-shadow:0 4px 16px rgba(0,0,0,0.18)',
    'transition:opacity 0.3s', 'opacity:0', 'white-space:nowrap',
  ].join(';');
  document.body.appendChild(el);
  requestAnimationFrame(() => { el.style.opacity = '1'; });
  setTimeout(() => {
    el.style.opacity = '0';
    setTimeout(() => el.remove(), 300);
  }, 2500);
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
  getUrgency, urgencyLabel, formatDeadline, taskTypeBadge,
  buildDailyPlan, hasSessionToday,
  isSetupDone, markSetupDone,
  getTodayEnergy, setTodayEnergy,
  getCapacityWarning, getCapacityPressuredTaskIds,
  getActiveSession, setActiveSession, clearActiveSession,
  getDayKey,
  calcStreak, getStreakStatus, getStreakMessage,
  getCompletionCompliment, calcXP, getLevel,
  showToast, showConfetti, saveTodayPlan, loadTodayPlan,
  getGreeting,
  navigate,
  isLoggedIn, getAuthToken, setAuthToken, clearAuthToken, pushCloudData, WORKER_URL,
  applySessionDone, isRecurringDueToday, getRecurringLabel,
};
