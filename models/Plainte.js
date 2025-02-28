const db = require('../config/database');
const DocumentPlainte = require('./DocumentPlainte');

class Plainte {
    static async create(plainteData) {
        const {
            id_utilisateur,
            lieu,
            description,
            categorie_infraction,
            fichier_plainte
        } = plainteData;

        // Générer un numéro de dossier unique
        let numero_dossier;
        let isUnique = false;
        
        while (!isUnique) {
            numero_dossier = this.generateNumeroDossier();
            // Vérifier si le numéro existe déjà
            const [existing] = await db.execute(
                'SELECT id_plainte FROM plaintes WHERE numero_dossier = ?',
                [numero_dossier]
            );
            if (existing.length === 0) {
                isUnique = true;
            }
        }

        const [result] = await db.execute(`
            INSERT INTO plaintes (
                id_utilisateur,
                date_depot,
                lieu,
                description,
                categorie_infraction,
                fichier_plainte,
                numero_dossier
            ) VALUES (?, CURRENT_DATE(), ?, ?, ?, ?, ?)
        `, [id_utilisateur, lieu, description, categorie_infraction, fichier_plainte, numero_dossier]);

        return {
            id: result.insertId,
            numero_dossier,
            ...plainteData
        };
    }

    static async update(id_plainte, updateData) {
        const allowedFields = ['lieu', 'description', 'categorie_infraction', 'statut'];
        const updates = [];
        const values = [];

        Object.keys(updateData).forEach(key => {
            if (allowedFields.includes(key)) {
                updates.push(`${key} = ?`);
                values.push(updateData[key]);
            }
        });

        if (updates.length === 0) return false;

        values.push(id_plainte);

        const [result] = await db.execute(
            `UPDATE plaintes SET ${updates.join(', ')} WHERE id_plainte = ?`,
            values
        );

        return result.affectedRows > 0;
    }

    static async delete(id_plainte, id_utilisateur) {
        const [result] = await db.execute(
            'DELETE FROM plaintes WHERE id_plainte = ? AND id_utilisateur = ?',
            [id_plainte, id_utilisateur]
        );

        return result.affectedRows > 0;
    }

    static async findById(id_plainte) {
        const [plaintes] = await db.execute(`
            SELECT 
                p.*,
                u.nom AS nom_utilisateur,
                u.prenom AS prenom_utilisateur,
                u.email AS email_utilisateur,
                u.telephone AS telephone_utilisateur,
                u.numero_citoyen AS numero_citoyen_utilisateur
            FROM plaintes p
            JOIN utilisateurs u ON p.id_utilisateur = u.id_utilisateur
            WHERE p.id_plainte = ?
        `, [id_plainte]);

        if (plaintes.length === 0) {
            return null;
        }

        const plainte = plaintes[0];
        
        // Récupérer les documents associés
        const documents = await DocumentPlainte.findByPlainte(id_plainte);
        
        return {
            id_plainte: plainte.id_plainte,
            id_utilisateur: plainte.id_utilisateur,
            date_depot: plainte.date_depot,
            lieu: plainte.lieu,
            description: plainte.description,
            categorie_infraction: plainte.categorie_infraction,
            statut: plainte.statut,
            id_enqueteur: plainte.id_enqueteur,
            numero_dossier: plainte.numero_dossier,
            motif_rejet: plainte.motif_rejet,
            created_at: plainte.created_at,
            updated_at: plainte.updated_at,
            deposeur: {
                nom: plainte.nom_utilisateur,
                prenom: plainte.prenom_utilisateur,
                email: plainte.email_utilisateur,
                telephone: plainte.telephone_utilisateur,
                numero_citoyen: plainte.numero_citoyen_utilisateur
            },
            documents: documents
        };
    }

    static async findByUser(id_utilisateur) {
        const [plaintes] = await db.execute(
            `SELECT 
                p.*,
                p.statut,
                p.categorie_infraction,
                p.description
            FROM plaintes p
            WHERE p.id_utilisateur = ? 
            ORDER BY p.date_depot DESC`,
            [id_utilisateur]
        );
        return plaintes;
    }

