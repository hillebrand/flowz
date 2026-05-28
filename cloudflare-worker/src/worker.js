/**
 * FlowState — Magister API proxy
 * Handles CORS and the Magister challenge-based OIDC auth flow.
 *
 * Routes:
 *   POST /auth      { school, username, password } → { access_token, person_id, expires_at }
 *   GET  /homework  ?school=&token=&person_id=&from=&to= → { assignments: [...] }
 */

const ALLOWED_ORIGIN = 'https://flowstate-app.surge.sh';

const CORS = {
  'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400',
};

export default {
  async fetch(request) {
    if (request.method === 'OPTIONS') return new Response(null, { headers: CORS });

    const url = new URL(request.url);
    try {
      if (url.pathname === '/auth' && request.method === 'POST') return handleAuth(request);
      if (url.pathname === '/homework' && request.method === 'GET')  return handleHomework(url);
      return json({ error: 'Not found' }, 404);
    } catch (e) {
      return json({ error: e.message }, 500);
    }
  },
};

// ─── Auth ────────────────────────────────────────────────────────────────────

async function handleAuth(request) {
  const { school, username, password } = await request.json();
  if (!school || !username || !password) return json({ error: 'Missing fields' }, 400);

  const host = school.includes('.') ? school : `${school}.magister.net`;

  // Cookie jar
  const jar = new Map();
  const saveCookies = (r) => {
    for (const sc of (r.headers.getSetCookie?.() ?? [])) {
      const [kv] = sc.split(';');
      const eq = kv.indexOf('=');
      if (eq > 0) jar.set(kv.slice(0, eq).trim(), kv.slice(eq + 1).trim());
    }
  };
  const cookies = () => [...jar].map(([k, v]) => `${k}=${v}`).join('; ');

  // Follow redirects, stop when we hit redirect_callback.html
  async function follow(url, init = {}) {
    const r = await fetch(url, {
      ...init,
      redirect: 'manual',
      headers: { ...init.headers, Cookie: cookies() },
    });
    saveCookies(r);
    const loc = r.headers.get('location');
    if (!loc) return r;
    const locUrl = new URL(loc, url);
    if (locUrl.pathname.endsWith('redirect_callback.html')) return r;
    return follow(locUrl.href);
  }

  const rand = () =>
    btoa(String.fromCharCode(...Array.from({ length: 16 }, () => (Math.random() * 256) | 0)))
      .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');

  // Step 1 — start OIDC authorize flow
  const qs = new URLSearchParams({
    client_id:     `M6-${host}`,
    state:         rand(),
    redirect_uri:  `https://${host}/oidc/redirect_callback.html`,
    response_type: 'id_token token',
    acr_values:    `tenant:${host}`,
    nonce:         rand(),
    scope:         'openid profile',
  });
  const loginResp = await follow(`https://accounts.magister.net/connect/authorize?${qs}`);

  const sessionIdM = loginResp.url.match(/sessionId=([a-f0-9A-F-]+)/);
  const returnUrlM = loginResp.url.match(/returnUrl=([^&]+)/);
  if (!sessionIdM || !returnUrlM) return json({ error: 'Could not start auth session' }, 401);

  const sessionId = sessionIdM[1];
  const returnUrl = decodeURIComponent(returnUrlM[1]);
  const xsrf      = decodeURIComponent(jar.get('XSRF-TOKEN') ?? '');

  // Step 2 — challenge helper
  const challenge = async (path, body) => {
    const r = await fetch(`https://accounts.magister.net/challenges/${path}`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', 'X-XSRF-TOKEN': xsrf, Cookie: cookies() },
      body:    JSON.stringify({ sessionId, returnUrl, ...body }),
    });
    saveCookies(r);
    return r.json();
  };

  // Step 3 — submit username
  const usernameResult = await challenge('username', { username });
  if (usernameResult.action === 'externalidp') {
    return json({ error: 'Deze school gebruikt Microsoft SSO. Direct inloggen niet mogelijk.' }, 400);
  }

  // Step 4 — submit password
  const pwResult = await challenge('password', { password });
  if (pwResult.error || !pwResult.redirectURL) {
    return json({ error: 'Gebruikersnaam of wachtwoord onjuist' }, 401);
  }

  // Handle optional 2FA prompts (skip FIDO promo; TOTP not supported here)
  if (pwResult.action === 'pairfidopromo') {
    await challenge('skip-pair-fido-promo', {});
  }

  // Step 5 — follow redirect, capture token from hash fragment
  const finalResp     = await follow(`https://accounts.magister.net${pwResult.redirectURL}`);
  const finalLocation = finalResp.headers.get('location') ?? '';
  const hashIdx       = finalLocation.indexOf('#');
  if (hashIdx === -1) return json({ error: 'Authenticatie mislukt — geen token ontvangen' }, 401);

  const hashParams  = new URLSearchParams(finalLocation.slice(hashIdx + 1));
  const accessToken = hashParams.get('access_token');
  const expiresIn   = parseInt(hashParams.get('expires_in') ?? '3600', 10);
  if (!accessToken) return json({ error: 'Authenticatie mislukt — kon token niet uitlezen' }, 401);

  // Step 6 — get personId
  const acctResp = await fetch(`https://${host}/api/account?noCache=0`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const acct     = await acctResp.json().catch(() => ({}));
  const personId = acct?.Persoon?.Id ?? null;

  return json({ access_token: accessToken, person_id: personId, expires_at: Date.now() + expiresIn * 1000 });
}

