async addCreneauDisponibilite(date_dispo, heure_debut_dispo, heure_fin_dispo, id_pratique) {
    try {
        // Récupérer la durée de la pratique et le praticien associé
        const pratique = await sequelize.query(
            `SELECT duree, id_prat_det FROM pratiques WHERE id_pratique = :id_pratique`,
            {
                replacements: { id_pratique },
                type: sequelize.QueryTypes.SELECT,
            }
        );

        if (pratique.length === 0) {
            return { success: false, message: 'Pratique non trouvée.' };
        }

        const { duree: dureePratique, id_prat_det } = pratique[0];
        const heureDebut = new Date(`1970-01-01T${heure_debut_dispo}:00`);
        const heureFin = new Date(`1970-01-01T${heure_fin_dispo}:00`);

        // Vérifier que la durée totale est un multiple de la durée de la pratique (en heures)
        const differenceHeures = (heureFin - heureDebut) / 3600000; // Différence en heures
        if (differenceHeures % dureePratique !== 0) {
            return { success: false, message: 'La durée doit être un multiple de la durée de la pratique (en heures).' };
        }

        // Récupérer les créneaux existants pour ce praticien
        const creneauxExistants = await sequelize.query(
            `SELECT heure_debut_dispo, heure_fin_dispo FROM creneaux_disponibilite
             WHERE date_dispo = :date_dispo
             AND id_pratique IN (
                 SELECT id_pratique FROM pratiques WHERE id_prat_det = :id_prat_det
             )`,
            {
                replacements: { date_dispo, id_prat_det },
                type: sequelize.QueryTypes.SELECT,
            }
        );

        // Fonction pour vérifier les chevauchements
        const chevauche = (debut, fin) => {
            return creneauxExistants.some(
                ({ heure_debut_dispo, heure_fin_dispo }) =>
                    !(new Date(`1970-01-01T${heure_fin_dispo}:00`) <= debut ||
                      new Date(`1970-01-01T${heure_debut_dispo}:00`) >= fin)
            );
        };

        // Diviser le créneau global en sous-créneaux par heure
        let currentHeureDebut = heureDebut;
        while (currentHeureDebut < heureFin) {
            const currentHeureFin = new Date(currentHeureDebut.getTime() + dureePratique * 3600000); // Avance de "dureePratique" heures

            if (chevauche(currentHeureDebut, currentHeureFin)) {
                return { success: false, message: 'Un créneau se chevauche déjà pour ce praticien.' };
            }

            // Insérer le sous-créneau (par heure)
            // Insérer les créneaux dans une boucle
            let heureDebutCreneau = heureDebut;
            let heureFinCreneau = new Date(heureDebutCreneau.getTime() + dureePratique * 3600000); // duree en heures

            while (heureFinCreneau <= heureFin) {
                await sequelize.query(
                    `INSERT INTO creneaux_disponibilite (date_dispo, heure_debut_dispo, heure_fin_dispo, status, date_ajout_dispo, id_pratique) 
                    VALUES (:date_dispo, :heure_debut_dispo, :heure_fin_dispo, 1, NOW(), :id_pratique)`,
                    {
                        replacements: {
                            date_dispo,
                            heure_debut_dispo: heureDebutCreneau.toISOString().slice(11, 13) + ':00', // Format HH:00
                            heure_fin_dispo: heureFinCreneau.toISOString().slice(11, 13) + ':00',     // Format HH:00
                            id_pratique,
                        },
                        type: sequelize.QueryTypes.INSERT,
                    }
                );

                // Passer au prochain créneau
                heureDebutCreneau = heureFinCreneau;
                heureFinCreneau = new Date(heureDebutCreneau.getTime() + dureePratique * 3600000); // Avancer de dureePratique heures
            }


            // Passer au sous-créneau suivant
            currentHeureDebut = currentHeureFin;
        }

        return {
            success: true,
            message: 'Créneaux ajoutés avec succès.',
        };
    } catch (error) {
        console.error('Erreur dans addCreneauDisponibilite :', error.message);
        return {
            success: false,
            message: 'Erreur interne du serveur.',
        };
    }
}
