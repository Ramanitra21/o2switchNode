/** @format */

const DisponibiliteModel = require("../models/DisponibiliteModel");
const disponibiliteModel = new DisponibiliteModel();

class DisponibiliteController {
  // Ajouter une disponibilité
  async addDisponibilite(req, res) {
    try {
      const { date_dispo, heure_debut_dispo, id_pratique, id_plage } = req.body;
      // 🛠️ Affichage des données reçues dans la console
      console.log("🔹 Données reçues dans addDisponibilite :", {
        date_dispo,
        heure_debut_dispo,
        id_pratique,
        id_plage,
      });
      const result = await disponibiliteModel.addDisponibilite(
        date_dispo,
        heure_debut_dispo,
        id_pratique,
        id_plage
      );

      if (result.success) {
        return res.status(201).json({
          success: true,
          message: result.message,
        });
      } else {
        return res.status(400).json({
          success: false,
          message: result.message,
        });
      }
    } catch (error) {
      console.error("Erreur dans addDisponibilite :", error.message);
      return res.status(500).json({
        success: false,
        message: "Erreur interne du serveur.",
      });
    }
  }

  // Récupérer les disponibilités par pratique
  async getDisponibilitesByPratique(req, res) {
    try {
      const { id_pratique } = req.params;

      const result = await disponibiliteModel.getDisponibilitesByPratique(
        id_pratique
      );

      if (result.success) {
        return res.status(200).json({
          success: true,
          data: result.data,
        });
      } else {
        return res.status(404).json({
          success: false,
          message: result.message,
        });
      }
    } catch (error) {
      console.error("Erreur dans getDisponibilitesByPratique :", error.message);
      return res.status(500).json({
        success: false,
        message: "Erreur interne du serveur.",
      });
    }
  }

  // Récupérer les disponibilités par praticien
  async getDisponibilitesByPraticien(req, res) {
    try {
      const { id_prat_det } = req.params;

      const result = await disponibiliteModel.getDisponibilitesByPraticien(
        id_prat_det
      );

      if (result.success) {
        return res.status(200).json({
          success: true,
          data: result.data,
        });
      } else {
        return res.status(404).json({
          success: false,
          message: result.message,
        });
      }
    } catch (error) {
      console.error(
        "Erreur dans getDisponibilitesByPraticien :",
        error.message
      );
      return res.status(500).json({
        success: false,
        message: "Erreur interne du serveur.",
      });
    }
  }
}

module.exports = new DisponibiliteController();
