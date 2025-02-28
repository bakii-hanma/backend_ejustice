const db = require('../config/database');

async function up() {
    try {
        await db.execute(`
            CREATE TABLE IF NOT EXISTS peines (
                id_peine INT AUTO_INCREMENT PRIMARY KEY,
                id_detenu INT NOT NULL,
                type_peine ENUM('Détention simple', 'Travaux forcés', 'Liberté conditionnelle') NOT NULL,
                duree_peine VARCHAR(50),
                date_debut DATE NOT NULL,
                date_fin DATE NOT NULL,
                observations TEXT DEFAULT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (id_detenu) REFERENCES detenus(id_detenu) ON DELETE CASCADE
            )
        `);
        console.log('Table peines créée avec succès');
    } catch (error) {
        console.error('Erreur lors de la création de la table peines:', error);
        throw error;
    }
}

async function down() {
    try {
        await db.execute('DROP TABLE IF EXISTS peines');
        console.log('Table peines supprimée avec succès');
    } catch (error) {
        console.error('Erreur lors de la suppression de la table peines:', error);
        throw error;
    }
}

module.exports = { up, down }; 