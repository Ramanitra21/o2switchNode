/** @format */

const { sequelize } = require("../config/db");

class PratiqueModel {
  async createPratique(
    nom_pratique,
    desc_pratique,
    date_pratique,
    tarif,
    duree,
    id_prat_det,
    id_dsp,
    couleur_pratique = null
  ) {
    const transaction = await sequelize.transaction(); // Démarrer une transaction
    try {
      // Générer une couleur aléatoire si elle est vide
      if (!couleur_pratique) {
        couleur_pratique = `#${Math.floor(Math.random() * 16777215)
          .toString(16)
          .padStart(6, "0")}`;
      }

      const result = await sequelize.query(
        `INSERT INTO pratiques 
                    (nom_pratique, desc_pratique, date_pratique, tarif, duree, id_prat_det, id_dsp, couleur_pratique) 
                 VALUES 
                    (:nom_pratique, :desc_pratique, :date_pratique, :tarif, :duree, :id_prat_det, :id_dsp, :couleur_pratique)`,
        {
          replacements: {
            nom_pratique,
            desc_pratique,
            date_pratique,
            tarif,
            duree,
            id_prat_det,
            id_dsp,
            couleur_pratique,
          },
          type: sequelize.QueryTypes.INSERT,
          transaction,
        }
      );

      await transaction.commit(); // Valider la transaction

      return {
        success: true,
        message: "Pratique créée avec succès.",
        insertedId: result[0], // Récupérer l'ID inséré si disponible
      };
    } catch (error) {
      await transaction.rollback(); // Annuler en cas d'erreur
      console.error("Erreur dans createPratique :", error);

      return {
        success: false,
        message: `Erreur lors de la création de la pratique : ${error.message}`,
      };
    }
  }

  async getPratiquesByIdPratDet(id_prat_det) {
    try {
      const result = await sequelize.query(
        `SELECT p.*, pr.*, d.*, pac.*
                 FROM pratiques p
                 LEFT JOIN praticien_info pr ON p.id_prat_det = pr.id_prat_det
                 LEFT JOIN discipline d ON p.id_dsp = d.id_dsp
                 LEFT JOIN praticien_adresse_consultation pac ON p.id_pratique = pac.id_pratique
                 WHERE p.id_prat_det = :id_prat_det`,
        {
          replacements: { id_prat_det },
          type: sequelize.QueryTypes.SELECT,
        }
      );

      if (result.length > 0) {
        return {
          success: true,
          message: "Pratiques récupérées avec succès.",
          data: result,
        };
      } else {
        return {
          success: false,
          message: "Aucune pratique trouvée pour ce praticien.",
        };
      }
    } catch (error) {
      console.error("Erreur dans getPratiquesByIdPratDet :", error.message);
      return {
        success: false,
        message: "Erreur interne du serveur.",
      };
    }
  }

  async getPratiquesByIdDsp(id_dsp) {
    try {
      const result = await sequelize.query(
        `SELECT p.*, pr.*, d.*, pac.*
                 FROM pratiques p
                 LEFT JOIN praticien_info pr ON p.id_prat_det = pr.id_prat_det
                 LEFT JOIN discipline d ON p.id_dsp = d.id_dsp
                 LEFT JOIN praticien_adresse_consultation pac ON p.id_pratique = pac.id_pratique
                 WHERE p.id_dsp = :id_dsp`,
        {
          replacements: { id_dsp },
          type: sequelize.QueryTypes.SELECT,
        }
      );

      if (result.length > 0) {
        return {
          success: true,
          message: "Pratiques récupérées avec succès.",
          data: result,
        };
      } else {
        return {
          success: false,
          message: "Aucune pratique trouvée pour cette discipline.",
        };
      }
    } catch (error) {
      console.error("Erreur dans getPratiquesByIdDsp :", error.message);
      return {
        success: false,
        message: "Erreur interne du serveur.",
      };
    }
  }
}

module.exports = PratiqueModel;
