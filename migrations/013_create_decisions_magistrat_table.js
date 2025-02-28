const db = require('../config/database');

async function up() {
    try {
        await db.execute(`
            CREATE TABLE IF NOT EXISTS decisions_magistrat (
                id_decision INT AUTO_INCREMENT PRIMARY KEY,
                id_enquete INT NOT NULL,
                id_magistrat INT NOT NULL,
                type_decision ENUM(
                    'Procédure judiciaire',
                    'Classement sans suite',
                    'Complement enquete'
                ) NOT NULL,
                date_decision DATETIME NOT NULL,
                motif TEXT NOT NULL,
                instructions TEXT NULL,
                date_audience DATETIME NULL,
                statut_decision ENUM(
                    'En attente',
                    'En cours',
                    'Executee',
                    'Annulee'
                ) DEFAULT 'En attente',
                observations TEXT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                
                FOREIGN KEY (id_enquete) REFERENCES enquetes(id_enquete),
                FOREIGN KEY (id_magistrat) REFERENCES utilisateurs(id_utilisateur)
            )
        `);
        console.log('Table decisions_magistrat créée avec succès');
    } catch (error) {
        console.error('Erreur lors de la création de la table decisions_magistrat:', error);
        throw error;
    }
}

async function down() {
    try {
        await db.execute('DROP TABLE IF EXISTS decisions_magistrat');
        console.log('Table decisions_magistrat supprimée avec succès');
    } catch (error) {
        console.error('Erreur lors de la suppression de la table:', error);
        throw error;
    }
}

module.exports = { up, down }; 