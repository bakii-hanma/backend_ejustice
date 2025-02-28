const db = require('../config/database');

async function up() {
    try {
        await db.execute(`
            CREATE TABLE IF NOT EXISTS convocations (
                id_convocation INT AUTO_INCREMENT PRIMARY KEY,
                id_enquete INT NOT NULL,
                id_interrogatoire INT NULL,
                nom_personne VARCHAR(255) NOT NULL,
                type_personne ENUM('Témoin', 'Suspect', 'Victime', 'Expert') NOT NULL,
                contact_telephone VARCHAR(20),
                contact_email VARCHAR(255),
                contact_adresse TEXT,
                date_convocation DATETIME NOT NULL,
                lieu VARCHAR(255) NOT NULL,
                motif TEXT NOT NULL,
                reference_legale VARCHAR(255),
                mode_envoi ENUM('Main propre', 'Email', 'SMS') NOT NULL,
                statut ENUM('Envoyée', 'Reçue', 'Confirmée', 'Non-répondue', 'Non-présenté') DEFAULT 'Envoyée',
                date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                date_reception DATETIME NULL,
                date_confirmation DATETIME NULL,
                observations TEXT,
                created_by INT NOT NULL,
                FOREIGN KEY (id_enquete) REFERENCES enquetes(id_enquete) ON DELETE CASCADE,
                FOREIGN KEY (id_interrogatoire) REFERENCES interrogatoires(id_interrogatoire) ON DELETE SET NULL,
                FOREIGN KEY (created_by) REFERENCES utilisateurs(id_utilisateur)
            )
        `);

        await db.execute(`
            CREATE TABLE IF NOT EXISTS relances_convocation (
                id_relance INT AUTO_INCREMENT PRIMARY KEY,
                id_convocation INT NOT NULL,
                date_relance DATETIME NOT NULL,
                type_relance ENUM('Email', 'SMS', 'Téléphone', 'Main propre') NOT NULL,
                statut ENUM('Envoyée', 'Reçue', 'Échec') NOT NULL,
                observations TEXT,
                FOREIGN KEY (id_convocation) REFERENCES convocations(id_convocation) ON DELETE CASCADE
            )
        `);

        await db.execute(`
            CREATE TABLE IF NOT EXISTS convocations_audience (
                id_convocation INT AUTO_INCREMENT PRIMARY KEY,
                id_audience INT NOT NULL,
                nom_personne VARCHAR(100) NOT NULL,
                prenom_personne VARCHAR(100) NOT NULL,
                contact_telephone VARCHAR(20),
                contact_email VARCHAR(100),
                role_convoque ENUM('Accusé', 'Avocat', 'Témoin', 'Enquêteur', 'Victime', 'Expert') NOT NULL,
                present BOOLEAN DEFAULT NULL,
                notification_envoyee BOOLEAN DEFAULT FALSE,
                date_notification DATETIME,
                FOREIGN KEY (id_audience) REFERENCES audiences(id_audience) ON DELETE CASCADE
            )
        `);

        console.log('Tables pour la gestion des convocations créées avec succès');
    } catch (error) {
        console.error('Erreur lors de la création des tables:', error);
        throw error;
    }
}

async function down() {
    try {
        await db.execute('DROP TABLE IF EXISTS relances_convocation');
        await db.execute('DROP TABLE IF EXISTS convocations');
        await db.execute('DROP TABLE IF EXISTS convocations_audience');
        console.log('Tables supprimées avec succès');
    } catch (error) {
        console.error('Erreur lors de la suppression des tables:', error);
        throw error;
    }
}

module.exports = { up, down }; 