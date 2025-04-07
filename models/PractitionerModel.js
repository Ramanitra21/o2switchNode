/** @format */
const {
  User,
  PractitionerInfo,
  PractSpeciality,
  Speciality,
} = require("../models");
const bcrypt = require("bcrypt");
const { sendTempCodeEmail } = require("../utils/emailInscription");
const { emailInscriptionDone } = require("../utils/emailInscriptionDone");

class PractitionerModel {
  // 🔐 Hash password
  static async hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  static async comparePassword(inputPassword, storedPasswordHash) {
    return await bcrypt.compare(inputPassword, storedPasswordHash);
  }

  // 👤 Création du compte praticien
  async createPractitioner(practData) {
    const t = await User.sequelize.transaction();
    try {
      const {
        firstname,
        lastname,
        mail,
        phone_number,
        adress,
        postal_code,
        city,
        birthdate,
        password,
        siret,
        profil_description,
        hook,
        prat_started_at,
      } = practData;

      // 🛡️ Vérification de l'existence du mail
      const existingUser = await User.findOne({
        where: { mail, id_user_role: 2 },
      });

      if (existingUser) {
        return {
          success: false,
          message: "Un praticien avec cet email existe déjà.",
        };
      }

      // ✅ Email non existant, on peut créer le compte
      const tempCode = Math.floor(100000 + Math.random() * 900000); // 6 chiffres
      const hashedPassword = await PractitionerModel.hashPassword(password);

      const newUser = await User.create(
        {
          firstname,
          lastname,
          mail,
          phone_number,
          adress,
          postal_code,
          city,
          birthdate,
          password: hashedPassword,
          id_user_role: 2,
          is_validated: tempCode, // le code temporaire est stocké ici
        },
        { transaction: t }
      );

      await PractitionerInfo.create(
        {
          siret,
          profil_description,
          hook,
          prat_started_at,
          id_user: newUser.id_user,
        },
        { transaction: t }
      );

      await t.commit();

      // ✉️ Envoi du code temporaire par email
      await sendTempCodeEmail(mail, `${firstname} ${lastname}`, tempCode);

      return {
        success: true,
        message:
          "Compte praticien créé. Vérifiez votre email pour le code d'activation.",
      };
    } catch (error) {
      await t.rollback();
      console.error("Erreur createPractitioner:", error);
      return {
        success: false,
        message: "Erreur lors de la création du praticien",
      };
    }
  }

  // ✅ Vérification du code temporaire
  async verifyPractitionerCode(mail, tempCode) {
    try {
      const user = await User.findOne({
        where: {
          mail,
          is_validated: parseInt(tempCode),
        },
      });

      if (!user) {
        return { success: false, message: "Code invalide ou expiré" };
      }

      user.is_validated = 1;
      await user.save();

      await emailInscriptionDone(mail, `${user.firstname} ${user.lastname}`);

      return {
        success: true,
        message: "Compte activé avec succès",
      };
    } catch (error) {
      console.error("Erreur verifyPractitionerCode:", error);
      return { success: false, message: "Erreur d'activation du compte" };
    }
  }

  // 🔐 Connexion praticien
  async loginPractitioner(mail, password) {
    try {
      const user = await User.findOne({
        where: {
          mail,
          id_user_role: 2,
          is_validated: 1,
        },
        include: PractitionerInfo,
      });

      if (!user) {
        return { success: false, message: "Identifiants incorrects" };
      }

      const passwordMatch = await PractitionerModel.comparePassword(
        password,
        user.password
      );
      if (!passwordMatch) {
        return { success: false, message: "Mot de passe incorrect" };
      }

      return { success: true, user };
    } catch (error) {
      console.error("Erreur loginPractitioner:", error);
      return { success: false, message: "Erreur de connexion" };
    }
  }

  // 📦 Récupération des infos complètes
  async getFullPractitionerInfo(mail) {
    try {
      const user = await User.findOne({
        where: {
          mail,
          id_user_role: 2,
        },
        include: [
          {
            model: PractitionerInfo,
            include: [
              {
                model: PractSpeciality,
                include: [Speciality],
              },
            ],
          },
        ],
      });

      if (!user) {
        return { success: false, message: "Praticien non trouvé" };
      }

      return { success: true, data: user };
    } catch (error) {
      console.error("Erreur getFullPractitionerInfo:", error);
      return { success: false, message: "Erreur de récupération des données" };
    }
  }
}

module.exports = PractitionerModel;

// /** @format */
// const sequelize = require("../config/db");
// const { QueryTypes } = require("sequelize");
// const bcrypt = require("bcrypt");
// const { sendTempCodeEmail } = require("../utils/emailInscription");
// const { emailInscriptionDone } = require("../utils/emailInscriptionDone");
// const { comparePassword } = require("../utils/passwordUtils");

// class PractitionerModel {
//   static async hashPassword(password) {
//     const salt = await bcrypt.genSalt(10);
//     return await bcrypt.hash(password, salt);
//   }

//   static async comparePassword(inputPassword, storedPasswordHash) {
//     return await bcrypt.compare(inputPassword, storedPasswordHash);
//   }

//   async createPractitioner(practData) {
//     try {
//       const {
//         firstname,
//         lastname,
//         mail,
//         phone_number,
//         adress,
//         postal_code,
//         city,
//         birthdate,
//         password,
//         siret,
//         profil_description,
//         hook,
//         prat_started_at,
//       } = practData;

