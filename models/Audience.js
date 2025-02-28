const db = require('../config/database');

class Audience {
    static async create(audienceData) {
        const {
            id_enquete,
            date_audience,
            lieu_audience,
            type_audience,
            notes_audience,
            personnes_convoquees  // Liste des personnes à convoquer
        } = audienceData;

        const connection = await db.getConnection();
        
        try {
            await connection.beginTransaction();

            // Créer l'audience
            const [result] = await connection.execute(`
                INSERT INTO audiences (
                    id_enquete,
                    date_audience,
                    lieu_audience,
                    type_audience,
                    notes_audience
                ) VALUES (?, ?, ?, ?, ?)
            `, [
                id_enquete,
                date_audience,
                lieu_audience,
                type_audience,
                notes_audience
            ]);

            const id_audience = result.insertId;

            // Ajouter les personnes à l'audience
            if (personnes_convoquees && personnes_convoquees.length > 0) {
                for (const personne of personnes_convoquees) {
                    await connection.execute(`
                        INSERT INTO personnes_audience (
                            id_audience,
                            nom,
                            prenom,
                            telephone,
                            email,
                            role
                        ) VALUES (?, ?, ?, ?, ?, ?)
                    `, [
                        id_audience,
                        personne.nom,
                        personne.prenom,
                        personne.telephone,
                        personne.email,
                        personne.role
                    ]);
                }
            }

            await connection.commit();
            return id_audience;

        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    static async rendreVerdict(verdictData) {
        const {
            id_audience,
            type_verdict,
            description_verdict,
            peine,
            date_execution,
            observations
        } = verdictData;

        const [result] = await db.execute(`
            INSERT INTO verdicts (
                id_audience,
                type_verdict,
                description_verdict,
                peine,
                date_execution,
                observations
            ) VALUES (?, ?, ?, ?, ?, ?)
        `, [
            id_audience,
            type_verdict,
            description_verdict,
            peine,
            date_execution,
            observations
        ]);

        // Mettre à jour le statut de l'audience
        await db.execute(`
            UPDATE audiences
            SET statut_audience = 'Terminée'
            WHERE id_audience = ?
        `, [id_audience]);

        return result.insertId;
    }

    static async findByEnquete(id_enquete) {
        const [audiences] = await db.execute(`
            SELECT 
                a.*,
                v.type_verdict,
                v.description_verdict,
                v.peine,
                v.date_verdict,
                v.observations as observations_verdict,
                COUNT(c.id_convocation) as nombre_convoques
            FROM audiences a
            LEFT JOIN verdicts v ON a.id_audience = v.id_audience
            LEFT JOIN convocations_audience c ON a.id_audience = c.id_audience
            WHERE a.id_enquete = ?
            GROUP BY a.id_audience
            ORDER BY a.date_audience DESC
        `, [id_enquete]);

        return audiences;
    }

    static async findById(id_audience) {
        const [audiences] = await db.execute(`
            SELECT 
                a.*,
                v.type_verdict,
                v.description_verdict,
                v.peine,
                v.date_verdict,
                v.observations as observations_verdict
            FROM audiences a
            LEFT JOIN verdicts v ON a.id_audience = v.id_audience
            WHERE a.id_audience = ?
        `, [id_audience]);

        if (audiences.length === 0) {
            return null;
        }

        // Récupérer les personnes convoquées
        const [personnes] = await db.execute(`
            SELECT id_personne_audience, nom, prenom, telephone, email, role, present
            FROM personnes_audience
            WHERE id_audience = ?
        `, [id_audience]);

        return {
            ...audiences[0],
            personnes_convoquees: personnes
        };
    }

    // ... autres méthodes (findById, update, delete, etc.)
}

module.exports = Audience; 