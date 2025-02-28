const db = require('../config/database');

async function up() {
    try {
        await db.execute(`
            CREATE TABLE IF NOT EXISTS audiences (
                id_audience INT AUTO_INCREMENT PRIMARY KEY,
                id_enquete INT NOT NULL,
                date_audience DATETIME NOT NULL,
                lieu_audience VARCHAR(255) NOT NULL,
                type_audience ENUM('Instruction', 'Jugement', 'Appel') NOT NULL,
                statut_audience ENUM('Planifiée', 'En cours', 'Terminée', 'Reportée') DEFAULT 'Planifiée',
                notes_audience TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (id_enquete) REFERENCES enquetes(id_enquete) ON DELETE CASCADE
            )
        `);

        await db.execute(`
            CREATE TABLE IF NOT EXISTS convocations_audience (
                id_convocation INT AUTO_INCREMENT PRIMARY KEY,
                id_audience INT NOT NULL,
                id_utilisateur INT NOT NULL,
                role_convoque ENUM('Accusé', 'Avocat', 'Témoin', 'Enquêteur', 'Victime') NOT NULL,
                present BOOLEAN DEFAULT NULL,
                notification_envoyee BOOLEAN DEFAULT FALSE,
                date_notification DATETIME,
                FOREIGN KEY (id_audience) REFERENCES audiences(id_audience) ON DELETE CASCADE,
                FOREIGN KEY (id_utilisateur) REFERENCES utilisateurs(id_utilisateur)
            )
        `);

        await db.execute(`
            CREATE TABLE IF NOT EXISTS verdicts (
                id_verdict INT AUTO_INCREMENT PRIMARY KEY,
                id_audience INT NOT NULL,
                type_verdict ENUM('Coupable', 'Non coupable', 'Report') NOT NULL,
                description_verdict TEXT NOT NULL,
                peine TEXT,
                date_verdict TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                date_execution DATE,
                observations TEXT,
                FOREIGN KEY (id_audience) REFERENCES audiences(id_audience) ON DELETE CASCADE
            )
        `);

        console.log('Tables pour la gestion des audiences créées avec succès');
    } catch (error) {
        console.error('Erreur lors de la création des tables:', error);
        throw error;
    }
}

async function down() {
    try {
        await db.execute('DROP TABLE IF EXISTS verdicts');
        await db.execute('DROP TABLE IF EXISTS convocations_audience');
        await db.execute('DROP TABLE IF EXISTS audiences');
        console.log('Tables supprimées avec succès');
    } catch (error) {
        console.error('Erreur lors de la suppression des tables:', error);
        throw error;
    }
}

module.exports = { up, down }; 