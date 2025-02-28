const express = require('express');
const router = express.Router();
const decisionMagistratController = require('../controllers/decisionMagistratController');
const authMiddleware = require('../middleware/auth');
const magistratMiddleware = require('../middleware/magistrat');

// Appliquer les middlewares
router.use(authMiddleware);
router.use(magistratMiddleware);

// Routes
router.post('/', decisionMagistratController.createDecision);
// ... autres routes

module.exports = router; 