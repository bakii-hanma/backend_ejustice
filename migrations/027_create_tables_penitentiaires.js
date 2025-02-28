const db = require('../config/database');

async function up() {
    try {
        // Table des détenus
        await db.execute(`
            CREATE TABLE IF NOT EXISTS detenus (
                id_detenu INT AUTO_INCREMENT PRIMARY KEY,
                nom VARCHAR(100) NOT NULL,
                prenom VARCHAR(100) NOT NULL,
                date_naissance DATE NOT NULL,
                sexe ENUM('Homme', 'Femme') NOT NULL,
                date_admission DATE NOT NULL,
                date_liberation DATE DEFAULT NULL,
                statut_detenu ENUM('En détention', 'Libéré', 'Transféré') DEFAULT 'En détention',
                cellule VARCHAR(10),
                id_enquete INT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (id_enquete) REFERENCES enquetes(id_enquete) ON DELETE SET NULL
            )
        `);

        // Table des peines
        await db.execute(`
            CREATE TABLE IF NOT EXISTS peines (
                id_peine INT AUTO_INCREMENT PRIMARY KEY,
                id_detenu INT NOT NULL,
                type_peine ENUM('Détention simple', 'Travaux forcés', 'Liberté conditionnelle') NOT NULL,
                duree_peine VARCHAR(50),
                date_debut DATE NOT NULL,
                date_fin DATE NOT NULL,
                observations TEXT DEFAULT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (id_detenu) REFERENCES detenus(id_detenu) ON DELETE CASCADE
            )
        `);

        // Table des cellules
        await db.execute(`
            CREATE TABLE IF NOT EXISTS cellules (
                id_cellule INT AUTO_INCREMENT PRIMARY KEY,
                nom_cellule VARCHAR(10) NOT NULL,
                capacite INT NOT NULL,
                nombre_occupe INT DEFAULT 0,
                statut_cellule ENUM('Disponible', 'Pleine', 'En maintenance') DEFAULT 'Disponible',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);

        // Table des mouvements (pour tracer les transferts)
        await db.execute(`
            CREATE TABLE IF NOT EXISTS mouvements_detenus (
                id_mouvement INT AUTO_INCREMENT PRIMARY KEY,
                id_detenu INT NOT NULL,
                type_mouvement ENUM('Admission', 'Transfert', 'Libération', 'Audience') NOT NULL,
                cellule_depart VARCHAR(10),
                cellule_arrivee VARCHAR(10),
                date_mouvement DATETIME NOT NULL,
                motif TEXT,
                effectue_par INT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (id_detenu) REFERENCES detenus(id_detenu) ON DELETE CASCADE,
                FOREIGN KEY (effectue_par) REFERENCES utilisateurs(id_utilisateur)
            )
        `);

        console.log('Tables pénitentiaires créées avec succès');
    } catch (error) {
        console.error('Erreur lors de la création des tables pénitentiaires:', error);
        throw error;
    }
}

async function down() {
    try {
        await db.execute('DROP TABLE IF EXISTS mouvements_detenus');
        await db.execute('DROP TABLE IF EXISTS peines');
        await db.execute('DROP TABLE IF EXISTS detenus');
        await db.execute('DROP TABLE IF EXISTS cellules');
        console.log('Tables pénitentiaires supprimées avec succès');
    } catch (error) {
        console.error('Erreur lors de la suppression des tables:', error);
        throw error;
    }
}

module.exports = { up, down }; 