const express = require('express');
const router = express.Router();
const interrogatoireController = require('../controllers/interrogatoireController');
const upload = require('../middleware/upload');

// Création d'un interrogatoire
router.post('/', interrogatoireController.createInterrogatoire);

// Récupération d'un interrogatoire par ID
router.get('/:id_interrogatoire', interrogatoireController.getInterrogatoireById);

// Récupération de tous les interrogatoires
router.get('/', interrogatoireController.getAllInterrogatoires);

// Mise à jour d'un interrogatoire
router.put('/:id_interrogatoire', upload, interrogatoireController.updateInterrogatoire);

// Suppression d'un interrogatoire
router.delete('/:id_interrogatoire', interrogatoireController.deleteInterrogatoire);

module.exports = router; 