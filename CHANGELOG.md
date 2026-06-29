# Changelog

Historique conservé volontairement. Même les pistes abandonnées ou corrigées restent notées pour pouvoir comprendre les choix plus tard.

## v0.7.3

### Corrections

- Correction du bouton de fermeture du bandeau d’installation.
- Ajout d’une règle CSS `[hidden]{display:none!important}` pour éviter que `.install-tip{display:flex}` annule l’attribut `hidden`.
- Fermeture du bandeau mémorisée dans `localStorage`.
- Détection plus robuste du mode PWA installé sur iPhone (`display-mode: standalone` + `navigator.standalone`).

### Identité

- Icône iPhone corrigée pour supprimer le cadre blanc.
- Icône rose pleine jusqu’aux bords.
- Même logo utilisé dans l’application et pour l’icône PWA.
- Suppression du petit carré rose avec simple `b` dans le header.

### Notes techniques

- Le cache-busting par `?v=...` ne doit pas supprimer les données locales.
- Si les données semblent disparaître, vérifier d’abord le domaine, le chemin, la clé `localStorage` et l’export JSON.

## v0.7.2

### Corrections

- Ajout `icons/apple-touch-icon.png`.
- Ajout `apple-touch-icon.png` à la racine.
- Ajout des balises iOS explicites dans `index.html`.
- Ajustement du manifest pour améliorer l’installation sur iPhone.

## v0.7.1

### Corrections

- Remplacement des icônes générées par erreur.
- Réintégration de l’icône rose validée avec le `b` tasse.

## v0.7.0

### Refonte

- Nouvelle identité graphique blanc + rose.
- Architecture séparée.
- Passage à la version `v0.x` au lieu de V6 / V7.
- Préparation d’une base plus proche d’une vraie application.

### Cafés

- Process en liste déroulante.
- Affichage conditionnel des informations.
- Synthèse des notes par méthode.

### Extractions

- Note globale.
- Critères de dégustation.
- Aides pédagogiques `i`.
- Notes vides invisibles.

### PWA

- Manifest.
- Icônes.
- Bandeau d’installation.

## v0.6.x / V6

### État précédent

- Carnet café local.
- Interface beige / café.
- Liste des cafés, recettes, moulins, machines et shots.
- Coffee Compass enrichi.
- Export / import JSON.
- Compression photo ajoutée pour éviter les problèmes d’enregistrement.
- Process café à préremplir.
- Badges de carte à agrandir.

### Points identifiés

- L’ajout d’image pouvait empêcher l’enregistrement.
- Les badges en haut à droite des cartes étaient trop petits.
- Le process café devait passer d’un champ libre à un choix prérempli.
- L’installation iPhone avait besoin d’un bandeau d’aide.

## Idées discutées puis ajustées

### Noter le corps, la clarté, l’acidité comme une qualité brute

Piste ajustée.

Le corps, la clarté ou l’acidité ne sont pas automatiquement bons ou mauvais. Un café très léger peut être excellent, et un café très dense peut être excellent aussi.

Décision : les étoiles servent à dire si le critère plaît dans ce contexte, pas à dire si une intensité élevée est objectivement meilleure.

### Descripteurs vs appréciation

Idée retenue : séparer progressivement :

- appréciation : est-ce que ça plaît ?
- profil sensoriel : qu’est-ce que c’est ?
- commentaires libres : pourquoi ?

## Convention de versions

- `v0.7.0` : nouvelle base ou nouvelle fonctionnalité importante.
- `v0.7.1`, `v0.7.2`, `v0.7.3` : corrections et ajustements.
- `v0.8.0` : prochaine évolution importante.
- `v1.0.0` : première version publique potentielle.
