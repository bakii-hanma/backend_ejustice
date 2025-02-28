const db = require('../config/database');

async function up() {
    try {
        await db.execute(`
            CREATE TABLE IF NOT EXISTS utilisateurs (
                id_utilisateur INT AUTO_INCREMENT PRIMARY KEY,
                nom VARCHAR(100) NOT NULL,
                prenom VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE,
                telephone VARCHAR(15),
                adresse TEXT,
                date_naissance DATE,
                role ENUM('citoyen', 'enqueteur', 'magistrat', 'admin_penitentiaire', 'detenu') NOT NULL,
                mot_de_passe VARCHAR(255) NOT NULL,
                numero_citoyen VARCHAR(50) UNIQUE DEFAULT NULL,
                specialite VARCHAR(50) DEFAULT NULL,
                grade VARCHAR(50) DEFAULT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
        console.log('Table utilisateurs créée avec succès');
    } catch (error) {
        console.error('Erreur lors de la création de la table:', error);
        throw error;
    }
}

async function down() {
    try {
        await db.execute('DROP TABLE IF EXISTS utilisateurs');
        console.log('Table utilisateurs supprimée avec succès');
    } catch (error) {
        console.error('Erreur lors de la suppression de la table:', error);
        throw error;
    }
}

module.exports = { up, down }; 