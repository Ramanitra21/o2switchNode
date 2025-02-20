/** @format */

const { sequelize } = require("../config/db");
const { envoyerMailRendezVous } = require("../utils/emailService");

class RendezVousPraticienModel {
  async createRendezVousPraticien(
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

      if (creneau.length === 0) {
        return {
          success: false,
          message: "Créneau indisponible ou inexistant.",
        };
      }

      if (creneau[0].heure_debut_dispo !== heure_rdv) {
        return {
          success: false,
          message:
            "L'heure du rendez-vous ne correspond pas à l'heure du créneau sélectionné.",
        };
      }

      // Vérification du chevauchement du rendez-vous pour le patient
      const patientRdvQuery = `
        SELECT 1 FROM rendez_vous
        WHERE id_patient = :id_patient 
        AND date_rdv = :date_rdv 
        AND heure_rdv = :heure_rdv
        AND status_rdv != 'annulé'
      `;
      const patientRdv = await sequelize.query(patientRdvQuery, {
        replacements: { id_patient, date_rdv, heure_rdv },
        type: sequelize.QueryTypes.SELECT,
      });

      if (patientRdv.length > 0) {
        return {
          success: false,
          message: "Le patient a déjà un rendez-vous à cette heure.",
        };
      }

      // Récupérer les infos du praticien et du patient
      const praticienQuery = `
        SELECT u.user_mail AS email_praticien, u.user_name, u.user_forname, p.nom_pratique 
        FROM pratiques p
        JOIN praticien_info pi ON p.id_prat_det = pi.id_prat_det
        JOIN users u ON pi.id_users = u.id_users
        WHERE p.id_pratique = :id_pratique
      `;
      const praticien = await sequelize.query(praticienQuery, {
        replacements: { id_pratique },
        type: sequelize.QueryTypes.SELECT,
      });

      const patientQuery = `
        SELECT u.user_mail AS email_patient, u.user_name, u.user_forname
        FROM users u
        WHERE u.id_users = :id_patient
      `;
      const patient = await sequelize.query(patientQuery, {
        replacements: { id_patient },
        type: sequelize.QueryTypes.SELECT,
      });

      if (praticien.length === 0 || patient.length === 0) {
        return {
          success: false,
          message: "Erreur lors de la récupération des emails.",
        };
      }

      const {
        email_praticien,
        user_name: praticien_nom,
        user_forname: praticien_prenom,
        nom_pratique,
      } = praticien[0];
      const {
        email_patient,
        user_name: patient_nom,
        user_forname: patient_prenom,
      } = patient[0];

      // Insérer le rendez-vous dans la base de données
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

      // Envoyer l'email de confirmation
      await envoyerMailRendezVous(
        email_patient,
        `${patient_prenom} ${patient_nom}`,
        email_praticien,
        `${praticien_prenom} ${praticien_nom}`,
        nom_pratique,
        date_rdv,
        heure_rdv,
        "Lieu du rendez-vous",
        motif_rdv
      );

      return {
        success: true,
        message: "Rendez-vous créé et emails envoyés avec succès.",
      };
    } catch (error) {
      console.error("Erreur dans createRendezVousPraticien:", error.message);
      return {
        success: false,
        message: "Erreur lors de la création du rendez-vous.",
      };
    }
  }
}

module.exports = RendezVousPraticienModel;
