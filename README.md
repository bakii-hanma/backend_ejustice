# API Backend de Gestion des Plaintes

Ce projet est une API backend pour un système de gestion des plaintes, permettant aux utilisateurs de déposer, suivre et gérer des plaintes.

## Fonctionnalités

- Authentification et gestion des utilisateurs
- Dépôt et suivi des plaintes
- Gestion des documents associés aux plaintes
- Validation, rejet et annulation des plaintes
- Recherche avancée avec filtres multiples
- Gestion des enquêtes liées aux plaintes

## Prérequis

- Node.js (v14+)
- MySQL (v8+)

## Installation

1. Cloner le dépôt
```bash
git clone https://github.com/votre-username/nom-du-repo.git
cd nom-du-repo
```

2. Installer les dépendances
```bash
npm install
```

3. Configurer les variables d'environnement
```bash
cp .env.example .env
# Modifier les valeurs dans le fichier .env
```

4. Exécuter les migrations
```bash
node migrate.js up
```

5. Démarrer le serveur
```bash
npm start
```

## Structure du projet

- `/config` - Configuration de la base de données et autres paramètres
- `/controllers` - Contrôleurs pour gérer les requêtes HTTP
- `/middlewares` - Middlewares Express (authentification, validation, etc.)
- `/models` - Modèles de données et logique métier
- `/routes` - Définition des routes de l'API
- `/migrations` - Scripts de migration de la base de données
- `/uploads` - Dossier pour les fichiers téléchargés

## API Endpoints

### Authentification
- `POST /api/auth/register` - Inscription d'un nouvel utilisateur
- `POST /api/auth/login` - Connexion d'un utilisateur

### Plaintes
- `POST /api/plaintes` - Créer une nouvelle plainte
- `GET /api/plaintes` - Récupérer toutes les plaintes
- `GET /api/plaintes/:id_plainte` - Récupérer une plainte spécifique
- `PUT /api/plaintes/:id_plainte` - Mettre à jour une plainte
- `DELETE /api/plaintes/:id_plainte` - Supprimer une plainte
- `PUT /api/plaintes/:id_plainte/valider` - Valider une plainte
- `PUT /api/plaintes/:id_plainte/rejeter` - Rejeter une plainte
- `PUT /api/plaintes/:id_plainte/annuler` - Annuler une plainte
- `GET /api/plaintes/recherche` - Recherche avancée de plaintes

## Licence

Ce projet est sous licence [MIT](LICENSE). 