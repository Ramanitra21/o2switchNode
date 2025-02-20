const { sequelize } = require('../config/db');

class RendezVousModel {
    async getRendezVousByUser(id_createur) {
        try {
            // Requête pour récupérer les rendez-vous d'un utilisateur avec les informations associées
            const query = `
                SELECT 
                    r.*, 
                    p.nom_pratique, 
                    u1.user_name AS nom_utilisateur, 
                    u2.user_name AS nom_utilisateur_1 
                FROM rendez_vous r
                LEFT JOIN pratiques p ON r.id_pratique = p.id_pratique
                LEFT JOIN users u1 ON r.id_createur = u1.id_createur
                LEFT JOIN users u2 ON r.id_patient = u2.id_createur
                WHERE r.id_createur = :id_createur
            `;
    
            const rendezVous = await sequelize.query(query, {
                replacements: { id_createur },
                type: sequelize.QueryTypes.SELECT
            });
    
            return { success: true, data: rendezVous };
        } catch (error) {
            console.error('Erreur dans getRendezVousByUser:', error.message);
            return { success: false, message: 'Erreur lors de la récupération des rendez-vous.' };
        }
    }
    
    async createRendezVous(date_rdv, heure_rdv, motif_rdv, status_rdv, id_pratique, id_createur, id_patient, id_crn) {
        try {
            // Vérifier si l'id_crn correspond bien à un créneau disponible et que l'heure correspond
            const verifQuery = `
                SELECT heure_debut_dispo FROM creneaux_disponibilite 
                WHERE id_crn = :id_crn AND id_pratique = :id_pratique AND date_dispo = :date_rdv
            `;
            
            const creneau = await sequelize.query(verifQuery, {
                replacements: { id_crn, id_pratique, date_rdv },
                type: sequelize.QueryTypes.SELECT
            });
            
            // Vérification si le créneau existe
            if (creneau.length === 0) {
                return { success: false, message: 'Créneau indisponible ou inexistant.' };
            }
            
            // Vérification si l'heure du rendez-vous correspond à l'heure du créneau disponible
            if (creneau[0].heure_debut_dispo !== heure_rdv) {
                return { success: false, message: 'L\'heure du rendez-vous ne correspond pas à l\'heure du créneau sélectionné.' };
            }
            
            // Insérer le rendez-vous si la vérification est validée
            const query = `
                INSERT INTO rendez_vous 
                (date_rdv, heure_rdv, motif_rdv, status_rdv, date_ajout_rdv, id_pratique, id_createur, id_patient, id_crn) 
                VALUES (:date_rdv, :heure_rdv, :motif_rdv, :status_rdv, NOW(), :id_pratique, :id_createur, :id_patient, :id_crn)
            `;
    
            await sequelize.query(query, {
                replacements: { date_rdv, heure_rdv, motif_rdv, status_rdv, id_pratique, id_createur, id_patient, id_crn },
                type: sequelize.QueryTypes.INSERT
            });
    
            return { success: true, message: 'Rendez-vous créé avec succès.' };
        } catch (error) {
            console.error('Erreur dans createRendezVous:', error.message);
            return { success: false, message: 'Erreur lors de la création du rendez-vous.' };
        }
    }
}

module.exports = RendezVousModel;