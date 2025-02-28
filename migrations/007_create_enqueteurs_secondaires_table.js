const db = require('../config/database');

async function up() {
    try {
        await db.execute(`
            CREATE TABLE IF NOT EXISTS enqueteurs_secondaires (
                id_enqueteur_secondaire INT AUTO_INCREMENT PRIMARY KEY,
                id_enquete INT NOT NULL,
                id_utilisateur INT NOT NULL,
                
                FOREIGN KEY (id_enquete) REFERENCES enquetes(id_enquete) ON DELETE CASCADE,
                FOREIGN KEY (id_utilisateur) REFERENCES utilisateurs(id_utilisateur) ON DELETE CASCADE
            )
        `);
        console.log('Table enqueteurs_secondaires créée avec succès');
    } catch (error) {
        console.error('Erreur lors de la création de la table enqueteurs_secondaires:', error);
        throw error;
    }
}

async function down() {
    try {
        await db.execute('DROP TABLE IF EXISTS enqueteurs_secondaires');
        console.log('Table enqueteurs_secondaires supprimée avec succès');
    } catch (error) {
        console.error('Erreur lors de la suppression de la table enqueteurs_secondaires:', error);
        throw error;
    }
}

module.exports = { up, down }; 