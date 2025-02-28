const Detenu = require('../models/Detenu');

const getStatistiquesDetaillees = async (req, res) => {
    try {
        const stats = await Detenu.getStatistiquesDetaillees();
        res.json(stats);
    } catch (error) {
        console.error('Erreur lors de la récupération des statistiques:', error);
        res.status(500).json({
            message: 'Erreur lors de la récupération des statistiques',
            error: 'SERVER_ERROR'
        });
    }
};

module.exports = {
    getStatistiquesDetaillees
}; 