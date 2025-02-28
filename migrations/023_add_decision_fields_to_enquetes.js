const db = require('../config/database');

async function up() {
    try {
        // Modifier d'abord le type ENUM de statut_enquete
        await db.execute(`
            ALTER TABLE enquetes
            MODIFY COLUMN statut_enquete ENUM(
                'En cours', 
                'Transmise au parquet',
                'En procès',
                'Classée sans suite',
                'Complément requis',
                'Clôturée'
            ) NOT NULL DEFAULT 'En cours'
        `);

        // Vérifier et ajouter chaque colonne individuellement
        const [columns] = await db.execute(`
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = 'emore-junior_ejustice' 
            AND TABLE_NAME = 'enquetes'
        `);

        const existingColumns = columns.map(col => col.COLUMN_NAME);

        // Ajouter decision_magistrat si elle n'existe pas
        if (!existingColumns.includes('decision_magistrat')) {
            await db.execute(`
                ALTER TABLE enquetes
                ADD COLUMN decision_magistrat TEXT NULL
            `);
        }

        // Ajouter date_decision si elle n'existe pas
        if (!existingColumns.includes('date_decision')) {
            await db.execute(`
                ALTER TABLE enquetes
                ADD COLUMN date_decision DATETIME NULL
            `);
        }

        // Ajouter motif_decision si elle n'existe pas
        if (!existingColumns.includes('motif_decision')) {
            await db.execute(`
                ALTER TABLE enquetes
                ADD COLUMN motif_decision TEXT NULL
            `);
        }

        // Ajouter actions_requises si elle n'existe pas
        if (!existingColumns.includes('actions_requises')) {
            await db.execute(`
                ALTER TABLE enquetes
                ADD COLUMN actions_requises TEXT NULL
            `);
        }
        
        console.log('Champs de décision ajoutés à la table enquetes');
    } catch (error) {
        console.error('Erreur lors de la modification de la table enquetes:', error);
        throw error;
    }
}

async function down() {
    try {
        // Vérifier l'existence des colonnes avant de les supprimer
        const [columns] = await db.execute(`
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = 'emore-junior_ejustice' 
            AND TABLE_NAME = 'enquetes'
        `);

        const existingColumns = columns.map(col => col.COLUMN_NAME);

        // Supprimer les colonnes si elles existent
        if (existingColumns.includes('decision_magistrat')) {
            await db.execute('ALTER TABLE enquetes DROP COLUMN decision_magistrat');
        }
        if (existingColumns.includes('date_decision')) {
            await db.execute('ALTER TABLE enquetes DROP COLUMN date_decision');
        }
        if (existingColumns.includes('motif_decision')) {
            await db.execute('ALTER TABLE enquetes DROP COLUMN motif_decision');
        }
        if (existingColumns.includes('actions_requises')) {
            await db.execute('ALTER TABLE enquetes DROP COLUMN actions_requises');
        }

        // Restaurer le type ENUM original
        await db.execute(`
            ALTER TABLE enquetes
            MODIFY COLUMN statut_enquete ENUM(
                'En cours', 
                'Transmise au parquet',
                'Clôturée'
            ) NOT NULL DEFAULT 'En cours'
        `);
        
        console.log('Champs de décision supprimés de la table enquetes');
    } catch (error) {
        console.error('Erreur lors de la restauration de la table enquetes:', error);
        throw error;
    }
}

module.exports = { up, down }; 