const path = require('path');
const fs = require('fs').promises;
const Preuve = require('../models/Preuve');
const DocumentPreuve = require('../models/DocumentPreuve');

// Créer une preuve
const createPreuve = async (req, res) => {
    try {
        const {
            id_enquete,
            type_preuve,
            description,
            date_recolte,
            lieu_recolte,
            id_enqueteur,
            statut_preuve = 'Récoltée',
            observations = null
        } = req.body;

        // Vérification des champs obligatoires
        if (!id_enquete || !type_preuve || !description || !date_recolte || !lieu_recolte) {
            return res.status(400).json({
                message: 'Certains champs obligatoires sont manquants',
                error: 'MISSING_FIELDS'
            });
        }

        // Vérifier si le dossier existe, sinon le créer
        const uploadDir = path.join(__dirname, '../uploads/documents_preuves');
        try {
            await fs.access(uploadDir);
        } catch {
            await fs.mkdir(uploadDir, { recursive: true });
        }

        // 1. Créer la preuve
        const newId = await Preuve.create({
            id_enquete: parseInt(id_enquete),
            type_preuve,
            description,
            date_recolte,
            lieu_recolte,
            id_enqueteur: parseInt(id_enqueteur),
            statut_preuve,
            fichier_preuve: null, // Sera géré par la table documents_preuve
            observations
        });

        // 2. Gérer les fichiers
        const documents = [];
        if (req.files && req.files.files) {
            const files = Array.isArray(req.files.files) ? req.files.files : [req.files.files];
            
            for (const file of files) {
                const extension = path.extname(file.name);
                const nomFichier = `${Date.now()}-${Math.random().toString(36).substring(7)}${extension}`;
                const cheminFichier = path.join(uploadDir, nomFichier);
                
                try {
                    await fs.writeFile(cheminFichier, file.data);
                    
                    // Créer l'entrée dans la table documents_preuve
                    const documentData = {
                        id_preuve: newId,
                        nom_fichier: file.name,
                        chemin_fichier: `uploads/documents_preuves/${nomFichier}`,
                        type_document: file.mimetype,
                        taille_fichier: file.size
                    };

                    const idDocument = await DocumentPreuve.create(documentData);
                    documents.push({
                        id_document: idDocument,
                        nom_fichier: file.name,
                        chemin_fichier: `uploads/documents_preuves/${nomFichier}`
                    });

                } catch (err) {
                    console.error('Erreur lors de l\'enregistrement du fichier:', err);
                    return res.status(500).json({
                        message: 'Erreur lors de l\'upload du fichier de preuve',
                        error: 'UPLOAD_ERROR'
                    });
                }
            }
        }

        const preuveCree = await Preuve.findById(newId);

        res.status(201).json({
            message: 'Preuve créée avec succès',
            preuve: {
                ...preuveCree,
                documents
            }
        });
    } catch (error) {
        console.error('Erreur lors de la création de la preuve:', error);
        res.status(500).json({
            message: 'Erreur lors de la création de la preuve',
            error: 'SERVER_ERROR'
        });
    }
};

// Récupérer une preuve par ID
const getPreuveById = async (req, res) => {
    try {
        const { id_preuve } = req.params;
        const preuve = await Preuve.findById(id_preuve);

        if (!preuve) {
            return res.status(404).json({
                message: 'Preuve non trouvée',
                error: 'PREUVE_NOT_FOUND'
            });
        }

        res.json({
            message: 'Preuve récupérée avec succès',
            preuve: preuve
        });
    } catch (error) {
        console.error('Erreur lors de la récupération de la preuve:', error);
        res.status(500).json({
            message: 'Erreur lors de la récupération de la preuve',
            error: 'SERVER_ERROR'
        });
    }
};

// Récupérer toutes les preuves
const getAllPreuves = async (req, res) => {
    try {
        const preuves = await Preuve.findAll();
        res.json({
            message: 'Liste de toutes les preuves',
            preuves: preuves
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des preuves:', error);
        res.status(500).json({
            message: 'Erreur lors de la récupération des preuves',
            error: 'SERVER_ERROR'
        });
    }
};

// Mettre à jour une preuve
const updatePreuve = async (req, res) => {
    try {
        const { id_preuve } = req.params;

        const success = await Preuve.update(id_preuve, req.body);

        if (!success) {
            return res.status(404).json({
                message: 'Preuve non trouvée ou aucune modification effectuée',
                error: 'PREUVE_NOT_UPDATED'
            });
        }

        const preuveMiseAJour = await Preuve.findById(id_preuve);
        res.json({
            message: 'Preuve mise à jour avec succès',
            preuve: preuveMiseAJour
        });
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la preuve:', error);
        res.status(500).json({
            message: 'Erreur lors de la mise à jour de la preuve',
            error: 'SERVER_ERROR'
        });
    }
};

// Supprimer une preuve
const deletePreuve = async (req, res) => {
    try {
        const { id_preuve } = req.params;

        const success = await Preuve.delete(id_preuve);
        if (!success) {
            return res.status(404).json({
                message: 'Preuve non trouvée ou déjà supprimée',
                error: 'PREUVE_NOT_FOUND'
            });
        }

        res.json({
            message: 'Preuve supprimée avec succès'
        });
    } catch (error) {
        console.error('Erreur lors de la suppression de la preuve:', error);
        res.status(500).json({
            message: 'Erreur lors de la suppression de la preuve',
            error: 'SERVER_ERROR'
        });
    }
};

module.exports = {
    createPreuve,
    getPreuveById,
    getAllPreuves,
    updatePreuve,
    deletePreuve
}; 