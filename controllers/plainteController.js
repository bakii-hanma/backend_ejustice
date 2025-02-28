const Plainte = require('../models/Plainte');
const DocumentPlainte = require('../models/DocumentPlainte');
const path = require('path');
const fs = require('fs').promises;
const HistoriqueRecherche = require('../models/HistoriqueRecherche');

// Fonction utilitaire pour créer le dossier des documents si nécessaire
async function ensureUploadDirExists() {
    const uploadDir = path.join(__dirname, '../uploads/documents');
    try {
        await fs.access(uploadDir);
    } catch {
        await fs.mkdir(uploadDir, { recursive: true });
    }
    return uploadDir;
}

const createPlainte = async (req, res) => {
    try {
        console.log('Headers reçus:', req.headers);
        console.log('Files reçus:', req.files);
        console.log('Body reçu:', req.body);

        // Vérifier si la requête est multipart
        if (!req.is('multipart/form-data')) {
            return res.status(400).json({
                message: 'La requête doit être de type multipart/form-data',
                error: 'INVALID_CONTENT_TYPE'
            });
        }

        // Vérifier les champs requis
        const {
            id_utilisateur,
            lieu,
            description,
            categorie_infraction,
            nom_fichier
        } = req.body;

        if (!id_utilisateur || !lieu || !categorie_infraction) {
            return res.status(400).json({
                message: 'Tous les champs obligatoires doivent être remplis',
                error: 'MISSING_FIELDS'
            });
        }

        let fichierPlaintePath = null;

        // Vérifier et gérer le fichier de plainte
        if (req.files && req.files.fichier_plainte) {
            const plaintePdf = req.files.fichier_plainte;
            
            // Vérifier le type MIME
            if (!plaintePdf.mimetype.includes('pdf')) {
                return res.status(400).json({
                    message: 'Le fichier doit être un PDF',
                    error: 'INVALID_FILE_TYPE'
                });
            }

            fichierPlaintePath = nom_fichier;
            const uploadPath = path.join(__dirname, '../uploads/plaintes', fichierPlaintePath);

            // Créer le dossier s'il n'existe pas
            await fs.mkdir(path.dirname(uploadPath), { recursive: true });

            try {
                await plaintePdf.mv(uploadPath);
                console.log('Fichier de plainte sauvegardé:', fichierPlaintePath);
            } catch (error) {
                console.error('Erreur lors de la sauvegarde du fichier de plainte:', error);
                throw new Error('Erreur lors de la sauvegarde du fichier de plainte');
            }
        }

        // Créer la plainte dans la base de données
        const plainte = await Plainte.create({
            id_utilisateur,
            lieu,
            description: description || 'Voir fichier PDF',
            categorie_infraction,
            fichier_plainte: fichierPlaintePath
        });

        console.log('Plainte créée:', plainte);

        // Gérer les fichiers justificatifs
        if (req.files && req.files.justificatifs) {
            const justificatifs = Array.isArray(req.files.justificatifs) 
                ? req.files.justificatifs 
                : [req.files.justificatifs];

            const uploadDir = path.join(__dirname, '../uploads/documents');
            await fs.mkdir(uploadDir, { recursive: true });

            for (const file of justificatifs) {
                const fileName = `${Date.now()}_${file.name}`;
                const uploadPath = path.join(uploadDir, fileName);

                try {
                    await file.mv(uploadPath);
                    console.log('Justificatif sauvegardé:', fileName);

                    await DocumentPlainte.create({
                        id_plainte: plainte.id,
                        nom_fichier: file.name,
                        chemin_fichier: fileName,
                        type_document: path.extname(file.name).slice(1),
                        taille_fichier: file.size
                    });
                } catch (error) {
                    console.error('Erreur lors de la sauvegarde du justificatif:', error);
                    // Continuer avec les autres fichiers même si un échoue
                }
            }
        }

        // Réponse avec plus de détails
        res.status(201).json({
            message: 'Plainte créée avec succès',
            plainte: {
                id: plainte.id,
                numero_dossier: plainte.numero_dossier,
                id_utilisateur: plainte.id_utilisateur,
                lieu: plainte.lieu,
                description: plainte.description,
                categorie_infraction: plainte.categorie_infraction,
                fichier_plainte: plainte.fichier_plainte,
                date_depot: plainte.date_depot
            }
        });

    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            message: 'Erreur lors de la création de la plainte',
            error: error.message || 'SERVER_ERROR'
        });
    }
};

