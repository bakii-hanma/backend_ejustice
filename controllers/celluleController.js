const Cellule = require('../models/Cellule');

const createCellule = async (req, res) => {
    try {
        const { nom_cellule, capacite, statut_cellule } = req.body;

        if (!nom_cellule || !capacite || !statut_cellule) {
            return res.status(400).json({
                message: 'Tous les champs sont requis',
                error: 'MISSING_FIELDS'
            });
        }

        const id_cellule = await Cellule.create({ nom_cellule, capacite, statut_cellule });
        res.status(201).json({
            message: 'Cellule créée avec succès',
            id_cellule
        });
    } catch (error) {
        console.error('Erreur lors de la création de la cellule:', error);
        res.status(500).json({
            message: 'Erreur lors de la création de la cellule',
            error: 'SERVER_ERROR'
        });
    }
};

const getAllCellules = async (req, res) => {
    try {
        const cellules = await Cellule.findAll();
        res.status(200).json({
            message: 'Cellules récupérées avec succès',
            cellules
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des cellules:', error);
        res.status(500).json({
            message: 'Erreur lors de la récupération des cellules',
            error: 'SERVER_ERROR'
        });
    }
};

const getCelluleById = async (req, res) => {
    try {
        const { id_cellule } = req.params;
        const cellule = await Cellule.findById(id_cellule);
        res.status(200).json({
            message: 'Cellule récupérée avec succès',
            cellule
        });
    } catch (error) {
        console.error('Erreur lors de la récupération de la cellule:', error);
        res.status(500).json({
            message: 'Erreur lors de la récupération de la cellule',
            error: 'SERVER_ERROR'
        });
    }
};

const updateCellule = async (req, res) => {
    try {
        const { id_cellule } = req.params;
        const { nom_cellule, capacite, statut_cellule } = req.body;

        if (!nom_cellule || !capacite || !statut_cellule) {
            return res.status(400).json({
                message: 'Tous les champs sont requis',
                error: 'MISSING_FIELDS'
            });
        }

        const updated = await Cellule.update(id_cellule, { nom_cellule, capacite, statut_cellule });
        if (updated) {
            res.status(200).json({
                message: 'Cellule mise à jour avec succès'
            });
        } else {
            res.status(404).json({
                message: 'Cellule non trouvée',
                error: 'CELLULE_NOT_FOUND'
            });
        }
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la cellule:', error);
        res.status(500).json({
            message: 'Erreur lors de la mise à jour de la cellule',
            error: 'SERVER_ERROR'
        });
    }
};

const deleteCellule = async (req, res) => {
    try {
        const { id_cellule } = req.params;
        const deleted = await Cellule.delete(id_cellule);
        if (deleted) {
            res.status(200).json({
                message: 'Cellule supprimée avec succès'
            });
        } else {
            res.status(404).json({
                message: 'Cellule non trouvée',
                error: 'CELLULE_NOT_FOUND'
            });
        }
    } catch (error) {
        console.error('Erreur lors de la suppression de la cellule:', error);
        res.status(500).json({
            message: 'Erreur lors de la suppression de la cellule',
            error: 'SERVER_ERROR'
        });
    }
};

// Ajoutez d'autres méthodes pour get, update, delete, etc.

module.exports = {
    createCellule,
    getAllCellules,
    getCelluleById,
    updateCellule,
    deleteCellule,
    // autres méthodes
}; 