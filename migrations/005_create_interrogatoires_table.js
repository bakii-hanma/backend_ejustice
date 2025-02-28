const db = require('../config/database');

async function up() {
    try {
        await db.execute(`
            CREATE TABLE IF NOT EXISTS interrogatoires (
                id_interrogatoire INT AUTO_INCREMENT PRIMARY KEY,
                id_enquete INT NOT NULL,
                type_personne ENUM('Suspect', 'Témoin', 'Victime') NOT NULL,
                nom_personne VARCHAR(255) NOT NULL,
                identite_document VARCHAR(50) NOT NULL,
                numero_document_identite VARCHAR(100) NOT NULL,
                contact_personne VARCHAR(15) NOT NULL,
                date_interrogatoire DATETIME NOT NULL,
                lieu_interrogatoire VARCHAR(255) NOT NULL,
                objet_interrogatoire TEXT NOT NULL,
                statut_interrogatoire ENUM('Prévu', 'En cours', 'Terminé', 'Annulé') NOT NULL DEFAULT 'Prévu',
                notes_preparatoires TEXT DEFAULT NULL,
                documents_associes TEXT DEFAULT NULL,
                observations_post_interrogatoire TEXT DEFAULT NULL,
                
                FOREIGN KEY (id_enquete) REFERENCES enquetes(id_enquete) ON DELETE CASCADE
            )
        `);
        console.log('Table interrogatoires créée avec succès');
    } catch (error) {
        console.error('Erreur lors de la création de la table interrogatoires:', error);
        throw error;
    }
}

async function down() {
    try {
        await db.execute('DROP TABLE IF EXISTS interrogatoires');
        console.log('Table interrogatoires supprimée avec succès');
    } catch (error) {
        console.error('Erreur lors de la suppression de la table interrogatoires:', error);
        throw error;
    }
}

module.exports = { up, down }; 