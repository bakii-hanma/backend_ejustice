const db = require('../config/database');

async function up() {
    try {
        // Vérifier les colonnes existantes
        const [columns] = await db.execute(`
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = 'emore-junior_ejustice' 
            AND TABLE_NAME = 'utilisateurs'
            AND COLUMN_NAME IN ('juridiction', 'fonction_magistrat', 'date_prise_fonction', 'statut_magistrat')
        `);

        const existingColumns = columns.map(col => col.COLUMN_NAME.toLowerCase());
        const columnsToAdd = [];

        // Définir les colonnes à ajouter avec leurs définitions
        if (!existingColumns.includes('juridiction')) {
            columnsToAdd.push('ADD COLUMN juridiction VARCHAR(100) NULL');
        }
        
        if (!existingColumns.includes('fonction_magistrat')) {
            columnsToAdd.push('ADD COLUMN fonction_magistrat VARCHAR(100) NULL');
        }
        
        if (!existingColumns.includes('date_prise_fonction')) {
            columnsToAdd.push('ADD COLUMN date_prise_fonction DATE NULL');
        }
        
        if (!existingColumns.includes('statut_magistrat')) {
            columnsToAdd.push('ADD COLUMN statut_magistrat ENUM(\'Actif\', \'Inactif\', \'Suspendu\') DEFAULT \'Actif\'');
        }

        // Ajouter uniquement les nouvelles colonnes
        if (columnsToAdd.length > 0) {
            await db.execute(`
                ALTER TABLE utilisateurs
                ${columnsToAdd.join(', ')}
            `);
            console.log('Nouvelles colonnes ajoutées avec succès');
        } else {
            console.log('Toutes les colonnes existent déjà');
        }

    } catch (error) {
        console.error('Erreur lors de l\'ajout des colonnes pour magistrats:', error);
        throw error;
    }
}

async function down() {
    try {
        await db.execute(`
            ALTER TABLE utilisateurs
            DROP COLUMN IF EXISTS juridiction,
            DROP COLUMN IF EXISTS fonction_magistrat,
            DROP COLUMN IF EXISTS date_prise_fonction,
            DROP COLUMN IF EXISTS statut_magistrat
        `);
        console.log('Colonnes magistrat supprimées avec succès');
    } catch (error) {
        console.error('Erreur lors de la suppression des colonnes:', error);
        throw error;
    }
}

module.exports = { up, down }; 