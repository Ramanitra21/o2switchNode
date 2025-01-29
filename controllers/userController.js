const UserModel = require('../models/UserModel');
const userModel = new UserModel();
const { generateToken } = require('../config/auth'); // Fonction pour générer un JWT

// Génération de l'access et token en fonction du type d'utilisateur
const getAccessAndToken = (user) => {
  let access = [];
  let token = '';

  switch (user.id_type_user) {
    case 1:
      access = [1, 2, 3];
      token = generateToken({ ...user, access });
      break;
    case 2:
      access = [3, 4, 5, 6, 7];
      token = generateToken({ ...user, access });
      break;
    case 3:
      access = [7, 8];
      token = generateToken({ ...user, access });
      break;
    default:
      access = [];
      token = generateToken({ ...user, access });
      break;
  }

  return { access, token };
};

// Contrôleur pour créer un utilisateur
exports.createUser = async (req, res) => {
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
      user_photo_url, // Ce champ sera passé automatiquement via multer
      id_type_user,
      mot_de_passe,
    } = req.body;

    // Si une photo a été téléchargée, mettre à jour user_photo_url avec le chemin de l'image
    let photoUrl = '';
    if (req.file) {
      photoUrl = `/images/${req.file.filename}`;
    }

    // Appel à la méthode createUser du modèle
    const result = await userModel.createUser({
      user_name,
      user_forname,
      adresse,
      code_postal,
      ville,
      user_date_naissance,
      user_mail,
      user_phone,
      user_photo_url: photoUrl, // Sauvegarde l'URL de l'image
      id_type_user,
      mot_de_passe,
    });

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message,
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Utilisateur créé avec succès.',
      user: result,
    });
  } catch (error) {
    console.error('Erreur dans createUser controller :', error.message);
    return res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur.',
    });
  }
};
// Contrôleur pour connecter un utilisateur
exports.loginUser = async (req, res) => {
  try {
    const { user_mail, mot_de_passe } = req.body;

    // Vérification des champs obligatoires
    if (!user_mail || !mot_de_passe) {
      return res.status(400).json({
        success: false,
        message: 'Email et mot de passe sont requis.',
      });
    }

    // Appel à la méthode loginUser du modèle
    const result = await userModel.loginUser(user_mail, mot_de_passe);

    if (!result.success) {
      return res.status(401).json({
        success: false,
        message: result.message,
      });
    }

    const user = result.user;

    // Génération des accès et du token
    const { access, token } = getAccessAndToken(user);

    return res.status(200).json({
      success: true,
      message: 'Connexion réussie.',
      user: user,
      token,
    });
  } catch (error) {
    console.error('Erreur dans loginUser controller :', error.message);
    return res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur.',
    });
  }
};