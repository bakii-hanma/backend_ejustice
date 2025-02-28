const express = require('express');
const router = express.Router();
const statistiquesController = require('../controllers/statistiquesController');
const authMiddleware = require('../middleware/auth');
const adminPenitentiaireMiddleware = require('../middleware/adminPenitentiaire');

// Appliquer les middlewares
router.use(authMiddleware);
router.use(adminPenitentiaireMiddleware);

// Route pour les statistiques détaillées
router.get('/', statistiquesController.getStatistiquesDetaillees);

module.exports = router; 