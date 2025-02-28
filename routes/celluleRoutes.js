const express = require('express');
const router = express.Router();
const celluleController = require('../controllers/celluleController');

// Routes pour la gestion des cellules
router.post('/', celluleController.createCellule);
router.get('/', celluleController.getAllCellules);
router.get('/:id_cellule', celluleController.getCelluleById);
router.put('/:id_cellule', celluleController.updateCellule);
router.delete('/:id_cellule', celluleController.deleteCellule);

module.exports = router; 