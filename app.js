const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const route = require('./route/routes');
const app = express();
const cors = require('cors');

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

app.use(cors());

// Middleware pour analyser le corps de la requête
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true })); // Ajout pour gérer les requêtes x-www-form-urlencoded

app.use('/images', express.static('public/images'));

// Routes
app.use('/api', route);

// Route de test
app.get('/', (req, res) => { 
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Démarrage du serveur
const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
