const db = require('../config/database');

class EnqueteurSecondaire {
    static async addEnqueteur(id_enquete, id_utilisateur) {
        const [result] = await db.execute(`
            INSERT INTO enqueteurs_secondaires (id_enquete, id_utilisateur)
            VALUES (?, ?)
        `, [id_enquete, id_utilisateur]);

        return result.insertId;
    }

    static async findByEnquete(id_enquete) {
        const [rows] = await db.execute(`
            SELECT
                es.id_enqueteur_secondaire,
                es.id_enquete,
                es.id_utilisateur,
                u.nom,
                u.prenom,
                u.email
            FROM enqueteurs_secondaires es
            JOIN utilisateurs u ON es.id_utilisateur = u.id_utilisateur
            WHERE es.id_enquete = ?
        `, [id_enquete]);

        return rows;
    }

    static async removeEnqueteur(id_enqueteur_secondaire) {
        const [result] = await db.execute(`
            DELETE FROM enqueteurs_secondaires
            WHERE id_enqueteur_secondaire = ?
        `, [id_enqueteur_secondaire]);

        return result.affectedRows > 0;
    }
}

module.exports = EnqueteurSecondaire; 