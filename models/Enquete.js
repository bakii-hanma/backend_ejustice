const db = require('../config/database');
const EnqueteurSecondaire = require('./EnqueteurSecondaire');

class Enquete {
    static generateCode() {
        return Math.random().toString(36).substring(2, 8).toUpperCase();
    }

    static async create(enqueteData) {
        const {
            id_plainte,
            titre_enquete,
            description,
            id_enqueteur_principal,
            date_ouverture,
            statut_enquete,
            categorie_enquete,
            priorite,
            lieu_enquete,
            mandat,
            budget,
            date_cloture,
            observations
        } = enqueteData;

        const code_enquete = this.generateCode();

        const [result] = await db.execute(`
            INSERT INTO enquetes
            (id_plainte, titre_enquete, description, id_enqueteur_principal,
             date_ouverture, statut_enquete, categorie_enquete, priorite, lieu_enquete,
             mandat, budget, date_cloture, observations, code_enquete)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            id_plainte || null,
            titre_enquete,
            description,
            id_enqueteur_principal,
            date_ouverture,
            statut_enquete || 'Ouverte',
            categorie_enquete,
            priorite || 'Moyenne',
            lieu_enquete,
            mandat || null,
            budget || 0.00,
            date_cloture || null,
            observations || null,
            code_enquete
        ]);

        return { id: result.insertId, code: code_enquete };
    }

    static async findById(id_enquete) {
        const [rows] = await db.execute(`
            SELECT
                e.id_enquete,
                e.id_plainte,
                e.titre_enquete,
                e.description,
                e.id_enqueteur_principal,
                e.date_ouverture,
                e.statut_enquete,
                e.categorie_enquete,
                e.priorite,
                e.lieu_enquete,
                e.mandat,
                e.budget,
                e.date_cloture,
                e.observations,
                e.code_enquete,
                u.nom AS enqueteur_principal_nom,
                u.prenom AS enqueteur_principal_prenom,
                e.transferee_parquet
            FROM enquetes e
            LEFT JOIN utilisateurs u ON e.id_enqueteur_principal = u.id_utilisateur
            WHERE e.id_enquete = ?
        `, [id_enquete]);

        if (rows.length === 0) {
            return null;
        }

        const enquete = rows[0];
        const enqueteursSecondaires = await EnqueteurSecondaire.findByEnquete(id_enquete);

        return {
            ...enquete,
            enqueteurs_secondaires: enqueteursSecondaires,
            transferee_parquet: enquete.transferee_parquet === 'Oui'
        };
    }

    static async findAll() {
        const [rows] = await db.execute(`
            SELECT
                e.id_enquete,
                e.id_plainte,
                e.titre_enquete,
                e.description,
                e.id_enqueteur_principal,
                e.date_ouverture,
                e.statut_enquete,
                e.categorie_enquete,
                e.priorite,
                e.lieu_enquete,
                e.mandat,
                e.budget,
                e.date_cloture,
                e.observations,
                e.code_enquete,
                u.nom AS enqueteur_principal_nom,
                u.prenom AS enqueteur_principal_prenom,
                e.transferee_parquet
            FROM enquetes e
            LEFT JOIN utilisateurs u ON e.id_enqueteur_principal = u.id_utilisateur
            ORDER BY e.date_ouverture DESC
        `);

        const enquetes = await Promise.all(rows.map(async (enquete) => {
            const enqueteursSecondaires = await EnqueteurSecondaire.findByEnquete(enquete.id_enquete);
            return {
                ...enquete,
                enqueteurs_secondaires: enqueteursSecondaires,
                transferee_parquet: enquete.transferee_parquet === 'Oui'
            };
        }));

        return enquetes;
    }

    static async update(id_enquete, updateData) {
        const allowedFields = [
            'id_plainte',
            'titre_enquete',
            'description',
            'id_enqueteur_principal',
            'date_ouverture',
            'statut_enquete',
            'categorie_enquete',
            'priorite',
            'lieu_enquete',
            'mandat',
            'budget',
            'date_cloture',
            'observations',
            'transferee_parquet'
        ];
        const updates = [];
        const values = [];

        for (const key of Object.keys(updateData)) {
            if (allowedFields.includes(key)) {
                updates.push(`${key} = ?`);
                values.push(updateData[key]);
            }
        }

        if (updates.length === 0) {
            return false;
        }

        values.push(id_enquete);

        const [result] = await db.execute(`
            UPDATE enquetes
            SET ${updates.join(', ')}
            WHERE id_enquete = ?
        `, values);

        return result.affectedRows > 0;
    }

    static async delete(id_enquete) {
        const [result] = await db.execute(`
            DELETE FROM enquetes
            WHERE id_enquete = ?
        `, [id_enquete]);

        return result.affectedRows > 0;
    }

    static async prendreDecision(id_enquete, decisionData) {
        const {
            decision_magistrat,
            motif_decision,
            actions_requises
        } = decisionData;

        let statut_enquete;
        switch (decision_magistrat) {
            case 'OUVRIR_PROCEDURE':
                statut_enquete = 'En procès';
                break;
            case 'CLASSER_SANS_SUITE':
                statut_enquete = 'Classée sans suite';
                break;
            case 'COMPLEMENT_ENQUETE':
                statut_enquete = 'Complément requis';
                break;
            default:
                throw new Error('Décision invalide');
        }

        const [result] = await db.execute(`
            UPDATE enquetes
            SET 
                statut_enquete = ?,
                decision_magistrat = ?,
                date_decision = CURRENT_TIMESTAMP,
                motif_decision = ?,
                actions_requises = ?
            WHERE id_enquete = ?
        `, [
            statut_enquete,
            decision_magistrat,
            motif_decision,
            actions_requises || null,
            id_enquete
        ]);

        return result.affectedRows > 0;
    }
}

module.exports = Enquete; 