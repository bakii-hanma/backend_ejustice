const Peine = require('../models/Peine');

const createPeine = async (req, res) => {
    try {
        const peineData = req.body;
        const id_peine = await Peine.create(peineData);

        res.status(201).json({
            message: 'Peine créée avec succès',
            id_peine
        });
    } catch (error) {
        console.error('Erreur lors de la création de la peine:', error);
        
        if (error.message === 'DETENU_NOT_FOUND') {
            return res.status(404).json({
                message: 'Détenu non trouvé',
                error: 'DETENU_NOT_FOUND'
            });
        }

        res.status(500).json({
            message: 'Erreur lors de la création de la peine',
            error: 'SERVER_ERROR'
        });
    }
};

const updatePeine = async (req, res) => {
    try {
        const { id_peine } = req.params;
        const peineData = req.body;

        const updated = await Peine.update(id_peine, peineData);

        if (!updated) {
            return res.status(404).json({
                message: 'Peine non trouvée',
                error: 'PEINE_NOT_FOUND'
            });
        }

        res.json({
            message: 'Peine mise à jour avec succès'
        });
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la peine:', error);
        res.status(500).json({
            message: 'Erreur lors de la mise à jour de la peine',
            error: 'SERVER_ERROR'
        });
    }
};

const deletePeine = async (req, res) => {
    try {
        const { id_peine } = req.params;
        const deleted = await Peine.delete(id_peine);

        if (!deleted) {
            return res.status(404).json({
                message: 'Peine non trouvée',
                error: 'PEINE_NOT_FOUND'
            });
        }

        res.json({
            message: 'Peine supprimée avec succès'
        });
    } catch (error) {
        console.error('Erreur lors de la suppression de la peine:', error);
        res.status(500).json({
            message: 'Erreur lors de la suppression de la peine',
            error: 'SERVER_ERROR'
        });
    }
};

const getPeineById = async (req, res) => {
    try {
        const { id_peine } = req.params;
        const peine = await Peine.findById(id_peine);

        res.json(peine);
    } catch (error) {
        console.error('Erreur lors de la récupération de la peine:', error);
        
        if (error.message === 'PEINE_NOT_FOUND') {
            return res.status(404).json({
                message: 'Peine non trouvée',
                error: 'PEINE_NOT_FOUND'
            });
        }

        res.status(500).json({
            message: 'Erreur lors de la récupération de la peine',
            error: 'SERVER_ERROR'
        });
    }
};

const getAllPeines = async (req, res) => {
    try {
        const peines = await Peine.findAll();
        res.json(peines);
    } catch (error) {
        console.error('Erreur lors de la récupération des peines:', error);
        res.status(500).json({
            message: 'Erreur lors de la récupération des peines',
            error: 'SERVER_ERROR'
        });
    }
};

const getPeinesByDetenu = async (req, res) => {
    try {
        const { id_detenu } = req.params;
        const peines = await Peine.findByDetenu(id_detenu);
        res.json(peines);
    } catch (error) {
        console.error('Erreur lors de la récupération des peines du détenu:', error);
        res.status(500).json({
            message: 'Erreur lors de la récupération des peines du détenu',
            error: 'SERVER_ERROR'
        });
    }
};

module.exports = {
    createPeine,
    updatePeine,
    deletePeine,
    getPeineById,
    getAllPeines,
    getPeinesByDetenu
}; 