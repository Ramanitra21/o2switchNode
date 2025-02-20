/** @format */

const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { authMiddleware } = require("../config/auth");

// Importation du contrôleur
const UserPraticienController = require("../controllers/UserPraticienController");

// Configuration de multer pour l'upload des images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images"); // Dossier où les images seront sauvegardées
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Nom du fichier avec un timestamp
  },
});

const upload = multer({ storage: storage });

// Routes User Praticien
router.post(
  "/createUserPraticien",
  upload.single("user_photo_url"),
  async (req, res) => {
    try {
      await UserPraticienController.createUserPraticien(req, res);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Erreur serveur",
        error: error.message,
      });
    }
  }
);

// Route de connexion
router.post("/login", async (req, res) => {
  try {
    await UserPraticienController.loginUserPraticien(req, res);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
      error: error.message,
    });
  }
});

// Route protégée : Profil utilisateur (nécessite un token valide)
router.get("/profile", authMiddleware, (req, res) => {
  try {
    res.json({ success: true, user: req.user });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
      error: error.message,
    });
  }
});

// Route de vérification du code temporaire
router.post("/verifyTempCode", async (req, res) => {
  try {
    await UserPraticienController.verifyTempCode(req, res);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
      error: error.message,
    });
  }
});

// Route pour récupérer les infos d'un utilisateur praticien
router.get("/userPraticien/:user_mail", async (req, res) => {
  try {
    await UserPraticienController.getUserPraticienInfo(req, res);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
      error: error.message,
    });
  }
});

// Route pour tester le token avec une requête GET
router.get("/testToken", authMiddleware, (req, res) => {
  res.json({ success: true, message: "Token valide", user: req.user });
});

module.exports = router;
