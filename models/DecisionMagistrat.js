const db = require('../config/database');

class DecisionMagistrat {
    static async create(decisionData) {
        const {
            id_enquete,
            id_magistrat,
            type_decision,
            motif,
            instructions,
            date_audience,
            observations
        } = decisionData;

        const [result] = await db.execute(`
            INSERT INTO decisions_magistrat (
                id_enquete,
                id_magistrat,
                type_decision,
                date_decision,
                motif,
                instructions,
                date_audience,
                observations
            ) VALUES (?, ?, ?, NOW(), ?, ?, ?, ?)
        `, [
            id_enquete,
            id_magistrat,
            type_decision,
            motif,
            instructions,
            date_audience,
            observations
        ]);

        return result.insertId;
    }

    static async findById(id_decision) {
        const [rows] = await db.execute(`
            SELECT 
                d.*,
                e.titre_enquete,
                e.code_enquete,
                u.nom AS magistrat_nom,
                u.prenom AS magistrat_prenom
            FROM decisions_magistrat d
            LEFT JOIN enquetes e ON d.id_enquete = e.id_enquete
            LEFT JOIN utilisateurs u ON d.id_magistrat = u.id_utilisateur
            WHERE d.id_decision = ?
        `, [id_decision]);

        return rows[0] || null;
    }

    static async findByEnquete(id_enquete) {
        const [rows] = await db.execute(`
            SELECT 
                d.*,
                u.nom AS magistrat_nom,
                u.prenom AS magistrat_prenom
            FROM decisions_magistrat d
            LEFT JOIN utilisateurs u ON d.id_magistrat = u.id_utilisateur
            WHERE d.id_enquete = ?
            ORDER BY d.date_decision DESC
        `, [id_enquete]);

        return rows;
    }

    static async findByMagistrat(id_magistrat) {
        const [rows] = await db.execute(`
            SELECT 
                d.*,
                e.titre_enquete,
                e.code_enquete
            FROM decisions_magistrat d
            LEFT JOIN enquetes e ON d.id_enquete = e.id_enquete
            WHERE d.id_magistrat = ?
            ORDER BY d.date_decision DESC
        `, [id_magistrat]);

        return rows;
    }

    static async update(id_decision, updateData) {
        const allowedFields = [
            'type_decision',
            'motif',
            'instructions',
            'date_audience',
            'statut_decision',
            'observations'
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

        values.push(id_decision);

        const [result] = await db.execute(`
            UPDATE decisions_magistrat
            SET ${updates.join(', ')}
            WHERE id_decision = ?
        `, values);

        return result.affectedRows > 0;
    }

    static async delete(id_decision) {
        const [result] = await db.execute(
            'DELETE FROM decisions_magistrat WHERE id_decision = ?',
            [id_decision]
        );
        return result.affectedRows > 0;
    }
}

module.exports = DecisionMagistrat; 