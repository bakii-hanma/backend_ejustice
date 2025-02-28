const User = require('../models/User');

const getEnquetesTransmises = async (req, res) => {
    try {
        const { id_parquet } = req.params;
        
        console.log('Informations utilisateur:', {
            userId: req.user.userId,
            role: req.user.role,
            id_parquet: req.user.id_parquet
        });
        
        // Vérifier que l'utilisateur est bien un magistrat de ce parquet
        if (req.user.role !== 'magistrat' || req.user.id_parquet != id_parquet) {
            console.log('Accès refusé:', {
                userRole: req.user.role,
                userParquet: req.user.id_parquet,
                requestedParquet: id_parquet
            });
            return res.status(403).json({
                message: 'Accès non autorisé à ce parquet',
                error: 'FORBIDDEN_ACCESS'
            });
        }

        console.log(`Récupération des dossiers transmis pour le parquet ${id_parquet}`);
        const enquetes = await User.getEnquetesTransmisesByMagistrat(id_parquet);
        console.log(`${enquetes.length} dossiers trouvés pour le parquet ${id_parquet}`);

        // Log détaillé de chaque enquête
        enquetes.forEach(enquete => {
            console.log(`
                Dossier ID: ${enquete.id_enquete}
                Titre: ${enquete.titre_enquete}
                Statut: ${enquete.statut_enquete}
                Date transmission: ${enquete.date_transmission}
                État dossier: ${enquete.etat_dossier}
                Enquêteur: ${enquete.enqueteur_nom} ${enquete.enqueteur_prenom}
            `);
        });

        res.json({
            message: 'Liste des enquêtes transmises récupérée avec succès',
            count: enquetes.length,
            enquetes: enquetes.map(enquete => ({
                ...enquete,
                date_transmission: new Date(enquete.date_transmission).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                })
            }))
        });
    } catch (error) {
        console.error('Erreur complète:', error);
        res.status(500).json({
            message: 'Erreur lors de la récupération des enquêtes',
            error: 'SERVER_ERROR'
        });
    }
};

const updateStatutEnquete = async (req, res) => {
    try {
        const { id_enquete } = req.params;
        const { nouveau_statut } = req.body;

        const success = await User.updateEnqueteStatus(id_enquete, nouveau_statut);

        if (!success) {
            return res.status(404).json({
                message: 'Enquête non trouvée',
                error: 'ENQUETE_NOT_FOUND'
            });
        }

        res.json({
            message: 'Statut de l\'enquête mis à jour avec succès'
        });
    } catch (error) {
        console.error('Erreur lors de la mise à jour du statut:', error);
        res.status(500).json({
            message: 'Erreur lors de la mise à jour du statut',
            error: 'SERVER_ERROR'
        });
    }
};

const planifierAudience = async (req, res) => {
    try {
        const { id_decision } = req.params;
        const { date_audience, lieu_audience, observations } = req.body;

        if (!date_audience || !lieu_audience) {
            return res.status(400).json({
                message: 'La date et le lieu de l\'audience sont requis',
                error: 'MISSING_REQUIRED_FIELDS'
            });
        }

        const success = await User.planifierAudience({
            id_decision,
            date_audience,
            lieu_audience,
            observations
        });

        if (!success) {
            return res.status(404).json({
                message: 'Décision non trouvée',
                error: 'DECISION_NOT_FOUND'
            });
        }

        res.json({
            message: 'Audience planifiée avec succès'
        });
    } catch (error) {
        console.error('Erreur lors de la planification de l\'audience:', error);
        res.status(500).json({
            message: 'Erreur lors de la planification de l\'audience',
            error: 'SERVER_ERROR'
        });
    }
};

module.exports = {
    getEnquetesTransmises,
    updateStatutEnquete,
    planifierAudience
}; 