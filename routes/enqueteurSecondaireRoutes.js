const express = require('express');
const router = express.Router();
const enqueteurSecondaireController = require('../controllers/enqueteurSecondaireController');

// Ajouter un enquêteur secondaire
router.post('/', enqueteurSecondaireController.addEnqueteurSecondaire);

// Récupérer les enquêteurs secondaires par enquête
router.get('/:id_enquete', enqueteurSecondaireController.getEnqueteursSecondairesByEnquete);

// Supprimer un enquêteur secondaire
router.delete('/:id_enqueteur_secondaire', enqueteurSecondaireController.removeEnqueteurSecondaire);

module.exports = router; 