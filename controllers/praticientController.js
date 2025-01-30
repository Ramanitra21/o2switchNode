const PraticienModel = require('../models/PraticientModel');
const praticienModel = new PraticienModel();

class PraticienController {
    // Fonction pour créer un praticien
    async createPraticien(req, res) {
        try {
            // Récupérer les données envoyées par le client (dans le corps de la requête)
            const { numero_ciret, monney, id_users } = req.body;

            // Appeler la méthode du modèle pour créer un praticien
            const result = await praticienModel.createPraticien(numero_ciret, monney, id_users);

            // Vérifier si l'utilisateur a bien été créé
            if (result.success) {
                return res.status(201).json({
                    success: true,
                    message: result.message,
                });
            } else {
                return res.status(500).json({
                    success: false,
                    message: result.message,
                });
            }
        } catch (error) {
            console.error('Erreur dans createPraticien:', error.message);
            return res.status(500).json({
                success: false,
                message: 'Erreur interne du serveur.',
            });
        }
    }

    // Fonction pour récupérer un praticien avec ses informations utilisateurs
    async getPraticien(req, res) {
        try {
            const result = await praticienModel.getPraticien();

            if (result.success) {
                return res.status(200).json({
                    success: true,
                    message: result.message,
                    data: result.data
                });
            } else {
                return res.status(404).json({
                    success: false,
                    message: result.message,
                });
            }
        } catch (error) {
            console.error('Erreur dans getPraticien:', error.message);
            return res.status(500).json({
                success: false,
                message: 'Erreur interne du serveur.',
            });
        }
    }


    async createDiscipline(req, res) {
        try {
            const { nom_dsp } = req.body;

            const result = await praticienModel.createDiscipline(nom_dsp);

            if (result.success) {
                return res.status(201).json({
                    success: true,
                    message: result.message,
                });
            } else {
                return res.status(500).json({
                    success: false,
                    message: result.message,
                });
            }
        } catch (error) {
            console.error('Erreur dans createDiscipline:', error.message);
            return res.status(500).json({
                success: false,
                message: 'Erreur interne du serveur.',
            });
        }
    }

    async createPratique(req, res) {
        try {
            const { nom_pratique, desc_pratique, date_pratique, tarif, duree, id_prat_det, id_dsp } = req.body;

            const result = await praticienModel.createPratique(nom_pratique, desc_pratique, date_pratique, tarif, duree, id_prat_det, id_dsp);

            if (result.success) {
                return res.status(201).json({
                    success: true,
                    message: result.message,
                });
            } else {
                return res.status(500).json({
                    success: false,
                    message: result.message,
                });
            }
        } catch (error) {
            console.error('Erreur dans createPratique:', error.message);
            return res.status(500).json({
                success: false,
                message: 'Erreur interne du serveur.',
            });
        }
    }

    async searchPraticien(req, res) {
        try {
            const { query } = req.query; // Récupération du paramètre de recherche
            if (!query) {
                return res.status(400).json({ success: false, message: "Paramètre de recherche requis." });
            }

            const result = await praticienModel.searchPraticien(query);
            res.status(200).json(result);
        } catch (error) {
            console.error("Erreur dans searchPraticien :", error);
            res.status(500).json({ success: false, message: "Erreur interne du serveur." });
        }
    }

    async getPratiques(req, res) {
        try {
            const searchQuery = req.query; // Récupérer les filtres de la requête

            const result = await praticienModel.getPratiques(searchQuery);

            if (result.success) {
                return res.status(200).json({
                    success: true,
                    data: result.data
                });
            } else {
                return res.status(500).json({
                    success: false,
                    message: result.message,
                });
            }
        } catch (error) {
            console.error('Erreur dans getPratiques:', error.message);
            return res.status(500).json({
                success: false,
                message: 'Erreur interne du serveur.',
            });
        }
    }

    
}

module.exports = new PraticienController();
