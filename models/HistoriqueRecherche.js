const db = require('../config/database');

class HistoriqueRecherche {
    static async create(historiqueData) {
        const {
            id_utilisateur,
            type_recherche,
            criteres,
            resultats_count
        } = historiqueData;

        const [result] = await db.execute(`
            INSERT INTO historique_recherches 
            (id_utilisateur, type_recherche, criteres, resultats_count)
            VALUES (?, ?, ?, ?)
        `, [
            id_utilisateur,
            type_recherche,
            JSON.stringify(criteres),
            resultats_count
        ]);

        return result.insertId;
    }

    static async findByUser(id_utilisateur, limit = 10) {
        const [rows] = await db.execute(`
            SELECT * 
            FROM historique_recherches 
            WHERE id_utilisateur = ?
            ORDER BY date_recherche DESC
            LIMIT ?
        `, [id_utilisateur, limit]);

        return rows.map(row => ({
            ...row,
            criteres: JSON.parse(row.criteres)
        }));
    }
}

module.exports = HistoriqueRecherche; 