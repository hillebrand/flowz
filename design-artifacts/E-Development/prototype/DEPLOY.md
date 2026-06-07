# Flowz — Deployment

## Live URL

De app staat live op:
```
https://flowz.pages.dev
```

Cloudflare Pages deployt automatisch bij elke push naar de `main` branch van `git@github.com:hillebrand/flowz.git`.

## Deployen

```bash
cd design-artifacts/E-Development/prototype
git add .
git commit -m "jouw commit bericht"
git push
```

Na ±1 minuut zijn de wijzigingen live op https://flowz.pages.dev.

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
