const AgendaModel = require('../models/AgendaModel');
const agendaModel = new AgendaModel();

class AgendaController {
    // Ajouter un créneau de disponibilité
    async addCreneauDisponibilite(req, res) {
        try {
            const { date_dispo, heure_debut_dispo, heure_fin_dispo, id_pratique } = req.body;

            const result = await agendaModel.addCreneauDisponibilite(date_dispo, heure_debut_dispo, heure_fin_dispo, id_pratique);

            if (result.success) {
                return res.status(201).json({
                    success: true,
                    message: result.message,
                });
            } else {
                return res.status(400).json({
                    success: false,
                    message: result.message,
                });
            }
        } catch (error) {
            console.error('Erreur dans addCreneauDisponibilite :', error.message);
            return res.status(500).json({
                success: false,
                message: 'Erreur interne du serveur.',
            });
        }
    }

    // Récupérer les créneaux de disponibilité par pratique
    async getCreneauxByPratique(req, res) {
        try {
            const { id_pratique } = req.params;

            const result = await agendaModel.getCreneauxByPratique(id_pratique);

            if (result.success) {
                return res.status(200).json({
                    success: true,
                    message: result.message,
                    data: result.data,
                });
            } else {
                return res.status(404).json({
                    success: false,
                    message: result.message,
                });
            }
        } catch (error) {
            console.error('Erreur dans getCreneauxByPratique :', error.message);
            return res.status(500).json({
                success: false,
                message: 'Erreur interne du serveur.',
            });
        }
    }

    // Récupérer les créneaux de disponibilité par praticien
    async getCreneauxByPraticien(req, res) {
        try {
            const { id_prat_det } = req.params;

            const result = await agendaModel.getCreneauxByPraticien(id_prat_det);

            if (result.success) {
                return res.status(200).json({
                    success: true,
                    message: result.message,
                    data: result.data,
                });
            } else {
                return res.status(404).json({
                    success: false,
                    message: result.message,
                });
            }
        } catch (error) {
            console.error('Erreur dans getCreneauxByPraticien :', error.message);
            return res.status(500).json({
                success: false,
                message: 'Erreur interne du serveur.',
            });
        }
    }

    // Récupérer les créneaux groupés par disponibilité
    async getCreneauxGroupedByDisponibilite(req, res) {
        try {
            const { id_prat_det } = req.params;

            const result = await agendaModel.getCreneauxGroupedByDisponibilite(id_prat_det);

            if (result.success) {
                return res.status(200).json({
                    success: true,
                    message: result.message,
                    data: result.data,
                });
            } else {
                return res.status(404).json({
                    success: false,
                    message: result.message,
                });
            }
        } catch (error) {
            console.error('Erreur dans getCreneauxGroupedByDisponibilite :', error.message);
            return res.status(500).json({
                success: false,
                message: 'Erreur interne du serveur.',
            });
        }
    }
    
}

module.exports = new AgendaController();
