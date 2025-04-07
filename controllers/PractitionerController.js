/** @format */

const PractitionerModel = require("../models/PractitionerModel");
const practitionerModel = new PractitionerModel();
const { generateToken } = require("../utils/tokenUtils");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

class PractitionerController {
  // ✅ Créer un praticien
  async createPractitioner(req, res) {
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
      } = req.body;

      console.log("📩 Données reçues :", req.body);

      // Gestion de la photo
      let photoUrl = "";
      if (req.file) {
        const originalPath = req.file.path;
        const uploadDir = path.join(__dirname, "../uploads");

        const compressedImagePath = path.join(
          uploadDir,
          `compressed-${Date.now()}.jpg`
        );

        try {
          if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
          }

          sharp.cache(false);
          const imageBuffer = await sharp(originalPath)
            .jpeg({ quality: 70 })
            .toBuffer();

          await sharp(imageBuffer).toFile(compressedImagePath);

          // Supprimer l'image originale
          try {
            await fs.promises.unlink(originalPath);
          } catch (unlinkError) {
            console.warn(
              "⚠️ Suppression image originale échouée :",
              unlinkError.message
            );
          }

          photoUrl = `/uploads/${path.basename(compressedImagePath)}`;
        } catch (err) {
          console.error("❌ Compression image échouée :", err.message);
          return res.status(500).json({
            success: false,
            message: "Erreur lors du traitement de l'image.",
          });
        }
      }

      const practitionerData = {
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
        photoUrl,
      };

      const result = await practitionerModel.createPractitioner(
        practitionerData
      );

      if (result.success) {
        return res.status(201).json({
          success: true,
          message: result.message,
        });
      } else {
        return res.status(400).json({
          success: false,
          message: result.message,
        });
      }
    } catch (error) {
      console.error("❌ Erreur createPractitioner :", error.message);
      return res
        .status(500)
        .json({ success: false, message: "Erreur interne." });
    }
  }

  // 🔐 Connexion
  async loginPractitioner(req, res) {
    try {
      const { mail, password } = req.body;
      const loginResult = await practitionerModel.loginPractitioner(
        mail,
        password
      );

      if (!loginResult.success) {
        return res
          .status(401)
          .json({ success: false, message: loginResult.message });
      }

      const user = loginResult.user;
      const token = generateToken({ id: user.id_user, email: user.mail });

      return res.status(200).json({ success: true, token, user });
    } catch (error) {
      console.error("❌ Erreur loginPractitioner :", error.message);
      return res
        .status(500)
        .json({ success: false, message: "Erreur interne." });
    }
  }

  // ✅ Vérifier code temporaire
  async verifyTempCode(req, res) {
    try {
      const { mail, tempCode } = req.body;

      if (!mail || !tempCode) {
        return res.status(400).json({
          success: false,
          message: "Email et code temporaire requis.",
        });
      }

      const result = await practitionerModel.verifyPractitionerCode(
        mail,
        tempCode
      );

      if (result.success) {
        return res.status(200).json({ success: true, message: result.message });
      } else {
        return res
          .status(400)
          .json({ success: false, message: result.message });
      }
    } catch (error) {
      console.error("❌ Erreur verifyTempCode :", error.message);
      return res
        .status(500)
        .json({ success: false, message: "Erreur serveur." });
    }
  }

  // 📦 Récupérer les infos complètes du praticien
  async getPractitionerInfo(req, res) {
    try {
      const { mail } = req.params;

      const result = await practitionerModel.getFullPractitionerInfo(mail);

      if (result.success) {
        return res.status(200).json({ success: true, user: result.data });
      } else {
        return res
          .status(404)
          .json({ success: false, message: result.message });
      }
    } catch (error) {
      console.error("❌ Erreur getPractitionerInfo :", error.message);
      return res
        .status(500)
        .json({ success: false, message: "Erreur serveur." });
    }
  }
}

module.exports = new PractitionerController();
