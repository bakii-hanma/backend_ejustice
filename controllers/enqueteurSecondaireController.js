const EnqueteurSecondaire = require('../models/EnqueteurSecondaire');

// Ajouter un enquêteur secondaire
const addEnqueteurSecondaire = async (req, res) => {
    try {
        const { id_enquete, id_utilisateur } = req.body;

        if (!id_enquete || !id_utilisateur) {
            return res.status(400).json({
                message: 'Les champs id_enquete et id_utilisateur sont requis',
                error: 'MISSING_FIELDS'
            });
        }

        const newId = await EnqueteurSecondaire.addEnqueteur(id_enquete, id_utilisateur);

        res.status(201).json({
            message: 'Enquêteur secondaire ajouté avec succès',
            id_enqueteur_secondaire: newId
        });
    } catch (error) {
        console.error('Erreur lors de l’ajout de l’enquêteur secondaire:', error);
        res.status(500).json({
            message: 'Erreur lors de l’ajout de l’enquêteur secondaire',
            error: 'SERVER_ERROR'
        });
    }
};

// Récupérer les enquêteurs secondaires par enquête
const getEnqueteursSecondairesByEnquete = async (req, res) => {
    try {
        const { id_enquete } = req.params;
        const enqueteurs = await EnqueteurSecondaire.findByEnquete(id_enquete);

        res.json({
            message: 'Liste des enquêteurs secondaires récupérée avec succès',
            enqueteurs: enqueteurs
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des enquêteurs secondaires:', error);
        res.status(500).json({
            message: 'Erreur lors de la récupération des enquêteurs secondaires',
            error: 'SERVER_ERROR'
        });
    }
};

// Supprimer un enquêteur secondaire
const removeEnqueteurSecondaire = async (req, res) => {
    try {
        const { id_enqueteur_secondaire } = req.params;

        const success = await EnqueteurSecondaire.removeEnqueteur(id_enqueteur_secondaire);
        if (!success) {
            return res.status(404).json({
                message: 'Enquêteur secondaire non trouvé ou déjà supprimé',
                error: 'ENQUETEUR_NOT_FOUND'
            });
        }

        res.json({
            message: 'Enquêteur secondaire supprimé avec succès'
        });
    } catch (error) {
        console.error('Erreur lors de la suppression de l’enquêteur secondaire:', error);
        res.status(500).json({
            message: 'Erreur lors de la suppression de l’enquêteur secondaire',
            error: 'SERVER_ERROR'
        });
    }
};

module.exports = {
    addEnqueteurSecondaire,
    getEnqueteursSecondairesByEnquete,
    removeEnqueteurSecondaire
}; 