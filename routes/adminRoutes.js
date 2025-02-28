const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

// Appliquer le middleware d'authentification et de vérification admin à toutes les routes
router.use(authMiddleware);
router.use(adminMiddleware);

// Routes de gestion des utilisateurs
router.post('/users', adminController.createUser);
router.put('/users/:id_utilisateur', adminController.updateUser);
router.post('/users/:id_utilisateur/reset-password', adminController.resetPassword);
router.delete('/users/:id_utilisateur', adminController.deleteUser);
router.get('/users', adminController.getAllUsers);

module.exports = router; 