const db = require('../config/database');

async function up() {
    try {
        // Vérifier si les colonnes existent déjà
        const [columns] = await db.execute(`
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = 'emore-junior_ejustice' 
            AND TABLE_NAME = 'preuves'
            AND COLUMN_NAME IN ('date_recolte', 'lieu_recolte')
        `);

        const existingColumns = columns.map(col => col.COLUMN_NAME.toLowerCase());
        const columnsToAdd = [];

        if (!existingColumns.includes('date_recolte')) {
            columnsToAdd.push('ADD COLUMN date_recolte DATE NULL');
        }

        if (!existingColumns.includes('lieu_recolte')) {
            columnsToAdd.push('ADD COLUMN lieu_recolte VARCHAR(255) NULL');
        }

        if (columnsToAdd.length > 0) {
            await db.execute(`
                ALTER TABLE preuves
                ${columnsToAdd.join(', ')}
            `);
            console.log('Colonnes ajoutées avec succès à la table preuves');
        } else {
            console.log('Les colonnes existent déjà dans la table preuves');
        }
    } catch (error) {
        console.error('Erreur lors de l\'ajout des colonnes:', error);
        throw error;
    }
}

async function down() {
    try {
        await db.execute(`
            ALTER TABLE preuves
            DROP COLUMN IF EXISTS date_recolte,
            DROP COLUMN IF EXISTS lieu_recolte
        `);
        console.log('Colonnes supprimées de la table preuves');
    } catch (error) {
        console.error('Erreur lors de la suppression des colonnes:', error);
        throw error;
    }
}

module.exports = { up, down }; 