const express = require('express');
const router = express.Router();
const audienceController = require('../controllers/audienceController');

// Planifier une nouvelle audience
router.post('/planifier', audienceController.planifierAudience);

// Rendre un verdict pour une audience
router.post('/:id_audience/verdict', audienceController.rendreVerdict);

// Récupérer les audiences d'une enquête
router.get('/enquete/:id_enquete', audienceController.getAudiencesByEnquete);

// Nouvelle route pour récupérer le verdict
router.get('/:id_audience/verdict', audienceController.getVerdict);

module.exports = router; 