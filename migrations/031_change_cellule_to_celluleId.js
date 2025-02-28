const db = require('../config/database');

async function up() {
    try {
        // Vérifier si la colonne cellule existe
        const [columns] = await db.execute(`
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = 'emore-junior_ejustice' 
            AND TABLE_NAME = 'detenus' 
            AND COLUMN_NAME = 'cellule'
        `);

        if (columns.length > 0) {
            // Renommer la colonne cellule en celluleId
            await db.execute(`
                ALTER TABLE detenus
                CHANGE COLUMN cellule celluleId INT NOT NULL;
            `);
            console.log('Colonne cellule changée en celluleId dans la table detenus');
        } else {
            console.log('La colonne cellule n\'existe pas dans la table detenus');
        }
    } catch (error) {
        console.error('Erreur lors du changement de la colonne cellule:', error);
        throw error;
    }
}

async function down() {
    try {
        await db.execute(`
            ALTER TABLE detenus
            CHANGE COLUMN celluleId cellule INT NOT NULL;
        `);
        console.log('Colonne celluleId changée en cellule dans la table detenus');
    } catch (error) {
        console.error('Erreur lors du changement de la colonne celluleId:', error);
        throw error;
    }
}

module.exports = { up, down }; 