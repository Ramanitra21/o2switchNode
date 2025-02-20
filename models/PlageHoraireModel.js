/** @format */

const { sequelize } = require("../config/db");

class PlageHoraireModel {
  async addPlageHoraire(id_prat_det, date_heure_debut, date_heure_fin) {
    try {
      // Vérifier si la plage horaire se chevauche avec une existante
      const overlappingPlages = await sequelize.query(
        `SELECT id_plage FROM plage_horaire
         WHERE id_prat_det = :id_prat_det
         AND deleted_at IS NULL
         AND (
           (date_heure_debut < :date_heure_fin AND date_heure_fin > :date_heure_debut) 
         )`,
        {
          replacements: {
            id_prat_det,
            date_heure_debut,
            date_heure_fin,
          },
          type: sequelize.QueryTypes.SELECT,
        }
      );

      if (overlappingPlages.length > 0) {
        return {
          success: false,
          message: "Un créneau se chevauche déjà pour ce praticien.",
        };
      }

      // Insérer la nouvelle plage horaire
      await sequelize.query(
        `INSERT INTO plage_horaire (id_prat_det, date_heure_debut, date_heure_fin)
         VALUES (:id_prat_det, :date_heure_debut, :date_heure_fin)`,
        {
          replacements: { id_prat_det, date_heure_debut, date_heure_fin },
          type: sequelize.QueryTypes.INSERT,
        }
      );

      return {
        success: true,
        message: "Plage horaire ajoutée avec succès.",
      };
    } catch (error) {
      console.error("Erreur dans addPlageHoraire :", error.message);
      return {
        success: false,
        message: "Erreur interne du serveur.",
      };
    }
  }

  async deletePlageHoraire(id_plage) {
    try {
      // Vérifier si la plage contient des rendez-vous occupés
      const occupiedAppointments = await sequelize.query(
        `SELECT id_rdv FROM rendez_vous
         WHERE id_plage = :id_plage AND id_patient IS NOT NULL AND deleted_at IS NULL`,
        {
          replacements: { id_plage },
          type: sequelize.QueryTypes.SELECT,
        }
      );

      if (occupiedAppointments.length > 0) {
        return {
          success: false,
          message:
            "Impossible de supprimer : un ou plusieurs rendez-vous sont déjà occupés.",
        };
      }

      // Supprimer les rendez-vous non occupés
      await sequelize.query(
        `UPDATE rendez_vous
         SET deleted_at = NOW()
         WHERE id_plage = :id_plage AND id_patient IS NULL`,
        {
          replacements: { id_plage },
          type: sequelize.QueryTypes.UPDATE,
        }
      );

      // Supprimer la plage horaire
      await sequelize.query(
        `UPDATE plage_horaire
         SET deleted_at = NOW()
         WHERE id_plage = :id_plage`,
        {
          replacements: { id_plage },
          type: sequelize.QueryTypes.UPDATE,
        }
      );

      return {
        success: true,
        message: "Plage horaire supprimée avec succès.",
      };
    } catch (error) {
      console.error("Erreur dans deletePlageHoraire :", error.message);
      return {
        success: false,
        message: "Erreur interne du serveur.",
      };
    }
  }

  async getPlagesByPraticien(id_prat_det) {
    try {
      const result = await sequelize.query(
        `SELECT 
                p.id_plage,
                p.date_heure_debut,
                p.date_heure_fin,
                p.deleted_at AS plage_deleted_at,
                u.user_name,
                u.user_forname,
                u.adresse,
                u.code_postal,
                u.ville,
                u.user_created_at,
                u.user_date_naissance,
                u.user_mail,
                u.user_phone,
                u.user_photo_url,
                pi.numero_ciret,
                pi.monney,
                pi.duree_echeance,
                pi.deleted_at AS prat_info_deleted_at
             FROM plage_horaire p
             JOIN praticien_info pi ON p.id_prat_det = pi.id_prat_det
             JOIN users u ON pi.id_users = u.id_users
             WHERE p.id_prat_det = :id_prat_det 
             AND p.deleted_at IS NULL 
             AND p.date_heure_debut >= NOW()
             AND u.deleted_at IS NULL 
             AND pi.deleted_at IS NULL`,
        {
          replacements: { id_prat_det },
          type: sequelize.QueryTypes.SELECT,
        }
      );

      return {
        success: true,
        message:
          "Plages horaires et informations des praticiens récupérées avec succès.",
        data: result,
      };
    } catch (error) {
      console.error("Erreur dans getPlagesByPraticien :", error.message);
      return {
        success: false,
        message: "Erreur interne du serveur.",
      };
    }
  }
}

module.exports = PlageHoraireModel;
