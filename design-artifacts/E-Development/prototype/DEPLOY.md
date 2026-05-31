# FlowState — GitHub Pages Deployment

## Eenmalige setup

### 1. Maak een GitHub repository aan
1. Ga naar https://github.com/new
2. Naam: `flowstate` (of een andere naam)
3. Zet op **Public**
4. Klik **Create repository**

### 2. Push de prototype map
Open een terminal in de map `design-artifacts/E-Development/prototype/` en voer uit:

```bash
git init
git add .
git commit -m "Initial FlowState prototype"
git branch -M main
git remote add origin https://github.com/JOUW-GEBRUIKERSNAAM/flowstate.git
git push -u origin main
```
*(vervang `JOUW-GEBRUIKERSNAAM` door je eigen GitHub-gebruikersnaam)*

### 3. Zet GitHub Pages aan
1. Ga naar je repository op GitHub
2. Klik op **Settings** → **Pages** (links in de sidebar)
3. Onder **Source**: kies `Deploy from a branch`
4. Branch: `main`, folder: `/ (root)`
5. Klik **Save**

Na ±1 minuut is de app live op:
```
https://JOUW-GEBRUIKERSNAAM.github.io/flowstate/
```

---

## Cross-device sync

Data wordt automatisch gesynchroniseerd via een account. Elke gebruiker (Evelien, een zusje, een klasgenoot) logt in met eigen e-mailadres en wachtwoord — ieders taken zijn volledig gescheiden.

**Hoe het werkt:**
- Bij openen app → login vereist
- Na inloggen → data wordt opgehaald van de cloud
- Bij elke opslag (taak toevoegen, sessie afronden, instelling wijzigen) → automatisch naar cloud gestuurd
- Ander apparaat opent app met zelfde account → haalt nieuwste versie op

**Eenmalige setup voor de Cloudflare Worker (vereist voor sync):**

1. Maak een KV namespace aan in het Cloudflare dashboard:
   - Ga naar Workers & Pages → KV → Create namespace
   - Naam: `flowstate-data`
   - Kopieer de namespace ID

2. Vul de ID in `cloudflare-worker/wrangler.toml`:
   ```
   id = "JOUW_KV_NAMESPACE_ID_HIER"
   ```

3. Deploy de worker opnieuw:
   ```bash
   cd cloudflare-worker
   npx wrangler deploy
   ```
