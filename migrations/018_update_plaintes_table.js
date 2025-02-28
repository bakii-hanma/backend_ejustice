const db = require('../config/database');

async function up() {
    try {
        // Vérifier si la colonne fichier_plainte existe déjà
        const [columns] = await db.execute(`
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = 'emore-junior_ejustice' 
            AND TABLE_NAME = 'plaintes' 
            AND COLUMN_NAME = 'fichier_plainte'
        `);

        // Ajouter la colonne fichier_plainte si elle n'existe pas
        if (columns.length === 0) {
            await db.execute(`
                ALTER TABLE plaintes
                ADD COLUMN fichier_plainte VARCHAR(255) NULL AFTER description,
                MODIFY COLUMN description TEXT NULL
            `);
            console.log('Table plaintes mise à jour avec succès');
        }

        // Créer le répertoire pour stocker les fichiers de plaintes
        const fs = require('fs').promises;
        const path = require('path');
        const uploadDir = path.join(__dirname, '../uploads/plaintes');
        
        try {
            await fs.access(uploadDir);
        } catch {
            await fs.mkdir(uploadDir, { recursive: true });
            console.log('Répertoire de stockage des plaintes créé');
        }

    } catch (error) {
        console.error('Erreur lors de la mise à jour de la table plaintes:', error);
        throw error;
    }
}

async function down() {
    try {
        // Supprimer la colonne fichier_plainte
        await db.execute(`
            ALTER TABLE plaintes
            DROP COLUMN IF EXISTS fichier_plainte,
            MODIFY COLUMN description TEXT NOT NULL
        `);
        console.log('Modifications de la table plaintes annulées');

    } catch (error) {
        console.error('Erreur lors de l\'annulation des modifications:', error);
        throw error;
    }
}

module.exports = { up, down }; 