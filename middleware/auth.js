const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        // Récupérer le token du header Authorization
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ 
                message: 'Authentification requise',
                error: 'NO_TOKEN'
            });
        }

        // Le token est normalement sous la forme "Bearer <token>"
        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ 
                message: 'Format de token invalide',
                error: 'INVALID_TOKEN_FORMAT'
            });
        }

        // Vérifier et décoder le token
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET || 'votre_secret_jwt');
        
        // Ajouter les informations de l'utilisateur à l'objet request
        req.user = {
            userId: decodedToken.userId,
            role: decodedToken.role
        };

        next();
    } catch (error) {
        console.error('Erreur d\'authentification:', error);
        res.status(401).json({ 
            message: 'Token invalide ou expiré',
            error: 'INVALID_TOKEN'
        });
    }
}; 