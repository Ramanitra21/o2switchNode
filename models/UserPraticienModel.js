/** @format */
const sequelize = require("../config/db");
const { QueryTypes } = require("sequelize");
const bcrypt = require("bcrypt"); // Importation de bcrypt
const { sendTempCodeEmail } = require("../utils/emailInscription");
const { emailInscriptionDone } = require("../utils/emailInscriptionDone");
const { comparePassword } = require("../utils/passwordUtils");

class UserPraticienModel {
  static async hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  // Fonction de comparaison de mot de passe
  static async comparePassword(inputPassword, storedPasswordHash) {
    return await bcrypt.compare(inputPassword, storedPasswordHash);
  }

  // Méthode pour créer un utilisateur
  async createUserPraticien(userData) {
    try {
      if (!sequelize) {
        console.error("Erreur: L'objet sequelize n'est pas initialisé.");
        return {
          success: false,
          message:
            "Erreur interne du serveur. La connexion à la base de données a échoué.",
        };
      }
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
        mot_de_passe,
        numero_ciret,
        monney,
        duree_echeance,
      } = userData;

      const user_created_at = new Date()
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");

      console.log("Étape 1 : Vérification de l'existence de l'email");

      const existingUsers = await sequelize.query(
        "SELECT * FROM users WHERE user_mail = :user_mail",
        {
          replacements: { user_mail: user_mail },
          type: QueryTypes.SELECT,
        }
      );

      const userExistsWithSameType = existingUsers.some(
        (user) => user.id_type_user === 1
      );
      if (userExistsWithSameType) {
        console.log(
          "Étape 2 : Utilisateur avec le même email et type déjà existant."
        );
        return {
          success: false,
          message: "Un utilisateur avec cet email et ce type existe déjà.",
        };
      }

      console.log("Étape 3 : Génération du code temporaire");
      const tempCode = Math.floor(1000 + Math.random() * 9000);

      console.log("Étape 4 : Hachage du mot de passe");
      const hashedPassword = await UserPraticienModel.hashPassword(
        mot_de_passe
      );

      console.log(
        "Étape 5 : Insertion de l'utilisateur dans la base de données"
      );
      const [userResult] = await sequelize.query(
        `INSERT INTO users 
        (user_name, user_forname, adresse, code_postal, ville, user_created_at, 
        user_date_naissance, user_mail, user_phone, user_photo_url, id_type_user, mot_de_passe, isActivated) 
        VALUES (:user_name, :user_forname, :adresse, :code_postal, :ville, :user_created_at, 
        :user_date_naissance, :user_mail, :user_phone, :user_photo_url, 1, :mot_de_passe, :isActivated)`,
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
            mot_de_passe: hashedPassword,
            isActivated: tempCode.toString(),
          },
          type: QueryTypes.INSERT,
        }
      );

      console.log("Étape 6 : Récupération de l'ID de l'utilisateur créé");
      const [user] = await sequelize.query(
        "SELECT * FROM users WHERE user_mail = :user_mail ORDER BY id_users DESC LIMIT 1",
        {
          replacements: { user_mail },
          type: QueryTypes.SELECT,
        }
      );

      console.log("Étape 7 : Insertion des informations du praticien");
      await sequelize.query(
        `INSERT INTO praticien_info (numero_ciret, monney, duree_echeance, id_users)
        VALUES (:numero_ciret, :monney, :duree_echeance, :id_users)`,
        {
          replacements: {
            numero_ciret,
            monney,
            duree_echeance,
            id_users: user.id_users,
          },
          type: QueryTypes.INSERT,
        }
      );

      console.log("Étape 8 : Envoi du code temporaire par email");
      await sendTempCodeEmail(user_mail, user_forname, tempCode);

      return {
        success: true,
        message:
          "Utilisateur praticien créé avec succès. Un code temporaire a été envoyé à votre email.",
        user,
      };
    } catch (error) {
      console.error("Erreur dans createUserPraticien :", error.message);
      return {
        success: false,
        message: "Erreur interne du serveur.",
      };
    }
  }

  async verifyTempCode(user_mail, tempCode) {
    try {
      // Vérifier si user_mail et tempCode sont valides
      if (!user_mail) {
        return {
          success: false,
          message: "L'email et le code temporaire sont requis.",
        };
      }
      if (!tempCode) {
        return {
          success: false,
          message: "le code temporaire sont requis.",
        };
      }

      const [user] = await sequelize.query(
        "SELECT * FROM users WHERE user_mail = :user_mail AND isActivated = :tempCode",
        {
          replacements: { user_mail, tempCode },
          type: QueryTypes.SELECT,
        }
      );

      if (user) {
        // Activation du compte
        await sequelize.query(
          "UPDATE users SET isActivated = 1 WHERE id_users = :id_users",
          {
            replacements: { id_users: user.id_users },
            type: QueryTypes.UPDATE,
          }
        );

        // Envoi de l'email de confirmation après activation
        await emailInscriptionDone(user_mail, user.user_name); // Appel de la fonction emailInscriptionDone

        return {
          success: true,
          message: "Compte activé avec succès et email de confirmation envoyé.",
        };
      } else {
        return {
          success: false,
          message: "Code temporaire incorrect.",
        };
      }
    } catch (error) {
      console.error("Erreur dans verifyTempCode :", error.message);
      return {
        success: false,
        message: "Erreur interne du serveur.",
      };
    }
  }

  //login praticien
  async loginUserPraticien(user_mail, mot_de_passe) {
    try {
      console.log("Tentative de connexion pour l'email :", user_mail);

      // Étape 1 : Recherche de l'utilisateur

      // Étape 1 : Recherche de l'utilisateur
      const users = await sequelize.query(
        "SELECT * FROM users WHERE user_mail = :user_mail AND id_type_user = 1 AND isActivated = 1",
        {
          replacements: { user_mail },
          type: QueryTypes.SELECT,
        }
      );

      if (users.length === 0) {
        console.log("Aucun utilisateur trouvé ou compte non activé.");
        return {
          success: false,
          message:
            "Accès refusé : utilisateur non praticien ou email incorrect.",
        };
      }

      const user = users[0];

      // Étape 2 : Vérification du mot de passe
      const passwordMatch = await comparePassword(
        mot_de_passe,
        user.mot_de_passe
      );

      if (!passwordMatch) {
        return {
          success: false,
          message: "Mot de passe incorrect.",
        };
      }

      // Si tout est ok, l'utilisateur est connecté
      return {
        success: true,
        user,
      };
    } catch (error) {
      console.error("Erreur dans loginUserPraticien :", error);
      return {
        success: false,
        message: "Erreur interne du serveur.",
      };
    }
  }

  //info sur le praticien par mail
  static async getUserPraticienInfo(user_mail) {
    try {
      const result = await sequelize.query(
        `SELECT 
          u.id_users,
          u.user_name,
          u.user_forname,
          u.adresse,
          u.code_postal,
          u.ville,
          u.user_date_naissance,
          u.user_mail,
          u.user_phone,
          u.user_photo_url,
          p.id_pratique,
          p.nom_pratique,
          p.desc_pratique,
          p.date_pratique,
          p.tarif,
          p.duree,
          p.couleur_pratique,
          p.lieu,
          p.longitude,
          p.latitude,
          p.isHome,
          p.note,
          pi.numero_ciret,
          pi.monney,
          pi.duree_echeance,
          d.id_dsp,
          d.nom_dsp
        FROM users u
        INNER JOIN praticien_info pi ON u.id_users = pi.id_users
        INNER JOIN pratiques p ON u.id_users = p.id_users
        INNER JOIN discipline d ON p.id_dsp = d.id_dsp
        WHERE u.user_mail = :user_mail AND u.isActivated = 1`,
        {
          replacements: { user_mail },
          type: QueryTypes.SELECT,
        }
      );

      if (result.length === 0) {
        return {
          success: false,
          message: "Aucun praticien trouvé ou compte non activé.",
        };
      }

      return {
        success: true,
        praticien: result,
      };
    } catch (error) {
      console.error("Erreur dans getUserPraticienInfo :", error.message);
      return {
        success: false,
        message: "Erreur interne du serveur.",
      };
    }
  }
}

module.exports = UserPraticienModel;
