/** @format */

const { Sequelize } = require("sequelize");
const config = require("./config");

const sequelize = new Sequelize(
  config.db.name,
  config.db.user,
  config.db.password,
  {
    host: config.db.host,
    dialect: config.db.dialect,
    logging: false, // Désactiver les logs SQL en production
  }
);

sequelize
  .authenticate()
  .then(() => console.log("✅ Connexion à la base de données réussie."))
  .catch((error) => console.error("❌ Erreur de connexion:", error));

module.exports = sequelize;
