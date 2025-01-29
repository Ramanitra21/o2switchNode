const { sequelize } = require('../config/db'); // Sequelize configuré
const { QueryTypes } = require('sequelize'); // Nécessaire pour exécuter des requêtes brutes
const crypto = require('crypto'); // Utilisation de crypto pour chiffrement/déchiffrement

class UserModel {
  // Fonction pour chiffrer le mot de passe
  static encryptPassword(password) {
    const secretKey = 'superSecretKey'; // Une clé secrète que vous utilisez pour le chiffrement
    const cipher = crypto.createCipher('aes-256-cbc', secretKey); // Crée un cipher avec un algorithme de chiffrement (ici, AES-256)
    let encrypted = cipher.update(password, 'utf8', 'hex'); // Chiffre le mot de passe
    encrypted += cipher.final('hex'); // Ajoute le reste du chiffrement
    return encrypted;
  }

  // Fonction pour déchiffrer le mot de passe
  static decryptPassword(encryptedPassword) {
    const secretKey = 'superSecretKey'; // La même clé secrète utilisée pour le chiffrement
    const decipher = crypto.createDecipher('aes-256-cbc', secretKey); // Crée un decipher
    let decrypted = decipher.update(encryptedPassword, 'hex', 'utf8'); // Déchiffre le mot de passe
    decrypted += decipher.final('utf8'); // Finalise le déchiffrement
    return decrypted;
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

      const user_created_at = new Date().toISOString().slice(0, 19).replace("T", " ");

      // Chiffrement du mot de passe sans bcrypt
      const encryptedPassword = UserModel.encryptPassword(mot_de_passe);

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
            user_mail,
            user_phone,
            user_photo_url,
            id_type_user,
            mot_de_passe: encryptedPassword,
          },
          type: QueryTypes.INSERT,
        }
      );

      return {
        success: true,
        message: 'Utilisateur créé avec succès.',
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
      // Recherche de l'utilisateur par email
      const users = await sequelize.query(
        'SELECT * FROM users WHERE user_mail = :user_mail',
        {
          replacements: { user_mail },
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

      // Déchiffrement du mot de passe stocké dans la base de données
      const decryptedPassword = UserModel.decryptPassword(user.mot_de_passe);

      // Vérification du mot de passe
      if (decryptedPassword !== mot_de_passe) {
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
