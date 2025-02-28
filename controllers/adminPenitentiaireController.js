const Detenu = require('../models/Detenu');
const Cellule = require('../models/Cellule');
const Peine = require('../models/Peine');

const admissionDetenu = async (req, res) => {
    try {
        const {
            nom,
            prenom,
            date_naissance,
            sexe,
            date_admission,
            cellule,
            id_enquete
        } = req.body;

        // Validation des champs requis
        if (!nom || !prenom || !date_naissance || !sexe || !date_admission || !cellule) {
            return res.status(400).json({
                message: 'Tous les champs obligatoires doivent être remplis',
                error: 'MISSING_FIELDS'
            });
        }

        const detenuData = {
            ...req.body,
            effectue_par: req.user.userId
        };

        const id_detenu = await Detenu.create(detenuData);

        res.status(201).json({
            message: 'Détenu admis avec succès',
            id_detenu
        });

    } catch (error) {
        console.error('Erreur lors de l\'admission du détenu:', error);
        
        if (error.message === 'CELLULE_FULL') {
            return res.status(400).json({
                message: 'La cellule sélectionnée est pleine',
                error: 'CELLULE_FULL'
            });
        }

        res.status(500).json({
            message: 'Erreur lors de l\'admission du détenu',
            error: 'SERVER_ERROR'
        });
    }
};

const transfererDetenu = async (req, res) => {
    try {
        const { id_detenu } = req.params;
        const { nouvelle_cellule, motif } = req.body;

        if (!nouvelle_cellule) {
            return res.status(400).json({
                message: 'La nouvelle cellule doit être spécifiée',
                error: 'MISSING_CELLULE'
            });
        }

        await Detenu.transferer(id_detenu, nouvelle_cellule, req.user.userId, motif);

        res.json({
            message: 'Détenu transféré avec succès'
        });

    } catch (error) {
        console.error('Erreur lors du transfert du détenu:', error);
        
        if (error.message === 'CELLULE_FULL') {
            return res.status(400).json({
                message: 'La cellule de destination est pleine',
                error: 'CELLULE_FULL'
            });
        }

        res.status(500).json({
            message: 'Erreur lors du transfert du détenu',
            error: 'SERVER_ERROR'
        });
    }
};

const libererDetenu = async (req, res) => {
    try {
        const { id_detenu } = req.params;
        const { motif } = req.body;

        await Detenu.liberer(id_detenu, req.user.userId, motif);

        res.json({
            message: 'Détenu libéré avec succès'
        });

    } catch (error) {
        console.error('Erreur lors de la libération du détenu:', error);
        res.status(500).json({
            message: 'Erreur lors de la libération du détenu',
            error: 'SERVER_ERROR'
        });
    }
};

const getStatistiques = async (req, res) => {
    try {
        const stats = await Detenu.getStatistiques();
        
        res.json({
            message: 'Statistiques récupérées avec succès',
            statistiques: stats
        });

    } catch (error) {
        console.error('Erreur lors de la récupération des statistiques:', error);
        res.status(500).json({
            message: 'Erreur lors de la récupération des statistiques',
            error: 'SERVER_ERROR'
        });
    }
};

