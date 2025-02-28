const Enquete = require('../models/Enquete');
const EnqueteurSecondaire = require('../models/EnqueteurSecondaire');

// Créer une enquête
const createEnquete = async (req, res) => {
    try {
        const {
            titre,
            description,
            enqueteur_principal_id,
            enqueteurs_secondaires_ids,
            priorite,
            lieu,
            mandat,
            budget,
            observations
        } = req.body;

        // Vérification des champs obligatoires
        if (!titre || !description || !enqueteur_principal_id || !lieu) {
            return res.status(400).json({
                message: 'Certains champs obligatoires sont manquants',
                error: 'MISSING_FIELDS'
            });
        }

        // Création de l'enquête principale
        const { id: newId, code: codeEnquete } = await Enquete.create({
            titre_enquete: titre,
            description,
            id_enqueteur_principal: enqueteur_principal_id,
            date_ouverture: new Date(),
            statut_enquete: 'Ouverte',
            categorie_enquete: 'Générale', // Vous pouvez ajuster selon vos besoins
            priorite,
            lieu_enquete: lieu,
            mandat,
            budget: parseFloat(budget.replace(/,/g, '')), // Convertir le budget en nombre
            observations
        });

        // Ajout des enquêteurs secondaires
        if (enqueteurs_secondaires_ids && enqueteurs_secondaires_ids.length > 0) {
            for (const id_utilisateur of enqueteurs_secondaires_ids) {
                await EnqueteurSecondaire.addEnqueteur(newId, id_utilisateur);
            }
        }

        const enqueteCree = await Enquete.findById(newId);

        res.status(201).json({
            message: 'Enquête créée avec succès',
            enquete: enqueteCree,
            code: codeEnquete
        });
    } catch (error) {
        console.error('Erreur lors de la création de l’enquête:', error);
        res.status(500).json({
            message: 'Erreur lors de la création de l’enquête',
            error: 'SERVER_ERROR'
        });
    }
};

// Récupérer une enquête par ID
const getEnqueteById = async (req, res) => {
    try {
        const { id_enquete } = req.params;
        const enquete = await Enquete.findById(id_enquete);

        if (!enquete) {
            return res.status(404).json({
                message: 'Enquête non trouvée',
                error: 'ENQUETE_NOT_FOUND'
            });
        }

        res.json({
            message: 'Enquête récupérée avec succès',
            enquete: enquete
        });
    } catch (error) {
        console.error('Erreur lors de la récupération de l’enquête:', error);
        res.status(500).json({
            message: 'Erreur lors de la récupération de l’enquête',
            error: 'SERVER_ERROR'
        });
    }
};

// Récupérer toutes les enquêtes
const getAllEnquetes = async (req, res) => {
    try {
        const enquetes = await Enquete.findAll();
        res.json({
            message: 'Liste de toutes les enquêtes',
            enquetes: enquetes
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des enquêtes:', error);
        res.status(500).json({
            message: 'Erreur lors de la récupération des enquêtes',
            error: 'SERVER_ERROR'
        });
    }
};

// Mettre à jour une enquête
const updateEnquete = async (req, res) => {
    try {
        const { id_enquete } = req.params;

        const success = await Enquete.update(id_enquete, req.body);

        if (!success) {
            return res.status(404).json({
                message: 'Enquête non trouvée ou aucune modification effectuée',
                error: 'ENQUETE_NOT_UPDATED'
            });
        }

        const enqueteMiseAJour = await Enquete.findById(id_enquete);
        res.json({
            message: 'Enquête mise à jour avec succès',
            enquete: enqueteMiseAJour
        });
    } catch (error) {
        console.error('Erreur lors de la mise à jour de l’enquête:', error);
        res.status(500).json({
            message: 'Erreur lors de la mise à jour de l’enquête',
            error: 'SERVER_ERROR'
        });
    }
};

// Supprimer une enquête
const deleteEnquete = async (req, res) => {
    try {
        const { id_enquete } = req.params;

        const success = await Enquete.delete(id_enquete);
        if (!success) {
            return res.status(404).json({
                message: 'Enquête non trouvée ou déjà supprimée',
                error: 'ENQUETE_NOT_FOUND'
            });
        }

        res.json({
            message: 'Enquête supprimée avec succès'
        });
    } catch (error) {
        console.error('Erreur lors de la suppression de l’enquête:', error);
        res.status(500).json({
            message: 'Erreur lors de la suppression de l’enquête',
            error: 'SERVER_ERROR'
        });
    }
};

module.exports = {
    createEnquete,
    getEnqueteById,
    getAllEnquetes,
    updateEnquete,
    deleteEnquete
}; 