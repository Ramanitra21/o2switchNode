/** @format */

const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const userController = require("../controllers/userController");
const PraticienController = require("../controllers/praticientController");
const RendezVousController = require("../controllers/RendezVousController");
const AgendaController = require("../controllers/AgendaController");
const PratiqueController = require("../controllers/PratiqueController");
const UserPraticienController = require("../controllers/UserPraticienController");
const PlageHoraireController = require("../controllers/PlageHoraireController");
const DisponibiliteController = require("../controllers/DisponibiliteController");
const { authMiddleware } = require("../config/auth");

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

router.get("/private", authMiddleware, (req, res) => {
  res.send(`Bienvenue dans la route protégée, utilisateur`);
});

router.post("/login", userController.loginUser);

router.post("/loginPraticien", UserPraticienController.loginUserPraticien);

// Routes utilisateur
router.post("/create", upload.single("user_photo"), userController.createUser);

// Routes praticien
router.post("/createPraticien", PraticienController.createPraticien);
router.get("/getPraticien", PraticienController.getPraticien);

// Routes User Praticien
router.post(
  "/createUserPraticien",
  upload.single("user_photo_url"),
  UserPraticienController.createUserPraticien
);

// Routes discipline et pratique
router.post(
  "/discipline/create",
  authMiddleware,
  PraticienController.createDiscipline
);
router.post("/pratique/create", PraticienController.createPratique);
router.get("/pratiques", PraticienController.getPratiques);

// Routes rendez-vous
router.post("/rdv/create", RendezVousController.createRendezVous);
router.get("/rdv/user/:id_users", RendezVousController.getRendezVousByUser);

// Routes agenda
router.post("/agenda/add", AgendaController.addCreneauDisponibilite);
router.get(
  "/agenda/pratique/:id_pratique",
  AgendaController.getCreneauxByPratique
);
router.get(
  "/agenda/praticien/:id_prat_det",
  AgendaController.getCreneauxByPraticien
);
router.get(
  "/agenda/grouped/:id_prat_det",
  AgendaController.getCreneauxGroupedByDisponibilite
);

// Routes disponibilités
router.post("/disponibilite/add", DisponibiliteController.addDisponibilite);
router.get(
  "/disponibilite/pratique/:id_pratique",
  DisponibiliteController.getDisponibilitesByPratique
);
router.get(
  "/disponibilite/praticien/:id_prat_det",
  DisponibiliteController.getDisponibilitesByPraticien
);

// Routes pratiques
router.post("/pratique/create", PratiqueController.createPratique);
router.get(
  "/pratiques/praticien/:id_prat_det",
  PratiqueController.getPratiquesByIdPratDet
);
router.get(
  "/pratiques/discipline/:id_dsp",
  PratiqueController.getPratiquesByIdDsp
);

// Route pour ajouter un jour de travail pour un praticien
router.post(
  "/jour-travail/create",
  PraticienController.createJourTravailPraticien
);

// Routes pour les plages horaires
router.post("/plage-horaire/add", PlageHoraireController.addPlageHoraire);

router.get(
  "/plage-horaire/praticien/:id_prat_det",
  PlageHoraireController.getPlagesByPraticien
);

module.exports = router;
