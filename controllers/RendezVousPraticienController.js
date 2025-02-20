/** @format */

const RendezVousPraticienModel = require("../models/RendezVousPraticienModel");
const rendezVousPraticienModel = new RendezVousPraticienModel();

class RendezVousPraticienController {
  /**
   * Récupérer les rendez-vous d'un utilisateur (praticien ou patient)
   */
  // async getRendezVousByUser(req, res) {
  //   try {
  //     const { id_createur } = req.params;

  //     if (!id_createur) {
  //       return res.status(400).json({
  //         success: false,
  //         message: "ID utilisateur requis.",
  //       });
  //     }

  //     const result = await rendezVousPraticienModel.getRendezVousByUser(
  //       id_createur
  //     );

  //     if (result.success) {
  //       return res.status(200).json({
  //         success: true,
  //         data: result.data,
  //       });
  //     } else {
  //       return res.status(404).json({
  //         success: false,
  //         message: result.message || "Aucun rendez-vous trouvé.",
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Erreur dans getRendezVousByUser:", error.message);
  //     return res.status(500).json({
  //       success: false,
  //       message: "Erreur interne du serveur.",
  //     });
  //   }
  // }

  /**
   * Créer un rendez-vous
   */
  async createRendezVousPraticien(req, res) {
    try {
      const {
        date_rdv,
        heure_rdv,
        motif_rdv,
        status_rdv,
        id_pratique,
        id_createur,
        id_patient,
        id_crn,
      } = req.body;

      if (
        !date_rdv ||
        !heure_rdv ||
        !motif_rdv ||
        !status_rdv ||
        !id_pratique ||
        !id_createur ||
        !id_patient ||
        !id_crn
      ) {
        return res.status(400).json({
          success: false,
          message: "Tous les champs sont requis.",
        });
      }

      const result = await rendezVousPraticienModel.createRendezVousPraticien(
        date_rdv,
        heure_rdv,
        motif_rdv,
        status_rdv,
        id_pratique,
        id_createur,
        id_patient,
        id_crn
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
      console.error("Erreur dans createRendezVousPraticien:", error.message);
      return res.status(500).json({
        success: false,
        message: "Erreur interne du serveur.",
      });
    }
  }
}

module.exports = new RendezVousPraticienController();
