const { sequelize } = require('../config/db');

class PraticienModel {
    async createPraticien(numero_ciret, monney, id_users) {
        try {
            // Requête d'insertion avec des paramètres nommés
            const result = await sequelize.query(
                `INSERT INTO praticien_info (numero_ciret, monney, id_users) 
                VALUES (:numero_ciret, :monney, :id_users)`,
                {
                    replacements: { 
                        numero_ciret,
                        monney,
                        id_users
                    },
                    type: sequelize.QueryTypes.INSERT
                }
            );
            
            if (result) {
                return {
                    success: true,
                    message: 'Praticien créé avec succès.'
                };
            } else {
                return {
                    success: false,
                    message: 'Erreur lors de la création du praticien.'
                };
            }
        } catch (error) {
            console.error('Erreur dans createPraticien :', error.message);
            return {
                success: false,
                message: 'Erreur interne du serveur.'
            };
        }
    }

    // Fonction pour récupérer un praticien avec un LEFT JOIN sur la table users
    async getPraticien() {
        try {
            const result = await sequelize.query(
                `SELECT p.*, u.*
                 FROM praticien_info p
                 LEFT JOIN users u ON p.id_users = u.id_users`,
                {
                    type: sequelize.QueryTypes.SELECT
                }
            );

            if (result.length > 0) {
                return {
                    success: true,
                    message: 'Praticien(s) récupéré(s) avec succès.',
                    data: result
                };
            } else {
                return {
                    success: false,
                    message: 'Aucun praticien trouvé.'
                };
            }
        } catch (error) {
            console.error('Erreur dans getPraticien :', error.message);
            return {
                success: false,
                message: 'Erreur interne du serveur.'
            };
        }
    }

    // async searchUser(query) {
    //     try {
    //         const result = await sequelize.query(
    //             `SELECT * FROM users 
    //              WHERE user_name LIKE :query OR user_mail LIKE :query`,
    //             {
    //                 replacements: { query: `%${query}%` },
    //                 type: sequelize.QueryTypes.SELECT
    //             }
    //         );

    //         if (result.length > 0) {
    //             return {
    //                 success: true,
    //                 message: 'Utilisateur(s) trouvé(s).',
    //                 data: result
    //             };
    //         } else {
    //             return {
    //                 success: false,
    //                 message: 'Aucun utilisateur trouvé.'
    //             };
    //         }
    //     } catch (error) {
    //         console.error('Erreur dans searchUser :', error.message);
    //         return {
    //             success: false,
    //             message: 'Erreur interne du serveur.'
    //         };
    //     }
    // }

    async createDiscipline(nom_dsp) {
        try {
            const result = await sequelize.query(
                `INSERT INTO discipline (nom_dsp) VALUES (:nom_dsp)`,
                {
                    replacements: { nom_dsp },
                    type: sequelize.QueryTypes.INSERT
                }
            );

            if (result) {
                return {
                    success: true,
                    message: 'Discipline créée avec succès.'
                };
            } else {
                return {
                    success: false,
                    message: 'Erreur lors de la création de la discipline.'
                };
            }
        } catch (error) {
            console.error('Erreur dans createDiscipline :', error.message);
            return {
                success: false,
                message: 'Erreur interne du serveur.'
            };
        }
    }

        // Fonction pour rechercher un praticien par nom ou numéro CIRET
        async searchPraticien(query) {
            try {
                const result = await sequelize.query(
                    `SELECT p.*, u.*
                     FROM praticien_info p
                     LEFT JOIN users u ON p.id_users = u.id_users
                     WHERE u.id_type_user = 2
                     AND (u.nom LIKE :query OR p.numero_ciret LIKE :query)`,
                    {
                        replacements: { query: `%${query}%` },
                        type: sequelize.QueryTypes.SELECT
                    }
                );
    
                if (result.length > 0) {
                    return {
                        success: true,
                        message: 'Résultats de la recherche obtenus avec succès.',
                        data: result
                    };
                } else {
                    return {
                        success: false,
                        message: 'Aucun praticien correspondant trouvé.'
                    };
                }
            } catch (error) {
                console.error('Erreur dans searchPraticien :', error.message);
                return {
                    success: false,
                    message: 'Erreur interne du serveur.'
                };
            }
        }

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

    async getPratiques(searchQuery) {
        try {
            let query = `SELECT * FROM pratiques WHERE 1=1`;
            let replacements = {};

            if (searchQuery.nom_pratique) {
                query += ` AND nom_pratique LIKE :nom_pratique`;
                replacements.nom_pratique = `%${searchQuery.nom_pratique}%`;
            }

            if (searchQuery.desc_pratique) {
                query += ` AND desc_pratique LIKE :desc_pratique`;
                replacements.desc_pratique = `%${searchQuery.desc_pratique}%`;
            }

            if (searchQuery.tarif) {
                query += ` AND tarif = :tarif`;
                replacements.tarif = searchQuery.tarif;
            }

            if (searchQuery.id_dsp) {
                query += ` AND id_dsp = :id_dsp`;
                replacements.id_dsp = searchQuery.id_dsp;
            }

            const result = await sequelize.query(query, {
                replacements,
                type: sequelize.QueryTypes.SELECT
            });

            return {
                success: true,
                data: result
            };
        } catch (error) {
            console.error('Erreur dans getPratiques:', error.message);
            return {
                success: false,
                message: 'Erreur interne du serveur.'
            };
        }
    }
}

module.exports = PraticienModel;
