const db = require('../config/database');

async function up() {
    try {
        // Vérifier si la colonne existe déjà
        const [columns] = await db.execute(`
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = 'emore-junior_ejustice' 
            AND TABLE_NAME = 'plaintes' 
            AND COLUMN_NAME = 'fichier_plainte'
        `);

        if (columns.length === 0) {
            await db.execute(`
                ALTER TABLE plaintes
                ADD COLUMN fichier_plainte VARCHAR(255) NULL
            `);
            console.log('Colonne fichier_plainte ajoutée à la table plaintes');
        }
    } catch (error) {
        console.error('Erreur lors de l\'ajout de la colonne:', error);
        throw error;
    }
}

async function down() {
    try {
        await db.execute(`
            ALTER TABLE plaintes
            DROP COLUMN IF EXISTS fichier_plainte
        `);
        console.log('Colonne fichier_plainte supprimée de la table plaintes');
    } catch (error) {
        console.error('Erreur lors de la suppression de la colonne:', error);
        throw error;
    }
}

module.exports = { up, down }; 