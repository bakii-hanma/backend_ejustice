const db = require('../config/database');

async function up() {
    try {
        await db.execute(`
            CREATE TABLE IF NOT EXISTS plaintes (
                id_plainte INT AUTO_INCREMENT PRIMARY KEY,
                id_utilisateur INT NOT NULL,
                date_depot DATE NOT NULL,
                lieu VARCHAR(255) NOT NULL,
                description TEXT NOT NULL,
                categorie_infraction VARCHAR(100) NOT NULL,
                statut ENUM('En attente', 'En cours', 'Clôturée') NOT NULL DEFAULT 'En attente',
                id_enqueteur INT DEFAULT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (id_utilisateur) REFERENCES utilisateurs(id_utilisateur),
                FOREIGN KEY (id_enqueteur) REFERENCES utilisateurs(id_utilisateur)
            )
        `);
        console.log('Table plaintes créée avec succès');
    } catch (error) {
        console.error('Erreur lors de la création de la table plaintes:', error);
        throw error;
    }
}

async function down() {
    try {
        await db.execute('DROP TABLE IF EXISTS plaintes');
        console.log('Table plaintes supprimée avec succès');
    } catch (error) {
        console.error('Erreur lors de la suppression de la table:', error);
        throw error;
    }
}

module.exports = { up, down }; 