const { sequelize } = require('../config/db'); // Sequelize configuré
const { QueryTypes } = require('sequelize'); // Nécessaire pour exécuter des requêtes brutes
const CryptoJS = require('crypto-js'); // Importation de crypto-js

class UserModel {
  // Fonction de hachage avec SHA-256 via crypto-js pour le mot de passe
  static hashPassword(password) {
    return CryptoJS.SHA256(password).toString(CryptoJS.enc.Base64); // Hachage avec SHA-256 en Base64
  }

  // Fonction de comparaison de mot de passe
  static comparePassword(inputPassword, storedPasswordHash) {
    const hashedInputPassword = UserModel.hashPassword(inputPassword);
    return hashedInputPassword === storedPasswordHash;
  }

  async createUser(userData) {
    try {
      const {
        user_name,
        user_forname,
        adresse,
        code_postal,
        ville,
        user_date_naissance,
        user_mail,
        user_phone,
        user_photo_url,
        id_type_user,
        mot_de_passe,
      } = userData;

      const user_created_at = new Date().toISOString().slice(0, 19).replace('T', ' ');

      // Hachage du mot de passe avec SHA-256
      const hashedPassword = UserModel.hashPassword(mot_de_passe);

      // Insertion de l'utilisateur dans la base de données
      await sequelize.query(
        `INSERT INTO users 
        (user_name, user_forname, adresse, code_postal, ville, user_created_at, 
        user_date_naissance, user_mail, user_phone, user_photo_url, id_type_user, mot_de_passe) 
        VALUES (:user_name, :user_forname, :adresse, :code_postal, :ville, :user_created_at, 
        :user_date_naissance, :user_mail, :user_phone, :user_photo_url, :id_type_user, :mot_de_passe)`,
        {
          replacements: {
            user_name,
            user_forname,
            adresse,
            code_postal,
            ville,
            user_created_at,
            user_date_naissance,
            user_mail, // Utilisation de l'e-mail non haché
            user_phone,
            user_photo_url,
            id_type_user,
            mot_de_passe: hashedPassword, // Utilisation du mot de passe haché
          },
          type: QueryTypes.INSERT,
        }
      );

      // Récupérer l'utilisateur créé
      const [user] = await sequelize.query('SELECT * FROM users ORDER BY id_users DESC LIMIT 1', {
        type: QueryTypes.SELECT,
      });

      return {
        success: true,
        message: 'Utilisateur créé avec succès.',
        user: user,
      };
    } catch (error) {
      console.error('Erreur dans createUser :', error.message);
      return {
        success: false,
        message: 'Erreur interne du serveur.',
      };
    }
  }

  async loginUser(user_mail, mot_de_passe) {
    try {
      // Recherche de l'utilisateur par email (non haché)
      const users = await sequelize.query(
        'SELECT * FROM users WHERE user_mail = :user_mail',
        {
          replacements: { user_mail }, // Utilisation de l'e-mail non haché
          type: QueryTypes.SELECT,
        }
      );

      if (users.length === 0) {
        return {
          success: false,
          message: 'Utilisateur non trouvé.',
        };
      }

      const user = users[0];

      // Comparaison du mot de passe avec le mot de passe haché stocké dans la base de données
      if (!UserModel.comparePassword(mot_de_passe, user.mot_de_passe)) {
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