// Gestion des cellules
const creerCellule = async (req, res) => {
    try {
        const { nom_cellule, capacite } = req.body;

        if (!nom_cellule || !capacite) {
            return res.status(400).json({
                message: 'Le nom et la capacité de la cellule sont requis',
                error: 'MISSING_FIELDS'
            });
        }

        const id_cellule = await Cellule.create({ nom_cellule, capacite });

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

const getCellules = async (req, res) => {
    try {
        const cellules = await Cellule.findAll();
        
        res.json({
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

const getOccupantsCellule = async (req, res) => {
    try {
        const { nom_cellule } = req.params;
        const occupants = await Cellule.getOccupants(nom_cellule);
        
        res.json({
            message: 'Occupants récupérés avec succès',
            occupants
        });

    } catch (error) {
        console.error('Erreur lors de la récupération des occupants:', error);
        res.status(500).json({
            message: 'Erreur lors de la récupération des occupants',
            error: 'SERVER_ERROR'
        });
    }
};

// Gestion des peines
const ajouterPeine = async (req, res) => {
    try {
        const {
            id_detenu,
            type_peine,
            duree_peine,
            date_debut,
            date_fin,
            observations
        } = req.body;

        if (!id_detenu || !type_peine || !duree_peine || !date_debut || !date_fin) {
            return res.status(400).json({
                message: 'Tous les champs obligatoires doivent être remplis',
                error: 'MISSING_FIELDS'
            });
        }

        const id_peine = await Peine.create(req.body);

        res.status(201).json({
            message: 'Peine ajoutée avec succès',
            id_peine
        });

    } catch (error) {
        console.error('Erreur lors de l\'ajout de la peine:', error);
        res.status(500).json({
            message: 'Erreur lors de l\'ajout de la peine',
            error: 'SERVER_ERROR'
        });
    }
};

const getPeinesDetenu = async (req, res) => {
    try {
        const { id_detenu } = req.params;
        const peines = await Peine.findByDetenu(id_detenu);
        
        res.json({
            message: 'Peines récupérées avec succès',
            peines
        });

    } catch (error) {
        console.error('Erreur lors de la récupération des peines:', error);
        res.status(500).json({
            message: 'Erreur lors de la récupération des peines',
            error: 'SERVER_ERROR'
        });
    }
};

const getDetenus = async (req, res) => {
    try {
        const filters = {
            statut: req.query.statut,
            cellule: req.query.cellule,
            search: req.query.search
        };

        const detenus = await Detenu.findAll(filters);
        
        res.json({
            message: 'Détenus récupérés avec succès',
            detenus
        });

    } catch (error) {
        console.error('Erreur lors de la récupération des détenus:', error);
        res.status(500).json({
            message: 'Erreur lors de la récupération des détenus',
            error: 'SERVER_ERROR'
        });
    }
};

const getDetenuById = async (req, res) => {
    try {
        const { id_detenu } = req.params;
        const detenu = await Detenu.findById(id_detenu);
        
        res.json({
            message: 'Détenu récupéré avec succès',
            detenu
        });

    } catch (error) {
        console.error('Erreur lors de la récupération du détenu:', error);
        
        if (error.message === 'DETENU_NOT_FOUND') {
            return res.status(404).json({
                message: 'Détenu non trouvé',
                error: 'DETENU_NOT_FOUND'
            });
        }

        res.status(500).json({
            message: 'Erreur lors de la récupération du détenu',
            error: 'SERVER_ERROR'
        });
    }
};

const updateCellule = async (req, res) => {
    try {
        const { id_cellule } = req.params;
        const { capacite, statut_cellule } = req.body;

        if (!capacite) {
            return res.status(400).json({
                message: 'La capacité de la cellule est requise',
                error: 'MISSING_FIELDS'
            });
        }

        await Cellule.update(id_cellule, { capacite, statut_cellule });

        res.json({
            message: 'Cellule mise à jour avec succès'
        });

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
        await Cellule.delete(id_cellule);

        res.json({
            message: 'Cellule supprimée avec succès'
        });

    } catch (error) {
        console.error('Erreur lors de la suppression de la cellule:', error);
        
        if (error.message === 'CELLULE_NOT_EMPTY') {
            return res.status(400).json({
                message: 'Impossible de supprimer une cellule occupée',
                error: 'CELLULE_NOT_EMPTY'
            });
        }

        res.status(500).json({
            message: 'Erreur lors de la suppression de la cellule',
            error: 'SERVER_ERROR'
        });
    }
};

const getCelluleById = async (req, res) => {
    try {
        const { id_cellule } = req.params;
        const cellule = await Cellule.findById(id_cellule);

        res.json({
            message: 'Cellule récupérée avec succès',
            cellule
        });

    } catch (error) {
        console.error('Erreur lors de la récupération de la cellule:', error);

        if (error.message === 'CELLULE_NOT_FOUND') {
            return res.status(404).json({
                message: 'Cellule non trouvée',
                error: 'CELLULE_NOT_FOUND'
            });
        }

        res.status(500).json({
            message: 'Erreur lors de la récupération de la cellule',
            error: 'SERVER_ERROR'
        });
    }
};

const getStats = async (req, res) => {
    try {
        const stats = await Detenu.getStatistiques();
        
        res.json(stats);
    } catch (error) {
        console.error('Erreur lors de la récupération des statistiques:', error);
        res.status(500).json({
            message: 'Erreur lors de la récupération des statistiques',
            error: 'SERVER_ERROR'
        });
    }
};

module.exports = {
    admissionDetenu,
    transfererDetenu,
    libererDetenu,
    getStatistiques,
    creerCellule,
    getCellules,
    getOccupantsCellule,
    ajouterPeine,
    getPeinesDetenu,
    getDetenus,
    getDetenuById,
    updateCellule,
    deleteCellule,
    getCelluleById,
    getStats
}; 