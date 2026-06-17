/**
 * FlowState — Magister API proxy + user auth + data sync
 *
 * Routes:
 *   POST /auth             { school, username, password } → { access_token, person_id, expires_at }
 *   GET  /homework         ?school=&token=&person_id=&from=&to= → { assignments: [...] }
 *   POST /register         { email, password } → { token, expires_at }
 *   POST /login            { email, password } → { token, expires_at }
 *   POST /forgot-password  { email } → { ok: true }  — verstuurt reset-mail via Resend.com
 *   POST /reset-password   { token, new_password } → { token, expires_at }
 *   POST /change-password  (Bearer) { current_password, new_password } → { ok: true }
 *   DELETE /account        (Bearer) → { ok: true }
 *   GET  /me               (Bearer) → { email }
 *   GET  /data             (Bearer) → data blob
 *   PUT  /data             (Bearer) + body → saved
 *
 * KV bindings required (wrangler.toml):
 *   FLOWSTATE_KV — stores user accounts, sessions, and data blobs
 */

const ALLOWED_ORIGINS = new Set([
  'https://flowstate-app.surge.sh',
  'https://flowz.pages.dev',
]);

function corsHeaders(request) {
  const origin = request.headers.get('Origin') || '';
  const allowed = ALLOWED_ORIGINS.has(origin) || origin.endsWith('.flowz.pages.dev')
    ? origin
    : 'https://flowz.pages.dev';
  return {
    'Access-Control-Allow-Origin':  allowed,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age':       '86400',
  };
}

export default {
  async fetch(request, env) {
    const CORS = corsHeaders(request);
    if (request.method === 'OPTIONS') return new Response(null, { headers: CORS });

    const url = new URL(request.url);
    try {
      if (url.pathname === '/auth'            && request.method === 'POST')   return handleAuth(request, CORS);
      if (url.pathname === '/homework'        && request.method === 'GET')    return handleHomework(url, request, CORS);
      if (url.pathname === '/register'        && request.method === 'POST')   return handleRegister(request, env, CORS);
      if (url.pathname === '/login'           && request.method === 'POST')   return handleLogin(request, env, CORS);
      if (url.pathname === '/forgot-password' && request.method === 'POST')   return handleForgotPassword(request, env, CORS);
      if (url.pathname === '/reset-password'  && request.method === 'POST')   return handleResetPassword(request, env, CORS);
      if (url.pathname === '/change-password' && request.method === 'POST')   return handleChangePassword(request, env, CORS);
      if (url.pathname === '/account'         && request.method === 'DELETE') return handleDeleteAccount(request, env, CORS);
      if (url.pathname === '/me'              && request.method === 'GET')    return handleMe(request, env, CORS);
      if (url.pathname === '/data'            && request.method === 'GET')    return handleGetData(request, env, CORS);
      if (url.pathname === '/data'            && request.method === 'PUT')    return handlePutData(request, env, CORS);
      return json({ error: 'Not found' }, 404, CORS);
    } catch (e) {
      return json({ error: e.message }, 500, CORS);
    }
  },
};

// ─── Auth ────────────────────────────────────────────────────────────────────

async function handleAuth(request, cors) {
  const { school, username, password } = await request.json();
  if (!school || !username || !password) return json({ error: 'Missing fields' }, 400, cors);

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
  async function follow(url, init = {}, depth = 0) {
    if (depth > 10) return json({ error: 'Te veel redirects tijdens authenticatie' }, 502, cors);
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
    return follow(locUrl.href, {}, depth + 1);
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
  if (!sessionIdM || !returnUrlM) return json({ error: 'Could not start auth session' }, 401, cors);

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
    return json({ error: 'Deze school gebruikt Microsoft SSO. Direct inloggen niet mogelijk.' }, 400, cors);
  }

  // Step 4 — submit password
  const pwResult = await challenge('password', { password });
  if (pwResult.error || !pwResult.redirectURL) {
    return json({ error: 'Gebruikersnaam of wachtwoord onjuist' }, 401, cors);
  }

  // Handle optional 2FA prompts (skip FIDO promo; TOTP not supported here)
  if (pwResult.action === 'pairfidopromo') {
    await challenge('skip-pair-fido-promo', {});
  }

  // Step 5 — follow redirect, capture token from hash fragment
  const finalResp     = await follow(`https://accounts.magister.net${pwResult.redirectURL}`);
  const finalLocation = finalResp.headers.get('location') ?? '';
  const hashIdx       = finalLocation.indexOf('#');
  if (hashIdx === -1) return json({ error: 'Authenticatie mislukt — geen token ontvangen' }, 401, cors);

  const hashParams  = new URLSearchParams(finalLocation.slice(hashIdx + 1));
  const accessToken = hashParams.get('access_token');
  const expiresIn   = parseInt(hashParams.get('expires_in') ?? '3600', 10);
  if (!accessToken) return json({ error: 'Authenticatie mislukt — kon token niet uitlezen' }, 401, cors);

  // Step 6 — get personId
  const acctResp = await fetch(`https://${host}/api/account?noCache=0`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const acct     = await acctResp.json().catch(() => ({}));
  const personId = acct?.Persoon?.Id ?? null;

  return json({ access_token: accessToken, person_id: personId, expires_at: Date.now() + expiresIn * 1000 }, 200, cors);
}

// ─── Homework ────────────────────────────────────────────────────────────────

async function handleHomework(url, request, cors) {
  const school   = url.searchParams.get('school');
  const personId = url.searchParams.get('person_id');
  const from     = url.searchParams.get('from') ?? today();
  const to       = url.searchParams.get('to')   ?? addDays(today(), 90);

  const authHeader = request.headers.get('Authorization') ?? '';
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();

  if (!school || !token || !personId) return json({ error: 'Missing params' }, 400, cors);

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
      description: stripHtml(a.Inhoud ?? ''),
      type:        INFO_LABELS[a.InfoType] ?? 'Huiswerk',
    }));

  const fromAssignments = (opdrRaw.Items ?? [])
    .filter(a => a.InleverenVoor)
    .map(a => ({
      id:          `opr_${a.Id}`,
      title:       a.Titel || a.Omschrijving || 'Opdracht',
      subject:     a.Vak ?? '',
      deadline:    a.InleverenVoor.slice(0, 10),
      description: stripHtml(a.Omschrijving ?? ''),
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

  return json({ assignments }, 200, cors);
}

// ─── User auth ───────────────────────────────────────────────────────────────

async function hashPassword(password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations: 100_000, hash: 'SHA-256' }, key, 256);
  return {
    hash: btoa(String.fromCharCode(...new Uint8Array(bits))),
    salt: btoa(String.fromCharCode(...salt)),
  };
}

