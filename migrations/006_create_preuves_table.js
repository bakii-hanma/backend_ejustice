const db = require('../config/database');

async function up() {
    try {
        await db.execute(`
            CREATE TABLE IF NOT EXISTS preuves (
                id_preuve INT AUTO_INCREMENT PRIMARY KEY,
                id_enquete INT NOT NULL,
                type_preuve ENUM(
                    'Document',
                    'Photo',
                    'Vidéo',
                    'Objet physique',
                    'Empreinte'
                ) NOT NULL,
                description TEXT NOT NULL,
                date_recolte DATETIME NOT NULL,
                lieu_recolte VARCHAR(255) NOT NULL,
                id_enqueteur INT DEFAULT NULL,
                statut_preuve ENUM('Récoltée', 'En analyse', 'Acceptée', 'Rejetée') NOT NULL DEFAULT 'Récoltée',
                fichier_preuve TEXT NULL,
                observations TEXT NULL,
                
                FOREIGN KEY (id_enquete) REFERENCES enquetes(id_enquete) ON DELETE CASCADE,
                FOREIGN KEY (id_enqueteur) REFERENCES utilisateurs(id_utilisateur) ON DELETE SET NULL
            )
        `);
        console.log('Table preuves créée avec succès');
    } catch (error) {
        console.error('Erreur lors de la création de la table preuves:', error);
        throw error;
    }
}

async function down() {
    try {
        await db.execute('DROP TABLE IF EXISTS preuves');
        console.log('Table preuves supprimée avec succès');
    } catch (error) {
        console.error('Erreur lors de la suppression de la table preuves:', error);
        throw error;
    }
}

module.exports = { up, down }; 