const Audience = require('../models/Audience');
const db = require('../config/database');

const planifierAudience = async (req, res) => {
    try {
        console.log('=== Début planification audience ===');
        console.log('Headers reçus:', req.headers);
        console.log('Body complet reçu:', JSON.stringify(req.body, null, 2));

        const {
            id_enquete,
            date_audience,
            lieu_audience,
            type_audience,
            notes_audience,
            personnes_convoquees
        } = req.body;

        console.log('Données extraites:');
        console.log('- id_enquete:', id_enquete);
        console.log('- date_audience:', date_audience);
        console.log('- lieu_audience:', lieu_audience);
        console.log('- type_audience:', type_audience);
        console.log('- notes_audience:', notes_audience);
        console.log('- personnes_convoquees:', JSON.stringify(personnes_convoquees, null, 2));

        // Validation des données
        if (!id_enquete || !date_audience || !lieu_audience || !type_audience) {
            console.log('❌ Validation échouée: champs obligatoires manquants');
            return res.status(400).json({
                message: 'Tous les champs obligatoires doivent être remplis',
                error: 'CHAMPS_MANQUANTS'
            });
        }

        // Validation des personnes convoquées
        if (!personnes_convoquees || !Array.isArray(personnes_convoquees) || personnes_convoquees.length === 0) {
            console.log('❌ Validation échouée: personnes_convoquees invalide');
            return res.status(400).json({
                message: 'Au moins une personne doit être convoquée',
                error: 'PERSONNES_REQUISES'
            });
        }

        // Vérifier que chaque personne a les champs requis
        for (const personne of personnes_convoquees) {
            console.log('Validation personne:', personne);
            if (!personne.nom || !personne.prenom || !personne.role) {
                console.log('❌ Validation échouée: données personne incomplètes');
                return res.status(400).json({
                    message: 'Nom, prénom et rôle sont requis pour chaque personne',
                    error: 'DONNEES_PERSONNE_INCOMPLETES'
                });
            }
        }

        console.log('✅ Validation réussie, création de l\'audience...');
        const id_audience = await Audience.create({
            id_enquete,
            date_audience,
            lieu_audience,
            type_audience,
            notes_audience,
            personnes_convoquees
        });

        console.log('✅ Audience créée avec ID:', id_audience);
        
        // Récupérer les détails de l'audience créée
        const audience = await Audience.findById(id_audience);
        console.log('Détails de l\'audience créée:', JSON.stringify(audience, null, 2));

        console.log('=== Fin planification audience ===');
        res.status(201).json({
            message: 'Audience planifiée avec succès',
            audience
        });

    } catch (error) {
        console.error('❌ Erreur lors de la planification de l\'audience:', error);
        console.error('Stack trace:', error.stack);
        res.status(500).json({
            message: 'Erreur lors de la planification de l\'audience',
            error: 'ERREUR_SERVEUR'
        });
    }
};

const rendreVerdict = async (req, res) => {
    try {
        const { id_audience } = req.params;
        const {
            type_verdict,
            description_verdict,
            peine,
            date_execution,
            observations
        } = req.body;

        // Validation des données
        if (!type_verdict || !description_verdict) {
            return res.status(400).json({
                message: 'Le type et la description du verdict sont requis',
                error: 'CHAMPS_MANQUANTS'
            });
        }

        // Si verdict = coupable, la peine est obligatoire
        if (type_verdict === 'Coupable' && !peine) {
            return res.status(400).json({
                message: 'La peine est requise pour un verdict de culpabilité',
                error: 'PEINE_MANQUANTE'
            });
        }

        const id_verdict = await Audience.rendreVerdict({
            id_audience,
            type_verdict,
            description_verdict,
            peine,
            date_execution,
            observations
        });

        res.json({
            message: 'Verdict rendu avec succès',
            id_verdict
        });

    } catch (error) {
        console.error('Erreur lors de l\'enregistrement du verdict:', error);
        res.status(500).json({
            message: 'Erreur lors de l\'enregistrement du verdict',
            error: 'ERREUR_SERVEUR'
        });
    }
};

const getAudiencesByEnquete = async (req, res) => {
    try {
        const { id_enquete } = req.params;

        const audiences = await Audience.findByEnquete(id_enquete);

        // Pour chaque audience, récupérer les personnes convoquées
        const audiencesAvecPersonnes = await Promise.all(audiences.map(async (audience) => {
            const [personnes] = await db.execute(`
                SELECT id_personne_audience, nom, prenom, telephone, email, role, present
                FROM personnes_audience
                WHERE id_audience = ?
            `, [audience.id_audience]);

            return {
                ...audience,
                personnes_convoquees: personnes
            };
        }));

        res.json({
            message: 'Audiences récupérées avec succès',
            audiences: audiencesAvecPersonnes
        });

    } catch (error) {
        console.error('Erreur lors de la récupération des audiences:', error);
        res.status(500).json({
            message: 'Erreur lors de la récupération des audiences',
            error: 'ERREUR_SERVEUR'
        });
    }
};

const getVerdict = async (req, res) => {
    try {
        const { id_audience } = req.params;

        const [verdict] = await db.execute(`
            SELECT 
                v.*,
                a.date_audience,
                a.lieu_audience,
                a.type_audience,
                e.titre_enquete,
                e.code_enquete
            FROM verdicts v
            JOIN audiences a ON v.id_audience = a.id_audience
            JOIN enquetes e ON a.id_enquete = e.id_enquete
            WHERE v.id_audience = ?
        `, [id_audience]);

        if (!verdict) {
            return res.status(404).json({
                message: 'Aucun verdict trouvé pour cette audience',
                error: 'VERDICT_NOT_FOUND'
            });
        }

        res.json({
            message: 'Verdict récupéré avec succès',
            verdict
        });

    } catch (error) {
        console.error('Erreur lors de la récupération du verdict:', error);
        res.status(500).json({
            message: 'Erreur lors de la récupération du verdict',
            error: 'ERREUR_SERVEUR'
        });
    }
};

module.exports = {
    planifierAudience,
    rendreVerdict,
    getAudiencesByEnquete,
    getVerdict
}; 