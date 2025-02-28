const db = require('../config/database');

async function up() {
    try {
        // Désactiver les contraintes de clé étrangère
        await db.execute('SET FOREIGN_KEY_CHECKS = 0');

        // Supprimer les tables qui dépendent de detenus
        await db.execute('DROP TABLE IF EXISTS mouvements_detenus');
        await db.execute('DROP TABLE IF EXISTS peines');
        await db.execute('DROP TABLE IF EXISTS detenus');

        // Créer la nouvelle table detenus
        await db.execute(`
            CREATE TABLE detenus (
                id_detenu INT PRIMARY KEY AUTO_INCREMENT,
                nom VARCHAR(100) NOT NULL,
                prenom VARCHAR(100) NOT NULL,
                date_naissance DATE NOT NULL,
                sexe ENUM('Homme', 'Femme') NOT NULL,
                date_admission DATE NOT NULL,
                celluleId INT NOT NULL,
                id_enquete INT,
                date_fin_peine DATE,
                statut ENUM('En détention', 'Libéré', 'Transféré') DEFAULT 'En détention',
                type_peine VARCHAR(100),
                numero_dossier VARCHAR(6) UNIQUE NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (celluleId) REFERENCES cellules(id_cellule),
                FOREIGN KEY (id_enquete) REFERENCES enquetes(id_enquete)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
        `);

        // Recréer la table mouvements_detenus
        await db.execute(`
            CREATE TABLE mouvements_detenus (
                id_mouvement INT PRIMARY KEY AUTO_INCREMENT,
                id_detenu INT NOT NULL,
                type_mouvement ENUM('Admission', 'Transfert', 'Liberation') NOT NULL,
                cellule_depart INT,
                cellule_arrivee INT NOT NULL,
                date_mouvement DATETIME NOT NULL,
                motif TEXT,
                effectue_par VARCHAR(100),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (id_detenu) REFERENCES detenus(id_detenu),
                FOREIGN KEY (cellule_depart) REFERENCES cellules(id_cellule),
                FOREIGN KEY (cellule_arrivee) REFERENCES cellules(id_cellule)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
        `);

        // Recréer la table peines
        await db.execute(`
            CREATE TABLE peines (
                id_peine INT PRIMARY KEY AUTO_INCREMENT,
                id_detenu INT NOT NULL,
                type_peine VARCHAR(100) NOT NULL,
                duree_peine INT,
                date_debut DATE NOT NULL,
                date_fin DATE,
                observations TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (id_detenu) REFERENCES detenus(id_detenu)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
        `);

        // Réactiver les contraintes de clé étrangère
        await db.execute('SET FOREIGN_KEY_CHECKS = 1');

        console.log('Tables recréées avec succès');
    } catch (error) {
        console.error('Erreur lors de la recréation des tables:', error);
        // Réactiver les contraintes de clé étrangère en cas d'erreur
        await db.execute('SET FOREIGN_KEY_CHECKS = 1');
        throw error;
    }
}

async function down() {
    try {
        // Désactiver les contraintes de clé étrangère
        await db.execute('SET FOREIGN_KEY_CHECKS = 0');

        // Supprimer les tables dans l'ordre inverse de leur création
        await db.execute('DROP TABLE IF EXISTS peines');
        await db.execute('DROP TABLE IF EXISTS mouvements_detenus');
        await db.execute('DROP TABLE IF EXISTS detenus');

        // Réactiver les contraintes de clé étrangère
        await db.execute('SET FOREIGN_KEY_CHECKS = 1');

        console.log('Tables supprimées avec succès');
    } catch (error) {
        console.error('Erreur lors de la suppression des tables:', error);
        // Réactiver les contraintes de clé étrangère en cas d'erreur
        await db.execute('SET FOREIGN_KEY_CHECKS = 1');
        throw error;
    }
}

module.exports = { up, down }; 