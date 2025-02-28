const db = require('../config/database');

class Convocation {
    static async create(convocationData) {
        const {
            id_enquete,
            id_interrogatoire,
            nom_personne,
            type_personne,
            contact_telephone,
            contact_email,
            contact_adresse,
            date_convocation,
            lieu,
            motif,
            reference_legale,
            mode_envoi,
            observations,
            created_by
        } = convocationData;

        const [result] = await db.execute(`
            INSERT INTO convocations (
                id_enquete,
                id_interrogatoire,
                nom_personne,
                type_personne,
                contact_telephone,
                contact_email,
                contact_adresse,
                date_convocation,
                lieu,
                motif,
                reference_legale,
                mode_envoi,
                observations,
                created_by
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            id_enquete,
            id_interrogatoire || null,
            nom_personne,
            type_personne,
            contact_telephone,
            contact_email,
            contact_adresse,
            date_convocation,
            lieu,
            motif,
            reference_legale,
            mode_envoi,
            observations,
            created_by
        ]);

        return result.insertId;
    }

    static async findByEnquete(id_enquete) {
        const [convocations] = await db.execute(`
            SELECT 
                c.*,
                i.date_interrogatoire,
                i.objet_interrogatoire,
                u.nom AS created_by_nom,
                u.prenom AS created_by_prenom,
                (
                    SELECT COUNT(*) 
                    FROM relances_convocation 
                    WHERE id_convocation = c.id_convocation
                ) as nombre_relances
            FROM convocations c
            LEFT JOIN interrogatoires i ON c.id_interrogatoire = i.id_interrogatoire
            LEFT JOIN utilisateurs u ON c.created_by = u.id_utilisateur
            WHERE c.id_enquete = ?
            ORDER BY c.date_convocation DESC
        `, [id_enquete]);

        return convocations;
    }

    static async updateStatus(id_convocation, newStatus, date = null) {
        const statusDate = {
            'Reçue': 'date_reception',
            'Confirmée': 'date_confirmation'
        };

        let query = 'UPDATE convocations SET statut = ?';
        const params = [newStatus];

        if (statusDate[newStatus]) {
            query += `, ${statusDate[newStatus]} = ?`;
            params.push(date || new Date());
        }

        query += ' WHERE id_convocation = ?';
        params.push(id_convocation);

        const [result] = await db.execute(query, params);
        return result.affectedRows > 0;
    }

    static async addRelance(relanceData) {
        const {
            id_convocation,
            type_relance,
            observations
        } = relanceData;

        const [result] = await db.execute(`
            INSERT INTO relances_convocation (
                id_convocation,
                date_relance,
                type_relance,
                statut,
                observations
            ) VALUES (?, NOW(), ?, 'Envoyée', ?)
        `, [
            id_convocation,
            type_relance,
            observations
        ]);

        return result.insertId;
    }

    static async getRelances(id_convocation) {
        const [relances] = await db.execute(`
            SELECT *
            FROM relances_convocation
            WHERE id_convocation = ?
            ORDER BY date_relance DESC
        `, [id_convocation]);

        return relances;
    }
}

module.exports = Convocation; 