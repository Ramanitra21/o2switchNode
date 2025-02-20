/** @format */

const { sequelize } = require("../config/db");

class RendezVousModel {
  async getRendezVousByPraticien(id_prat_det) {
    try {
      const result = await sequelize.query(
        `SELECT 
                    rv.id_rdv,
                    rv.date_rdv,
                    rv.heure_rdv,
                    rv.motif_rdv,
                    rv.status_rdv,
                    rv.date_ajout_rdv,
                    rv.date_modif_rdv,
                    rv.id_plage, 
                    p.date_heure_debut,
                    p.date_heure_fin,
                    
                    -- Informations du praticien (créateur)
                    u.user_name AS praticien_name,
                    u.user_forname AS praticien_forname,
                    u.user_mail AS praticien_mail,
                    u.user_phone AS praticien_phone,
                    u.user_photo_url AS praticien_photo,
                    u.adresse AS praticien_adresse,
                    u.code_postal AS praticien_code_postal,
                    u.ville AS praticien_ville,
                    u.user_created_at AS praticien_created_at,
                    u.user_date_naissance AS praticien_birth_date,
                    
                    -- Informations du patient
                    up.user_name AS patient_name,
                    up.user_forname AS patient_forname,
                    up.user_mail AS patient_mail,
                    up.user_phone AS patient_phone,
                    up.user_photo_url AS patient_photo,
                    up.adresse AS patient_adresse,
                    up.code_postal AS patient_code_postal,
                    up.ville AS patient_ville,
                    up.user_created_at AS patient_created_at,
                    up.user_date_naissance AS patient_birth_date,
                    
                    -- Informations sur la pratique
                    pr.nom_pratique,
                    pr.desc_pratique,
                    pr.longitude,
                	pr.latitude,	
                    pr.isHome,
                    pr.note	,
                    pr.tarif,
                    pr.duree,
                    pr.couleur_pratique,
                    
                    -- Informations sur le praticien
                    pi.numero_ciret,
                    pi.monney,
                    pi.duree_echeance,
                    pi.deleted_at AS prat_info_deleted_at
                 FROM rendez_vous rv
                 JOIN plage_horaire p ON rv.id_plage = p.id_plage
                 JOIN users u ON rv.id_createur = u.id_users
                 JOIN users up ON rv.id_patient = up.id_users
                 JOIN pratiques pr ON p.id_prat_det = pr.id_prat_det
                 JOIN praticien_info pi ON pr.id_prat_det = pi.id_prat_det
                 WHERE p.id_prat_det = :id_prat_det
                 AND rv.date_rdv >= CURDATE()
                 AND rv.deleted_at IS NULL
                 AND p.deleted_at IS NULL
                 AND u.deleted_at IS NULL
                 AND up.deleted_at IS NULL
                 AND pr.deleted_at IS NULL
                 AND pi.deleted_at IS NULL`,
        {
          replacements: { id_prat_det },
          type: sequelize.QueryTypes.SELECT,
        }
      );

      return {
        success: true,
        message: "Rendez-vous récupérés avec succès.",
        data: result,
      };
    } catch (error) {
      console.error("Erreur dans getRendezVousByPraticien :", error.message);
      return {
        success: false,
        message: "Erreur interne du serveur.",
      };
    }
  }

  async getRendezVousByCreateur(id_createur) {
    try {
      const result = await sequelize.query(
        `SELECT 
                rv.id_rdv,
                rv.date_rdv,
                rv.heure_rdv,
                rv.motif_rdv,
                rv.status_rdv,
                rv.date_ajout_rdv,
                rv.date_modif_rdv,
                rv.id_plage,
                p.date_heure_debut,
                p.date_heure_fin,
                
                -- Informations du créateur (praticien)
                u.user_name AS createur_name,
                u.user_forname AS createur_forname,
                u.user_mail AS createur_mail,
                u.user_phone AS createur_phone,
                u.user_photo_url AS createur_photo,
                u.adresse AS createur_adresse,
                u.code_postal AS createur_code_postal,
                u.ville AS createur_ville,
                u.user_created_at AS createur_created_at,
                u.user_date_naissance AS createur_birth_date,
                
                -- Informations du patient
                up.user_name AS patient_name,
                up.user_forname AS patient_forname,
                up.user_mail AS patient_mail,
                up.user_phone AS patient_phone,
                up.user_photo_url AS patient_photo,
                up.adresse AS patient_adresse,
                up.code_postal AS patient_code_postal,
                up.ville AS patient_ville,
                up.user_created_at AS patient_created_at,
                up.user_date_naissance AS patient_birth_date,
                
                
                    -- Informations sur la pratique
                    pr.nom_pratique,
                    pr.desc_pratique,
                    pr.longitude,
                	pr.latitude,	
                    pr.isHome,
                    pr.note	,
                    pr.tarif,
                    pr.duree,
                    pr.couleur_pratique,
                
                -- Informations sur le praticien
                pi.numero_ciret,
                pi.monney,
                pi.duree_echeance,
                pi.deleted_at AS prat_info_deleted_at
             FROM rendez_vous rv
             JOIN plage_horaire p ON rv.id_plage = p.id_plage
             JOIN users u ON rv.id_createur = u.id_users
             JOIN users up ON rv.id_patient = up.id_users
             JOIN pratiques pr ON p.id_prat_det = pr.id_prat_det
             JOIN praticien_info pi ON pr.id_prat_det = pi.id_prat_det
             WHERE rv.id_createur = :id_createur
             AND rv.date_rdv >= CURDATE()
             AND rv.deleted_at IS NULL
             AND p.deleted_at IS NULL
             AND u.deleted_at IS NULL
             AND up.deleted_at IS NULL
             AND pr.deleted_at IS NULL
             AND pi.deleted_at IS NULL`,
        {
          replacements: { id_createur },
          type: sequelize.QueryTypes.SELECT,
        }
      );

      return {
        success: true,
        message: "Rendez-vous récupérés avec succès.",
        data: result,
      };
    } catch (error) {
      console.error("Erreur dans getRendezVousByCreateur :", error.message);
      return {
        success: false,
        message: "Erreur interne du serveur.",
      };
    }
  }

