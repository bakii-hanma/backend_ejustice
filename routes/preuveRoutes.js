const express = require('express');
const router = express.Router();
const preuveController = require('../controllers/preuveController');

// Création d’une preuve
router.post('/', preuveController.createPreuve);

// Récupération d’une preuve par ID
router.get('/:id_preuve', preuveController.getPreuveById);

// Récupération de toutes les preuves
router.get('/', preuveController.getAllPreuves);

// Mise à jour d’une preuve
router.put('/:id_preuve', preuveController.updatePreuve);

// Suppression d’une preuve
router.delete('/:id_preuve', preuveController.deletePreuve);

module.exports = router; 