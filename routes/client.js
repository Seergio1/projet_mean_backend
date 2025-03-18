const express = require('express');

const authMiddleware = require('../middlewares/auth');
const rendezVousControllers = require('../controllers/rendezVousControllers')
const devisControllers = require('../controllers/DevisControllers')


const router = express.Router();

router.get('/test_client', authMiddleware, (req, res) => {
    res.json({ message: 'Bienvenue sur la route client !' });
});

router.post('/rendez-vous/prise',authMiddleware,rendezVousControllers.prendreRendezVous)

router.post('/devis/demande',authMiddleware,devisControllers.demandeDevis)

router.post('/devis/historique_tous_vehicule',authMiddleware,devisControllers.getAllHistoriqueDevisClient)

router.post('/devis/historique_vehicule',authMiddleware,devisControllers.getHistoriqueDevisClientVehicule)




module.exports = router;
