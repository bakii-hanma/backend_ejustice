const express = require('express');
const router = express.Router();
const enqueteController = require('../controllers/enqueteController');
const decisionMagistratController = require('../controllers/decisionMagistratController');

// Création d’une enquête
router.post('/', enqueteController.createEnquete);

// Récupération d’une enquête par ID
router.get('/:id_enquete', enqueteController.getEnqueteById);

// Récupération de toutes les enquêtes
router.get('/', enqueteController.getAllEnquetes);

// Mise à jour d’une enquête
router.put('/:id_enquete', enqueteController.updateEnquete);

// Suppression d’une enquête
router.delete('/:id_enquete', enqueteController.deleteEnquete);

// Ajouter cette route
router.post('/:id_enquete/decision', decisionMagistratController.prendreDecision);

module.exports = router; 