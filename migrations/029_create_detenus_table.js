const db = require('../config/database');

async function up() {
    try {
        await db.execute(`
            CREATE TABLE IF NOT EXISTS detenus (
                id_detenu INT AUTO_INCREMENT PRIMARY KEY,
                nom VARCHAR(100) NOT NULL,
                prenom VARCHAR(100) NOT NULL,
                date_naissance DATE NOT NULL,
                sexe ENUM('Homme', 'Femme') NOT NULL,
                date_admission DATE NOT NULL,
                date_liberation DATE DEFAULT NULL,
                statut_detenu ENUM('En détention', 'Libéré', 'Transféré') DEFAULT 'En détention',
                cellule VARCHAR(10),
                id_enquete INT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (id_enquete) REFERENCES enquetes(id_enquete) ON DELETE SET NULL
            )
        `);
        console.log('Table detenus créée avec succès');
    } catch (error) {
        console.error('Erreur lors de la création de la table detenus:', error);
        throw error;
    }
}

async function down() {
    try {
        await db.execute('DROP TABLE IF EXISTS detenus');
        console.log('Table detenus supprimée avec succès');
    } catch (error) {
        console.error('Erreur lors de la suppression de la table detenus:', error);
        throw error;
    }
}

module.exports = { up, down }; 