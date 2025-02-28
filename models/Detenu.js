const db = require('../config/database');

class Detenu {
    static async create(detenuData) {
        const {
            nom,
            prenom,
            date_naissance,
            sexe,
            date_admission,
            celluleId,
            id_enquete,
            date_fin_peine,
            statut,
            type_peine,
            numero_dossier
        } = detenuData;

        // Vérification des champs requis
        if (!nom || !prenom || !date_naissance || !sexe || !date_admission || !celluleId) {
            throw new Error('Tous les champs obligatoires doivent être remplis');
        }

        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            // 1. Vérifier si la cellule existe et a de la place
            const [celluleInfo] = await connection.execute(
                'SELECT capacite, nombre_occupe FROM cellules WHERE id_cellule = ?',
                [celluleId]
            );

            if (celluleInfo.length === 0) {
                console.error(`Cellule non trouvée: ${celluleId}`);
                throw new Error('CELLULE_NOT_FOUND');
            }

            if (celluleInfo[0].nombre_occupe >= celluleInfo[0].capacite) {
                throw new Error('CELLULE_FULL');
            }

            console.log('Données pour l\'insertion dans la table detenus:', {
                nom,
                prenom,
                date_naissance,
                sexe,
                date_admission,
                celluleId,
                id_enquete,
                date_fin_peine,
                statut,
                type_peine,
                numero_dossier
            });

            // 2. Créer le détenu
            const [result] = await connection.execute(`
                INSERT INTO detenus (
                    nom, prenom, date_naissance, sexe, 
                    date_admission, celluleId, id_enquete, 
                    date_fin_peine, statut, type_peine, numero_dossier
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
                nom,
                prenom,
                date_naissance,
                sexe,
                date_admission,
                celluleId,
                id_enquete || null,
                date_fin_peine || null,
                statut || 'En détention',
                type_peine || null,
                numero_dossier
            ]);

            // 3. Mettre à jour l'occupation de la cellule
            await connection.execute(`
                UPDATE cellules 
                SET nombre_occupe = nombre_occupe + 1,
                    statut_cellule = CASE 
                        WHEN nombre_occupe + 1 >= capacite THEN 'Pleine'
                        ELSE 'Disponible'
                    END
                WHERE id_cellule = ?
            `, [celluleId]);

            // 4. Créer un mouvement d'admission
            await connection.execute(`
                INSERT INTO mouvements_detenus (
                    id_detenu, type_mouvement, cellule_arrivee,
                    date_mouvement, motif
                ) VALUES (?, 'Admission', ?, NOW(), 'Nouvelle admission')
            `, [result.insertId, celluleId]);

            await connection.commit();
            return result.insertId;

        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    static async transferer(id_detenu, celluleId, motif) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            // Vérifier si le détenu existe
            const [detenu] = await connection.execute(
                'SELECT celluleId FROM detenus WHERE id_detenu = ?',
                [id_detenu]
            );

            if (detenu.length === 0) {
                throw new Error('DETENU_NOT_FOUND');
            }

            const ancienneCellule = detenu[0].celluleId;

            // Mettre à jour la cellule du détenu
            await connection.execute(
                'UPDATE detenus SET celluleId = ? WHERE id_detenu = ?',
                [celluleId, id_detenu]
            );

            // Créer un mouvement
            await connection.execute(`
                INSERT INTO mouvements_detenus (
                    id_detenu, type_mouvement,
                    cellule_depart, cellule_arrivee,
                    date_mouvement, motif
                ) VALUES (?, 'Transfert', ?, ?, NOW(), ?)
            `, [id_detenu, ancienneCellule, celluleId, motif]);

            // Mettre à jour les compteurs des cellules
            await connection.execute(
                'UPDATE cellules SET nombre_occupe = nombre_occupe - 1 WHERE id_cellule = ?',
                [ancienneCellule]
            );

            await connection.execute(
                'UPDATE cellules SET nombre_occupe = nombre_occupe + 1 WHERE id_cellule = ?',
                [celluleId]
            );

            await connection.commit();
            return true;

        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    static async liberer(id_detenu, motif) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            // Vérifier si le détenu existe
            const [detenu] = await connection.execute(
                'SELECT celluleId FROM detenus WHERE id_detenu = ?',
                [id_detenu]
            );

            if (detenu.length === 0) {
                throw new Error('DETENU_NOT_FOUND');
            }

            const celluleId = detenu[0].celluleId;

            // Mettre à jour le statut du détenu
            await connection.execute(
                'UPDATE detenus SET statut = "Libéré", date_liberation = NOW(), celluleId = NULL WHERE id_detenu = ?',
                [id_detenu]
            );

            // Créer un mouvement
            await connection.execute(`
                INSERT INTO mouvements_detenus (
                    id_detenu, type_mouvement,
                    cellule_depart, date_mouvement, motif
                ) VALUES (?, 'Libération', ?, NOW(), ?)
            `, [id_detenu, celluleId, motif]);

            // Mettre à jour le compteur de la cellule
            await connection.execute(
                'UPDATE cellules SET nombre_occupe = nombre_occupe - 1 WHERE id_cellule = ?',
                [celluleId]
            );

            await connection.commit();
            return true;

        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    static async getStatistiques() {
        const connection = await db.getConnection();
        try {
            // Total des détenus
            const [totalDetenus] = await connection.execute(
                'SELECT COUNT(*) as total FROM detenus'
            );

            // Détenus par statut
            const [detenusByStatus] = await connection.execute(`
                SELECT 
                    COUNT(CASE WHEN statut = 'En détention' THEN 1 END) as detenusEnDetention,
                    COUNT(CASE WHEN statut = 'Libéré' THEN 1 END) as detenusLiberes,
                    COUNT(CASE WHEN statut = 'En transfert' THEN 1 END) as detenusEnTransfert
                FROM detenus
            `);

            // Statistiques des cellules
            const [celluleStats] = await connection.execute(`
                SELECT 
                    COUNT(*) as totalCellules,
                    COUNT(CASE WHEN nombre_occupe > 0 THEN 1 END) as cellulesOccupees,
                    ROUND(
                        (SUM(nombre_occupe) / SUM(capacite)) * 100, 
                        2
                    ) as tauxOccupation
                FROM cellules
            `);

            return {
                totalDetenus: totalDetenus[0].total,
                detenusEnDetention: detenusByStatus[0].detenusEnDetention,
                detenusLiberes: detenusByStatus[0].detenusLiberes,
                detenusEnTransfert: detenusByStatus[0].detenusEnTransfert,
                totalCellules: celluleStats[0].totalCellules,
                cellulesOccupees: celluleStats[0].cellulesOccupees,
                tauxOccupation: celluleStats[0].tauxOccupation
            };

        } catch (error) {
            throw error;
        } finally {
            connection.release();
        }
    }

    static async getStatistiquesDetaillees() {
        const connection = await db.getConnection();
        try {
            // Statistiques générales
            const [generalStats] = await connection.execute(`
                SELECT 
                    COUNT(*) as total_detenus,
                    COUNT(CASE WHEN statut = 'En détention' THEN 1 END) as en_detention,
                    COUNT(CASE WHEN statut = 'Libéré' THEN 1 END) as liberes,
                    COUNT(CASE WHEN statut = 'En transfert' THEN 1 END) as transferes
                FROM detenus
            `);

            // Occupation des cellules
            const [celluleStats] = await connection.execute(`
                SELECT 
                    c.id_cellule,
                    c.nom_cellule,
                    c.capacite,
                    c.nombre_occupe,
                    ROUND((c.nombre_occupe / c.capacite) * 100, 2) as taux_occupation
                FROM cellules c
                ORDER BY c.id_cellule
            `);

            // Historique des actions (mouvements)
            const [historique] = await connection.execute(`
                SELECT 
                    m.date_mouvement as date,
                    m.type_mouvement as type,
                    CONCAT(d.nom, ' ', d.prenom) as detenu,
                    CASE 
                        WHEN m.type_mouvement = 'Transfert' 
                        THEN CONCAT('De cellule ', m.cellule_depart, ' vers cellule ', m.cellule_arrivee)
                        ELSE m.motif
                    END as details
                FROM mouvements_detenus m
                JOIN detenus d ON m.id_detenu = d.id_detenu
                ORDER BY m.date_mouvement DESC
                LIMIT 10
            `);

            // Formater les données pour le graphique d'occupation
            const occupation_cellules = celluleStats.map(cellule => ({
                cellule: cellule.nom_cellule,
                taux: cellule.taux_occupation,
                occupe: cellule.nombre_occupe,
                capacite: cellule.capacite
            }));

            return {
                total_detenus: generalStats[0].total_detenus,
                en_detention: generalStats[0].en_detention,
                liberes: generalStats[0].liberes,
                transferes: generalStats[0].transferes,
                occupation_cellules,
                historique: historique.map(h => ({
                    date: new Date(h.date).toLocaleDateString('fr-FR'),
                    type: h.type,
                    detenu: h.detenu,
                    details: h.details
                }))
            };

        } catch (error) {
            throw error;
        } finally {
            connection.release();
        }
    }

    static async findAll(filters = {}) {
        let query = `
            SELECT 
                d.*,
                p.type_peine,
                p.date_fin as fin_peine,
                c.capacite as capacite_cellule,
                c.nombre_occupe as occupation_cellule
            FROM detenus d
            LEFT JOIN peines p ON d.id_detenu = p.id_detenu
            LEFT JOIN cellules c ON d.celluleId = c.id_cellule
            WHERE 1=1
        `;
        const params = [];

        // Appliquer les filtres
        if (filters.statut) {
            query += ' AND d.statut_detenu = ?';
            params.push(filters.statut);
        }

        if (filters.cellule) {
            query += ' AND d.celluleId = ?';
            params.push(filters.cellule);
        }

        if (filters.search) {
            query += ' AND (d.nom LIKE ? OR d.prenom LIKE ?)';
            const searchTerm = `%${filters.search}%`;
            params.push(searchTerm, searchTerm);
        }

        query += ' ORDER BY d.date_admission DESC';

        const [detenus] = await db.execute(query, params);
        return detenus;
    }

    static async findById(id_detenu) {
        const [detenus] = await db.execute(`
            SELECT 
                d.*,
                p.id_peine,
                p.type_peine as peine_type,
                p.duree_peine,
                p.date_debut as debut_peine,
                p.date_fin as fin_peine,
                p.observations as observations_peine,
                c.capacite as capacite_cellule,
                c.nombre_occupe as occupation_cellule
            FROM detenus d
            LEFT JOIN peines p ON d.id_detenu = p.id_detenu
            LEFT JOIN cellules c ON d.celluleId = c.id_cellule
            WHERE d.id_detenu = ?
        `, [id_detenu]);

        if (detenus.length === 0) {
            throw new Error('DETENU_NOT_FOUND');
        }

        return detenus[0];
    }

    static async update(id_detenu, detenuData) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            // Récupérer les données actuelles du détenu
            const [currentDetenu] = await connection.execute(
                'SELECT * FROM detenus WHERE id_detenu = ?',
                [id_detenu]
            );

            if (currentDetenu.length === 0) {
                throw new Error('DETENU_NOT_FOUND');
            }

            // Fusionner les données actuelles avec les nouvelles données
            const updatedData = {
                ...currentDetenu[0],
                ...detenuData
            };

            const {
                nom,
                prenom,
                date_naissance,
                sexe,
                date_admission,
                celluleId,
                id_enquete,
                date_fin_peine,
                statut,
                type_peine,
                numero_dossier
            } = updatedData;

            // Vérifier si la cellule existe et a de la place
            if (celluleId) {
                const [celluleInfo] = await connection.execute(
                    'SELECT capacite, nombre_occupe FROM cellules WHERE id_cellule = ?',
                    [celluleId]
                );

                if (celluleInfo.length === 0) {
                    throw new Error('CELLULE_NOT_FOUND');
                }

                if (celluleInfo[0].nombre_occupe >= celluleInfo[0].capacite) {
                    throw new Error('CELLULE_FULL');
                }
            }

            // Mettre à jour le détenu avec des valeurs par défaut pour éviter undefined
            const [result] = await connection.execute(`
                UPDATE detenus
                SET 
                    nom = ?, 
                    prenom = ?, 
                    date_naissance = ?, 
                    sexe = ?, 
                    date_admission = ?, 
                    celluleId = ?, 
                    id_enquete = ?,
                    date_fin_peine = ?,
                    statut = ?,
                    type_peine = ?,
                    numero_dossier = ?
                WHERE id_detenu = ?
            `, [
                nom || currentDetenu[0].nom,
                prenom || currentDetenu[0].prenom,
                date_naissance || currentDetenu[0].date_naissance,
                sexe || currentDetenu[0].sexe,
                date_admission || currentDetenu[0].date_admission,
                celluleId || currentDetenu[0].celluleId,
                id_enquete || null,
                date_fin_peine || null,
                statut || 'En détention',
                type_peine || null,
                numero_dossier || currentDetenu[0].numero_dossier,
                id_detenu
            ]);

            // Si changement de cellule, créer un mouvement
            if (celluleId && celluleId !== currentDetenu[0].celluleId) {
                await connection.execute(`
                    INSERT INTO mouvements_detenus (
                        id_detenu, type_mouvement, 
                        cellule_depart, cellule_arrivee,
                        date_mouvement, motif
                    ) VALUES (?, 'Transfert', ?, ?, NOW(), 'Transfert de cellule')
                `, [id_detenu, currentDetenu[0].celluleId, celluleId]);

                // Mettre à jour l'occupation des cellules
                await connection.execute(`
                    UPDATE cellules 
                    SET nombre_occupe = nombre_occupe - 1
                    WHERE id_cellule = ?
                `, [currentDetenu[0].celluleId]);

                await connection.execute(`
                    UPDATE cellules 
                    SET nombre_occupe = nombre_occupe + 1
                    WHERE id_cellule = ?
                `, [celluleId]);
            }

            await connection.commit();
            return result.affectedRows > 0;

        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    static async delete(id_detenu) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            // 1. Récupérer les informations du détenu et de sa cellule
            const [detenu] = await connection.execute(
                'SELECT celluleId FROM detenus WHERE id_detenu = ?',
                [id_detenu]
            );

            if (detenu.length === 0) {
                throw new Error('DETENU_NOT_FOUND');
            }

            const celluleId = detenu[0].celluleId;

            // 2. Supprimer d'abord les mouvements associés
            await connection.execute(
                'DELETE FROM mouvements_detenus WHERE id_detenu = ?',
                [id_detenu]
            );

            // 3. Supprimer les peines associées (si ce n'est pas déjà géré par ON DELETE CASCADE)
            await connection.execute(
                'DELETE FROM peines WHERE id_detenu = ?',
                [id_detenu]
            );

            // 4. Mettre à jour le nombre d'occupants de la cellule
            await connection.execute(
                'UPDATE cellules SET nombre_occupe = nombre_occupe - 1 WHERE id_cellule = ?',
                [celluleId]
            );

            // 5. Supprimer le détenu
            const [result] = await connection.execute(
                'DELETE FROM detenus WHERE id_detenu = ?',
                [id_detenu]
            );

            await connection.commit();
            return result.affectedRows > 0;

        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    // Autres méthodes utiles...
}

module.exports = Detenu; 