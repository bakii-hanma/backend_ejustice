const db = require('../config/database');

async function up() {
    try {
        // Vérifier si la colonne code_enquete existe déjà
        const [columns] = await db.execute(`
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = 'emore-junior_ejustice' 
            AND TABLE_NAME = 'enquetes' 
            AND COLUMN_NAME = 'code_enquete'
        `);

        // Si la colonne n'existe pas, on l'ajoute
        if (columns.length === 0) {
            await db.execute(`
                ALTER TABLE enquetes
                ADD COLUMN code_enquete VARCHAR(8) UNIQUE NOT NULL
            `);
            console.log('Colonne code_enquete ajoutée à la table enquetes');
        }

    } catch (error) {
        console.error('Erreur lors de la modification de la table enquetes:', error);
        throw error;
    }
}

async function down() {
    try {
        // Vérifier si la colonne existe avant de la supprimer
        const [columns] = await db.execute(`
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = 'emore-junior_ejustice' 
            AND TABLE_NAME = 'enquetes' 
            AND COLUMN_NAME = 'code_enquete'
        `);

        if (columns.length > 0) {
            await db.execute(`
                ALTER TABLE enquetes
                DROP COLUMN code_enquete
            `);
            console.log('Colonne code_enquete supprimée de la table enquetes');
        }
    } catch (error) {
        console.error('Erreur lors de la restauration de la table enquetes:', error);
        throw error;
    }
}

module.exports = { up, down }; 