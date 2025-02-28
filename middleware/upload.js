const multer = require('multer');

const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
        files: 5
    }
}).any();

module.exports = (req, res, next) => {
    upload(req, res, function (err) {
        console.log('Files reçus:', req.files);
        console.log('Body reçu:', req.body);

        if (err instanceof multer.MulterError) {
            console.error('Multer error:', err);
            return res.status(400).json({
                message: 'Erreur lors du téléchargement des fichiers',
                error: err.message
            });
        } else if (err) {
            console.error('Upload error:', err);
            return res.status(400).json({
                message: 'Erreur lors du téléchargement des fichiers',
                error: 'UPLOAD_ERROR'
            });
        }

        // Convertir id_utilisateur en nombre
        if (req.body.id_utilisateur) {
            req.body.id_utilisateur = parseInt(req.body.id_utilisateur);
        }

        next();
    });
}; 