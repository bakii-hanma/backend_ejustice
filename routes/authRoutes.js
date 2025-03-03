const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Route de statut pour vérifier que le backend fonctionne
router.get('/status', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Le système d\'authentification est opérationnel',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/users-by-role', authController.getUsersByRole);

module.exports = router; 