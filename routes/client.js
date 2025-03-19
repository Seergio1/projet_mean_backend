const express = require('express');

const authMiddleware = require('../middlewares/auth');
const rendezVousControllers = require('../controllers/rendezVousControllers')
const devisControllers = require('../controllers/DevisControllers')
const serviceControllers = require('../controllers/serviceControllers')
const factureControllers = require('../controllers/factureControllers')


const router = express.Router();

router.get('/test_client', authMiddleware, (req, res) => {
    res.json({ message: 'Bienvenue sur la route client !' });
});

router.post('/rendez-vous/prise',authMiddleware,rendezVousControllers.prendreRendezVous)

router.post('/devis/demande',authMiddleware,devisControllers.demandeDevis) //

router.post('/devis/historique_tous_vehicule',authMiddleware,devisControllers.getAllHistoriqueDevisClient)

router.post('/devis/historique_vehicule',authMiddleware,devisControllers.getHistoriqueDevisClientVehicule)

router.post('/service/historique_tous_vehicule',authMiddleware,serviceControllers.getAllHistoriqueServiceClient)

router.post('/service/historique_vehicule',authMiddleware,serviceControllers.getHistoriqueServiceClientVehicule)

router.post('/facture/demande',authMiddleware,factureControllers.ajoutFacture)


module.exports = router;
