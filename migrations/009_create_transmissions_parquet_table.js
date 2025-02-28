const db = require('../config/database');

async function up() {
    try {
        await db.execute(`
            CREATE TABLE IF NOT EXISTS transmissions_parquet (
                id_transmission INT AUTO_INCREMENT PRIMARY KEY,
                id_enquete INT NOT NULL,
                date_transmission DATETIME NOT NULL,
                id_parquet INT NOT NULL,
                etat_dossier ENUM('Complet', 'Partiel') NOT NULL,
                rapport_final TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (id_enquete) REFERENCES enquetes(id_enquete) ON DELETE CASCADE,
                FOREIGN KEY (id_parquet) REFERENCES utilisateurs(id_utilisateur)
            )
        `);
        console.log('Table transmissions_parquet créée avec succès');
    } catch (error) {
        console.error('Erreur lors de la création de la table transmissions_parquet:', error);
        throw error;
    }
}

async function down() {
    try {
        await db.execute('DROP TABLE IF EXISTS transmissions_parquet');
        console.log('Table transmissions_parquet supprimée avec succès');
    } catch (error) {
        console.error('Erreur lors de la suppression de la table:', error);
        throw error;
    }
}

module.exports = { up, down }; 