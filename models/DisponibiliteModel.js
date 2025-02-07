/** @format */

const { sequelize } = require("../config/db");

class DisponibiliteModel {
  async addDisponibilite(date_dispo, heure_debut_dispo, id_pratique, id_plage) {
    try {
      console.log("Valeurs reçues :", {
        date_dispo,
        heure_debut_dispo,
        id_pratique,
        id_plage,
      });

      // Vérifier l'existence de la plage horaire et la correspondance avec la pratique
      const pratDetCheck = await sequelize.query(
        `SELECT p.id_prat_det FROM pratiques p 
         JOIN plage_horaire ph ON ph.id_plage = :id_plage 
         WHERE p.id_pratique = :id_pratique AND p.id_prat_det = ph.id_prat_det`,
        {
          replacements: { id_pratique, id_plage },
          type: sequelize.QueryTypes.SELECT,
        }
      );

      if (pratDetCheck.length === 0) {
        return {
          success: false,
          message: "Incohérence entre la pratique et la plage horaire.",
        };
      }

      // Vérifier si la pratique existe et récupérer sa durée
      const pratique = await sequelize.query(
        `SELECT duree, id_prat_det FROM pratiques WHERE id_pratique = :id_pratique`,
        {
          replacements: { id_pratique },
          type: sequelize.QueryTypes.SELECT,
        }
      );

      if (pratique.length === 0) {
        return { success: false, message: "Pratique non trouvée." };
      }

      const { duree, id_prat_det } = pratique[0]; // Durée en minutes

      // Récupérer la plage horaire si fournie
      let heure_debut_plage, heure_fin_plage;
      if (id_plage) {
        const plage = await sequelize.query(
          `SELECT TIME_FORMAT(date_heure_debut, '%H:%i') AS heure_debut_plage, 
                  TIME_FORMAT(date_heure_fin, '%H:%i') AS heure_fin_plage 
           FROM plage_horaire 
           WHERE id_plage = :id_plage`,
          {
            replacements: { id_plage },
            type: sequelize.QueryTypes.SELECT,
          }
        );

        if (plage.length === 0) {
          return { success: false, message: "Plage horaire non trouvée." };
        }

        heure_debut_plage = plage[0].heure_debut_plage;
        heure_fin_plage = plage[0].heure_fin_plage;

        console.log("Heures récupérées :", {
          heure_debut_dispo,
          heure_debut_plage,
          heure_fin_plage,
        });

        if (heure_debut_dispo < heure_debut_plage) {
          return {
            success: false,
            message: "L'heure de début est avant celle de la plage horaire.",
          };
        }
      }

      // Calculer l'heure de fin de disponibilité
      const [h, m] = heure_debut_dispo.split(":").map(Number);
      const dateDebut = new Date(date_dispo);
      dateDebut.setHours(h, m, 0);
      const dateFin = new Date(dateDebut.getTime() + duree * 60000);
      const heure_fin_dispo = dateFin.toTimeString().split(" ")[0].slice(0, 5);

      console.log("Heure de fin calculée :", heure_fin_dispo);

      // Vérifier si la disponibilité dépasse la plage horaire
      if (id_plage && heure_fin_dispo > heure_fin_plage) {
        return {
          success: false,
          message: "La disponibilité dépasse la plage horaire.",
        };
      }

      // Vérifier si la disponibilité chevauche une autre disponibilité du praticien
      const overlappingCreneaux = await sequelize.query(
        `SELECT id_crn FROM creneaux_disponibilite
         WHERE date_dispo = :date_dispo
         AND id_pratique = :id_pratique
         AND (
             (heure_debut_dispo < :heure_fin_dispo AND heure_fin_dispo > :heure_debut_dispo)
         )`,
        {
          replacements: {
            date_dispo,
            heure_debut_dispo,
            heure_fin_dispo,
            id_pratique,
          },
          type: sequelize.QueryTypes.SELECT,
        }
      );

      if (overlappingCreneaux.length > 0) {
        return { success: false, message: "Un créneau se chevauche déjà." };
      }

      // 🔥 Vérifier si la disponibilité chevauche une autre **pratique du praticien**
      const overlappingPratiques = await sequelize.query(
        `SELECT p.id_pratique FROM pratiques p
         JOIN creneaux_disponibilite cd ON p.id_pratique = cd.id_pratique
         WHERE p.id_prat_det = :id_prat_det
         AND cd.date_dispo = :date_dispo
         AND (
             (cd.heure_debut_dispo < :heure_fin_dispo AND cd.heure_fin_dispo > :heure_debut_dispo)
         )`,
        {
          replacements: {
            id_prat_det,
            date_dispo,
            heure_debut_dispo,
            heure_fin_dispo,
          },
          type: sequelize.QueryTypes.SELECT,
        }
      );

      if (overlappingPratiques.length > 0) {
        return {
          success: false,
          message:
            "Un autre acte est déjà prévu pour ce praticien sur ce créneau.",
        };
      }

      // Insérer la disponibilité
      await sequelize.query(
        `INSERT INTO creneaux_disponibilite (date_dispo, heure_debut_dispo, heure_fin_dispo, status, date_ajout_dispo, id_pratique, id_plage)
         VALUES (:date_dispo, :heure_debut_dispo, :heure_fin_dispo, 1, NOW(), :id_pratique, NULLIF(:id_plage, ''))`,
        {
          replacements: {
            date_dispo,
            heure_debut_dispo,
            heure_fin_dispo,
            id_pratique,
            id_plage,
          },
          type: sequelize.QueryTypes.INSERT,
        }
      );

      return { success: true, message: "Disponibilité ajoutée avec succès." };
    } catch (error) {
      console.error("Erreur dans addDisponibilite :", error.message);
      return { success: false, message: "Erreur interne du serveur." };
    }
  }

  // Récupérer les disponibilités par pratique
  async getDisponibilitesByPratique(id_pratique) {
    try {
      const result = await sequelize.query(
        `SELECT * FROM creneaux_disponibilite WHERE id_pratique = :id_pratique`,
        {
          replacements: { id_pratique },
          type: sequelize.QueryTypes.SELECT,
        }
      );
      return { success: true, data: result };
    } catch (error) {
      console.error("Erreur dans getDisponibilitesByPratique :", error.message);
      return { success: false, message: "Erreur interne du serveur." };
    }
  }

  // Récupérer les disponibilités par praticien
  async getDisponibilitesByPraticien(id_prat_det) {
    try {
      const result = await sequelize.query(
        `SELECT cd.*, p.nom_pratique FROM creneaux_disponibilite cd
         JOIN pratiques p ON cd.id_pratique = p.id_pratique
         WHERE p.id_prat_det = :id_prat_det`,
        {
          replacements: { id_prat_det },
          type: sequelize.QueryTypes.SELECT,
        }
      );
      return { success: true, data: result };
    } catch (error) {
      console.error(
        "Erreur dans getDisponibilitesByPraticien :",
        error.message
      );
      return { success: false, message: "Erreur interne du serveur." };
    }
  }
}

module.exports = DisponibiliteModel;
