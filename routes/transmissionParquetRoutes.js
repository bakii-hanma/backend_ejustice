const express = require('express');
const router = express.Router();
const transmissionParquetController = require('../controllers/transmissionParquetController');

router.post('/', transmissionParquetController.createTransmission);
router.get('/:id_transmission', transmissionParquetController.getTransmissionById);
router.get('/', transmissionParquetController.getAllTransmissions);
router.put('/:id_transmission', transmissionParquetController.updateTransmission);
router.delete('/:id_transmission', transmissionParquetController.deleteTransmission);

module.exports = router; 