const db = require('../config/database');

class DocumentPlainte {
    static async create(documentData) {
        const {
            id_plainte,
            nom_fichier,
            chemin_fichier,
            type_document,
            taille_fichier
        } = documentData;

        const [result] = await db.execute(
            `INSERT INTO documents_plainte 
            (id_plainte, nom_fichier, chemin_fichier, type_document, taille_fichier) 
            VALUES (?, ?, ?, ?, ?)`,
            [id_plainte, nom_fichier, chemin_fichier, type_document, taille_fichier]
        );

        return result.insertId;
    }

    static async findByPlainte(id_preuve) {
        const [documents] = await db.execute(
            `SELECT 
                id_document,
                id_plainte,
                nom_fichier,
                chemin_fichier,
                type_document,
                taille_fichier,
                date_upload
            FROM documents_plainte 
            WHERE id_plainte = ?
            ORDER BY date_upload DESC`,
            [id_preuve]
        );
        return documents;
    }

    static async delete(id_document) {
        const [result] = await db.execute(
            'DELETE FROM documents_plainte WHERE id_document = ?',
            [id_document]
        );
        return result.affectedRows > 0;
    }
}

module.exports = DocumentPlainte; 