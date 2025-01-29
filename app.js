const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const route = require('./route/routes');
const app = express();

// Configuration de multer pour l'upload d'images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images'); // Dossier où les images seront sauvegardées
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Nom du fichier avec un timestamp
  }
});

const upload = multer({ storage: storage });

// Middleware pour analyser le corps de la requête
app.use(bodyParser.json());

app.use('/images', express.static('public/images'));


// Routes
app.use('/api', route);

// Route de test
app.get('/', (req, res) => {
  res.send('Bienvenue sur le serveur Node.js');
});

// Démarrage du serveur
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
