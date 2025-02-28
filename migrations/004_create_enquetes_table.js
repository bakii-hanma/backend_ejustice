const db = require('../config/database');

async function up() {
    try {
        await db.execute(`
            CREATE TABLE IF NOT EXISTS enquetes (
                id_enquete INT AUTO_INCREMENT PRIMARY KEY,
                id_plainte INT DEFAULT NULL,
                titre_enquete VARCHAR(255) NOT NULL,
                description TEXT NOT NULL,
                id_enqueteur_principal INT NOT NULL,
                date_ouverture DATE NOT NULL,
                statut_enquete ENUM('Ouverte', 'En cours', 'Clôturée', 'Suspendue') NOT NULL DEFAULT 'Ouverte',
                categorie_enquete VARCHAR(100) NOT NULL,
                priorite ENUM('Basse', 'Moyenne', 'Haute', 'Urgente') NOT NULL DEFAULT 'Moyenne',
                lieu_enquete VARCHAR(255) NOT NULL,
                mandat TEXT DEFAULT NULL,
                budget DECIMAL(10, 2) DEFAULT 0.00,
                date_cloture DATE DEFAULT NULL,
                observations TEXT DEFAULT NULL,
                code_enquete VARCHAR(6) NOT NULL UNIQUE,
                
                FOREIGN KEY (id_plainte) REFERENCES plaintes(id_plainte) ON DELETE SET NULL,
                FOREIGN KEY (id_enqueteur_principal) REFERENCES utilisateurs(id_utilisateur) ON DELETE CASCADE
            )
        `);
        console.log('Table enquetes créée avec succès');
    } catch (error) {
        console.error('Erreur lors de la création de la table enquetes:', error);
        throw error;
    }
}

async function down() {
    try {
        await db.execute('DROP TABLE IF EXISTS enquetes');
        console.log('Table enquetes supprimée avec succès');
    } catch (error) {
        console.error('Erreur lors de la suppression de la table enquetes:', error);
        throw error;
    }
}

module.exports = { up, down }; 