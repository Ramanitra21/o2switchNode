const { sequelize } = require('../config/db'); // Sequelize configuré
const { QueryTypes } = require('sequelize'); // Nécessaire pour exécuter des requêtes brutes

class UserModel {
  async loginUser(mail, mot_de_passe) {
    try {
      // Utilisation de Sequelize pour exécuter une requête SQL brute
      const users = await sequelize.query(
        'SELECT * FROM user_test WHERE mail = :mail',
        {
          replacements: { mail },
          type: QueryTypes.SELECT, // Type de requête (SELECT dans ce cas)
        }
      );

      if (users.length === 0) {
        return {
          success: false,
          message: 'Utilisateur non trouvé.',
        };
      }

      const user = users[0];
      const isPasswordValid = mot_de_passe === user.mot_de_passe; // Remplacez par bcrypt pour un meilleur hachage
      if (!isPasswordValid) {
        return {
          success: false,
          message: 'Mot de passe incorrect.',
        };
      }

      return {
        success: true,
        user,
      };
    } catch (error) {
      console.error('Erreur dans loginUser :', error.message);
      return {
        success: false,
        message: 'Erreur interne du serveur.',
      };
    }
  }
}

module.exports = UserModel;