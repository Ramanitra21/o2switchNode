const nodemailer = require('nodemailer'); // Importer nodemailer
const { sequelize } = require('../config/db');
const { QueryTypes } = require('sequelize');
const CryptoJS = require('crypto-js'); // Importation de crypto-js

class UserPraticienModel {
  // Fonction de hachage avec SHA-256 via crypto-js pour le mot de passe
  static hashPassword(password) {
    return CryptoJS.SHA256(password).toString(CryptoJS.enc.Base64); // Hachage avec SHA-256 en Base64
  }

  // Fonction de comparaison de mot de passe
  static comparePassword(inputPassword, storedPasswordHash) {
    const hashedInputPassword = UserPraticienModel.hashPassword(inputPassword);
    return hashedInputPassword === storedPasswordHash;
  }

  // Fonction pour envoyer l'email de confirmation
  async sendConfirmationEmail(userEmail, userName) {  // Utiliser `userName` au lieu de `nameUser`
    try {
      // Créer un transporteur d'email
      const transporter = nodemailer.createTransport({
        host: 'passion-vins.fr',
        port: 465,
        secure: true,
        auth: {
          user: 'team@passion-vins.fr',
          pass: '0?M{)K@PU#UC',
        }
      });
  
      const mailOptions = {
        from: 'team@passion-vins.fr',
        to: userEmail,
        subject: 'Bienvenue sur notre plateforme',
        text: 'Votre compte praticien a été créé avec succès. Merci de nous rejoindre !',
        html: `<!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta http-equiv="X-UA-Compatible" content="ie=edge" />
            <title>Static Template</title>
            <link
              href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap"
              rel="stylesheet"
            />
          </head>
          <body
            style="margin: 0; font-family: 'Poppins', sans-serif; background: #ffffff; font-size: 14px;"
          >
            <div
              style="max-width: 680px; margin: 0 auto; padding: 45px 30px 60px; background: #f4f7ff; background-repeat: no-repeat; background-size: 800px 452px; background-position: top center; font-size: 14px; color: #434343;"
            >
              <header>
                <table style="width: 100%; background-color: #5da781;">
                  <tbody>
                    <tr style="height: 0;">
                      <td style="color: #fff;">Hello Soins</td>
                      <td style="text-align: right; color: #fff;">
                        <span style="font-size: 16px; line-height: 30px;">😊</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </header>
  
              <main>
                <div
                  style="margin: 0; margin-top: 70px; padding: 92px 30px 115px; background: #ffffff; border-radius: 30px; text-align: center; background-color: #dee1e6;"
                >
                  <div style="width: 100%; max-width: 489px; margin: 0 auto;">
                    <h1
                      style="margin: 0; font-size: 24px; font-weight: 500; color: #1f1f1f;"
                    >
                      L'équipe de Hello Soin vous souhaite la bienvenue dans notre communauté
                    </h1>
                    <p
                      style="margin: 0; margin-top: 17px; font-size: 16px; font-weight: 500;"
                    >
                      Hey ${userName},
                    </p>
                    <p
                      style="margin: 0; margin-top: 17px; font-weight: 500; letter-spacing: 0.56px;"
                    >
                      Votre compte a été bien créé, nous vous souhaitons la bienvenue !
                    </p>
                  </div>
                </div>
  
                <p
                  style="max-width: 400px; margin: 0 auto; margin-top: 90px; text-align: center; font-weight: 500; color: #8c8c8c;"
                >
                  Besoin d'aide ? Contactez-nous sur
                  <a
                    href="mailto:support@passion-vins.fr"
                    style="color: #499fb6; text-decoration: none;"
                    >support@passion-vins.fr</a
                  >
                  ou Connectez-vous directement
                  <a
                    href=""
                    target="_blank"
                    style="color: #499fb6; text-decoration: none;"
                    >Help Center</a
                  >
                </p>
              </main>
  
              <footer
                style="width: 100%; max-width: 490px; margin: 20px auto 0; text-align: center; border-top: 1px solid #e6ebf1;"
              >
                <p
                  style="margin: 0; margin-top: 40px; font-size: 16px; font-weight: 600; color: #434343;"
                >
                  Hello Soin
                </p>
                <p style="margin: 0; margin-top: 8px; color: #434343;">
                  Address 540, City, State.
                </p>
                <div style="margin: 0; margin-top: 16px;">
                  <a href="" target="_blank" style="display: inline-block;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#405969" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-facebook"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                  </a>
                  <a
                    href=""
                    target="_blank"
                    style="display: inline-block; margin-left: 8px;"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#405969" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-instagram"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                  </a>
                  <a
                    href=""
                    target="_blank"
                    style="display: inline-block; margin-left: 8px;"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#405969" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-youtube"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/></svg>
                  </a>
                </div>
                <p style="margin: 0; margin-top: 16px; color: #434343;">
                  Copyright © 2025 Company. All rights reserved.
                </p>
              </footer>
            </div>
          </body>
        </html>`
      };
  
      // Envoi de l'email
      await transporter.sendMail(mailOptions);
      console.log('Email de confirmation envoyé avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email :', error);
    }
  }
  

