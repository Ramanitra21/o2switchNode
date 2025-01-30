const RendezVousModel = require('../models/RendezVousModel');
const rendezVousModel = new RendezVousModel;

class RendezVousController {
    async createRendezVous(req, res) {
        try {
            const { date_rdv, heure_rdv, motif_rdv, status_rdv, duree, id_pratique, id_users, id_users_1 } = req.body;
            //id_users patient
            // id_users_1 praticien

            const result = await rendezVousModel.createRendezVous(date_rdv, heure_rdv, motif_rdv, status_rdv, duree, id_pratique, id_users, id_users_1);

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
            console.error('Erreur dans createRendezVous:', error.message);
            return res.status(500).json({
                success: false,
                message: 'Erreur interne du serveur.',
            });
        }
    }

    async getRendezVousByIdUsers1(req, res) {
        try {
            const { id_users_1 } = req.params; // Récupérer id_users_1 depuis l'URL

            const result = await rendezVousModel.getRendezVousByIdUsers1(id_users_1);

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
            console.error('Erreur dans getRendezVousByIdUsers1:', error.message);
            return res.status(500).json({
                success: false,
                message: 'Erreur interne du serveur.',
            });
        }
    }
}

module.exports = new RendezVousController();