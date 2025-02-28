const DecisionMagistrat = require('../models/DecisionMagistrat');
const Enquete = require('../models/Enquete');

const createDecision = async (req, res) => {
    try {
        const {
            id_enquete,
            type_decision,
            motif,
            instructions,
            date_audience,
            observations
        } = req.body;

        // Vérification des champs requis
        if (!id_enquete || !type_decision || !motif) {
            return res.status(400).json({
                message: 'Certains champs obligatoires sont manquants',
                error: 'MISSING_FIELDS'
            });
        }

        // Vérifier que l'utilisateur est bien un magistrat
        if (req.user.role !== 'magistrat') {
            return res.status(403).json({
                message: 'Seuls les magistrats peuvent créer des décisions',
                error: 'FORBIDDEN_ACCESS'
            });
        }

        const newId = await DecisionMagistrat.create({
            id_enquete,
            id_magistrat: req.user.userId,
            type_decision,
            motif,
            instructions,
            date_audience,
            observations
        });

        // Mettre à jour le statut de l'enquête si nécessaire
        if (type_decision === 'Classement sans suite') {
            await Enquete.update(id_enquete, { statut_enquete: 'Clôturée' });
        }

        const decision = await DecisionMagistrat.findById(newId);

        res.status(201).json({
            message: 'Décision créée avec succès',
            decision
        });
    } catch (error) {
        console.error('Erreur lors de la création de la décision:', error);
        res.status(500).json({
            message: 'Erreur lors de la création de la décision',
            error: 'SERVER_ERROR'
        });
    }
};

const prendreDecision = async (req, res) => {
    try {
        const { id_enquete } = req.params;
        const {
            decision_magistrat,
            motif_decision,
            actions_requises
        } = req.body;

        // Vérification des champs requis
        if (!decision_magistrat || !motif_decision) {
            return res.status(400).json({
                message: 'La décision et le motif sont requis',
                error: 'MISSING_FIELDS'
            });
        }

        // Vérifier que la décision est valide
        const decisions_valides = ['OUVRIR_PROCEDURE', 'CLASSER_SANS_SUITE', 'COMPLEMENT_ENQUETE'];
        if (!decisions_valides.includes(decision_magistrat)) {
            return res.status(400).json({
                message: 'Décision invalide',
                error: 'INVALID_DECISION'
            });
        }

        // Si c'est un complément d'enquête, les actions requises sont obligatoires
        if (decision_magistrat === 'COMPLEMENT_ENQUETE' && !actions_requises) {
            return res.status(400).json({
                message: 'Les actions requises sont nécessaires pour un complément d\'enquête',
                error: 'MISSING_ACTIONS'
            });
        }

        const success = await Enquete.prendreDecision(id_enquete, {
            decision_magistrat,
            motif_decision,
            actions_requises
        });

        if (!success) {
            return res.status(404).json({
                message: 'Enquête non trouvée',
                error: 'ENQUETE_NOT_FOUND'
            });
        }

        // Récupérer l'enquête mise à jour
        const enquete = await Enquete.findById(id_enquete);

        res.json({
            message: 'Décision enregistrée avec succès',
            enquete
        });

    } catch (error) {
        console.error('Erreur lors de la prise de décision:', error);
        res.status(500).json({
            message: 'Erreur lors de la prise de décision',
            error: 'SERVER_ERROR'
        });
    }
};

// ... autres méthodes du contrôleur (getById, update, delete, etc.)

module.exports = {
    createDecision,
    prendreDecision,
    // ... autres méthodes exportées
}; 