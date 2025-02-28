const express = require('express');
const router = express.Router();
const plainteController = require('../controllers/plainteController');
const upload = require('../middleware/upload');
const HistoriqueRecherche = require('../models/HistoriqueRecherche');

// Routes sans middleware d'authentification
router.post('/', plainteController.createPlainte);
router.put('/:id_plainte', upload, plainteController.updatePlainte);
router.delete('/:id_plainte', plainteController.deletePlainte);
router.post('/mes-plaintes', plainteController.getUserPlaintes);
router.get('/', plainteController.getAllPlaintes);
router.put('/:id_plainte/valider', plainteController.validerPlainte);
router.put('/:id_plainte/rejeter', plainteController.rejeterPlainte);
router.get('/recherche', plainteController.rechercheAvancee);

// Route pour l'historique des recherches (sans authentification pour l'instant)
router.get('/historique-recherches', async (req, res) => {
    try {
        const historique = await HistoriqueRecherche.findByUser(req.user.userId);
        res.json({
            message: 'Historique des recherches récupéré avec succès',
            historique
        });
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'historique:', error);
        res.status(500).json({
            message: 'Erreur lors de la récupération de l\'historique',
            error: 'SERVER_ERROR'
        });
    }
});

// Route pour annuler une plainte
router.put('/:id_plainte/annuler', plainteController.annulerPlainte);

module.exports = router; 