const db = require('../config/database');
const bcrypt = require('bcrypt');

async function up() {
    try {
        // Vérifier si l'admin existe déjà
        const [admins] = await db.execute(`
            SELECT id_utilisateur 
            FROM utilisateurs 
            WHERE email = 'admin@ejustice.com'
        `);

        if (admins.length === 0) {
            // Hasher le mot de passe
            const hashedPassword = await bcrypt.hash('Admin@2024', 10);

            // Créer l'administrateur par défaut
            await db.execute(`
                INSERT INTO utilisateurs (
                    nom,
                    prenom,
                    email,
                    telephone,
                    adresse,
                    role,
                    mot_de_passe,
                    date_naissance
                ) VALUES (
                    'Admin',
                    'System',
                    'admin@ejustice.com',
                    '+243000000000',
                    'Kinshasa, RDC',
                    'admin',
                    ?,
                    '1990-01-01 essfra2025!'
                )
            `, [hashedPassword]);

            console.log('Compte administrateur par défaut créé avec succès');
        } else {
            console.log('Le compte administrateur existe déjà');
        }
    } catch (error) {
        console.error('Erreur lors de la création du compte admin:', error);
        throw error;
    }
}

async function down() {
    try {
        await db.execute(`
            DELETE FROM utilisateurs 
            WHERE email = 'admin@ejustice.com' 
            AND role = 'admin'
        `);
        console.log('Compte administrateur par défaut supprimé');
    } catch (error) {
        console.error('Erreur lors de la suppression du compte admin:', error);
        throw error;
    }
}

module.exports = { up, down }; 