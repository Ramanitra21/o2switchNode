const UserPraticienModel = require('../models/UserPraticienModel');
const userPraticienModel = new UserPraticienModel();

class UserPraticienController {
    // Fonction pour créer un utilisateur praticien
async createUserPraticien(req, res) {
    try {
        // Affiche les données reçues pour débogage
        console.log('Requête reçue :', req.body);

        // Déstructuration des données du body de la requête
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
            duree_echeance 
        } = req.body;

        // Si une photo a été téléchargée, on met à jour l'URL de la photo
        let photoUrl = '';
        if (req.file) {
            photoUrl = `/images/${req.file.filename}`;
        }

        // Affichage de chaque variable et sa valeur
        console.log('user_name:', user_name);
        console.log('user_forname:', user_forname);
        console.log('adresse:', adresse);
        console.log('code_postal:', code_postal);
        console.log('ville:', ville);
        console.log('user_date_naissance:', user_date_naissance);
        console.log('user_mail:', user_mail);
        console.log('user_phone:', user_phone);
        console.log('mot_de_passe:', mot_de_passe);
        console.log('numero_ciret:', numero_ciret);
        console.log('monney:', monney);
        console.log('duree_echeance:', duree_echeance);
        console.log('user_photo_url:', photoUrl);  // Affichage de l'URL de la photo

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
            user_photo_url: photoUrl,  // L'URL de l'image
            mot_de_passe,
            numero_ciret,
            monney,
            duree_echeance
        };

        // Appel à la méthode pour créer un utilisateur praticien
        const result = await userPraticienModel.createUserPraticien(userPraticienData);

        // Si l'utilisateur est créé avec succès, on renvoie une réponse
        if (result.success) {
            console.log('Contrôleur : Utilisateur praticien créé avec succès.');
            return res.status(201).json({
                success: true,
                message: result.message,
                user: result.user,
            });
        } else {
            // Si la création échoue, on renvoie une erreur
            console.log('Contrôleur : Erreur lors de la création de l\'utilisateur.');
            return res.status(400).json({
                success: false,
                message: result.message,
            });
        }
    } catch (error) {
        // Gestion des erreurs
        console.error('Erreur dans createUserPraticien (contrôleur):', error.message);
        return res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur.',
        });
    }
}


    // Fonction pour connecter un utilisateur praticien
    async loginUserPraticien(req, res) {
        try {
            const { user_mail, mot_de_passe } = req.body;
            const result = await userPraticienModel.loginUserPraticien(user_mail, mot_de_passe);
            
            if (result.success) {
                return res.status(200).json({
                    success: true,
                    message: 'Connexion réussie.',
                    user: result.user,
                });
            } else {
                return res.status(401).json({
                    success: false,
                    message: result.message,
                });
            }
        } catch (error) {
            console.error('Erreur dans loginUserPraticien:', error.message);
            return res.status(500).json({
                success: false,
                message: 'Erreur interne du serveur.',
            });
        }
    }
}

module.exports = new UserPraticienController();