async function verifyPassword(password, storedHash, storedSalt) {
  const salt = Uint8Array.from(atob(storedSalt), c => c.charCodeAt(0));
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations: 100_000, hash: 'SHA-256' }, key, 256);
  return btoa(String.fromCharCode(...new Uint8Array(bits))) === storedHash;
}

async function createSession(env, email) {
  const token = crypto.randomUUID();
  const expires_at = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 days
  await env.FLOWSTATE_KV.put(
    `session:${token}`,
    JSON.stringify({ email, expires_at }),
    { expiration: Math.floor(expires_at / 1000) },
  );
  return { token, expires_at };
}

async function resolveToken(request, env) {
  const auth = request.headers.get('Authorization') || '';
  const token = auth.replace(/^Bearer\s+/i, '').trim();
  if (!token) return null;
  const raw = await env.FLOWSTATE_KV.get(`session:${token}`);
  if (!raw) return null;
  const session = JSON.parse(raw);
  if (session.expires_at < Date.now()) { await env.FLOWSTATE_KV.delete(`session:${token}`); return null; }
  return session.email;
}

async function handleRegister(request, env, cors) {
  const { email, password } = await request.json();
  if (!email || !password) return json({ error: 'Vul email en wachtwoord in' }, 400, cors);
  if (password.length < 8) return json({ error: 'Wachtwoord moet minimaal 8 tekens zijn' }, 400, cors);
  const normalizedEmail = email.toLowerCase().trim();
  if (await env.FLOWSTATE_KV.get(`user:${normalizedEmail}`))
    return json({ error: 'Dit e-mailadres is al geregistreerd' }, 409, cors);
  const { hash, salt } = await hashPassword(password);
  await env.FLOWSTATE_KV.put(`user:${normalizedEmail}`, JSON.stringify({ hash, salt, created_at: Date.now() }));
  return json(await createSession(env, normalizedEmail), 200, cors);
}

async function handleLogin(request, env, cors) {
  const { email, password } = await request.json();
  if (!email || !password) return json({ error: 'Vul email en wachtwoord in' }, 400, cors);
  const normalizedEmail = email.toLowerCase().trim();
  const userRaw = await env.FLOWSTATE_KV.get(`user:${normalizedEmail}`);
  if (!userRaw) return json({ error: 'E-mailadres of wachtwoord onjuist' }, 401, cors);
  const user = JSON.parse(userRaw);
  if (!(await verifyPassword(password, user.hash, user.salt)))
    return json({ error: 'E-mailadres of wachtwoord onjuist' }, 401, cors);
  return json(await createSession(env, normalizedEmail), 200, cors);
}

