const db = require('../config/database');

async function up() {
    try {
        await db.execute(`
            CREATE TABLE IF NOT EXISTS documents_plainte (
                id_document INT AUTO_INCREMENT PRIMARY KEY,
                id_plainte INT NOT NULL,
                nom_fichier VARCHAR(255) NOT NULL,
                chemin_fichier TEXT NOT NULL,
                type_document VARCHAR(50) NOT NULL,
                taille_fichier INT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (id_plainte) REFERENCES plaintes(id_plainte) ON DELETE CASCADE
            )
        `);
        console.log('Table documents_plainte créée avec succès');
    } catch (error) {
        console.error('Erreur lors de la création de la table documents_plainte:', error);
        throw error;
    }
}

async function down() {
    try {
        await db.execute('DROP TABLE IF EXISTS documents_plainte');
        console.log('Table documents_plainte supprimée avec succès');
    } catch (error) {
        console.error('Erreur lors de la suppression de la table:', error);
        throw error;
    }
}

module.exports = { up, down }; 