const updatePlainte = async (req, res) => {
    try {
        const { id_plainte } = req.params;
        const id_utilisateur = req.user.userId;

        // Vérifier si la plainte existe et appartient à l'utilisateur
        const plainte = await Plainte.findById(id_plainte);
        if (!plainte || plainte.id_utilisateur !== id_utilisateur) {
            return res.status(404).json({
                message: 'Plainte non trouvée',
                error: 'PLAINTE_NOT_FOUND'
            });
        }

        const success = await Plainte.update(id_plainte, req.body);

        if (success) {
            res.json({ message: 'Plainte mise à jour avec succès' });
        } else {
            res.status(400).json({
                message: 'Aucune modification effectuée',
                error: 'NO_CHANGES'
            });
        }

    } catch (error) {
        console.error('Erreur lors de la mise à jour de la plainte:', error);
        res.status(500).json({
            message: 'Erreur lors de la mise à jour de la plainte',
            error: 'SERVER_ERROR'
        });
    }
};

const deletePlainte = async (req, res) => {
    try {
        const { id_plainte } = req.params;
        const id_utilisateur = req.user.userId;

        const success = await Plainte.delete(id_plainte, id_utilisateur);

        if (success) {
            res.json({ message: 'Plainte supprimée avec succès' });
        } else {
            res.status(404).json({
                message: 'Plainte non trouvée ou non autorisée',
                error: 'PLAINTE_NOT_FOUND'
            });
        }

    } catch (error) {
        console.error('Erreur lors de la suppression de la plainte:', error);
        res.status(500).json({
            message: 'Erreur lors de la suppression de la plainte',
            error: 'SERVER_ERROR'
        });
    }
};

const getUserPlaintes = async (req, res) => {
    try {
        const { id_utilisateur } = req.body;

        if (!id_utilisateur) {
            return res.status(400).json({
                message: 'ID utilisateur requis',
                error: 'MISSING_USER_ID'
            });
        }

        // Récupérer les plaintes avec leurs documents
        const plaintes = await Plainte.findByUser(parseInt(id_utilisateur));
        
        // Pour chaque plainte, récupérer ses documents
        const plaintesAvecDocuments = await Promise.all(plaintes.map(async (plainte) => {
            const documents = await DocumentPlainte.findByPlainte(plainte.id_plainte);
            return {
                ...plainte,
                documents: documents
            };
        }));

        res.json({
            message: 'Plaintes récupérées avec succès',
            plaintes: plaintesAvecDocuments
        });

    } catch (error) {
        console.error('Erreur lors de la récupération des plaintes:', error);
        res.status(500).json({
            message: 'Erreur lors de la récupération des plaintes',
            error: 'SERVER_ERROR'
        });
    }
};

