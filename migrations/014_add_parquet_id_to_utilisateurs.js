const db = require('../config/database');

async function up() {
    try {
        // 1. Vérifier si la colonne id_parquet existe déjà
        const [columns] = await db.execute(`
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = 'emore-junior_ejustice' 
            AND TABLE_NAME = 'utilisateurs' 
            AND COLUMN_NAME = 'id_parquet'
        `);

        // Si la colonne n'existe pas, on continue
        if (columns.length === 0) {
            // 2. Vérifier si la table parquet existe
            const [tables] = await db.execute(`
                SELECT TABLE_NAME 
                FROM INFORMATION_SCHEMA.TABLES 
                WHERE TABLE_SCHEMA = 'emore-junior_ejustice' 
                AND TABLE_NAME = 'parquet'
            `);

            if (tables.length === 0) {
                // Créer d'abord la table parquet si elle n'existe pas
                await db.execute(`
                    CREATE TABLE IF NOT EXISTS parquet (
                        id_parquet INT AUTO_INCREMENT PRIMARY KEY,
                        nom_parquet VARCHAR(255) NOT NULL,
                        adresse VARCHAR(255) NOT NULL,
                        contact VARCHAR(15),
                        email VARCHAR(100)
                    )
                `);
                console.log('Table parquet créée avec succès');
            }

            // 3. Ajouter la colonne id_parquet
            await db.execute(`
                ALTER TABLE utilisateurs
                ADD COLUMN id_parquet INT NULL
            `);

            // 4. Ajouter la contrainte de clé étrangère
            await db.execute(`
                ALTER TABLE utilisateurs
                ADD CONSTRAINT fk_utilisateur_parquet
                FOREIGN KEY (id_parquet) REFERENCES parquet(id_parquet)
            `);

            console.log('Colonne id_parquet et contrainte ajoutées avec succès');
        } else {
            console.log('La colonne id_parquet existe déjà');
        }

        // 5. Créer un parquet par défaut si nécessaire
        const [parquets] = await db.execute('SELECT * FROM parquet LIMIT 1');
        if (parquets.length === 0) {
            await db.execute(`
                INSERT INTO parquet (nom_parquet, adresse, contact, email)
                VALUES ('Parquet Principal', 'Adresse du parquet', '+123456789', 'contact@parquet.gov')
            `);
            console.log('Parquet par défaut créé');
        }

    } catch (error) {
        console.error('Erreur lors de l\'ajout de la colonne id_parquet:', error);
        throw error;
    }
}

async function down() {
    try {
        // 1. Supprimer la contrainte de clé étrangère si elle existe
        const [constraints] = await db.execute(`
            SELECT CONSTRAINT_NAME 
            FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS 
            WHERE TABLE_SCHEMA = 'emore-junior_ejustice' 
            AND TABLE_NAME = 'utilisateurs' 
            AND CONSTRAINT_NAME = 'fk_utilisateur_parquet'
        `);

        if (constraints.length > 0) {
            await db.execute(`
                ALTER TABLE utilisateurs
                DROP FOREIGN KEY fk_utilisateur_parquet
            `);
            console.log('Contrainte de clé étrangère supprimée');
        }

        // 2. Supprimer la colonne id_parquet
        await db.execute(`
            ALTER TABLE utilisateurs
            DROP COLUMN IF EXISTS id_parquet
        `);
        console.log('Colonne id_parquet supprimée');

    } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        throw error;
    }
}

module.exports = { up, down }; 