const db = require('../config/database');
const bcrypt = require('bcrypt');

class User {
    static async findByEmail(email) {
        const [users] = await db.execute(`
            SELECT 
                id_utilisateur,
                nom,
                prenom,
                email,
                telephone,
                adresse,
                date_naissance,
                role,
                mot_de_passe,
                numero_citoyen,
                juridiction,
                fonction_magistrat,
                date_prise_fonction,
                statut_magistrat,
                id_parquet
            FROM utilisateurs 
            WHERE email = ?
        `, [email]);
        
        return users[0];
    }

    static async create(userData) {
        const {
            nom,
            prenom,
            email,
            telephone,
            adresse,
            date_naissance,
            role,
            mot_de_passe,
            numero_citoyen
        } = userData;

        const [result] = await db.execute(
            `INSERT INTO utilisateurs 
            (nom, prenom, email, telephone, adresse, date_naissance, role, mot_de_passe, numero_citoyen) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                nom,
                prenom,
                email,
                telephone || null,
                adresse || null,
                date_naissance || null,
                role,
                mot_de_passe,
                numero_citoyen
            ]
        );

        return result.insertId;
    }

    static async findByCitizenNumber(numero_citoyen) {
        const [users] = await db.execute(
            'SELECT * FROM utilisateurs WHERE numero_citoyen = ?',
            [numero_citoyen]
        );
        return users[0];
    }

    static async findByRole(role) {
        const [users] = await db.execute('SELECT * FROM utilisateurs WHERE role = ?', [role]);
        return users;
    }

    static async createUser(userData) {
        const {
            nom,
            prenom,
            email,
            telephone,
            adresse,
            date_naissance,
            role,
            mot_de_passe,
            numero_citoyen,
            // Champs spécifiques aux magistrats
            juridiction,
            fonction_magistrat,
            date_prise_fonction,
            id_parquet,
            is_active
        } = userData;

        // Vérifier si c'est un magistrat et si l'id_parquet est fourni
        if (role === 'magistrat' && !id_parquet) {
            throw new Error('ID_PARQUET_REQUIRED');
        }

        const [result] = await db.execute(`
            INSERT INTO utilisateurs (
                nom, 
                prenom, 
                email, 
                telephone, 
                adresse, 
                date_naissance, 
                role, 
                mot_de_passe, 
                numero_citoyen,
                juridiction,
                fonction_magistrat,
                date_prise_fonction,
                id_parquet,
                statut_magistrat
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            nom,
            prenom,
            email,
            telephone || null,
            adresse || null,
            date_naissance || null,
            role,
            mot_de_passe,
            numero_citoyen || null,
            juridiction || null,
            fonction_magistrat || null,
            date_prise_fonction || null,
            role === 'magistrat' ? id_parquet : null,
            role === 'magistrat' ? (is_active ? 'Actif' : 'Inactif') : null
        ]);

        return result.insertId;
    }

    static async findById(id) {
        const [users] = await db.execute(`
            SELECT 
                id_utilisateur,
                nom,
                prenom,
                email,
                role,
                id_parquet,
                juridiction,
                fonction_magistrat,
                statut_magistrat
            FROM utilisateurs 
            WHERE id_utilisateur = ?
        `, [id]);
        return users[0];
    }

