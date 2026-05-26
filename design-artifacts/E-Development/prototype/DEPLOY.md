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

De app synchroniseert automatisch via JSONBlob bij het openen:
- Wijzigingen op de desktop → zichtbaar op de telefoon na een page refresh
- Wijzigingen op de telefoon → zichtbaar op de desktop na een page refresh
- Werkt zonder account of login

De gedeelde data staat op blob ID `019e6583-f28d-72f2-ba8a-0c47b53f9a61`.
