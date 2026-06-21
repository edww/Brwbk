# Brewbook

Carnet de bord café simple, mobile-first, sans serveur et sans npm.

## Fichiers

- `index.html`
- `style.css`
- `app.js`
- `manifest.webmanifest`
- `sw.js`

## Utilisation

1. Uploader les fichiers dans un repo GitHub.
2. Activer GitHub Pages ou connecter le repo à Netlify.
3. Ouvrir l’URL sur iPhone.
4. Ajouter à l’écran d’accueil si besoin.

## Données

Les données sont stockées localement dans le navigateur via `localStorage`.

L’onglet **Export** permet :

- exporter toutes les données en JSON ;
- réimporter un JSON ;
- transférer les données vers un autre téléphone.

Les photos sont intégrées au JSON en base64. C’est pratique, mais les exports peuvent devenir gros.

## V1 inclut

- Historique des shots/extractions
- Cafés
- Recettes de référence
- Moulins
- Machines
- Photos
- Export/import JSON
- Mode hors ligne basique via service worker
