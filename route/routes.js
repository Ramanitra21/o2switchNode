const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const userController = require('../controllers/userController');
const {authMiddleware} = require('../config/auth')

// Configuration de multer pour l'upload des images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images'); // Dossier où les images seront sauvegardées
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Nom du fichier avec un timestamp
  }
});

const upload = multer({ storage: storage });


router.get('/private', authMiddleware, (req, res) => {
    res.send(`Bienvenue dans la route protégée, utilisateur`);
});

router.post('/login', userController.loginUser);

// Route pour créer un utilisateur avec upload de photo
router.post('/create', upload.single('user_photo'), userController.createUser);

module.exports = router;