  async getRendezVousByPatient(id_patient) {
    try {
      const result = await sequelize.query(
        `SELECT 
                rv.id_rdv,
                rv.date_rdv,
                rv.heure_rdv,
                rv.motif_rdv,
                rv.status_rdv,
                rv.date_ajout_rdv,
                rv.date_modif_rdv,
                rv.id_plage,
                p.date_heure_debut,
                p.date_heure_fin,
                
                -- Informations du créateur (praticien)
                u.user_name AS createur_name,
                u.user_forname AS createur_forname,
                u.user_mail AS createur_mail,
                u.user_phone AS createur_phone,
                u.user_photo_url AS createur_photo,
                u.adresse AS createur_adresse,
                u.code_postal AS createur_code_postal,
                u.ville AS createur_ville,
                u.user_created_at AS createur_created_at,
                u.user_date_naissance AS createur_birth_date,
                
                -- Informations du patient
                up.user_name AS patient_name,
                up.user_forname AS patient_forname,
                up.user_mail AS patient_mail,
                up.user_phone AS patient_phone,
                up.user_photo_url AS patient_photo,
                up.adresse AS patient_adresse,
                up.code_postal AS patient_code_postal,
                up.ville AS patient_ville,
                up.user_created_at AS patient_created_at,
                up.user_date_naissance AS patient_birth_date,
                
                -- Informations sur la pratique
                pr.nom_pratique,
                pr.desc_pratique,
                pr.tarif,
                pr.duree,
                pr.couleur_pratique,
                
                -- Informations sur le praticien
                pi.numero_ciret,
                pi.monney,
                pi.duree_echeance,
                pi.deleted_at AS prat_info_deleted_at
             FROM rendez_vous rv
             JOIN plage_horaire p ON rv.id_plage = p.id_plage
             JOIN users u ON rv.id_createur = u.id_users
             JOIN users up ON rv.id_patient = up.id_users
             JOIN pratiques pr ON p.id_prat_det = pr.id_prat_det
             JOIN praticien_info pi ON pr.id_prat_det = pi.id_prat_det
             WHERE rv.id_patient = :id_patient
             AND rv.date_rdv >= CURDATE()
             AND rv.deleted_at IS NULL
             AND p.deleted_at IS NULL
             AND u.deleted_at IS NULL
             AND up.deleted_at IS NULL
             AND pr.deleted_at IS NULL
             AND pi.deleted_at IS NULL`,
        {
          replacements: { id_patient },
          type: sequelize.QueryTypes.SELECT,
        }
      );

      return {
        success: true,
        message: "Rendez-vous récupérés avec succès.",
        data: result,
      };
    } catch (error) {
      console.error("Erreur dans getRendezVousByPatient :", error.message);
      return {
        success: false,
        message: "Erreur interne du serveur.",
      };
    }
  }

  async createRendezVous(
    date_rdv,
    heure_rdv,
    motif_rdv,
    status_rdv,
    id_pratique,
    id_createur,
    id_patient,
    id_crn
  ) {
    try {
      // Vérifier si l'id_crn correspond bien à un créneau disponible et que l'heure correspond
      const verifQuery = `
                SELECT heure_debut_dispo FROM creneaux_disponibilite 
                WHERE id_crn = :id_crn AND id_pratique = :id_pratique AND date_dispo = :date_rdv
            `;

      const creneau = await sequelize.query(verifQuery, {
        replacements: { id_crn, id_pratique, date_rdv },
        type: sequelize.QueryTypes.SELECT,
      });

      // Vérification si le créneau existe
      if (creneau.length === 0) {
        return {
          success: false,
          message: "Créneau indisponible ou inexistant.",
        };
      }

      // Vérification si l'heure du rendez-vous correspond à l'heure du créneau disponible
      if (creneau[0].heure_debut_dispo !== heure_rdv) {
        return {
          success: false,
          message:
            "L'heure du rendez-vous ne correspond pas à l'heure du créneau sélectionné.",
        };
      }

      // Insérer le rendez-vous si la vérification est validée
      const query = `
                INSERT INTO rendez_vous 
                (date_rdv, heure_rdv, motif_rdv, status_rdv, date_ajout_rdv, id_pratique, id_createur, id_patient, id_crn) 
                VALUES (:date_rdv, :heure_rdv, :motif_rdv, :status_rdv, NOW(), :id_pratique, :id_createur, :id_patient, :id_crn)
            `;

      await sequelize.query(query, {
        replacements: {
          date_rdv,
          heure_rdv,
          motif_rdv,
          status_rdv,
          id_pratique,
          id_createur,
          id_patient,
          id_crn,
        },
        type: sequelize.QueryTypes.INSERT,
      });

      return { success: true, message: "Rendez-vous créé avec succès." };
    } catch (error) {
      console.error("Erreur dans createRendezVous:", error.message);
      return {
        success: false,
        message: "Erreur lors de la création du rendez-vous.",
      };
    }
  }
}

module.exports = RendezVousModel;
