const path = require('path');
const fs = require('fs').promises;
const Interrogatoire = require('../models/Interrogatoire');

// Fonction utilitaire pour créer le dossier des documents si nécessaire
async function ensureUploadDirExists() {
    const uploadDir = path.join(__dirname, '../uploads/documents_interrogatoire');
    try {
        await fs.access(uploadDir);
    } catch {
        await fs.mkdir(uploadDir, { recursive: true });
    }
    return uploadDir;
}

// Créer un interrogatoire
const createInterrogatoire = async (req, res) => {
    try {
        console.log('Headers reçus:', req.headers);
        console.log('Files reçus:', req.files);
        console.log('Body reçu:', req.body);

        const {
            id_enquete,
            type_personne,
            nom_personne,
            identite_document,
            date_interrogatoire,
            lieu_interrogatoire,
            resume_interrogatoire
        } = req.body;

        // Vérification des champs requis
        if (!id_enquete || !type_personne || !nom_personne || !identite_document || !date_interrogatoire || !lieu_interrogatoire || !resume_interrogatoire) {
            return res.status(400).json({
                message: 'Tous les champs sont requis',
                error: 'MISSING_FIELDS'
            });
        }

        let fichier_interrogatoire = null;

        // Traitement du fichier s'il existe
        if (req.files && req.files.fichier_interrogatoire) {
            const file = req.files.fichier_interrogatoire;
            const uploadDir = await ensureUploadDirExists();
            
            // Générer un nom de fichier unique
            const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
            const fileExtension = path.extname(file.name);
            const fileName = `interrogatoire_${uniqueSuffix}${fileExtension}`;
            const filePath = path.join(uploadDir, fileName);

            // Déplacer le fichier
            await file.mv(filePath);
            fichier_interrogatoire = fileName;
        }

        // Créer l'interrogatoire
        const interrogatoireData = {
            id_enquete,
            type_personne,
            nom_personne,
            identite_document,
            date_interrogatoire,
            lieu_interrogatoire,
            resume_interrogatoire,
            fichier_interrogatoire
        };

        const nouvelInterrogatoire = await Interrogatoire.create(interrogatoireData);

        res.status(201).json({
            message: 'Interrogatoire créé avec succès',
            interrogatoire: nouvelInterrogatoire
        });

    } catch (error) {
        console.error('Erreur lors de la création de l\'interrogatoire:', error);
        res.status(500).json({
            message: 'Erreur lors de la création de l\'interrogatoire',
            error: 'SERVER_ERROR'
        });
    }
};

// Récupérer un interrogatoire par ID
const getInterrogatoireById = async (req, res) => {
    try {
        const { id_interrogatoire } = req.params;
        const interrogatoire = await Interrogatoire.findById(id_interrogatoire);

        if (!interrogatoire) {
            return res.status(404).json({
                message: 'Interrogatoire non trouvé',
                error: 'INTERROGATOIRE_NOT_FOUND'
            });
        }

        res.json({
            message: 'Interrogatoire récupéré avec succès',
            interrogatoire: interrogatoire
        });
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'interrogatoire:', error);
        res.status(500).json({
            message: 'Erreur lors de la récupération de l\'interrogatoire',
            error: 'SERVER_ERROR'
        });
    }
};

// Récupérer tous les interrogatoires
const getAllInterrogatoires = async (req, res) => {
    try {
        const interrogatoires = await Interrogatoire.findAll();
        res.json({
            message: 'Liste de tous les interrogatoires',
            interrogatoires: interrogatoires
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des interrogatoires:', error);
        res.status(500).json({
            message: 'Erreur lors de la récupération des interrogatoires',
            error: 'SERVER_ERROR'
        });
    }
};

// Mettre à jour un interrogatoire
const updateInterrogatoire = async (req, res) => {
    try {
        const { id_interrogatoire } = req.params;

        const success = await Interrogatoire.update(id_interrogatoire, req.body);

        if (!success) {
            return res.status(404).json({
                message: 'Interrogatoire non trouvé ou aucune modification effectuée',
                error: 'INTERROGATOIRE_NOT_UPDATED'
            });
        }

        const interrogatoireMisAJour = await Interrogatoire.findById(id_interrogatoire);
        res.json({
            message: 'Interrogatoire mis à jour avec succès',
            interrogatoire: interrogatoireMisAJour
        });
    } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'interrogatoire:', error);
        res.status(500).json({
            message: 'Erreur lors de la mise à jour de l\'interrogatoire',
            error: 'SERVER_ERROR'
        });
    }
};

// Supprimer un interrogatoire
const deleteInterrogatoire = async (req, res) => {
    try {
        const { id_interrogatoire } = req.params;

        const success = await Interrogatoire.delete(id_interrogatoire);

        if (!success) {
            return res.status(404).json({
                message: 'Interrogatoire non trouvé ou déjà supprimé',
                error: 'INTERROGATOIRE_NOT_FOUND'
            });
        }

        res.json({
            message: 'Interrogatoire supprimé avec succès'
        });
    } catch (error) {
        console.error('Erreur lors de la suppression de l\'interrogatoire:', error);
        res.status(500).json({
            message: 'Erreur lors de la suppression de l\'interrogatoire',
            error: 'SERVER_ERROR'
        });
    }
};

module.exports = {
    createInterrogatoire,
    getInterrogatoireById,
    getAllInterrogatoires,
    updateInterrogatoire,
    deleteInterrogatoire
}; 