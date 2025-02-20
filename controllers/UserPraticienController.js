/** @format */

const UserPraticienModel = require("../models/UserPraticienModel");
const userPraticienModel = new UserPraticienModel();
const { generateToken } = require("../utils/tokenUtils");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
class UserPraticienController {
  // Créer un utilisateur praticien
  async createUserPraticien(req, res) {
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
        mot_de_passe,
        numero_ciret,
        monney,
        duree_echeance,
      } = req.body;

      console.log("Données reçues dans le body :", req.body);
      // Si une photo a été téléchargée, on met à jour l'URL de la photo
      let photoUrl = "";
      // Compression et enregistrement de l'image

      if (req.file) {
        const originalPath = req.file.path;
        const uploadDir = path.join(__dirname, "../uploads");
        console.log("Chemin du fichier original :", originalPath);
        console.log("Chemin du fichier upload :", uploadDir);

        const compressedImagePath = path.join(
          uploadDir,
          `compressed-${Date.now()}.jpg`
        );

        try {
          console.log("ateto ahekana");

          if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
          }

          // Désactiver le cache Sharp pour éviter le verrouillage des fichiers
          sharp.cache(false);

          // Compression de l'image et conversion en buffer avant d'écrire sur le disque
          const imageBuffer = await sharp(originalPath)
            .jpeg({ quality: 70 })
            .toBuffer();

          // Sauvegarde de l'image compressée
          await sharp(imageBuffer).toFile(compressedImagePath);
          console.log("Image compressée sauvegardée à : ", compressedImagePath);

          // Vérification et suppression du fichier original
          try {
            await fs.promises.access(originalPath, fs.constants.F_OK);
            await fs.promises.unlink(originalPath);
            console.log(`✅ Fichier supprimé : ${originalPath}`);
          } catch (unlinkError) {
            console.log(
              "Erreur lors de la suppression du fichier original :",
              unlinkError.message
            );
          }

          photoUrl = `/uploads/${path.basename(compressedImagePath)}`;
        } catch (err) {
          console.error("Erreur de compression d'image :", err.message);
          return res.status(500).json({
            success: false,
            message: "Erreur lors de la compression de l'image.",
          });
        }
      }

      // Préparer les données pour l'utilisateur praticien
      const userPraticienData = {
        user_name,
        user_forname,
        adresse,
        code_postal,
        ville,
        user_date_naissance,
        user_mail,
        user_phone,
        user_photo_url: photoUrl,
        mot_de_passe,
        numero_ciret,
        monney,
        duree_echeance,
      };

      const result = await userPraticienModel.createUserPraticien(
        userPraticienData
      );

      if (result.success) {
        return res.status(201).json({
          success: true,
          message: "Utilisateur praticien créé avec succès.",
          user: result.user, // Retourne uniquement les informations de l'utilisateur
        });
      } else {
        return res
          .status(400)
          .json({ success: false, message: result.message });
      }
    } catch (error) {
      console.error("Erreur dans createUserPraticien :", error.message);
      return res
        .status(500)
        .json({ success: false, message: "Erreur interne du serveur." });
    }
  }

  async loginUserPraticien(req, res) {
    try {
      const { user_mail, mot_de_passe } = req.body;
      console.log("Requête reçue pour login :", req.body);

      const loginResult = await userPraticienModel.loginUserPraticien(
        user_mail,
        mot_de_passe
      );

      if (!loginResult.success) {
        console.log("Échec de connexion :", loginResult.message);
        return res
          .status(401)
          .json({ success: false, message: loginResult.message });
      }

      const user = loginResult.user;

      console.log("Utilisateur authentifié avec succès :", user.user_mail);

      // Génération du token
      const token = generateToken({ id: user.id_users, email: user.user_mail });
      console.log("Token généré :", token);

      return res.status(200).json({ success: true, token, user });
    } catch (error) {
      console.error("Erreur dans loginUserPraticien :", error);
      return res
        .status(500)
        .json({ success: false, message: "Erreur interne du serveur." });
    }
  }

  // Vérifier le code temporaire
  async verifyTempCode(req, res) {
    try {
      const { user_mail, tempCode } = req.body;

      if (!user_mail || !tempCode) {
        return res.status(400).json({
          success: false,
          message: "L'email et le code temporaire sont requis.",
        });
      }

      const result = await userPraticienModel.verifyTempCode(
        user_mail,
        tempCode
      );

      if (result.success) {
        return res.status(200).json({
          success: true,
          message: result.message,
        });
      } else {
        return res
          .status(400)
          .json({ success: false, message: result.message });
      }
    } catch (error) {
      console.error("Erreur dans verifyTempCode :", error.message);
      return res
        .status(500)
        .json({ success: false, message: "Erreur interne du serveur." });
    }
  }

  // Récupérer les informations d'un utilisateur praticien
  async getUserPraticienInfo(req, res) {
    try {
      const { user_mail } = req.params; // On récupère l'email du praticien depuis les paramètres de l'URL

      // Appel à la méthode statique du modèle pour obtenir les infos du praticien
      const result = await userPraticienModel.getUserPraticienInfo(user_mail);

      if (result.success) {
        return res.status(200).json({
          success: true,
          user: result.user, // Les informations de l'utilisateur (praticien)
        });
      } else {
        return res
          .status(404)
          .json({ success: false, message: result.message }); // En cas d'absence d'utilisateur
      }
    } catch (error) {
      console.error("Erreur dans getUserPraticienInfo :", error.message);
      return res
        .status(500)
        .json({ success: false, message: "Erreur interne du serveur." });
    }
  }
}

module.exports = new UserPraticienController();
