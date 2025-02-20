/** @format */

const { sequelize } = require("../config/db");

class PlageHoraireModel {
  async addPlageHoraire(id_prat_det, date_heure_debut, date_heure_fin) {
    try {
      // Vérifier si la plage horaire se chevauche avec une existante
      const overlappingPlages = await sequelize.query(
        `SELECT id_plage FROM plage_horaire
         WHERE id_prat_det = :id_prat_det
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

  async getPlagesByPraticien(id_prat_det) {
    try {
      const result = await sequelize.query(
        `SELECT * FROM plage_horaire WHERE id_prat_det = :id_prat_det AND deleted_at = NULL `,
        {
          replacements: { id_prat_det },
          type: sequelize.QueryTypes.SELECT,
        }
      );

      return {
        success: true,
        message: "Plages horaires récupérées avec succès.",
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
