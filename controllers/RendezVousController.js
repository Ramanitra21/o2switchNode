/** @format */

const RendezVousModel = require("../models/RendezVousModel_before");
const rendezVousModel = new RendezVousModel();

class RendezVousController {
  async getRendezVousByUser(req, res) {
    try {
      const { id_createur } = req.params;

      if (!id_createur) {
        return res.status(400).json({
          success: false,
          message: "ID utilisateur requis.",
        });
      }

      const result = await rendezVousModel.getRendezVousByUser(id_createur);

      if (result.success) {
        return res.status(200).json({
          success: true,
          data: result.data,
        });
      } else {
        return res.status(500).json({
          success: false,
          message: result.message,
        });
      }
    } catch (error) {
      console.error("Erreur dans getRendezVousByUser:", error.message);
      return res.status(500).json({
        success: false,
        message: "Erreur interne du serveur.",
      });
    }
  }

  async createRendezVous(req, res) {
    try {
      const {
        date_rdv,
        heure_rdv,
        motif_rdv,
        status_rdv,
        id_pratique,
        id_createur,
        id_patient,
      } = req.body;

      if (
        !date_rdv ||
        !heure_rdv ||
        !motif_rdv ||
        !status_rdv ||
        !id_pratique ||
        !id_createur ||
        !id_patient
      ) {
        return res.status(400).json({
          success: false,
          message: "Tous les champs sont requis.",
        });
      }

      const result = await rendezVousModel.createRendezVous(
        date_rdv,
        heure_rdv,
        motif_rdv,
        status_rdv,
        id_pratique,
        id_createur,
        id_patient
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
      console.error("Erreur dans createRendezVous:", error.message);
      return res.status(500).json({
        success: false,
        message: "Erreur interne du serveur.",
      });
    }
  }
}

module.exports = new RendezVousController();
