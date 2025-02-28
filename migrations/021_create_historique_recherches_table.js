const db = require('../config/database');

async function up() {
    try {
        await db.execute(`
            CREATE TABLE IF NOT EXISTS historique_recherches (
                id_historique INT AUTO_INCREMENT PRIMARY KEY,
                id_utilisateur INT NOT NULL,
                type_recherche ENUM('Plaintes', 'Enquetes', 'Interrogatoires', 'Preuves', 'Personnes') NOT NULL,
                criteres TEXT NOT NULL,
                date_recherche TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                resultats_count INT NOT NULL,
                FOREIGN KEY (id_utilisateur) REFERENCES utilisateurs(id_utilisateur)
            )
        `);
        console.log('Table historique_recherches créée avec succès');
    } catch (error) {
        console.error('Erreur lors de la création de la table historique_recherches:', error);
        throw error;
    }
}

async function down() {
    try {
        await db.execute('DROP TABLE IF EXISTS historique_recherches');
        console.log('Table historique_recherches supprimée avec succès');
    } catch (error) {
        console.error('Erreur lors de la suppression de la table:', error);
        throw error;
    }
}

module.exports = { up, down }; 