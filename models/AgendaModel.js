const { sequelize } = require('../config/db');

class AgendaModel {
    // Ajouter un créneau de disponibilité en respectant la durée de la pratique
    async addCreneauDisponibilite(date_dispo, heure_debut_dispo, heure_fin_dispo, id_pratique) {
        try {
            // Récupérer la durée de la pratique
            const pratique = await sequelize.query(
                `SELECT duree FROM pratiques WHERE id_pratique = :id_pratique`,
                {
                    replacements: { id_pratique },
                    type: sequelize.QueryTypes.SELECT
                }
            );

            if (pratique.length === 0) {
                return { success: false, message: 'Pratique non trouvée.' };
            }

            const dureePratique = parseFloat(pratique[0].duree);
            const heureDebut = new Date(`1970-01-01T${heure_debut_dispo}`);
            const heureFin = new Date(`1970-01-01T${heure_fin_dispo}`);

            // Vérifier si la durée totale est un multiple de la durée de la pratique
            const differenceMinutes = (heureFin - heureDebut) / 60000;
            if (differenceMinutes % (dureePratique * 60) !== 0) {
                return { success: false, message: 'La durée doit être un multiple de la durée de la pratique.' };
            }

            // Insertion du créneau avec disponibilité par défaut (1 = disponible)
            const result = await sequelize.query(
                `INSERT INTO creneaux_disponibilite (date_dispo, heure_debut_dispo, heure_fin_dispo, status, date_ajout_dispo, id_pratique) 
                VALUES (:date_dispo, :heure_debut_dispo, :heure_fin_dispo, 1, NOW(), :id_pratique)`,
                {
                    replacements: { date_dispo, heure_debut_dispo, heure_fin_dispo, id_pratique },
                    type: sequelize.QueryTypes.INSERT
                }
            );

            return {
                success: true,
                message: 'Créneau ajouté avec succès.'
            };
        } catch (error) {
            console.error('Erreur dans addCreneauDisponibilite :', error.message);
            return {
                success: false,
                message: 'Erreur interne du serveur.'
            };
        }
    }

    // Lister les créneaux de disponibilité avec infos de la pratique, du praticien et de la discipline
    async getCreneauxByPratique(id_pratique) {
        try {
            const result = await sequelize.query(
                `SELECT cd.*, p.nom_pratique, p.tarif, p.duree, 
                        pi.id_prat_det, u.user_name, u.user_forname, u.user_mail, 
                        d.nom_dsp, pa.adresse 
                FROM creneaux_disponibilite cd
                JOIN pratiques p ON cd.id_pratique = p.id_pratique
                JOIN praticien_info pi ON p.id_prat_det = pi.id_prat_det
                JOIN users u ON pi.id_users = u.id_users
                JOIN discipline d ON p.id_dsp = d.id_dsp
                LEFT JOIN praticien_adresse_consultation pa ON p.id_pratique = pa.id_pratique
                WHERE cd.id_pratique = :id_pratique`,
                {
                    replacements: { id_pratique },
                    type: sequelize.QueryTypes.SELECT
                }
            );

            return {
                success: true,
                message: 'Créneaux récupérés avec succès.',
                data: result
            };
        } catch (error) {
            console.error('Erreur dans getCreneauxByPratique :', error.message);
            return {
                success: false,
                message: 'Erreur interne du serveur.'
            };
        }
    }

    // Lister les créneaux de disponibilité par praticien
    async getCreneauxByPraticien(id_prat_det) {
        try {
            const result = await sequelize.query(
                `SELECT cd.*, p.nom_pratique, p.tarif, p.duree, 
                        pi.id_prat_det, u.user_name, u.user_forname, u.user_mail, 
                        d.nom_dsp, pa.adresse 
                FROM creneaux_disponibilite cd
                JOIN pratiques p ON cd.id_pratique = p.id_pratique
                JOIN praticien_info pi ON p.id_prat_det = pi.id_prat_det
                JOIN users u ON pi.id_users = u.id_users
                JOIN discipline d ON p.id_dsp = d.id_dsp
                LEFT JOIN praticien_adresse_consultation pa ON p.id_pratique = pa.id_pratique
                WHERE pi.id_prat_det = :id_prat_det`,
                {
                    replacements: { id_prat_det },
                    type: sequelize.QueryTypes.SELECT
                }
            );

            return {
                success: true,
                message: 'Créneaux récupérés avec succès.',
                data: result
            };
        } catch (error) {
            console.error('Erreur dans getCreneauxByPraticien :', error.message);
            return {
                success: false,
                message: 'Erreur interne du serveur.'
            };
        }
    }

    // Lister les créneaux de disponibilité groupés par statut
    async getCreneauxGroupedByDisponibilite(id_prat_det) {
        try {
            const result = await sequelize.query(
                `SELECT cd.status, COUNT(*) AS nombre_creneaux, 
                        GROUP_CONCAT(DISTINCT p.nom_pratique) AS pratiques, 
                        GROUP_CONCAT(DISTINCT u.user_name, ' ', u.user_forname) AS praticiens,
                        GROUP_CONCAT(DISTINCT d.nom_dsp) AS disciplines,
                        GROUP_CONCAT(DISTINCT pa.adresse) AS adresses
                FROM creneaux_disponibilite cd
                JOIN pratiques p ON cd.id_pratique = p.id_pratique
                JOIN praticien_info pi ON p.id_prat_det = pi.id_prat_det
                JOIN users u ON pi.id_users = u.id_users
                JOIN discipline d ON p.id_dsp = d.id_dsp
                LEFT JOIN praticien_adresse_consultation pa ON p.id_pratique = pa.id_pratique
                WHERE pi.id_prat_det = :id_prat_det
                GROUP BY cd.status`,
                {
                    replacements: { id_prat_det },
                    type: sequelize.QueryTypes.SELECT
                }
            );

            return {
                success: true,
                message: 'Créneaux groupés récupérés avec succès.',
                data: result
            };
        } catch (error) {
            console.error('Erreur dans getCreneauxGroupedByDisponibilite :', error.message);
            return {
                success: false,
                message: 'Erreur interne du serveur.'
            };
        }
    }
}

module.exports = AgendaModel;