async function handleForgotPassword(request, env, cors) {
  const { email } = await request.json();
  if (!email) return json({ error: 'Vul je e-mailadres in' }, 400, cors);
  const normalizedEmail = email.toLowerCase().trim();
  const userRaw = await env.FLOWSTATE_KV.get(`user:${normalizedEmail}`);
  // Don't reveal whether the account exists
  if (!userRaw) return json({ ok: true }, 200, cors);
  const token = crypto.randomUUID();
  await env.FLOWSTATE_KV.put(
    `reset:${token}`,
    JSON.stringify({ email: normalizedEmail, expires_at: Date.now() + 60 * 60 * 1000 }),
    { expirationTtl: 3600 },
  );

  const webFallback = `https://flowz.pages.dev/00.4-wachtwoord-resetten.html?token=${token}`;

  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Flowz <noreply@flowz.pages.dev>',
        to: [normalizedEmail],
        subject: 'Wachtwoord opnieuw instellen — Flowz',
        html: `
          <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px">
            <h1 style="font-size:24px;font-weight:700;color:#111827;margin-bottom:8px">Wachtwoord opnieuw instellen</h1>
            <p style="color:#6b7280;margin-bottom:24px">Klik op de knop hieronder om je wachtwoord te wijzigen. De link is 1 uur geldig.</p>
            <a href="${webFallback}"
               style="display:inline-block;background:#6366f1;color:#fff;font-weight:600;padding:12px 24px;border-radius:12px;text-decoration:none;margin-bottom:24px">
              Wachtwoord wijzigen
            </a>
            <p style="color:#9ca3af;font-size:13px">Heb jij dit niet aangevraagd? Dan hoef je niks te doen.</p>
          </div>`,
      }),
    });
  } catch (e) {
    // Email sending failed — log but don't expose to client
    console.error('Resend error:', e);
  }

  return json({ ok: true }, 200, cors);
}

async function handleResetPassword(request, env, cors) {
  const { token, new_password } = await request.json();
  if (!token || !new_password) return json({ error: 'Ongeldige aanvraag' }, 400, cors);
  if (new_password.length < 8) return json({ error: 'Wachtwoord moet minimaal 8 tekens zijn' }, 400, cors);
  const raw = await env.FLOWSTATE_KV.get(`reset:${token}`);
  if (!raw) return json({ error: 'Deze link is verlopen of ongeldig' }, 400, cors);
  const { email, expires_at } = JSON.parse(raw);
  if (expires_at < Date.now()) {
    await env.FLOWSTATE_KV.delete(`reset:${token}`);
    return json({ error: 'Deze link is verlopen. Vraag een nieuwe aan.' }, 400, cors);
  }
  const userRaw = await env.FLOWSTATE_KV.get(`user:${email}`);
  if (!userRaw) return json({ error: 'Account niet gevonden' }, 404, cors);
  const user = JSON.parse(userRaw);
  const { hash, salt } = await hashPassword(new_password);
  await env.FLOWSTATE_KV.put(`user:${email}`, JSON.stringify({ ...user, hash, salt }));
  await env.FLOWSTATE_KV.delete(`reset:${token}`);
  return json(await createSession(env, email), 200, cors);
}

async function handleChangePassword(request, env, cors) {
  const email = await resolveToken(request, env);
  if (!email) return json({ error: 'Niet ingelogd' }, 401, cors);
  const { current_password, new_password } = await request.json();
  if (!current_password || !new_password) return json({ error: 'Vul beide velden in' }, 400, cors);
  if (new_password.length < 8) return json({ error: 'Wachtwoord moet minimaal 8 tekens zijn' }, 400, cors);
  const userRaw = await env.FLOWSTATE_KV.get(`user:${email}`);
  if (!userRaw) return json({ error: 'Account niet gevonden' }, 404, cors);
  const user = JSON.parse(userRaw);
  if (!(await verifyPassword(current_password, user.hash, user.salt)))
    return json({ error: 'Huidig wachtwoord klopt niet' }, 401, cors);
  const { hash, salt } = await hashPassword(new_password);
  await env.FLOWSTATE_KV.put(`user:${email}`, JSON.stringify({ ...user, hash, salt }));
  return json({ ok: true }, 200, cors);
}

async function handleDeleteAccount(request, env, cors) {
  const email = await resolveToken(request, env);
  if (!email) return json({ error: 'Niet ingelogd' }, 401, cors);
  const auth  = request.headers.get('Authorization') || '';
  const token = auth.replace(/^Bearer\s+/i, '').trim();
  await env.FLOWSTATE_KV.delete(`user:${email}`);
  await env.FLOWSTATE_KV.delete(`data:${email}`);
  if (token) await env.FLOWSTATE_KV.delete(`session:${token}`);
  return json({ ok: true }, 200, cors);
}

async function handleMe(request, env, cors) {
  const email = await resolveToken(request, env);
  if (!email) return json({ error: 'Niet ingelogd' }, 401, cors);
  return json({ email }, 200, cors);
}

async function handleGetData(request, env, cors) {
  const email = await resolveToken(request, env);
  if (!email) return json({ error: 'Niet ingelogd' }, 401, cors);
  const raw = await env.FLOWSTATE_KV.get(`data:${email}`);
  return json(raw ? JSON.parse(raw) : null, 200, cors);
}

async function handlePutData(request, env, cors) {
  const email = await resolveToken(request, env);
  if (!email) return json({ error: 'Niet ingelogd' }, 401, cors);
  const data = await request.json();
  await env.FLOWSTATE_KV.put(`data:${email}`, JSON.stringify(data));
  return json({ ok: true }, 200, cors);
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function json(data, status = 200, cors = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...cors },
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
