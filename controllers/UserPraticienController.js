/** @format */

const UserPraticienModel = require("../models/UserPraticienModel");
const userPraticienModel = new UserPraticienModel();
const { generateToken } = require("../config/auth"); // Fonction pour générer un JWT

// Génération de l'access et token en fonction du type d'utilisateur
const getAccessAndToken = (user) => {
  let access = [];
  let token = "";

  // Gestion des accès en fonction du type d'utilisateur
  switch (user.id_type_user) {
    case 1:
      access = [1, 2, 3]; // Exemple d'accès pour le praticien
      token = generateToken({ ...user, access });
      break;
    case 2:
      access = [3, 4, 5, 6, 7]; // Exemple d'accès pour un autre type
      token = generateToken({ ...user, access });
      break;
    case 3:
      access = [7, 8]; // Exemple d'accès pour un autre type
      token = generateToken({ ...user, access });
      break;
    default:
      access = [];
      token = generateToken({ ...user, access });
      break;
  }

  return { access, token };
};

// Contrôleur pour créer un utilisateur praticien
exports.createUserPraticien = async (req, res) => {
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

    // Si une photo a été téléchargée, on met à jour l'URL de la photo
    let photoUrl = "";
    if (req.file) {
      photoUrl = `/images/${req.file.filename}`;
    }

    // Préparation des données à envoyer à la base de données
    const userPraticienData = {
      user_name,
      user_forname,
      adresse,
      code_postal,
      ville,
      user_date_naissance,
      user_mail,
      user_phone,
      user_photo_url: photoUrl, // L'URL de l'image
      mot_de_passe,
      numero_ciret,
      monney,
      duree_echeance,
    };

    // Appel à la méthode pour créer un utilisateur praticien
    const result = await userPraticienModel.createUserPraticien(
      userPraticienData
    );

    // Si l'utilisateur est créé avec succès, on renvoie une réponse
    if (result.success) {
      const { access, token } = getAccessAndToken(result.user);
      return res.status(201).json({
        success: true,
        message: "Utilisateur praticien créé avec succès.",
        user: result.user,
        token: token,
        access: access,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: result.message,
      });
    }
  } catch (error) {
    console.error("Erreur dans createUserPraticien:", error.message);
    return res.status(500).json({
      success: false,
      message: "Erreur interne du serveur.",
    });
  }
};
// Contrôleur pour connecter un utilisateur praticien
exports.loginUserPraticien = async (req, res) => {
  try {
    // Déstructuration des données reçues dans la requête POST
    const { user_mail, mot_de_passe } = req.body;

    // Affichage des données reçues pour débogage
    console.log("Données reçues dans la requête POST : ");
    console.log("user_mail:", user_mail);
    console.log("mot_de_passe:", mot_de_passe);

    // Vérifie que les paramètres sont présents
    if (!user_mail || !mot_de_passe) {
      return res.status(400).json({
        success: false,
        message: "Email et mot de passe sont requis.",
      });
    }

    // Appel à la méthode loginUserPraticien du modèle
    const result = await userPraticienModel.loginUserPraticien(
      user_mail,
      mot_de_passe
    );

    if (result.success) {
      const { access, token } = getAccessAndToken(result.user);
      return res.status(200).json({
        success: true,
        message: "Connexion réussie.",
        user: result.user,
        token: token,
        access: access,
      });
    } else {
      return res.status(401).json({
        success: false,
        message: result.message,
      });
    }
  } catch (error) {
    console.error("Erreur dans loginUserPraticien:", error.message);
    return res.status(500).json({
      success: false,
      message: "Erreur interne du serveur.",
    });
  }
};
