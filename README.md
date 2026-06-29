# Brewbook

> Carnet café local, pensé pour suivre les cafés, les extractions, les recettes et la progression sensorielle sans transformer l’interface en usine à gaz.

## Version actuelle

**v0.7.3** — prototype privé.

Cette branche `v0.x` remplace l’ancienne logique V6 / V7 / V7.1 / V7.2. Les anciennes idées restent conservées dans le changelog et les notes de projet pour pouvoir revenir en arrière si une piste redevient intéressante.

## Fonctionnalités actuelles

### Cafés

- Nom du café
- Torréfacteur
- Origine
- Process prérempli
- Niveau de torréfaction
- Photo
- Note de rachat éventuelle
- Synthèse automatique par méthode quand des extractions sont notées

### Extractions

- Méthode : Espresso, Turbo shot, Americano, Aerocano, V60, Aeropress, French press, Cold brew, Moka
- Café associé
- Moulin et machine
- Dose, rendement, temps, réglage moulin
- Eau / ratio / température
- Note globale de 1 à 5
- Critères de dégustation optionnels
- Notes libres
- Photo

### Notation

Les notes vides ne sont pas affichées.

Une information absente ne produit pas de placeholder du type `—`, `0/5` ou `pas encore noté`. L’interface se remplit seulement avec ce qui a réellement été saisi.

### Aides pédagogiques

Chaque critère de dégustation peut avoir un bouton `i` avec :

- définition simple ;
- confusion fréquente ;
- exemples concrets ;
- question à se poser pour noter.

Objectif : rendre Brewbook utilisable même par quelqu’un qui ne connaît pas encore le vocabulaire café.

### Coffee Compass

Assistant de diagnostic pour relier le goût à des corrections possibles :

- acidité agressive ;
- amertume ;
- astringence ;
- manque de corps ;
- channeling ;
- extraction déséquilibrée.

### PWA iPhone

- Installation sur l’écran d’accueil
- Icône rose Brewbook
- `apple-touch-icon`
- Manifest web
- Service worker simple
- Bandeau d’aide à l’installation fermable

## Organisation des fichiers

```text
index.html
style.css
manifest.webmanifest
sw.js
apple-touch-icon.png
icons/
  icon-180.png
  icon-192.png
  icon-512.png
  icon-master-rose.png
  favicon-32.png
  apple-touch-icon.png
js/
  app.js
  data.js
  ratings.js
README.md
CHANGELOG.md
IDEAS.md
```

## Données

Les données sont stockées localement dans le navigateur via `localStorage`.

Le paramètre `?v=...` sert à casser le cache des fichiers, mais ne devrait pas effacer les données tant que l’application reste sur le même domaine et le même chemin de stockage.

Attention : changer d’URL, de domaine, de sous-dossier ou de clé de stockage peut donner l’impression que les données ont disparu, car le navigateur considère parfois qu’il s’agit d’un autre espace local.

## Sauvegarde

Utiliser régulièrement :

- **Exporter JSON** avant de remplacer une version ;
- **Importer JSON** après installation d’une nouvelle version si besoin.

## Roadmap proche

### v0.8

- Stabiliser le système de notation.
- Améliorer les aides `i`.
- Améliorer la fiche café intelligente.
- Ajouter recherche et filtres.
- Corriger les détails d’identité graphique.

### v0.9

- Préparer une version quasi publique.
- Nettoyer l’architecture.
- Améliorer la sauvegarde.
- Étudier IndexedDB si les photos deviennent trop nombreuses.

### v1.0

Première version publique potentielle.
