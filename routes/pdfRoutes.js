const express = require('express');
const router = express.Router();
const pdfController = require('../controllers/pdfController');
const authMiddleware = require('../middleware/auth');

router.post('/convert-html-to-pdf', authMiddleware, pdfController.convertHtmlToPdf);

module.exports = router; 