// ─── Homework ────────────────────────────────────────────────────────────────

async function handleHomework(url) {
  const school   = url.searchParams.get('school');
  const token    = url.searchParams.get('token');
  const personId = url.searchParams.get('person_id');
  const from     = url.searchParams.get('from') ?? today();
  const to       = url.searchParams.get('to')   ?? addDays(today(), 90);

  if (!school || !token || !personId) return json({ error: 'Missing params' }, 400);

  const host    = school.includes('.') ? school : `${school}.magister.net`;
  const headers = { Authorization: `Bearer ${token}` };

  const [afsprRaw, opdrRaw] = await Promise.all([
    fetch(`https://${host}/api/personen/${personId}/afspraken?van=${from}&tot=${to}`, { headers })
      .then(r => r.json()).catch(() => ({ Items: [] })),
    fetch(`https://${host}/api/personen/${personId}/opdrachten?top=100&startdatum=${from}&einddatum=${to}`, { headers })
      .then(r => r.json()).catch(() => ({ Items: [] })),
  ]);

  // InfoType: 1=Huiswerk, 2=Proefwerk, 3=Tentamen, 4=SchriftelijkeOverhoring, 5=MondelingeOverhoring
  const INFO_LABELS = { 1: 'Huiswerk', 2: 'Proefwerk', 3: 'Tentamen', 4: 'S.O.', 5: 'Mondeling' };

  const fromAppointments = (afsprRaw.Items ?? [])
    .filter(a => [1, 2, 3, 4, 5].includes(a.InfoType) && a.Einde)
    .map(a => ({
      id:          `afs_${a.Id}`,
      title:       a.Omschrijving || stripHtml(a.Inhoud) || 'Huiswerk',
      subject:     a.Vakken?.[0]?.Naam ?? '',
      deadline:    a.Einde.slice(0, 10),
      description: a.Inhoud ?? '',
      type:        INFO_LABELS[a.InfoType] ?? 'Huiswerk',
    }));

  const fromAssignments = (opdrRaw.Items ?? [])
    .filter(a => a.InleverenVoor)
    .map(a => ({
      id:          `opr_${a.Id}`,
      title:       a.Titel || a.Omschrijving || 'Opdracht',
      subject:     a.Vak ?? '',
      deadline:    a.InleverenVoor.slice(0, 10),
      description: a.Omschrijving ?? '',
      type:        'Opdracht',
    }));

  // Deduplicate by title+deadline, sort by deadline
  const seen = new Set();
  const assignments = [...fromAppointments, ...fromAssignments]
    .filter(a => {
      const key = `${a.title}|${a.deadline}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) => a.deadline.localeCompare(b.deadline));

  return json({
    assignments,
    _debug: {
      afspraken_total: (afsprRaw.Items ?? []).length,
      afspraken_matched: fromAppointments.length,
      opdrachten_total: (opdrRaw.Items ?? []).length,
      opdrachten_matched: fromAssignments.length,
    },
  });
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS },
  });
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function addDays(dateStr, days) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function stripHtml(html = '') {
  return html.replace(/<[^>]*>/g, '').trim();
}
