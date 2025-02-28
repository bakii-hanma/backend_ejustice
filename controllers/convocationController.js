const Convocation = require('../models/Convocation');
const Interrogatoire = require('../models/Interrogatoire');

const createConvocation = async (req, res) => {
    try {
        const {
            id_enquete,
            id_interrogatoire,
            nom_personne,
            type_personne,
            contact_telephone,
            contact_email,
            contact_adresse,
            date_convocation,
            lieu,
            motif,
            reference_legale,
            mode_envoi,
            observations
        } = req.body;

        // Validation des champs requis
        if (!id_enquete || !nom_personne || !type_personne || !date_convocation || !lieu || !motif || !mode_envoi) {
            return res.status(400).json({
                message: 'Tous les champs obligatoires doivent être remplis',
                error: 'MISSING_FIELDS'
            });
        }

        const convocationData = {
            ...req.body,
            created_by: req.user.id_utilisateur
        };

        const id_convocation = await Convocation.create(convocationData);

        res.status(201).json({
            message: 'Convocation créée avec succès',
            id_convocation
        });

    } catch (error) {
        console.error('Erreur lors de la création de la convocation:', error);
        res.status(500).json({
            message: 'Erreur lors de la création de la convocation',
            error: 'SERVER_ERROR'
        });
    }
};

const getConvocationsByEnquete = async (req, res) => {
    try {
        const { id_enquete } = req.params;
        const convocations = await Convocation.findByEnquete(id_enquete);

        res.json({
            message: 'Convocations récupérées avec succès',
            convocations
        });

    } catch (error) {
        console.error('Erreur lors de la récupération des convocations:', error);
        res.status(500).json({
            message: 'Erreur lors de la récupération des convocations',
            error: 'SERVER_ERROR'
        });
    }
};

const updateConvocationStatus = async (req, res) => {
    try {
        const { id_convocation } = req.params;
        const { statut, date } = req.body;

        const success = await Convocation.updateStatus(id_convocation, statut, date);

        if (!success) {
            return res.status(404).json({
                message: 'Convocation non trouvée',
                error: 'CONVOCATION_NOT_FOUND'
            });
        }

        res.json({
            message: 'Statut de la convocation mis à jour avec succès'
        });

    } catch (error) {
        console.error('Erreur lors de la mise à jour du statut:', error);
        res.status(500).json({
            message: 'Erreur lors de la mise à jour du statut',
            error: 'SERVER_ERROR'
        });
    }
};

const addRelance = async (req, res) => {
    try {
        const { id_convocation } = req.params;
        const { type_relance, observations } = req.body;

        const id_relance = await Convocation.addRelance({
            id_convocation,
            type_relance,
            observations
        });

        res.status(201).json({
            message: 'Relance enregistrée avec succès',
            id_relance
        });

    } catch (error) {
        console.error('Erreur lors de l\'ajout de la relance:', error);
        res.status(500).json({
            message: 'Erreur lors de l\'ajout de la relance',
            error: 'SERVER_ERROR'
        });
    }
};

module.exports = {
    createConvocation,
    getConvocationsByEnquete,
    updateConvocationStatus,
    addRelance
}; 