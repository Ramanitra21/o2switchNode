const { sequelize } = require('../config/db'); // Sequelize configuré
const { QueryTypes } = require('sequelize'); // Nécessaire pour exécuter des requêtes brutes

class RendezVousModel{
    // Création d'un rendez-vous
    async createRendezVous(date_rdv, heure_rdv, motif_rdv, status_rdv, duree, id_pratique, id_users, id_users_1) {
        try {
            const result = await sequelize.query(
                `INSERT INTO rendez_vous (date_rdv, heure_rdv, motif_rdv, status_rdv, duree, heure_fin, date_ajout_rdv, date_modif_rdv, id_pratique, id_users, id_users_1) 
                 VALUES (:date_rdv, :heure_rdv, :motif_rdv, :status_rdv, :duree, ADDTIME(:heure_rdv, SEC_TO_TIME(:duree * 60)), NOW(), NOW(), :id_pratique, :id_users, :id_users_1)`,
                {
                    replacements: { date_rdv, heure_rdv, motif_rdv, status_rdv, duree, id_pratique, id_users, id_users_1 },
                    type: sequelize.QueryTypes.INSERT
                }
            );

            if (result) {
                return {
                    success: true,
                    message: 'Rendez-vous créé avec succès.'
                };
            } else {
                return {
                    success: false,
                    message: 'Erreur lors de la création du rendez-vous.'
                };
            }
        } catch (error) {
            console.error('Erreur dans createRendezVous :', error.message);
            return {
                success: false,
                message: 'Erreur interne du serveur.'
            };
        }
    }

     // Récupérer les rendez-vous par id_users_1
     async getRendezVousByIdUsers1(id_users_1) {
        try {
            const result = await sequelize.query(
                `SELECT * FROM rendez_vous WHERE id_users_1 = :id_users_1`,
                {
                    replacements: { id_users_1 },
                    type: sequelize.QueryTypes.SELECT
                }
            );

            return {
                success: true,
                data: result
            };
        } catch (error) {
            console.error('Erreur dans getRendezVousByIdUsers1:', error.message);
            return {
                success: false,
                message: 'Erreur interne du serveur.'
            };
        }
    }
}

module.exports = RendezVousModel;