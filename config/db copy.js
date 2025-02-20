const { Sequelize } = require('sequelize');

// Configuration de la connexion à la base de données avec Sequelize
const sequelize = new Sequelize('teameo_db', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false, // Désactiver les logs SQL pour un affichage plus propre
});

// Fonction générique pour exécuter des requêtes SQL brutes (si nécessaire)
const execute = async (sql, values = []) => {
    try {
        const [results] = await sequelize.query(sql, { replacements: values });
        return results;
    } catch (error) {
        console.error('Erreur lors de l\'exécution de la requête SQL :', error.message);
        throw error;
    }
};

// Vérification de la connexion
(async () => {
    try {
        await sequelize.authenticate();
        console.log('Connexion à la base de données établie avec succès.');
    } catch (error) {
        console.error('Impossible de se connecter à la base de données :', error.message);
    }
})();

module.exports = { sequelize, execute };