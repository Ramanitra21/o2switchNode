const { sequelize } = require('../config/db');

class RendezVousModel {
    async getRendezVousByUser(id_users) {
        try {
            const query = `
                SELECT 
                    r.*, 
                    p.nom_pratique, 
                    u1.user_name AS nom_utilisateur,  -- Utilisateur associé à id_users
                    u2.user_name AS nom_utilisateur_1 -- Utilisateur associé à id_user_1
                FROM rendez_vous r
                LEFT JOIN pratiques p ON r.id_pratique = p.id_pratique
                LEFT JOIN users u1 ON r.id_users = u1.id_users
                LEFT JOIN users u2 ON r.id_users_1 = u2.id_users
                WHERE r.id_users = :id_users
            `;
    
            const rendezVous = await sequelize.query(query, {
                replacements: { id_users },
                type: sequelize.QueryTypes.SELECT
            });
    
            return {
                success: true,
                data: rendezVous
            };
        } catch (error) {
            console.error('Erreur dans getRendezVousByUser:', error.message);
            return {
                success: false,
                message: 'Erreur lors de la récupération des rendez-vous.'
            };
        }
    }
    async createRendezVous(date_rdv, heure_rdv, motif_rdv, status_rdv, id_pratique, id_users, id_users_1) {
        try {
            const query = `
                INSERT INTO rendez_vous 
                (date_rdv, heure_rdv, motif_rdv, status_rdv, date_ajout_rdv, id_pratique, id_users, id_users_1) 
                VALUES (:date_rdv, :heure_rdv, :motif_rdv, :status_rdv, NOW(), :id_pratique, :id_users, :id_users_1)
            `;

            await sequelize.query(query, {
                replacements: {
                    date_rdv,
                    heure_rdv,
                    motif_rdv,
                    status_rdv,
                    id_pratique,
                    id_users,
                    id_users_1
                },
                type: sequelize.QueryTypes.INSERT
            });

            return {
                success: true,
                message: 'Rendez-vous créé avec succès.'
            };
        } catch (error) {
            console.error('Erreur dans createRendezVous:', error.message);
            return {
                success: false,
                message: 'Erreur lors de la création du rendez-vous.'
            };
        }
    }
}

module.exports = RendezVousModel;