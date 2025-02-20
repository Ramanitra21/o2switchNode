/** @format */

const PlageHoraireModel = require("../models/PlageHoraireModel");
const plageHoraireModel = new PlageHoraireModel();

class PlageHoraireController {
  // Ajouter une plage horaire
  async addPlageHoraire(req, res) {
    try {
      const { date, heure_debut, heure_fin, id_prat_det } = req.body;

      // Assembler date et heure
      const date_heure_debut = `${date} ${heure_debut}`;
      const date_heure_fin = `${date} ${heure_fin}`;

      const result = await plageHoraireModel.addPlageHoraire(
        id_prat_det,
        date_heure_debut,
        date_heure_fin
      );

      if (result.success) {
        return res.status(201).json({ success: true, message: result.message });
      } else {
        return res
          .status(400)
          .json({ success: false, message: result.message });
      }
    } catch (error) {
      console.error("Erreur dans addPlageHoraire :", error.message);
      return res
        .status(500)
        .json({ success: false, message: "Erreur interne du serveur." });
    }
  }

  // Supprimer une plage horaire
  async deletePlageHoraire(req, res) {
    try {
      const { id_plage } = req.params;

      const result = await plageHoraireModel.deletePlageHoraire(id_plage);

      if (result.success) {
        return res.status(200).json({ success: true, message: result.message });
      } else {
        return res
          .status(400)
          .json({ success: false, message: result.message });
      }
    } catch (error) {
      console.error("Erreur dans deletePlageHoraire :", error.message);
      return res
        .status(500)
        .json({ success: false, message: "Erreur interne du serveur." });
    }
  }

  // Récupérer les plages horaires par praticien
  async getPlagesByPraticien(req, res) {
    try {
      const { id_prat_det } = req.params;
      const result = await plageHoraireModel.getPlagesByPraticien(id_prat_det);

      if (result.success) {
        return res
          .status(200)
          .json({ success: true, message: result.message, data: result.data });
      } else {
        return res
          .status(404)
          .json({ success: false, message: result.message });
      }
    } catch (error) {
      console.error("Erreur dans getPlagesByPraticien :", error.message);
      return res
        .status(500)
        .json({ success: false, message: "Erreur interne du serveur." });
    }
  }
}

module.exports = new PlageHoraireController();
