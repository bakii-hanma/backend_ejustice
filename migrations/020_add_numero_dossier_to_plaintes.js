const db = require('../config/database');

async function up() {
    try {
        // Vérifier si la colonne numero_dossier existe déjà
        const [columns] = await db.execute(`
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = 'emore-junior_ejustice' 
            AND TABLE_NAME = 'plaintes' 
            AND COLUMN_NAME = 'numero_dossier'
        `);

        // Si la colonne n'existe pas, on l'ajoute
        if (columns.length === 0) {
            await db.execute(`
                ALTER TABLE plaintes
                ADD COLUMN numero_dossier VARCHAR(6) UNIQUE NOT NULL
            `);
            console.log('Colonne numero_dossier ajoutée à la table plaintes');
        } else {
            console.log('La colonne numero_dossier existe déjà');
        }
    } catch (error) {
        console.error('Erreur lors de la modification de la table plaintes:', error);
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
            AND TABLE_NAME = 'plaintes' 
            AND COLUMN_NAME = 'numero_dossier'
        `);

        if (columns.length > 0) {
            await db.execute(`
                ALTER TABLE plaintes
                DROP COLUMN numero_dossier
            `);
            console.log('Colonne numero_dossier supprimée de la table plaintes');
        }
    } catch (error) {
        console.error('Erreur lors de la restauration de la table plaintes:', error);
        throw error;
    }
}

module.exports = { up, down }; 