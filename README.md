# o2switchNode
# Projet Node.js avec JWT et Sequelize

Ce projet est une application Node.js qui utilise JWT pour l'authentification et Sequelize pour interagir avec une base de données MySQL.

## Installation

1. Clonez le dépôt.
2. Installez les dépendances avec `npm install`.
3. Configurez votre fichier `.env`.
4. Lancez le serveur avec `npm start` ou `npm run dev`.

## Structure du projet

- `config/` : Configuration de la base de données.
- `controllers/` : Contrôleurs pour gérer les routes.
- `middlewares/` : Middlewares pour l'authentification.
- `models/` : Modèles Sequelize.
- `routes/` : Routes de l'application.
- `utils/` : Utilitaires pour les emails, les tokens, etc.
- `app.js` : Point d'entrée de l'application.