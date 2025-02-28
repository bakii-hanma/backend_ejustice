const express = require('express');
const router = express.Router();
const adminPenitentiaireController = require('../controllers/adminPenitentiaireController');
const authMiddleware = require('../middleware/auth');
const adminPenitentiaireMiddleware = require('../middleware/adminPenitentiaire');

// Appliquer les middlewares
router.use(authMiddleware);
router.use(adminPenitentiaireMiddleware);

// Routes pour la gestion des détenus
router.post('/detenus', adminPenitentiaireController.admissionDetenu);
router.put('/detenus/:id_detenu/transfert', adminPenitentiaireController.transfererDetenu);
router.put('/detenus/:id_detenu/liberation', adminPenitentiaireController.libererDetenu);
router.get('/statistiques', adminPenitentiaireController.getStatistiques);
router.get('/detenus', adminPenitentiaireController.getDetenus);
router.get('/detenus/:id_detenu', adminPenitentiaireController.getDetenuById);

// Routes CRUD pour la gestion des cellules
router.post('/cellules', adminPenitentiaireController.creerCellule);           // Créer
router.get('/cellules', adminPenitentiaireController.getCellules);             // Lister toutes
router.get('/cellules/:id_cellule', adminPenitentiaireController.getCelluleById);  // Détails d'une cellule
router.put('/cellules/:id_cellule', adminPenitentiaireController.updateCellule);   // Modifier
router.delete('/cellules/:id_cellule', adminPenitentiaireController.deleteCellule); // Supprimer
router.get('/cellules/:nom_cellule/occupants', adminPenitentiaireController.getOccupantsCellule); // Liste des occupants

// Routes pour la gestion des peines
router.post('/peines', adminPenitentiaireController.ajouterPeine);
router.get('/detenus/:id_detenu/peines', adminPenitentiaireController.getPeinesDetenu);

// Route pour les statistiques du tableau de bord
router.get('/stats', adminPenitentiaireController.getStats);

module.exports = router; 