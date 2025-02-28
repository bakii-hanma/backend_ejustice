const db = require('../config/database');

async function up() {
    try {
        // Vérifier si la colonne existe déjà
        const [columns] = await db.execute(`
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = 'emore-junior_ejustice' 
            AND TABLE_NAME = 'detenus' 
            AND COLUMN_NAME = 'numero_dossier'
        `);

        if (columns.length === 0) {
            await db.execute(`
                ALTER TABLE detenus
                ADD COLUMN numero_dossier VARCHAR(6) UNIQUE NOT NULL;
            `);
            console.log('Colonne numero_dossier ajoutée à la table detenus');
        } else {
            console.log('La colonne numero_dossier existe déjà dans la table detenus');
        }
    } catch (error) {
        console.error('Erreur lors de l\'ajout de la colonne numero_dossier:', error);
        throw error;
    }
}

async function down() {
    try {
        await db.execute(`
            ALTER TABLE detenus
            DROP COLUMN numero_dossier;
        `);
        console.log('Colonne numero_dossier supprimée de la table detenus');
    } catch (error) {
        console.error('Erreur lors de la suppression de la colonne numero_dossier:', error);
        throw error;
    }
}

module.exports = { up, down }; 