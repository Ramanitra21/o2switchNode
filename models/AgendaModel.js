const { sequelize } = require('../config/db');

class AgendaModel {
    async addCreneauDisponibilite(date_dispo, heure_debut_dispo, heure_fin_dispo, id_pratique) {
        try {
            // Récupérer la durée de la pratique et le praticien associé
            const pratique = await sequelize.query(
                `SELECT duree, id_prat_det FROM pratiques WHERE id_pratique = :id_pratique`,
                {
                    replacements: { id_pratique },
                    type: sequelize.QueryTypes.SELECT,
                }
            );
    
            if (pratique.length === 0) {
                return { success: false, message: 'Pratique non trouvée.' };
            }
    
            const { duree: dureePratique, id_prat_det } = pratique[0];
            const heureDebut = new Date(`1970-01-01T${heure_debut_dispo}`);
            const heureFin = new Date(`1970-01-01T${heure_fin_dispo}`);
    
            // Vérifier si la durée totale est un multiple de la durée de la pratique
            const differenceMinutes = (heureFin - heureDebut) / 60000;
            if (differenceMinutes % (dureePratique * 60) !== 0) {
                return { success: false, message: 'La durée doit être un multiple de la durée de la pratique.' };
            }
    
            // Vérifier si les créneaux ne se chevauchent pas pour ce praticien (tous ses créneaux)
            const overlappingCreneaux = await sequelize.query(
                `SELECT id_crn FROM creneaux_disponibilite
                 WHERE date_dispo = :date_dispo
                 AND id_pratique IN (
                     SELECT id_pratique FROM pratiques WHERE id_prat_det = :id_prat_det
                 )
                 AND (
                     (heure_debut_dispo < :heure_fin_dispo AND heure_fin_dispo > :heure_debut_dispo)
                 )`,
                {
                    replacements: {
                        date_dispo,
                        heure_debut_dispo,
                        heure_fin_dispo,
                        id_prat_det, // On vérifie tous les créneaux du praticien
                    },
                    type: sequelize.QueryTypes.SELECT,
                }
            );
    
            if (overlappingCreneaux.length > 0) {
                return { success: false, message: 'Un créneau se chevauche déjà pour ce praticien.' };
            }
    
            // Insertion du créneau avec disponibilité par défaut (1 = disponible)
// Initialisation de l'heure de début en tant qu'objet Date
let currentHeureDebut = new Date(`1970-01-01T${heure_debut_dispo}:00`);

// Calcul de l'heure de fin pour le premier créneau en ajoutant la durée
let currentHeureFin = new Date(currentHeureDebut.getTime() + (dureePratique * 3600000)); // dureePratique est en minutes

// Boucle pour créer les créneaux jusqu'à ce que l'heure de fin dépasse heure_fin_dispo
while (currentHeureFin <= new Date(`1970-01-01T${heure_fin_dispo}:00`)) {
    
    // Récupération des heures et minutes au format HH:MM pour heure_debut_dispo
    const heureDebutStr = `${currentHeureDebut.getHours().toString().padStart(2, '0')}:${currentHeureDebut.getMinutes().toString().padStart(2, '0')}`;
    
    // Récupération des heures et minutes au format HH:MM pour heure_fin_dispo
    const heureFinStr = `${currentHeureFin.getHours().toString().padStart(2, '0')}:${currentHeureFin.getMinutes().toString().padStart(2, '0')}`;

    // Insertion d'un créneau dans la base de données
    await sequelize.query(
        `INSERT INTO creneaux_disponibilite (date_dispo, heure_debut_dispo, heure_fin_dispo, status, date_ajout_dispo, id_pratique) 
         VALUES (:date_dispo, :heure_debut_dispo, :heure_fin_dispo, 1, NOW(), :id_pratique)`,
        {
            replacements: {
                date_dispo,           // La date du créneau
                heure_debut_dispo: heureDebutStr,  // Heure de début (ex. "08:00")
                heure_fin_dispo: heureFinStr,      // Heure de fin (ex. "08:30")
                id_pratique          // Identifiant de la pratique concernée
            },
            type: sequelize.QueryTypes.INSERT, // Type d'opération Sequelize : INSERTION
        }
    );

    // Passer au créneau suivant :
    // L'heure de début devient l'heure de fin actuelle
    currentHeureDebut = currentHeureFin;

    // Calculer la nouvelle heure de fin en ajoutant la durée de pratique
    currentHeureFin = new Date(currentHeureDebut.getTime() + (dureePratique * 3600000)); // Ajoute dureePratique minutes
}

    
            return {
                success: true,
                message: 'Créneau ajouté avec succès.',
            };
        } catch (error) {
            console.error('Erreur dans addCreneauDisponibilite :', error.message);
            return {
                success: false,
                message: 'Erreur interne du serveur.',
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
                LEFT JOIN praticien_adresse_consultation pa ON p.id_pratique = pa.id_prat_det
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
                LEFT JOIN praticien_adresse_consultation pa ON p.id_pratique = pa.id_prat_det
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
                LEFT JOIN praticien_adresse_consultation pa ON p.id_pratique = pa.id_prat_det
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