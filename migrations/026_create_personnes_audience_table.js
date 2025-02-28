const db = require('../config/database');

async function up() {
    try {
        await db.execute(`
            CREATE TABLE IF NOT EXISTS personnes_audience (
                id_personne_audience INT AUTO_INCREMENT PRIMARY KEY,
                id_audience INT NOT NULL,
                nom VARCHAR(100) NOT NULL,
                prenom VARCHAR(100) NOT NULL,
                telephone VARCHAR(20),
                email VARCHAR(100),
                role ENUM('Accusé', 'Témoin', 'Victime') NOT NULL,
                present BOOLEAN DEFAULT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (id_audience) REFERENCES audiences(id_audience) ON DELETE CASCADE
            )
        `);
        console.log('Table personnes_audience créée avec succès');
    } catch (error) {
        console.error('Erreur lors de la création de la table:', error);
        throw error;
    }
}

async function down() {
    try {
        await db.execute('DROP TABLE IF EXISTS personnes_audience');
        console.log('Table personnes_audience supprimée avec succès');
    } catch (error) {
        console.error('Erreur lors de la suppression de la table:', error);
        throw error;
    }
}

module.exports = { up, down }; 