    static async updateUser(id_utilisateur, updateData) {
        const allowedFields = [
            'nom',
            'prenom',
            'email',
            'telephone',
            'adresse',
            'date_naissance',
            'role',
            'specialite',
            'juridiction',
            'fonction_magistrat',
            'date_prise_fonction',
            'is_active'  // Pour gérer le statut du magistrat
        ];

        const updates = [];
        const values = [];

        // Traitement spécial pour is_active (conversion en statut_magistrat)
        if (updateData.hasOwnProperty('is_active')) {
            updates.push('statut_magistrat = ?');
            values.push(updateData.is_active ? 'Actif' : 'Inactif');
            delete updateData.is_active;
        }

        // Traitement des autres champs
        for (const [key, value] of Object.entries(updateData)) {
            if (allowedFields.includes(key)) {
                updates.push(`${key} = ?`);
                values.push(value === '' ? null : value); // Convertir les chaînes vides en NULL
            }
        }

        if (updates.length === 0) return false;

        values.push(id_utilisateur);

        const [result] = await db.execute(`
            UPDATE utilisateurs
            SET ${updates.join(', ')}
            WHERE id_utilisateur = ?
        `, values);

        if (result.affectedRows > 0) {
            // Récupérer l'utilisateur mis à jour
            const updatedUser = await this.findById(id_utilisateur);
            // Convertir statut_magistrat en is_active pour le frontend
            return {
                ...updatedUser,
                is_active: updatedUser.statut_magistrat === 'Actif'
            };
        }

        return false;
    }

    static async resetPassword(id_utilisateur, newPassword) {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        const [result] = await db.execute(`
            UPDATE utilisateurs
            SET mot_de_passe = ?
            WHERE id_utilisateur = ?
        `, [hashedPassword, id_utilisateur]);

        return result.affectedRows > 0;
    }

    static async deleteUser(id_utilisateur) {
        const [result] = await db.execute(
            'DELETE FROM utilisateurs WHERE id_utilisateur = ?',
            [id_utilisateur]
        );
        return result.affectedRows > 0;
    }

    static async getAllUsers() {
        const [users] = await db.execute(`
            SELECT 
                id_utilisateur,
                nom,
                prenom,
                email,
                telephone,
                adresse,
                date_naissance,
                role,
                numero_citoyen,
                specialite,
                juridiction,
                fonction_magistrat,
                date_prise_fonction,
                statut_magistrat,
                created_at,
                updated_at
            FROM utilisateurs
            ORDER BY created_at DESC
        `);
        
        // Convertir statut_magistrat en is_active pour le frontend
        return users.map(user => ({
            ...user,
            is_active: user.statut_magistrat === 'Actif'
        }));
    }

