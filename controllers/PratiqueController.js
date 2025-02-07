/** @format */

const PratiqueModel = require("../models/PratiqueModel");
const pratiqueModel = new PratiqueModel();

class PratiqueController {
  // Fonction pour créer une pratique
  async createPratique(req, res) {
    try {
      const {
        nom_pratique,
        desc_pratique,
        date_pratique,
        tarif,
        duree,
        couleur_pratique,
        id_prat_det,
        id_dsp,
      } = req.body;

      const result = await pratiqueModel.createPratique(
        nom_pratique,
        desc_pratique,
        date_pratique,
        tarif,
        duree,
        couleur_pratique,
        id_prat_det,
        id_dsp
      );

      if (result.success) {
        return res.status(201).json({
          success: true,
          message: result.message,
        });
      } else {
        return res.status(500).json({
          success: false,
          message: result.message,
        });
      }
    } catch (error) {
      console.error("Erreur dans createPratique:", error.message);
      return res.status(500).json({
        success: false,
        message: "Erreur interne du serveur.",
      });
    }
  }

  // Fonction pour récupérer les pratiques d'un praticien
  async getPratiquesByIdPratDet(req, res) {
    try {
      const { id_prat_det } = req.params;
      const result = await pratiqueModel.getPratiquesByIdPratDet(id_prat_det);

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
      console.error("Erreur dans getPratiquesByIdPratDet:", error.message);
      return res.status(500).json({
        success: false,
        message: "Erreur interne du serveur.",
      });
    }
  }

  // Fonction pour récupérer les pratiques d'une discipline
  async getPratiquesByIdDsp(req, res) {
    try {
      const { id_dsp } = req.params;
      const result = await pratiqueModel.getPratiquesByIdDsp(id_dsp);

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
      console.error("Erreur dans getPratiquesByIdDsp:", error.message);
      return res.status(500).json({
        success: false,
        message: "Erreur interne du serveur.",
      });
    }
  }
}

module.exports = new PratiqueController();
