const db = require('../config/database');

async function up() {
    try {
        await db.execute(`
            CREATE TABLE IF NOT EXISTS cellules (
                id_cellule INT AUTO_INCREMENT PRIMARY KEY,
                nom_cellule VARCHAR(10) NOT NULL,
                capacite INT NOT NULL,
                nombre_occupe INT DEFAULT 0,
                statut_cellule ENUM('Disponible', 'Pleine', 'En maintenance') DEFAULT 'Disponible',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
        console.log('Table cellules créée avec succès');
    } catch (error) {
        console.error('Erreur lors de la création de la table cellules:', error);
        throw error;
    }
}

async function down() {
    try {
        await db.execute('DROP TABLE IF EXISTS cellules');
        console.log('Table cellules supprimée avec succès');
    } catch (error) {
        console.error('Erreur lors de la suppression de la table cellules:', error);
        throw error;
    }
}

module.exports = { up, down }; 