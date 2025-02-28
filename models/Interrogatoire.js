const db = require('../config/database');

class Interrogatoire {
    /**
     * On suppose que la table interrogatoires possède une clé primaire auto-incrémentée nommée id_interrogatoire,
     * ainsi qu'une clé étrangère id_enquete faisant référence à la table enquetes.
     */

    static async create(data) {
        const {
            id_enquete,
            type_personne,
            nom_personne,
            identite_document,
            date_interrogatoire,
            lieu_interrogatoire,
            resume_interrogatoire,
            fichier_interrogatoire
        } = data;

        const [result] = await db.execute(`
            INSERT INTO interrogatoires (
                id_enquete,
                type_personne,
                nom_personne,
                numero_document_identite,
                date_interrogatoire,
                lieu_interrogatoire,
                objet_interrogatoire,
                statut_interrogatoire,
                documents_associes
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            id_enquete,
            type_personne,
            nom_personne,
            identite_document,
            date_interrogatoire,
            lieu_interrogatoire,
            resume_interrogatoire,
            'En cours',
            fichier_interrogatoire || null
        ]);

        return {
            id_interrogatoire: result.insertId,
            ...data,
            statut_interrogatoire: 'En cours'
        };
    }

    static async findById(id_interrogatoire) {
        const [rows] = await db.execute(`
            SELECT
                i.id_interrogatoire,
                i.id_enquete,
                i.type_personne,
                i.nom_personne,
                i.numero_document_identite,
                i.contact_personne,
                i.date_interrogatoire,
                i.lieu_interrogatoire,
                i.objet_interrogatoire,
                i.statut_interrogatoire,
                e.titre_enquete AS enquete_titre
            FROM interrogatoires i
            LEFT JOIN enquetes e ON i.id_enquete = e.id_enquete
            WHERE i.id_interrogatoire = ?
        `, [id_interrogatoire]);

        return rows.length ? rows[0] : null;
    }

    static async findAll() {
        const [rows] = await db.execute(`
            SELECT
                i.id_interrogatoire,
                i.id_enquete,
                i.type_personne,
                i.nom_personne,
                i.numero_document_identite,
                i.contact_personne,
                i.date_interrogatoire,
                i.lieu_interrogatoire,
                i.objet_interrogatoire,
                i.statut_interrogatoire,
                i.notes_preparatoires,
                i.documents_associes,
                i.observations_post_interrogatoire,
                e.titre_enquete AS enquete_titre
            FROM interrogatoires i
            LEFT JOIN enquetes e ON i.id_enquete = e.id_enquete
            ORDER BY i.date_interrogatoire DESC
        `);

        return rows;
    }

    static async update(id_interrogatoire, updateData) {
        const allowedFields = [
            'id_enquete',
            'type_personne',
            'nom_personne',
            'numero_document_identite',
            'contact_personne',
            'date_interrogatoire',
            'lieu_interrogatoire',
            'objet_interrogatoire',
            'statut_interrogatoire',
            'notes_preparatoires',
            'documents_associes',
            'observations_post_interrogatoire'
        ];
        const updates = [];
        const values = [];

        for (const key of Object.keys(updateData)) {
            if (allowedFields.includes(key)) {
                updates.push(`${key} = ?`);
                values.push(updateData[key]);
            }
        }

        if (updates.length === 0) {
            return false;
        }

        values.push(id_interrogatoire);

        const [result] = await db.execute(`
            UPDATE interrogatoires
            SET ${updates.join(', ')}
            WHERE id_interrogatoire = ?
        `, values);

        return result.affectedRows > 0;
    }

    static async delete(id_interrogatoire) {
        const [result] = await db.execute(`
            DELETE FROM interrogatoires
            WHERE id_interrogatoire = ?
        `, [id_interrogatoire]);

        return result.affectedRows > 0;
    }
}

module.exports = Interrogatoire; 