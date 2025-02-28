const db = require('../config/database');
const DocumentPreuve = require('./DocumentPreuve');

class Preuve {
    static async create(preuveData) {
        const {
            id_enquete,
            type_preuve,
            description,
            date_recolte,
            lieu_recolte,
            id_enqueteur,
            statut_preuve,
            fichier_preuve,
            observations
        } = preuveData;

        const [result] = await db.execute(`
            INSERT INTO preuves
            (id_enquete, type_preuve, description, date_recolte, lieu_recolte,
             id_enqueteur, statut_preuve, fichier_preuve, observations)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            id_enquete,
            type_preuve,
            description,
            date_recolte,
            lieu_recolte,
            id_enqueteur,
            statut_preuve || 'Récoltée',
            fichier_preuve || null,
            observations || null
        ]);

        return result.insertId;
    }

    static async findById(id_preuve) {
        const [rows] = await db.execute(`
            SELECT
                p.*,
                e.titre_enquete AS enquete_titre,
                u.nom AS enqueteur_nom,
                u.prenom AS enqueteur_prenom
            FROM preuves p
            LEFT JOIN enquetes e ON p.id_enquete = e.id_enquete
            LEFT JOIN utilisateurs u ON p.id_enqueteur = u.id_utilisateur
            WHERE p.id_preuve = ?
        `, [id_preuve]);

        if (rows.length === 0) {
            return null;
        }

        // Récupérer les documents associés
        const documents = await DocumentPreuve.findByPreuve(id_preuve);

        // Formater la réponse
        return {
            id: rows[0].id_preuve,
            enquete: {
                id: rows[0].id_enquete,
                titre: rows[0].enquete_titre
            },
            type_preuve: rows[0].type_preuve,
            description: rows[0].description,
            date_recolte: rows[0].date_recolte,
            lieu_recolte: rows[0].lieu_recolte,
            enqueteur: {
                id: rows[0].id_enqueteur,
                nom: rows[0].enqueteur_nom,
                prenom: rows[0].enqueteur_prenom
            },
            statut: rows[0].statut_preuve,
            observations: rows[0].observations,
            documents: documents.map(doc => ({
                id: doc.id_document,
                nom: doc.nom_fichier,
                type: doc.type_document,
                chemin: doc.chemin_fichier,
                taille: doc.taille_fichier,
                date_upload: doc.date_upload
            })),
            created_at: rows[0].created_at,
            updated_at: rows[0].updated_at
        };
    }

    static async findAll() {
        const [rows] = await db.execute(`
            SELECT
                p.*,
                e.titre_enquete AS enquete_titre,
                u.nom AS enqueteur_nom,
                u.prenom AS enqueteur_prenom
            FROM preuves p
            LEFT JOIN enquetes e ON p.id_enquete = e.id_enquete
            LEFT JOIN utilisateurs u ON p.id_enqueteur = u.id_utilisateur
            ORDER BY p.date_recolte DESC
        `);

        // Récupérer les documents pour chaque preuve
        const preuves = await Promise.all(rows.map(async (row) => {
            const documents = await DocumentPreuve.findByPreuve(row.id_preuve);
            return {
                id: row.id_preuve,
                enquete: {
                    id: row.id_enquete,
                    titre: row.enquete_titre
                },
                type_preuve: row.type_preuve,
                description: row.description,
                date_recolte: row.date_recolte,
                lieu_recolte: row.lieu_recolte,
                enqueteur: {
                    id: row.id_enqueteur,
                    nom: row.enqueteur_nom,
                    prenom: row.enqueteur_prenom
                },
                statut: row.statut_preuve,
                observations: row.observations,
                documents: documents.map(doc => ({
                    id: doc.id_document,
                    nom: doc.nom_fichier,
                    type: doc.type_document,
                    chemin: doc.chemin_fichier,
                    taille: doc.taille_fichier,
                    date_upload: doc.date_upload
                })),
                created_at: row.created_at,
                updated_at: row.updated_at
            };
        }));

        return preuves;
    }

    static async update(id_preuve, updateData) {
        const allowedFields = [
            'id_enquete',
            'type_preuve',
            'description',
            'date_recolte',
            'lieu_recolte',
            'id_enqueteur',
            'statut_preuve',
            'fichier_preuve',
            'observations'
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

        values.push(id_preuve);

        const [result] = await db.execute(`
            UPDATE preuves
            SET ${updates.join(', ')}
            WHERE id_preuve = ?
        `, values);

        return result.affectedRows > 0;
    }

    static async delete(id_preuve) {
        const [result] = await db.execute(`
            DELETE FROM preuves
            WHERE id_preuve = ?
        `, [id_preuve]);

        return result.affectedRows > 0;
    }
}

module.exports = Preuve; 