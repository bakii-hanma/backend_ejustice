const db = require('../config/database');

class TransmissionParquet {
    static async create(transmissionData) {
        const {
            id_enquete,
            date_transmission,
            id_parquet,
            etat_dossier,
            rapport_final
        } = transmissionData;

        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            // Créer la transmission
            const [result] = await connection.query(`
                INSERT INTO transmissions_parquet
                (id_enquete, date_transmission, id_parquet, etat_dossier, rapport_final)
                VALUES (?, ?, ?, ?, ?)
            `, [
                id_enquete,
                date_transmission,
                id_parquet,
                etat_dossier,
                rapport_final
            ]);

            // Mettre à jour le statut de l'enquête
            await connection.query(`
                UPDATE enquetes
                SET transferee_parquet = 'Oui'
                WHERE id_enquete = ?
            `, [id_enquete]);

            await connection.commit();
            return result.insertId;

        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    static async findById(id_transmission) {
        const [rows] = await db.execute(`
            SELECT 
                t.*,
                e.titre_enquete,
                e.code_enquete,
                u.nom AS parquet_nom,
                u.prenom AS parquet_prenom
            FROM transmissions_parquet t
            LEFT JOIN enquetes e ON t.id_enquete = e.id_enquete
            LEFT JOIN utilisateurs u ON t.id_parquet = u.id_utilisateur
            WHERE t.id_transmission = ?
        `, [id_transmission]);

        return rows[0] || null;
    }

    static async findAll() {
        const [rows] = await db.execute(`
            SELECT 
                t.*,
                e.titre_enquete,
                e.code_enquete,
                u.nom AS parquet_nom,
                u.prenom AS parquet_prenom
            FROM transmissions_parquet t
            LEFT JOIN enquetes e ON t.id_enquete = e.id_enquete
            LEFT JOIN utilisateurs u ON t.id_parquet = u.id_utilisateur
            ORDER BY t.date_transmission DESC
        `);

        return rows;
    }

    static async update(id_transmission, updateData) {
        const allowedFields = [
            'date_transmission',
            'id_parquet',
            'etat_dossier',
            'rapport_final'
        ];
        const updates = [];
        const values = [];

        for (const [key, value] of Object.entries(updateData)) {
            if (allowedFields.includes(key)) {
                updates.push(`${key} = ?`);
                values.push(value);
            }
        }

        if (updates.length === 0) return false;

        values.push(id_transmission);

        const [result] = await db.execute(`
            UPDATE transmissions_parquet
            SET ${updates.join(', ')}
            WHERE id_transmission = ?
        `, values);

        return result.affectedRows > 0;
    }

    static async delete(id_transmission) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            // Récupérer l'id_enquete avant la suppression
            const [transmission] = await connection.query(
                'SELECT id_enquete FROM transmissions_parquet WHERE id_transmission = ?',
                [id_transmission]
            );

            if (transmission.length === 0) {
                await connection.rollback();
                connection.release();
                return false;
            }

            const { id_enquete } = transmission[0];

            // Supprimer la transmission
            const [result] = await connection.query(
                'DELETE FROM transmissions_parquet WHERE id_transmission = ?',
                [id_transmission]
            );

            // Mettre à jour le statut de l'enquête
            await connection.query(`
                UPDATE enquetes
                SET transferee_parquet = 'Non'
                WHERE id_enquete = ?
            `, [id_enquete]);

            await connection.commit();
            return result.affectedRows > 0;

        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }
}

module.exports = TransmissionParquet; 