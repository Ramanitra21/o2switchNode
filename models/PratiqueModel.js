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
    lieu,
    longitude,
    latitude,
    isHome,
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
          (nom_pratique, desc_pratique, date_pratique, tarif, duree, id_prat_det, id_dsp, couleur_pratique, lieu, longitude, latitude, isHome) 
        VALUES 
          (:nom_pratique, :desc_pratique, :date_pratique, :tarif, :duree, :id_prat_det, :id_dsp, :couleur_pratique, :lieu, :longitude, :latitude, :isHome)`,
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
            lieu,
            longitude,
            latitude,
            isHome,
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
  async getPratiqueByDisciplineAndLocation(discipline, lieu) {
    try {
      const result = await sequelize.query(
        `SELECT 
                u.user_name AS nom_praticien, 
                u.user_forname AS prenom_praticien,
                p.nom_pratique,
                d.nom_dsp AS nom_discipline,
                p.lieu,
                p.longitude,
                p.latitude,
                p.note,
                p.tarif,
                p.desc_pratique,
                CASE 
                    WHEN p.isHome = 1 THEN 'Accepte consultation à domicile' 
                    ELSE 'N\'accepte pas la consultation à domicile' 
                END AS consultation_domicile
            FROM pratiques p
            LEFT JOIN discipline d ON p.id_dsp = d.id_dsp
            LEFT JOIN praticien_info pi ON p.id_prat_det = pi.id_prat_det
            LEFT JOIN users u ON pi.id_users = u.id_users
            WHERE 
                p.deleted_at IS NULL  -- Vérifie que la pratique n'est pas supprimée
                AND pi.deleted_at IS NULL -- Vérifie que le praticien n'est pas supprimé
                AND u.deleted_at IS NULL -- Vérifie que l'utilisateur n'est pas supprimé
                AND (
                    :discipline IS NULL 
                    OR LOWER(d.nom_dsp) LIKE LOWER(CONCAT('%', :discipline, '%')) 
                    OR SOUNDEX(d.nom_dsp) = SOUNDEX(:discipline) -- Recherche phonétique
                )
                AND (
                    :lieu IS NULL 
                    OR LOWER(p.lieu) LIKE LOWER(CONCAT('%', :lieu, '%')) 
                    OR SOUNDEX(p.lieu) = SOUNDEX(:lieu) -- Recherche phonétique
                )
            `,
        {
          replacements: {
            discipline: discipline ? `%${discipline}%` : null,
            lieu: lieu ? `%${lieu}%` : null,
          },
          type: sequelize.QueryTypes.SELECT,
        }
      );

      return {
        success: true,
        message: "Pratiques trouvées avec succès.",
        data: result,
      };
    } catch (error) {
      console.error("Erreur dans getPratiqueByDisciplineAndLocation :", error);
      return {
        success: false,
        message: `Erreur lors de la recherche des pratiques : ${error.message}`,
      };
    }
  }
}

module.exports = PratiqueModel;
