const express = require('express');
const router = express.Router();
const parquetController = require('../controllers/parquetController');

router.post('/', parquetController.createParquet);
router.get('/:id_parquet', parquetController.getParquetById);
router.get('/', parquetController.getAllParquets);
router.put('/:id_parquet', parquetController.updateParquet);
router.delete('/:id_parquet', parquetController.deleteParquet);

module.exports = router; 