    static async findByIdWithDetails(id_plainte) {
        const [plaintes] = await db.execute(`
            SELECT 
                p.*,
                u.nom,
                u.prenom,
                u.email,
                u.telephone,
                u.numero_citoyen
            FROM plaintes p
            JOIN utilisateurs u ON p.id_utilisateur = u.id_utilisateur
            WHERE p.id_plainte = ?
        `, [id_plainte]);

        if (plaintes.length === 0) return null;

        const plainte = plaintes[0];
        
        // Récupérer les documents associés
        const documents = await DocumentPlainte.findByPlainte(id_plainte);
        
        return {
            id_plainte: plainte.id_plainte,
            id_utilisateur: plainte.id_utilisateur,
            date_depot: plainte.date_depot,
            lieu: plainte.lieu,
            description: plainte.description,
            categorie_infraction: plainte.categorie_infraction,
            statut: plainte.statut,
            id_enqueteur: plainte.id_enqueteur,
            numero_dossier: plainte.numero_dossier,
            motif_rejet: plainte.motif_rejet,
            fichier_plainte: plainte.fichier_plainte,
            created_at: plainte.created_at,
            updated_at: plainte.updated_at,
            deposeur: {
                nom: plainte.nom,
                prenom: plainte.prenom,
                email: plainte.email,
                telephone: plainte.telephone,
                numero_citoyen: plainte.numero_citoyen
            },
            documents: documents
        };
    }

    static async findAll() {
        const [plaintes] = await db.execute(`
            SELECT 
                p.*,
                u.nom       AS nom_utilisateur,
                u.prenom    AS prenom_utilisateur,
                u.email     AS email_utilisateur,
                u.telephone AS telephone_utilisateur,
                u.numero_citoyen AS numero_citoyen_utilisateur
            FROM plaintes p
            JOIN utilisateurs u ON p.id_utilisateur = u.id_utilisateur
            ORDER BY p.date_depot DESC
        `);

        // Pour chaque plainte, récupérer ses documents
        const plaintesAvecDocuments = await Promise.all(plaintes.map(async (plainte) => {
            const documents = await DocumentPlainte.findByPlainte(plainte.id_plainte);
            return {
                ...plainte,
                documents: documents,
                deposeur: {
                    nom: plainte.nom_utilisateur,
                    prenom: plainte.prenom_utilisateur,
                    email: plainte.email_utilisateur,
                    telephone: plainte.telephone_utilisateur,
                    numero_citoyen: plainte.numero_citoyen_utilisateur
                }
            };
        }));

        return plaintesAvecDocuments;
    }

    static async validerPlainte(id_plainte, id_enqueteur) {
        const [result] = await db.execute(`
            UPDATE plaintes 
            SET 
                statut = 'Validée',
                id_enqueteur = ?,
                updated_at = CURRENT_TIMESTAMP
            WHERE id_plainte = ?
        `, [id_enqueteur, id_plainte]);

        return result.affectedRows > 0;
    }

    static async rejeterPlainte(id_plainte, motif_rejet) {
        const [result] = await db.execute(`
            UPDATE plaintes 
            SET 
                statut = 'Rejetée',
                motif_rejet = ?,
                updated_at = CURRENT_TIMESTAMP
            WHERE id_plainte = ?
        `, [motif_rejet, id_plainte]);

        return result.affectedRows > 0;
    }

    static generateNumeroDossier() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let numero = '';
        for (let i = 0; i < 6; i++) {
            numero += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return numero;
    }

