const Parquet = require('../models/Parquet');

const createParquet = async (req, res) => {
    try {
        const { nom_parquet, adresse, contact, email } = req.body;

        if (!nom_parquet || !adresse) {
            return res.status(400).json({
                message: 'Le nom et l\'adresse du parquet sont obligatoires',
                error: 'MISSING_REQUIRED_FIELDS'
            });
        }

        const newId = await Parquet.create({
            nom_parquet,
            adresse,
            contact,
            email
        });

        const parquet = await Parquet.findById(newId);

        res.status(201).json({
            message: 'Parquet créé avec succès',
            parquet
        });
    } catch (error) {
        console.error('Erreur lors de la création du parquet:', error);
        res.status(500).json({
            message: 'Erreur lors de la création du parquet',
            error: 'SERVER_ERROR'
        });
    }
};

const getParquetById = async (req, res) => {
    try {
        const { id_parquet } = req.params;
        const parquet = await Parquet.findById(id_parquet);

        if (!parquet) {
            return res.status(404).json({
                message: 'Parquet non trouvé',
                error: 'PARQUET_NOT_FOUND'
            });
        }

        res.json({
            message: 'Parquet récupéré avec succès',
            parquet
        });
    } catch (error) {
        console.error('Erreur lors de la récupération du parquet:', error);
        res.status(500).json({
            message: 'Erreur lors de la récupération du parquet',
            error: 'SERVER_ERROR'
        });
    }
};

const getAllParquets = async (req, res) => {
    try {
        const parquets = await Parquet.findAll();
        res.json({
            message: 'Liste des parquets récupérée avec succès',
            parquets
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des parquets:', error);
        res.status(500).json({
            message: 'Erreur lors de la récupération des parquets',
            error: 'SERVER_ERROR'
        });
    }
};

const updateParquet = async (req, res) => {
    try {
        const { id_parquet } = req.params;
        const success = await Parquet.update(id_parquet, req.body);

        if (!success) {
            return res.status(404).json({
                message: 'Parquet non trouvé ou aucune modification effectuée',
                error: 'PARQUET_NOT_UPDATED'
            });
        }

        const parquet = await Parquet.findById(id_parquet);
        res.json({
            message: 'Parquet mis à jour avec succès',
            parquet
        });
    } catch (error) {
        console.error('Erreur lors de la mise à jour du parquet:', error);
        res.status(500).json({
            message: 'Erreur lors de la mise à jour du parquet',
            error: 'SERVER_ERROR'
        });
    }
};

const deleteParquet = async (req, res) => {
    try {
        const { id_parquet } = req.params;
        const success = await Parquet.delete(id_parquet);

        if (!success) {
            return res.status(404).json({
                message: 'Parquet non trouvé',
                error: 'PARQUET_NOT_FOUND'
            });
        }

        res.json({
            message: 'Parquet supprimé avec succès'
        });
    } catch (error) {
        console.error('Erreur lors de la suppression du parquet:', error);
        res.status(500).json({
            message: 'Erreur lors de la suppression du parquet',
            error: 'SERVER_ERROR'
        });
    }
};

module.exports = {
    createParquet,
    getParquetById,
    getAllParquets,
    updateParquet,
    deleteParquet
}; 