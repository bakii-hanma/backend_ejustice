const TransmissionParquet = require('../models/TransmissionParquet');

const createTransmission = async (req, res) => {
    try {
        const {
            id_enquete,
            date_transmission,
            id_parquet,
            etat_dossier,
            rapport_final
        } = req.body;

        // Validation des champs requis
        if (!id_enquete || !date_transmission || !id_parquet || !etat_dossier || !rapport_final) {
            return res.status(400).json({
                message: 'Tous les champs sont obligatoires',
                error: 'MISSING_FIELDS'
            });
        }

        const newId = await TransmissionParquet.create({
            id_enquete,
            date_transmission,
            id_parquet,
            etat_dossier,
            rapport_final
        });

        const transmission = await TransmissionParquet.findById(newId);

        res.status(201).json({
            message: 'Transmission créée avec succès',
            transmission
        });
    } catch (error) {
        console.error('Erreur lors de la création de la transmission:', error);
        res.status(500).json({
            message: 'Erreur lors de la création de la transmission',
            error: 'SERVER_ERROR'
        });
    }
};

const getTransmissionById = async (req, res) => {
    try {
        const { id_transmission } = req.params;
        const transmission = await TransmissionParquet.findById(id_transmission);

        if (!transmission) {
            return res.status(404).json({
                message: 'Transmission non trouvée',
                error: 'TRANSMISSION_NOT_FOUND'
            });
        }

        res.json({
            message: 'Transmission récupérée avec succès',
            transmission
        });
    } catch (error) {
        console.error('Erreur lors de la récupération de la transmission:', error);
        res.status(500).json({
            message: 'Erreur lors de la récupération de la transmission',
            error: 'SERVER_ERROR'
        });
    }
};

const getAllTransmissions = async (req, res) => {
    try {
        const transmissions = await TransmissionParquet.findAll();
        res.json({
            message: 'Liste des transmissions récupérée avec succès',
            transmissions
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des transmissions:', error);
        res.status(500).json({
            message: 'Erreur lors de la récupération des transmissions',
            error: 'SERVER_ERROR'
        });
    }
};

const updateTransmission = async (req, res) => {
    try {
        const { id_transmission } = req.params;
        const success = await TransmissionParquet.update(id_transmission, req.body);

        if (!success) {
            return res.status(404).json({
                message: 'Transmission non trouvée ou aucune modification effectuée',
                error: 'TRANSMISSION_NOT_UPDATED'
            });
        }

        const transmission = await TransmissionParquet.findById(id_transmission);
        res.json({
            message: 'Transmission mise à jour avec succès',
            transmission
        });
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la transmission:', error);
        res.status(500).json({
            message: 'Erreur lors de la mise à jour de la transmission',
            error: 'SERVER_ERROR'
        });
    }
};

const deleteTransmission = async (req, res) => {
    try {
        const { id_transmission } = req.params;
        const success = await TransmissionParquet.delete(id_transmission);

        if (!success) {
            return res.status(404).json({
                message: 'Transmission non trouvée',
                error: 'TRANSMISSION_NOT_FOUND'
            });
        }

        res.json({
            message: 'Transmission supprimée avec succès'
        });
    } catch (error) {
        console.error('Erreur lors de la suppression de la transmission:', error);
        res.status(500).json({
            message: 'Erreur lors de la suppression de la transmission',
            error: 'SERVER_ERROR'
        });
    }
};

module.exports = {
    createTransmission,
    getTransmissionById,
    getAllTransmissions,
    updateTransmission,
    deleteTransmission
}; 