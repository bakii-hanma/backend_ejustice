const db = require('../config/database');

async function up() {
    try {
        await db.execute(`
            CREATE TABLE IF NOT EXISTS documents_preuve (
                id_document INT AUTO_INCREMENT PRIMARY KEY,
                id_preuve INT NOT NULL,
                nom_fichier VARCHAR(255) NOT NULL,
                chemin_fichier TEXT NOT NULL,
                type_document VARCHAR(50) NOT NULL,
                taille_fichier INT NOT NULL,
                date_upload TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (id_preuve) REFERENCES preuves(id_preuve) ON DELETE CASCADE
            )
        `);
        console.log('Table documents_preuve créée avec succès');
    } catch (error) {
        console.error('Erreur lors de la création de la table documents_preuve:', error);
        throw error;
    }
}

async function down() {
    try {
        await db.execute('DROP TABLE IF EXISTS documents_preuve');
        console.log('Table documents_preuve supprimée avec succès');
    } catch (error) {
        console.error('Erreur lors de la suppression de la table:', error);
        throw error;
    }
}

module.exports = { up, down }; 