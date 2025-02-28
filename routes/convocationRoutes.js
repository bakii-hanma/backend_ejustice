const express = require('express');
const router = express.Router();
const convocationController = require('../controllers/convocationController');

// Créer une nouvelle convocation
router.post('/', convocationController.createConvocation);

// Récupérer les convocations d'une enquête
router.get('/enquete/:id_enquete', convocationController.getConvocationsByEnquete);

// Mettre à jour le statut d'une convocation
router.put('/:id_convocation/status', convocationController.updateConvocationStatus);

// Ajouter une relance
router.post('/:id_convocation/relance', convocationController.addRelance);

module.exports = router; 