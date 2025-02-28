const express = require('express');
const router = express.Router();
const peineController = require('../controllers/peineController');

// Routes CRUD pour les peines
router.post('/', peineController.createPeine);
router.get('/', peineController.getAllPeines);
router.get('/:id_peine', peineController.getPeineById);
router.put('/:id_peine', peineController.updatePeine);
router.delete('/:id_peine', peineController.deletePeine);

// Route pour obtenir les peines d'un détenu spécifique
router.get('/detenu/:id_detenu', peineController.getPeinesByDetenu);

module.exports = router; 