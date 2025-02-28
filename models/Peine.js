const db = require('../config/database');

class Peine {
    static async create(peineData) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            const {
                id_detenu,
                type_peine,
                duree_peine,
                date_debut,
                date_fin,
                observations
            } = peineData;

            // Vérifier si le détenu existe
            const [detenu] = await connection.execute(
                'SELECT id_detenu FROM detenus WHERE id_detenu = ?',
                [id_detenu]
            );

            if (detenu.length === 0) {
                throw new Error('DETENU_NOT_FOUND');
            }

            // Créer la peine
            const [result] = await connection.execute(`
                INSERT INTO peines (
                    id_detenu,
                    type_peine,
                    duree_peine,
                    date_debut,
                    date_fin,
                    observations
                ) VALUES (?, ?, ?, ?, ?, ?)
            `, [
                id_detenu,
                type_peine,
                duree_peine,
                date_debut,
                date_fin,
                observations
            ]);

            // Mettre à jour le type de peine du détenu
            await connection.execute(
                'UPDATE detenus SET type_peine = ? WHERE id_detenu = ?',
                [type_peine, id_detenu]
            );

            await connection.commit();
            return result.insertId;

        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    static async update(id_peine, peineData) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            // Vérifier si la peine existe
            const [peine] = await connection.execute(
                'SELECT id_detenu FROM peines WHERE id_peine = ?',
                [id_peine]
            );

            if (peine.length === 0) {
                throw new Error('PEINE_NOT_FOUND');
            }

            const {
                type_peine,
                duree_peine,
                date_debut,
                date_fin,
                observations
            } = peineData;

            // Mettre à jour la peine
            const [result] = await connection.execute(`
                UPDATE peines
                SET 
                    type_peine = ?,
                    duree_peine = ?,
                    date_debut = ?,
                    date_fin = ?,
                    observations = ?
                WHERE id_peine = ?
            `, [
                type_peine,
                duree_peine,
                date_debut,
                date_fin,
                observations,
                id_peine
            ]);

            // Mettre à jour le type de peine du détenu
            if (type_peine) {
                await connection.execute(
                    'UPDATE detenus SET type_peine = ? WHERE id_detenu = ?',
                    [type_peine, peine[0].id_detenu]
                );
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

    static async delete(id_peine) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            // Vérifier si la peine existe
            const [peine] = await connection.execute(
                'SELECT id_detenu FROM peines WHERE id_peine = ?',
                [id_peine]
            );

            if (peine.length === 0) {
                throw new Error('PEINE_NOT_FOUND');
            }

            // Supprimer la peine
            const [result] = await connection.execute(
                'DELETE FROM peines WHERE id_peine = ?',
                [id_peine]
            );

            // Mettre à jour le détenu si c'était sa seule peine
            const [autresPeines] = await connection.execute(
                'SELECT COUNT(*) as count FROM peines WHERE id_detenu = ?',
                [peine[0].id_detenu]
            );

            if (autresPeines[0].count === 0) {
                await connection.execute(
                    'UPDATE detenus SET type_peine = NULL WHERE id_detenu = ?',
                    [peine[0].id_detenu]
                );
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

    static async findById(id_peine) {
        try {
            const [peines] = await db.execute(`
                SELECT 
                    p.*,
                    d.nom as nom_detenu,
                    d.prenom as prenom_detenu
                FROM peines p
                LEFT JOIN detenus d ON p.id_detenu = d.id_detenu
                WHERE p.id_peine = ?
            `, [id_peine]);

            if (peines.length === 0) {
                throw new Error('PEINE_NOT_FOUND');
            }

            return peines[0];
        } catch (error) {
            throw error;
        }
    }

    static async findAll() {
        try {
            const [peines] = await db.execute(`
                SELECT 
                    p.*,
                    d.nom as nom_detenu,
                    d.prenom as prenom_detenu
                FROM peines p
                LEFT JOIN detenus d ON p.id_detenu = d.id_detenu
                ORDER BY p.date_debut DESC
            `);
            
            return peines;
        } catch (error) {
            throw error;
        }
    }

    static async findByDetenu(id_detenu) {
        try {
            const [peines] = await db.execute(`
                SELECT *
                FROM peines
                WHERE id_detenu = ?
                ORDER BY date_debut DESC
            `, [id_detenu]);
            
            return peines;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Peine; 