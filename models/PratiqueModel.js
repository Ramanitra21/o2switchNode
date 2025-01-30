const { sequelize } = require('../config/db');

class PratiqueModel {
    async createPratique(nom_pratique, desc_pratique, date_pratique, tarif, duree, id_prat_det, id_dsp) {
        try {
            const result = await sequelize.query(
                `INSERT INTO pratiques (nom_pratique, desc_pratique, date_pratique, tarif, duree, id_prat_det, id_dsp) 
                 VALUES (:nom_pratique, :desc_pratique, :date_pratique, :tarif, :duree, :id_prat_det, :id_dsp)`,
                {
                    replacements: { nom_pratique, desc_pratique, date_pratique, tarif, duree, id_prat_det, id_dsp },
                    type: sequelize.QueryTypes.INSERT
                }
            );

            if (result) {
                return {
                    success: true,
                    message: 'Pratique créée avec succès.'
                };
            } else {
                return {
                    success: false,
                    message: 'Erreur lors de la création de la pratique.'
                };
            }
        } catch (error) {
            console.error('Erreur dans createPratique :', error.message);
            return {
                success: false,
                message: 'Erreur interne du serveur.'
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
                    type: sequelize.QueryTypes.SELECT
                }
            );

            if (result.length > 0) {
                return {
                    success: true,
                    message: 'Pratiques récupérées avec succès.',
                    data: result
                };
            } else {
                return {
                    success: false,
                    message: 'Aucune pratique trouvée pour ce praticien.'
                };
            }
        } catch (error) {
            console.error('Erreur dans getPratiquesByIdPratDet :', error.message);
            return {
                success: false,
                message: 'Erreur interne du serveur.'
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
                    type: sequelize.QueryTypes.SELECT
                }
            );

            if (result.length > 0) {
                return {
                    success: true,
                    message: 'Pratiques récupérées avec succès.',
                    data: result
                };
            } else {
                return {
                    success: false,
                    message: 'Aucune pratique trouvée pour cette discipline.'
                };
            }
        } catch (error) {
            console.error('Erreur dans getPratiquesByIdDsp :', error.message);
            return {
                success: false,
                message: 'Erreur interne du serveur.'
            };
        }
    }
}

module.exports = PratiqueModel;