  // Méthode pour créer un utilisateur
  async createUserPraticien(userData) {
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
        mot_de_passe,
        numero_ciret,
        monney,
        duree_echeance,
      } = userData;

      const user_created_at = new Date().toISOString().slice(0, 19).replace('T', ' ');

      console.log('Étape 1 : Vérification de l\'existence de l\'email');

      // Vérification de l'existence de l'email avec un id_type_user identique
      const existingUsers = await sequelize.query(
        'SELECT * FROM users WHERE user_mail = :user_mail',
        {
          replacements: { user_mail: user_mail },  // Passez explicitement user_mail
          type: QueryTypes.SELECT,
        }
      );
      

      const userExistsWithSameType = existingUsers.some(user => user.id_type_user === 1);
      if (userExistsWithSameType) {
        console.log('Étape 2 : Utilisateur avec le même email et type déjà existant.');
        return {
          success: false,
          message: 'Un utilisateur avec cet email et ce type existe déjà.',
        };
      }

      console.log('Étape 3 : Hachage du mot de passe');
      // Hachage du mot de passe avec SHA-256
      const hashedPassword = await UserPraticienModel.hashPassword(mot_de_passe);

      console.log('Étape 4 : Insertion de l\'utilisateur dans la base de données');
      // Insertion de l'utilisateur dans la base de données
      const [userResult] = await sequelize.query(
        `INSERT INTO users 
        (user_name, user_forname, adresse, code_postal, ville, user_created_at, 
        user_date_naissance, user_mail, user_phone, user_photo_url, id_type_user, mot_de_passe) 
        VALUES (:user_name, :user_forname, :adresse, :code_postal, :ville, :user_created_at, 
        :user_date_naissance, :user_mail, :user_phone, :user_photo_url, 1, :mot_de_passe)`,
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
          },
          type: QueryTypes.INSERT,
        }
      );

      console.log('Étape 5 : Récupération de l\'ID de l\'utilisateur créé');
      // Récupérer l'ID de l'utilisateur créé
      const [user] = await sequelize.query('SELECT * FROM users WHERE user_mail = :user_mail ORDER BY id_users DESC LIMIT 1', {
        replacements: { user_mail },
        type: QueryTypes.SELECT,
      });

      console.log('Étape 6 : Insertion des informations du praticien');
      // Insérer les infos du praticien
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

      console.log('Étape 7 : Envoi de l\'email de confirmation');
      // Envoyer un email de confirmation
      await this.sendConfirmationEmail(user_mail, user_forname);

      return {
        success: true,
        message: 'Utilisateur praticien créé avec succès.',
        user,
      };
    } catch (error) {
      console.error('Erreur dans createUserPraticien :', error.message);
      return {
        success: false,
        message: 'Erreur interne du serveur.',
      };
    }
  }


  async loginUserPraticien(user_mail, mot_de_passe) {
    try {
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
          message: 'Email incorrect.',
        };
      }

      const user = users[0];

      if (!UserPraticienModel.comparePassword(mot_de_passe, user.mot_de_passe)) {
        return {
          success: false,
          message: 'Mot de passe incorrect.',
        };
      }

      if (user.id_type_user !== 1) {
        return {
          success: false,
          message: 'Accès refusé : utilisateur non praticien.',
        };
      }

      return {
        success: true,
        user,
      };
    } catch (error) {
      console.error('Erreur dans loginUserPraticien :', error.message);
      return {
        success: false,
        message: 'Erreur interne du serveur.',
      };
    }
  }
}

module.exports = UserPraticienModel;
