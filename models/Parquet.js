const db = require('../config/database');

class Parquet {
    static async create(parquetData) {
        const {
            nom_parquet,
            adresse,
            contact,
            email
        } = parquetData;

        const [result] = await db.execute(`
            INSERT INTO parquet (nom_parquet, adresse, contact, email)
            VALUES (?, ?, ?, ?)
        `, [nom_parquet, adresse, contact, email]);

        return result.insertId;
    }

    static async findById(id_parquet) {
        const [rows] = await db.execute(
            'SELECT * FROM parquet WHERE id_parquet = ?',
            [id_parquet]
        );
        return rows[0] || null;
    }

    static async findAll() {
        const [rows] = await db.execute('SELECT * FROM parquet');
        return rows;
    }

    static async update(id_parquet, updateData) {
        const allowedFields = ['nom_parquet', 'adresse', 'contact', 'email'];
        const updates = [];
        const values = [];

        for (const [key, value] of Object.entries(updateData)) {
            if (allowedFields.includes(key)) {
                updates.push(`${key} = ?`);
                values.push(value);
            }
        }

        if (updates.length === 0) return false;

        values.push(id_parquet);

        const [result] = await db.execute(`
            UPDATE parquet
            SET ${updates.join(', ')}
            WHERE id_parquet = ?
        `, values);

        return result.affectedRows > 0;
    }

    static async delete(id_parquet) {
        const [result] = await db.execute(
            'DELETE FROM parquet WHERE id_parquet = ?',
            [id_parquet]
        );
        return result.affectedRows > 0;
    }
}

module.exports = Parquet; 