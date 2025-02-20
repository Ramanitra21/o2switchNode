/** @format */

const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const route = require("./route/routes");
const app = express();
const cors = require("cors");

// Chargement des variables d'environnement
require("dotenv").config();

// Vérification que les variables d'environnement sont bien chargées
console.log("EMAIL_HOST:", process.env.EMAIL_HOST); // Vérification de EMAIL_HOST
console.log("EMAIL_PORT:", process.env.EMAIL_PORT); // Vérification de EMAIL_PORT
console.log("EMAIL_USER:", process.env.EMAIL_USER); // Vérification de EMAIL_USER

// Importation de sequelize pour vérifier la connexion à la base de données
const sequelize = require("./config/db"); // Assurez-vous que le chemin est correct

// Vérification de la connexion à la base de données
sequelize
  .authenticate()
  .then(() => {
    console.log("Connexion à la base de données réussie");
  })
  .catch((err) => {
    console.error("Erreur de connexion :", err);
  });

// Configuration de multer pour l'upload d'images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images"); // Dossier où les images seront sauvegardées
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Nom du fichier avec un timestamp
  },
});

const upload = multer({ storage: storage });

app.use(cors());

// Middleware pour analyser le corps de la requête
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true })); // Ajout pour gérer les requêtes x-www-form-urlencoded

app.use("/images", express.static("public/images"));

// Routes
app.use("/api", route);

// Route de test
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Démarrage du serveur
const PORT = 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