//       // Vérification de l'existence de l'email
//       const existingUsers = await sequelize.query(
//         "SELECT * FROM users WHERE mail = :mail AND id_user_role = 1",
//         {
//           replacements: { mail },
//           type: QueryTypes.SELECT,
//         }
//       );

//       if (existingUsers.length > 0) {
//         return {
//           success: false,
//           message: "Un praticien avec cet email existe déjà.",
//         };
//       }

//       // Génération du code temporaire
//       const tempCode = Math.floor(1000 + Math.random() * 9000);
//       const hashedPassword = await PractitionerModel.hashPassword(password);

//       // Insertion dans la table users
//       await sequelize.query(
//         `INSERT INTO users
//         (firstname, lastname, mail, phone_number, adress, postal_code, city,
//         birthdate, password, created_at, id_user_role, is_validated)
//         VALUES (:firstname, :lastname, :mail, :phone_number, :adress, :postal_code, :city,
//         :birthdate, :password, NOW(), 2, :tempCode)`,
//         {
//           replacements: {
//             firstname,
//             lastname,
//             mail,
//             phone_number,
//             adress,
//             postal_code,
//             city,
//             birthdate,
//             password: hashedPassword,
//             tempCode,
//           },
//           type: QueryTypes.INSERT,
//         }
//       );

//       // Récupération de l'ID utilisateur
//       const [user] = await sequelize.query(
//         "SELECT id_user FROM users WHERE mail = :mail ORDER BY id_user DESC LIMIT 1",
//         {
//           replacements: { mail },
//           type: QueryTypes.SELECT,
//         }
//       );

//       // Insertion dans practitioner_info
//       await sequelize.query(
//         `INSERT INTO practitioner_info
//         (siret, profil_description, hook, prat_started_at, id_user)
//         VALUES (:siret, :profil_description, :hook, :prat_started_at, :id_user)`,
//         {
//           replacements: {
//             siret,
//             profil_description,
//             hook,
//             prat_started_at,
//             id_user: user.id_user,
//           },
//           type: QueryTypes.INSERT,
//         }
//       );

//       // Envoi du code par email
//       await sendTempCodeEmail(mail, `${firstname} ${lastname}`, tempCode);

//       return {
//         success: true,
//         message: "Compte praticien créé. Vérifiez votre email pour le code d'activation.",
//       };
//     } catch (error) {
//       console.error("Erreur createPractitioner:", error);
//       return {
//         success: false,
//         message: "Erreur lors de la création du praticien",
//       };
//     }
//   }

//   async verifyPractitionerCode(mail, tempCode) {
//     try {
//       const [user] = await sequelize.query(
//         "SELECT id_user FROM users WHERE mail = :mail AND is_validated = :tempCode",
//         {
//           replacements: { mail, tempCode: parseInt(tempCode) },
//           type: QueryTypes.SELECT,
//         }
//       );

//       if (!user) {
//         return { success: false, message: "Code invalide ou expiré" };
//       }

//       await sequelize.query(
//         "UPDATE users SET is_validated = 1 WHERE id_user = :id_user",
//         {
//           replacements: { id_user: user.id_user },
//           type: QueryTypes.UPDATE,
//         }
//       );

//       await emailInscriptionDone(mail, `${user.firstname} ${user.lastname}`);

//       return {
//         success: true,
//         message: "Compte activé avec succès",
//       };
//     } catch (error) {
//       console.error("Erreur verifyPractitionerCode:", error);
//       return { success: false, message: "Erreur d'activation du compte" };
//     }
//   }

//   async loginPractitioner(mail, password) {
//     try {
//       const [user] = await sequelize.query(
//         `SELECT u.*, p.*
//         FROM users u
//         JOIN practitioner_info p ON u.id_user = p.id_user
//         WHERE u.mail = :mail AND u.id_user_role = 2 AND u.is_validated = 1`,
//         {
//           replacements: { mail },
//           type: QueryTypes.SELECT,
//         }
//       );

//       if (!user) {
//         return { success: false, message: "Identifiants incorrects" };
//       }

//       const passwordMatch = await comparePassword(password, user.password);
//       if (!passwordMatch) {
//         return { success: false, message: "Mot de passe incorrect" };
//       }

//       return { success: true, user };
//     } catch (error) {
//       console.error("Erreur loginPractitioner:", error);
//       return { success: false, message: "Erreur de connexion" };
//     }
//   }

//   async getFullPractitionerInfo(mail) {
//     try {
//       const result = await sequelize.query(
//         `SELECT
//           u.*,
//           p.*,
//           ps.id_pract_speciality,
//           s.designation as specialite
//         FROM users u
//         LEFT JOIN practitioner_info p ON u.id_user = p.id_user
//         LEFT JOIN pract_specialities ps ON p.id_pract_info = ps.id_pract_info
//         LEFT JOIN specialities s ON ps.id_speciality = s.id_speciality
//         WHERE u.mail = :mail AND u.id_user_role = 2`,
//         {
//           replacements: { mail },
//           type: QueryTypes.SELECT,
//         }
//       );

//       if (result.length === 0) {
//         return { success: false, message: "Praticien non trouvé" };
//       }

//       return { success: true, data: result };
//     } catch (error) {
//       console.error("Erreur getFullPractitionerInfo:", error);
//       return { success: false, message: "Erreur de récupération des données" };
//     }
//   }
// }

// module.exports = PractitionerModel;`
