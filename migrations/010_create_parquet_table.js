const db = require('../config/database');

async function up() {
    try {
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

        // Modifier la table transmissions_parquet pour mettre à jour la clé étrangère
        await db.execute(`
            ALTER TABLE transmissions_parquet
            DROP FOREIGN KEY transmissions_parquet_ibfk_2;
        `);

        await db.execute(`
            ALTER TABLE transmissions_parquet
            MODIFY COLUMN id_parquet INT NOT NULL,
            ADD CONSTRAINT transmissions_parquet_ibfk_2
            FOREIGN KEY (id_parquet) REFERENCES parquet(id_parquet);
        `);
        console.log('Table transmissions_parquet mise à jour avec succès');

    } catch (error) {
        console.error('Erreur lors de la création/modification des tables:', error);
        throw error;
    }
}

async function down() {
    try {
        // Restaurer l'ancienne référence avant de supprimer la table
        await db.execute(`
            ALTER TABLE transmissions_parquet
            DROP FOREIGN KEY transmissions_parquet_ibfk_2;
        `);

        await db.execute(`
            ALTER TABLE transmissions_parquet
            ADD CONSTRAINT transmissions_parquet_ibfk_2
            FOREIGN KEY (id_parquet) REFERENCES utilisateurs(id_utilisateur);
        `);

        await db.execute('DROP TABLE IF EXISTS parquet');
        console.log('Table parquet supprimée avec succès');
    } catch (error) {
        console.error('Erreur lors de la suppression de la table:', error);
        throw error;
    }
}

module.exports = { up, down }; 