    static async rechercheAvancee(criteres) {
        try {
            let query = `
                SELECT 
                    p.*,
                    u.nom AS nom_utilisateur,
                    u.prenom AS prenom_utilisateur,
                    u.email AS email_utilisateur,
                    u.telephone AS telephone_utilisateur,
                    u.numero_citoyen AS numero_citoyen_utilisateur
                FROM plaintes p
                JOIN utilisateurs u ON p.id_utilisateur = u.id_utilisateur
                WHERE 1=1
            `;
            
            const params = [];

            // Recherche par numéro de dossier
            if (criteres.numero_dossier) {
                query += ` AND p.numero_dossier LIKE ?`;
                params.push(`%${criteres.numero_dossier}%`);
            }

            // Recherche par nom/prénom du plaignant
            if (criteres.nom_plaignant) {
                query += ` AND (u.nom LIKE ? OR u.prenom LIKE ?)`;
                params.push(`%${criteres.nom_plaignant}%`, `%${criteres.nom_plaignant}%`);
            }

            // Recherche par période de dépôt
            if (criteres.date_debut && criteres.date_fin) {
                query += ` AND p.date_depot BETWEEN ? AND ?`;
                params.push(criteres.date_debut, criteres.date_fin);
            }

            // Recherche par statut
            if (criteres.statut) {
                query += ` AND p.statut = ?`;
                params.push(criteres.statut);
            }

            // Recherche par catégorie d'infraction
            if (criteres.categorie_infraction) {
                query += ` AND p.categorie_infraction = ?`;
                params.push(criteres.categorie_infraction);
            }

            // Recherche par lieu
            if (criteres.lieu) {
                query += ` AND p.lieu LIKE ?`;
                params.push(`%${criteres.lieu}%`);
            }

            // Recherche textuelle dans la description
            if (criteres.description) {
                query += ` AND p.description LIKE ?`;
                params.push(`%${criteres.description}%`);
            }

            // Compter le nombre total de résultats sans la pagination
            const countQuery = query.replace('SELECT p.*, u.nom', 'SELECT COUNT(*) as total');
            const [totalRows] = await db.execute(countQuery, params);
            const total = totalRows[0].total;

            // Tri des résultats
            const ordre = criteres.ordre || 'DESC';
            const tri = criteres.tri || 'date_depot';
            query += ` ORDER BY p.${tri} ${ordre}`;

            // Pagination
            if (criteres.page && criteres.limite) {
                const offset = (criteres.page - 1) * criteres.limite;
                query += ` LIMIT ? OFFSET ?`;
                params.push(parseInt(criteres.limite), offset);
            }

            const [plaintes] = await db.execute(query, params);

            // Récupérer les documents pour chaque plainte
            const plaintesAvecDocuments = await Promise.all(plaintes.map(async (plainte) => {
                const documents = await DocumentPlainte.findByPlainte(plainte.id_plainte);
                return {
                    ...plainte,
                    documents,
                    deposeur: {
                        nom: plainte.nom_utilisateur,
                        prenom: plainte.prenom_utilisateur,
                        email: plainte.email_utilisateur,
                        telephone: plainte.telephone_utilisateur,
                        numero_citoyen: plainte.numero_citoyen_utilisateur
                    }
                };
            }));

            return {
                total,
                plaintes: plaintesAvecDocuments
            };
        } catch (error) {
            console.error('Erreur dans rechercheAvancee:', error);
            throw error;
        }
    }

    static async annulerPlainte(id_plainte, motif_annulation) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            // Vérifier si la plainte existe
            const [plainte] = await connection.execute(
                'SELECT * FROM plaintes WHERE id_plainte = ?',
                [id_plainte]
            );

            if (plainte.length === 0) {
                throw new Error('PLAINTE_NOT_FOUND');
            }

            // Vérifier si la plainte n'est pas déjà annulée
            if (plainte[0].statut === 'Annulée') {
                throw new Error('PLAINTE_ALREADY_CANCELLED');
            }

            // Mettre à jour le statut de la plainte
            const [result] = await connection.execute(`
                UPDATE plaintes 
                SET 
                    statut = 'Annulée',
                    motif_annulation = ?,
                    date_annulation = NOW()
                WHERE id_plainte = ?
            `, [motif_annulation, id_plainte]);

            // Si une enquête est associée, la clôturer
            if (plainte[0].id_enquete) {
                await connection.execute(`
                    UPDATE enquetes
                    SET 
                        statut = 'Clôturée',
                        motif_cloture = 'Plainte annulée',
                        date_cloture = NOW()
                    WHERE id_enquete = ?
                `, [plainte[0].id_enquete]);
            }

            await connection.commit();
            return result.affectedRows > 0;

        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }
}

module.exports = Plainte; 