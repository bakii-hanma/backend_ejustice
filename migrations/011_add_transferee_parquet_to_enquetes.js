const db = require('../config/database');

async function up() {
    try {
        // Vérifier si la colonne existe déjà
        const [columns] = await db.execute(`
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = 'emore-junior_ejustice' 
            AND TABLE_NAME = 'enquetes' 
            AND COLUMN_NAME = 'transferee_parquet'
        `);

        if (columns.length === 0) {
            // La colonne n'existe pas, on peut l'ajouter
            await db.execute(`
                ALTER TABLE enquetes
                ADD COLUMN transferee_parquet ENUM('Oui', 'Non') DEFAULT 'Non' NOT NULL
            `);
            console.log('Colonne transferee_parquet ajoutée à la table enquetes');
        } else {
            console.log('La colonne transferee_parquet existe déjà');
        }
    } catch (error) {
        console.error('Erreur lors de l\'ajout de la colonne transferee_parquet:', error);
        throw error;
    }
}

async function down() {
    try {
        await db.execute(`
            ALTER TABLE enquetes
            DROP COLUMN IF EXISTS transferee_parquet
        `);
        console.log('Colonne transferee_parquet supprimée de la table enquetes');
    } catch (error) {
        console.error('Erreur lors de la suppression de la colonne:', error);
        throw error;
    }
}

module.exports = { up, down }; 