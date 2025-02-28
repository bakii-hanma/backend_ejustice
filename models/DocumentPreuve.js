const db = require('../config/database');

class DocumentPreuve {
    static async create(documentData) {
        const {
            id_preuve,
            nom_fichier,
            chemin_fichier,
            type_document,
            taille_fichier
        } = documentData;

        const [result] = await db.execute(
            `INSERT INTO documents_preuve 
            (id_preuve, nom_fichier, chemin_fichier, type_document, taille_fichier) 
            VALUES (?, ?, ?, ?, ?)`,
            [id_preuve, nom_fichier, chemin_fichier, type_document, taille_fichier]
        );

        return result.insertId;
    }

    static async findByPreuve(id_preuve) {
        const [documents] = await db.execute(
            'SELECT * FROM documents_preuve WHERE id_preuve = ?',
            [id_preuve]
        );
        return documents;
    }

    static async delete(id_document) {
        const [result] = await db.execute(
            'DELETE FROM documents_preuve WHERE id_document = ?',
            [id_document]
        );
        return result.affectedRows > 0;
    }
}

module.exports = DocumentPreuve; 