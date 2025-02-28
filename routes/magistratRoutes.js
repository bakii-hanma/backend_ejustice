const express = require('express');
const router = express.Router();
const magistratController = require('../controllers/magistratController');
const authMiddleware = require('../middleware/auth');
const magistratMiddleware = require('../middleware/magistrat');

// Appliquer les middlewares d'authentification et de vérification du rôle magistrat
router.use(authMiddleware);
router.use(magistratMiddleware);

// Route pour récupérer les dossiers transmis à un parquet spécifique
router.get('/dossiers-transmis/:id_parquet', magistratController.getEnquetesTransmises);

module.exports = router;