const getAllPlaintes = async (req, res) => {
    try {
        const plaintes = await Plainte.findAll();

        // Pour chaque plainte, récupérer ses documents
        const plaintesAvecDocuments = await Promise.all(plaintes.map(async (plainte) => {
            const documents = await DocumentPlainte.findByPlainte(plainte.id_plainte);
            return {
                ...plainte,
                documents: documents
            };
        }));

        res.json({
            message: 'Toutes les plaintes récupérées avec succès',
            plaintes: plaintesAvecDocuments
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des plaintes:', error);
        res.status(500).json({
            message: 'Erreur lors de la récupération des plaintes',
            error: 'SERVER_ERROR'
        });
    }
};

const validerPlainte = async (req, res) => {
    try {
        const { id_plainte } = req.params;
        const { id_enqueteur } = req.body;

        if (!id_enqueteur) {
            return res.status(400).json({
                message: 'L\'ID de l\'enquêteur est requis',
                error: 'MISSING_ENQUETEUR_ID'
            });
        }

        const success = await Plainte.validerPlainte(id_plainte, id_enqueteur);

        if (!success) {
            return res.status(404).json({
                message: 'Plainte non trouvée ou déjà validée',
                error: 'PLAINTE_NOT_FOUND'
            });
        }

        // Récupérer la plainte mise à jour avec ses détails
        const plainte = await Plainte.findByIdWithDetails(id_plainte);

        res.json({
            message: 'Plainte validée avec succès',
            plainte
        });

    } catch (error) {
        console.error('Erreur lors de la validation de la plainte:', error);
        res.status(500).json({
            message: 'Erreur lors de la validation de la plainte',
            error: 'SERVER_ERROR'
        });
    }
};

const rejeterPlainte = async (req, res) => {
    try {
        const { id_plainte } = req.params;
        const { motif_rejet } = req.body;

        if (!motif_rejet) {
            return res.status(400).json({
                message: 'Le motif de rejet est requis',
                error: 'MISSING_REJECTION_REASON'
            });
        }

        const success = await Plainte.rejeterPlainte(id_plainte, motif_rejet);

        if (!success) {
            return res.status(404).json({
                message: 'Plainte non trouvée ou déjà rejetée',
                error: 'PLAINTE_NOT_FOUND'
            });
        }

        // Récupérer la plainte mise à jour avec ses détails
        const plainte = await Plainte.findByIdWithDetails(id_plainte);

        res.json({
            message: 'Plainte rejetée avec succès',
            plainte
        });

    } catch (error) {
        console.error('Erreur lors du rejet de la plainte:', error);
        res.status(500).json({
            message: 'Erreur lors du rejet de la plainte',
            error: 'SERVER_ERROR'
        });
    }
};

const rechercheAvancee = async (req, res) => {
    try {
        const criteres = {
            numero_dossier: req.query.numero_dossier,
            nom_plaignant: req.query.nom_plaignant,
            date_debut: req.query.date_debut,
            date_fin: req.query.date_fin,
            statut: req.query.statut,
            categorie_infraction: req.query.categorie_infraction,
            lieu: req.query.lieu,
            description: req.query.description,
            page: parseInt(req.query.page) || 1,
            limite: parseInt(req.query.limite) || 10,
            tri: req.query.tri,
            ordre: req.query.ordre
        };

        const resultats = await Plainte.rechercheAvancee(criteres);

        // Enregistrer l'historique de recherche
        if (req.user) {  // Si l'utilisateur est authentifié
            await HistoriqueRecherche.create({
                id_utilisateur: req.user.userId,
                type_recherche: 'Plaintes',
                criteres: {
                    ...criteres,
                    date_recherche: new Date().toISOString()
                },
                resultats_count: resultats.total
            });
        }

        res.json({
            message: 'Recherche effectuée avec succès',
            total: resultats.total,
            page: criteres.page,
            limite: criteres.limite,
            nombre_pages: Math.ceil(resultats.total / criteres.limite),
            plaintes: resultats.plaintes
        });

    } catch (error) {
        console.error('Erreur lors de la recherche avancée:', error);
        res.status(500).json({
            message: 'Erreur lors de la recherche avancée',
            error: 'SEARCH_ERROR'
        });
    }
};

const annulerPlainte = async (req, res) => {
    try {
        const { id_plainte } = req.params;
        const { motif_annulation } = req.body;

        if (!motif_annulation) {
            return res.status(400).json({
                message: 'Le motif d\'annulation est requis',
                error: 'MOTIF_REQUIRED'
            });
        }

        const annulee = await Plainte.annulerPlainte(id_plainte, motif_annulation);

        if (!annulee) {
            return res.status(404).json({
                message: 'Plainte non trouvée',
                error: 'PLAINTE_NOT_FOUND'
            });
        }

        res.json({
            message: 'Plainte annulée avec succès'
        });

    } catch (error) {
        console.error('Erreur lors de l\'annulation de la plainte:', error);

        if (error.message === 'PLAINTE_NOT_FOUND') {
            return res.status(404).json({
                message: 'Plainte non trouvée',
                error: 'PLAINTE_NOT_FOUND'
            });
        }

        if (error.message === 'PLAINTE_ALREADY_CANCELLED') {
            return res.status(400).json({
                message: 'Cette plainte est déjà annulée',
                error: 'PLAINTE_ALREADY_CANCELLED'
            });
        }

        res.status(500).json({
            message: 'Erreur lors de l\'annulation de la plainte',
            error: 'SERVER_ERROR'
        });
    }
};

module.exports = {
    createPlainte,
    updatePlainte,
    deletePlainte,
    getUserPlaintes,
    getAllPlaintes,
    validerPlainte,
    rejeterPlainte,
    rechercheAvancee,
    annulerPlainte
}; 