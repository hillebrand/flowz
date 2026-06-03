# Architectuurbeslissingen

Dit document legt technische beslissingen vast die de richting van de echte implementatie bepalen.

---

## ADR-001 — Native app voor productie-implementatie

**Datum:** 2026-06-03  
**Status:** Besloten  

### Context

De huidige Magister-integratie in het prototype maakt gebruik van een **bookmarklet**: de gebruiker installeert eenmalig een JavaScript-bladwijzer, opent Magister, klikt op de bladwijzer, en wordt teruggestuurd naar Flowz met het access token in de URL.

Deze aanpak is noodzakelijk omdat:
- Magister's OAuth-server alleen geregistreerde `redirect_uri`'s accepteert
- `lmc-vo.magister.net` en de meeste scholen gebruiken **Microsoft EntraID** (Azure AD SSO) voor authenticatie
- Een gewone web-app geen eigen `redirect_uri` kan laten registreren bij Magister zonder hun medewerking
- Cross-origin beperkingen in de browser verhinderen dat een web-app de token-callback onderschept

De bookmarklet werkt technisch, maar heeft een stroeve UX (eenmalige setup met meerdere stappen).

### Beslissing

Bij de **productie-implementatie** van Flowz wordt gekozen voor een **native app** (iOS en/of Android), in plaats van een web-app (PWA, Vue 3 + Vite, of vergelijkbaar).

### Reden

Een native app kan gebruik maken van:
- **Custom URL schemes** (`flowz://callback`) als OAuth `redirect_uri` — dit werkt met alle OIDC-servers
- **In-app browser** (`SFSafariViewController` op iOS, `Chrome Custom Tabs` op Android) voor de Magister/Microsoft SSO-flow
- De bookmarklet-stap vervalt volledig: gebruiker logt in via een webview, tokens worden automatisch onderschept

### Wat vervalt

- ~~Vue 3 + Vite als frontend-framework~~ — dit was de eerder beoogde richting voor implementatie, maar valt af ten gunste van native
- ~~Bookmarklet-gebaseerde Magister-koppeling~~ — vervangt door OAuth redirect met native URL scheme

### Prototype

Het huidige prototype (HTML/JS op `flowstate-app.surge.sh`) blijft geldig als design- en UX-referentie. De business logic, Cloudflare Worker API, en data-structuren kunnen grotendeels hergebruikt worden.

---

## ADR-002 — Cloudflare Worker als backend-proxy

**Datum:** 2026-05-23  
**Status:** Actief in prototype  

### Beslissing

De backend draait als Cloudflare Worker op `flowstate-proxy.flowstate-evelien.workers.dev`.

### Verantwoordelijkheden

- Magister OAuth-flow voor scholen zonder EntraID (direct login met gebruikersnaam + wachtwoord)
- Proxy voor Magister's huiswerk-API (`/api/personen/{id}/afspraken`, `/opdrachten`)
- Gebruikersaccounts (registratie, login, wachtwoord-reset) via KV-opslag
- Data-sync blob per gebruiker

### Herbruikbaar voor native

De Worker-API is platformonafhankelijk — dezelfde endpoints werken voor een native app. Het `redirect_uri`-probleem speelt alleen aan de **auth-kant** (Magister SSO), niet voor de data-ophaal-calls.
