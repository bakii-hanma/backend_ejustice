const fs = require('fs');
const path = require('path');
const db = require('../config/database');

async function runMigrations() {
    const migrationFiles = fs.readdirSync(__dirname)
        .filter(file => file.endsWith('.js') && file !== 'migrationRunner.js')
        .sort()
        .concat([
            '012_add_magistrat_fields.js',
            '013_create_decisions_magistrat_table.js',
            '014_add_parquet_id_to_utilisateurs.js',
            '018_update_plaintes_table.js',
            '027_create_cellules_table.js',
            '028_create_peines_table.js',
            '029_create_detenus_table.js'
        ]);

    for (const file of migrationFiles) {
        const migration = require(path.join(__dirname, file));
        console.log(`Exécution de la migration: ${file}`);
        
        try {
            await migration.up();
            console.log(`Migration ${file} réussie`);
        } catch (error) {
            console.error(`Erreur lors de la migration ${file}:`, error);
            process.exit(1);
        }
    }
}

runMigrations().then(() => {
    console.log('Toutes les migrations ont été exécutées avec succès');
    process.exit(0);
}); 