    static async getEnquetesTransmisesByMagistrat(id_parquet) {
        console.log(`Exécution de la requête pour le parquet ${id_parquet}`);
        
        // 1. Récupérer les enquêtes avec tous les détails nécessaires
        const [enquetes] = await db.execute(`
            SELECT 
                e.id_enquete,
                e.titre_enquete,
                e.description,
                e.statut_enquete,
                e.code_enquete,
                e.categorie_enquete,
                e.priorite,
                e.id_enqueteur_principal,
                e.date_ouverture,
                e.lieu_enquete,
                e.mandat,
                e.budget,
                e.date_cloture,
                e.observations,
                tp.id_transmission,
                tp.date_transmission,
                tp.etat_dossier,
                tp.rapport_final,
                u.nom AS enqueteur_principal_nom,
                u.prenom AS enqueteur_principal_prenom,
                p.nom_parquet
            FROM enquetes e
            JOIN transmissions_parquet tp ON e.id_enquete = tp.id_enquete
            LEFT JOIN utilisateurs u ON e.id_enqueteur_principal = u.id_utilisateur
            LEFT JOIN parquet p ON tp.id_parquet = p.id_parquet
            WHERE tp.id_parquet = ?
            ORDER BY tp.date_transmission DESC
        `, [id_parquet]);

        // 2. Pour chaque enquête, récupérer ses preuves et interrogatoires
        for (let enquete of enquetes) {
            // Récupérer les preuves
            const [preuves] = await db.execute(`
                SELECT 
                    p.id_preuve,
                    p.type_preuve,
                    p.description,
                    p.date_recolte,
                    p.lieu_recolte,
                    p.statut_preuve,
                    p.observations,
                    p.fichier_preuve,
                    GROUP_CONCAT(
                        JSON_OBJECT(
                            'id_document', dp.id_document,
                            'nom_fichier', dp.nom_fichier,
                            'chemin_fichier', dp.chemin_fichier,
                            'type_document', dp.type_document
                        )
                    ) AS documents
                FROM preuves p
                LEFT JOIN documents_preuve dp ON p.id_preuve = dp.id_preuve
                WHERE p.id_enquete = ?
                GROUP BY p.id_preuve
            `, [enquete.id_enquete]);

            // Récupérer les interrogatoires
            const [interrogatoires] = await db.execute(`
                SELECT 
                    i.id_interrogatoire,
                    i.id_enquete,
                    i.type_personne,
                    i.nom_personne,
                    i.numero_document_identite,
                    i.contact_personne,
                    i.date_interrogatoire,
                    i.lieu_interrogatoire,
                    i.objet_interrogatoire,
                    i.statut_interrogatoire,
                    i.notes_preparatoires,
                    i.documents_associes,
                    i.observations_post_interrogatoire,
                    e.titre_enquete AS enquete_titre,
                    u.nom AS enqueteur_principal_nom,
                    u.prenom AS enqueteur_principal_prenom
                FROM interrogatoires i
                LEFT JOIN enquetes e ON i.id_enquete = e.id_enquete
                LEFT JOIN utilisateurs u ON e.id_enqueteur_principal = u.id_utilisateur
                WHERE i.id_enquete = ?
                ORDER BY i.date_interrogatoire DESC
            `, [enquete.id_enquete]);

            // Ajouter les preuves et interrogatoires à l'enquête
            enquete.preuves = preuves.map(preuve => ({
                ...preuve,
                documents: preuve.documents ? JSON.parse(`[${preuve.documents}]`) : []
            }));
            enquete.interrogatoires = interrogatoires;
            
            // Ajouter les compteurs
            enquete.nombre_preuves = preuves.length;
            enquete.nombre_interrogatoires = interrogatoires.length;
        }

        console.log(`${enquetes.length} enquêtes trouvées avec leurs preuves et interrogatoires`);
        return enquetes;
    }

    static async updateEnqueteStatus(id_enquete, nouveau_statut) {
        const [result] = await db.execute(`
            UPDATE enquetes
            SET statut_enquete = ?,
                updated_at = CURRENT_TIMESTAMP
            WHERE id_enquete = ?
        `, [nouveau_statut, id_enquete]);

        return result.affectedRows > 0;
    }

    static async planifierAudience(audienceData) {
        const {
            id_decision,
            date_audience,
            lieu_audience,
            observations
        } = audienceData;

        const [result] = await db.execute(`
            UPDATE decisions_magistrat
            SET 
                date_audience = ?,
                lieu_audience = ?,
                observations = ?,
                statut_decision = 'En cours',
                updated_at = CURRENT_TIMESTAMP
            WHERE id_decision = ?
        `, [date_audience, lieu_audience, observations, id_decision]);

        return result.affectedRows > 0;
    }

    static async getAudiencesByMagistrat(id_magistrat) {
        const [audiences] = await db.execute(`
            SELECT 
                d.id_decision,
                d.date_audience,
                d.lieu_audience,
                d.observations,
                d.statut_decision,
                e.titre_enquete,
                e.code_enquete
            FROM decisions_magistrat d
            JOIN enquetes e ON d.id_enquete = e.id_enquete
            WHERE d.id_magistrat = ?
                AND d.date_audience IS NOT NULL
            ORDER BY d.date_audience ASC
        `, [id_magistrat]);

        return audiences;
    }

    static async updateAudienceStatus(id_decision, nouveau_statut) {
        const [result] = await db.execute(`
            UPDATE decisions_magistrat
            SET 
                statut_decision = ?,
                updated_at = CURRENT_TIMESTAMP
            WHERE id_decision = ?
        `, [nouveau_statut, id_decision]);

        return result.affectedRows > 0;
    }
}

module.exports = User; 