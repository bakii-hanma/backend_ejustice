const User = require('../models/User');

module.exports = async (req, res, next) => {
    try {
        if (req.user && req.user.role === 'magistrat') {
            // Récupérer les informations complètes de l'utilisateur
            const magistrat = await User.findById(req.user.userId);
            
            if (!magistrat) {
                return res.status(404).json({
                    message: 'Utilisateur non trouvé',
                    error: 'USER_NOT_FOUND'
                });
            }

            // Ajouter l'id_parquet à l'objet req.user
            req.user.id_parquet = magistrat.id_parquet;
            
            if (magistrat.statut_magistrat !== 'Actif') {
                return res.status(403).json({
                    message: 'Compte magistrat inactif',
                    error: 'INACTIVE_ACCOUNT'
                });
            }

            next();
        } else {
            res.status(403).json({
                message: 'Accès refusé. Droits de magistrat requis',
                error: 'FORBIDDEN_ACCESS'
            });
        }
    } catch (error) {
        console.error('Erreur dans le middleware magistrat:', error);
        res.status(500).json({
            message: 'Erreur lors de la vérification des droits',
            error: 'SERVER_ERROR'
        });
    }
}; 