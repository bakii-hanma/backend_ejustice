const Detenu = require('../models/Detenu');

const createDetenu = async (req, res) => {
    try {
        const { 
            nom, 
            prenom, 
            date_naissance, 
            sexe, 
            date_admission, 
            celluleId, 
            id_enquete,
            date_fin_peine,
            statut,
            type_peine
        } = req.body;

        console.log('Données reçues pour la création du détenu:', {
            nom,
            prenom,
            date_naissance,
            sexe,
            date_admission,
            celluleId,
            id_enquete,
            date_fin_peine,
            statut,
            type_peine
        });

        // Fonction pour générer un numéro aléatoire de 6 caractères
        const generateRandomNumber = () => {
            return Math.random().toString(36).substring(2, 8).toUpperCase();
        };

        const numero_dossier = generateRandomNumber();

        const id_detenu = await Detenu.create({ 
            nom, 
            prenom, 
            date_naissance, 
            sexe, 
            date_admission, 
            celluleId,
            id_enquete,
            date_fin_peine,
            statut,
            type_peine,
            numero_dossier
        });

        res.status(201).json({
            message: 'Détenu créé avec succès',
            id_detenu,
            numero_dossier
        });
    } catch (error) {
        console.error('Erreur lors de la création du détenu:', error);
        res.status(500).json({
            message: 'Erreur lors de la création du détenu',
            error: error.message
        });
    }
};

const updateDetenu = async (req, res) => {
    try {
        const { id_detenu } = req.params;
        const detenuData = req.body;

        const updated = await Detenu.update(id_detenu, detenuData);

        if (!updated) {
            return res.status(404).json({
                message: 'Détenu non trouvé',
                error: 'DETENU_NOT_FOUND'
            });
        }

        res.json({
            message: 'Détenu mis à jour avec succès'
        });
    } catch (error) {
        console.error('Erreur lors de la mise à jour du détenu:', error);
        res.status(500).json({
            message: 'Erreur lors de la mise à jour du détenu',
            error: error.message
        });
    }
};

const transfererDetenu = async (req, res) => {
    try {
        const { id_detenu } = req.params;
        const { celluleId, motif } = req.body;

        await Detenu.transferer(id_detenu, celluleId, motif);

        res.status(200).json({
            message: 'Détenu transféré avec succès'
        });
    } catch (error) {
        console.error('Erreur lors du transfert du détenu:', error);
        res.status(500).json({
            message: 'Erreur lors du transfert du détenu',
            error: error.message
        });
    }
};

const libererDetenu = async (req, res) => {
    try {
        const { id_detenu } = req.params;
        const { motif } = req.body;

        await Detenu.liberer(id_detenu, motif);

        res.status(200).json({
            message: 'Détenu libéré avec succès'
        });
    } catch (error) {
        console.error('Erreur lors de la libération du détenu:', error);
        res.status(500).json({
            message: 'Erreur lors de la libération du détenu',
            error: error.message
        });
    }
};

const getStatistiques = async (req, res) => {
    try {
        const stats = await Detenu.getStatistiques();
        res.status(200).json(stats);
    } catch (error) {
        console.error('Erreur lors de la récupération des statistiques:', error);
        res.status(500).json({
            message: 'Erreur lors de la récupération des statistiques',
            error: error.message
        });
    }
};

const getAllDetenus = async (req, res) => {
    try {
        const { statut, cellule, search } = req.query;
        const detenus = await Detenu.findAll({ statut, cellule, search });
        res.status(200).json(detenus);
    } catch (error) {
        console.error('Erreur lors de la récupération des détenus:', error);
        res.status(500).json({
            message: 'Erreur lors de la récupération des détenus',
            error: error.message
        });
    }
};

const getDetenuById = async (req, res) => {
    try {
        const { id_detenu } = req.params;
        const detenu = await Detenu.findById(id_detenu);
        res.status(200).json(detenu);
    } catch (error) {
        console.error('Erreur lors de la récupération du détenu:', error);
        if (error.message === 'DETENU_NOT_FOUND') {
            res.status(404).json({
                message: 'Détenu non trouvé',
                error: 'DETENU_NOT_FOUND'
            });
        } else {
            res.status(500).json({
                message: 'Erreur lors de la récupération du détenu',
                error: error.message
            });
        }
    }
};

const deleteDetenu = async (req, res) => {
    try {
        const { id_detenu } = req.params;

        const deleted = await Detenu.delete(id_detenu);
        
        if (!deleted) {
            return res.status(404).json({
                message: 'Détenu non trouvé',
                error: 'DETENU_NOT_FOUND'
            });
        }
        
        res.json({
            message: 'Détenu supprimé avec succès'
        });
    } catch (error) {
        console.error('Erreur lors de la suppression du détenu:', error);
        
        if (error.message === 'DETENU_NOT_FOUND') {
            return res.status(404).json({
                message: 'Détenu non trouvé',
                error: 'DETENU_NOT_FOUND'
            });
        }

        res.status(500).json({
            message: 'Erreur lors de la suppression du détenu',
            error: 'SERVER_ERROR'
        });
    }
};

module.exports = {
    createDetenu,
    updateDetenu,
    transfererDetenu,
    libererDetenu,
    getStatistiques,
    getAllDetenus,
    getDetenuById,
    deleteDetenu
}; 