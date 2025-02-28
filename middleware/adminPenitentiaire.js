module.exports = (req, res, next) => {
    if (req.user && req.user.role === 'admin_penitentiaire') {
        next();
    } else {
        res.status(403).json({
            message: 'Accès refusé. Droits d\'administrateur pénitentiaire requis',
            error: 'FORBIDDEN_ACCESS'
        });
    }
}; 