const db = require('../config/database');

async function up() {
    try {
        // Vérifier si la colonne motif_rejet existe déjà
        const [columns] = await db.execute(`
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = 'emore-junior_ejustice' 
            AND TABLE_NAME = 'plaintes' 
            AND COLUMN_NAME = 'motif_rejet'
        `);

        // Si la colonne n'existe pas, on l'ajoute
        if (columns.length === 0) {
            await db.execute(`
                ALTER TABLE plaintes
                ADD COLUMN motif_rejet TEXT NULL
            `);
            console.log('Colonne motif_rejet ajoutée à la table plaintes');
        }

        // Modifier le type ENUM du statut dans tous les cas
        await db.execute(`
            ALTER TABLE plaintes
            MODIFY COLUMN statut ENUM('En attente', 'Validée', 'Rejetée') NOT NULL DEFAULT 'En attente'
        `);
        
        console.log('Statut de la table plaintes mis à jour');

    } catch (error) {
        console.error('Erreur lors de la modification de la table plaintes:', error);
        throw error;
    }
}

async function down() {
    try {
        // Restaurer le type ENUM original du statut
        await db.execute(`
            ALTER TABLE plaintes
            MODIFY COLUMN statut ENUM('En attente', 'En cours', 'Clôturée') NOT NULL DEFAULT 'En attente'
        `);

        // Supprimer la colonne motif_rejet si elle existe
        const [columns] = await db.execute(`
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = 'emore-junior_ejustice' 
            AND TABLE_NAME = 'plaintes' 
            AND COLUMN_NAME = 'motif_rejet'
        `);

        if (columns.length > 0) {
            await db.execute(`
                ALTER TABLE plaintes
                DROP COLUMN motif_rejet
            `);
        }

        console.log('Modifications de la table plaintes annulées');
    } catch (error) {
        console.error('Erreur lors de la restauration de la table plaintes:', error);
        throw error;
    }
}

module.exports = { up, down }; 