const db = require('../config/database');

async function up() {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // Ajouter les colonnes pour l'annulation
        await connection.execute(`
            ALTER TABLE plaintes
            ADD COLUMN motif_annulation TEXT DEFAULT NULL,
            ADD COLUMN date_annulation DATETIME DEFAULT NULL
        `);

        // Mettre à jour les contraintes de vérification pour le statut
        await connection.execute(`
            ALTER TABLE plaintes
            MODIFY COLUMN statut ENUM('En attente', 'Validée', 'Rejetée', 'En cours', 'Clôturée', 'Annulée') NOT NULL DEFAULT 'En attente'
        `);

        await connection.commit();
        console.log('Migration 031_add_annulation_fields_to_plaintes: SUCCESS');

    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}

async function down() {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // Supprimer les colonnes
        await connection.execute(`
            ALTER TABLE plaintes
            DROP COLUMN motif_annulation,
            DROP COLUMN date_annulation
        `);

        // Restaurer les contraintes de vérification pour le statut
        await connection.execute(`
            ALTER TABLE plaintes
            MODIFY COLUMN statut ENUM('En attente', 'Validée', 'Rejetée', 'En cours', 'Clôturée') NOT NULL DEFAULT 'En attente'
        `);

        await connection.commit();
        console.log('Migration 031_add_annulation_fields_to_plaintes: REVERTED');

    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}

module.exports = {
    up,
    down
}; 