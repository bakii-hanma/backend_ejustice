const db = require('../config/database');

class Cellule {
    static async create(celluleData) {
        const {
            nom_cellule,
            capacite,
            statut_cellule
        } = celluleData;

        const [result] = await db.execute(`
            INSERT INTO cellules (nom_cellule, capacite, statut_cellule)
            VALUES (?, ?, ?)
        `, [nom_cellule, capacite, statut_cellule]);

        return result.insertId;
    }

    static async findAll() {
        try {
            const [cellules] = await db.execute(`
                SELECT 
                    id_cellule,
                    nom_cellule,
                    capacite,
                    nombre_occupe,
                    statut_cellule,
                    (SELECT COUNT(*) FROM detenus WHERE celluleId = id_cellule) as nombre_actuel
                FROM cellules
                ORDER BY nom_cellule
            `);
            return cellules;
        } catch (error) {
            throw error;
        }
    }

    static async findDisponibles() {
        const [cellules] = await db.execute(`
            SELECT *
            FROM cellules
            WHERE statut_cellule = 'Disponible'
            ORDER BY nom_cellule
        `);
        return cellules;
    }

    static async update(id_cellule, celluleData) {
        const {
            capacite,
            statut_cellule
        } = celluleData;

        const [result] = await db.execute(`
            UPDATE cellules
            SET 
                capacite = ?,
                statut_cellule = ?
            WHERE id_cellule = ?
        `, [capacite, statut_cellule, id_cellule]);

        return result.affectedRows > 0;
    }

    static async getOccupants(nom_cellule) {
        const [detenus] = await db.execute(`
            SELECT 
                d.id_detenu,
                d.nom,
                d.prenom,
                d.date_admission,
                p.type_peine,
                p.date_fin
            FROM detenus d
            LEFT JOIN peines p ON d.id_detenu = p.id_detenu
            WHERE d.cellule = ?
            AND d.statut_detenu = 'En détention'
        `, [nom_cellule]);

        return detenus;
    }

    static async delete(id_cellule) {
        // Vérifier si la cellule est vide
        const [occupants] = await db.execute(
            'SELECT COUNT(*) as count FROM detenus WHERE cellule = (SELECT nom_cellule FROM cellules WHERE id_cellule = ?)',
            [id_cellule]
        );

        if (occupants[0].count > 0) {
            throw new Error('CELLULE_NOT_EMPTY');
        }

        const [result] = await db.execute(
            'DELETE FROM cellules WHERE id_cellule = ?',
            [id_cellule]
        );

        return result.affectedRows > 0;
    }

    static async findById(id_cellule) {
        const [cellules] = await db.execute(`
            SELECT 
                c.*,
                (SELECT COUNT(*) FROM detenus WHERE cellule = c.nom_cellule) as nombre_actuel
            FROM cellules c
            WHERE c.id_cellule = ?
        `, [id_cellule]);

        if (cellules.length === 0) {
            throw new Error('CELLULE_NOT_FOUND');
        }

        return cellules[0];
    }
}

module.exports = Cellule; 