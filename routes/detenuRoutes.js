const express = require('express');
const router = express.Router();
const detenuController = require('../controllers/detenuController');

// Routes pour les détenus
router.post('/', detenuController.createDetenu);
router.get('/', detenuController.getAllDetenus);
router.get('/statistiques', detenuController.getStatistiques);
router.get('/:id_detenu', detenuController.getDetenuById);
router.put('/:id_detenu', detenuController.updateDetenu);
router.post('/:id_detenu/transferer', detenuController.transfererDetenu);
router.post('/:id_detenu/liberer', detenuController.libererDetenu);
router.delete('/:id_detenu', detenuController.deleteDetenu);

module.exports = router; 