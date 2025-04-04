const express = require('express');

const authMiddleware = require('../middlewares/auth');
const rendezVousControllers = require('../controllers/rendezVousControllers')
const devisControllers = require('../controllers/DevisControllers')
const serviceControllers = require('../controllers/serviceControllers')
const factureControllers = require('../controllers/factureControllers')
const notificationControllers = require('../controllers/notificationControllers')
const vehiculeControllers = require('../controllers/vehiculeControllers')
const tacheControllers = require('../controllers/tacheControllers')
const articleControllers = require('../controllers/articleController')



const router = express.Router();

router.get('/test_client', authMiddleware, (req, res) => {
    res.json({ message: 'Bienvenue sur la route client !' });
});

// integrer le 03/04/25
router.post('/devis/demande',authMiddleware,devisControllers.demandeDevis) 

router.post('/devis/historique_tous_vehicule',authMiddleware,devisControllers.getAllHistoriqueDevisClient) 

router.post('/devis/historique_vehicule',authMiddleware,devisControllers.getHistoriqueDevisClientVehicule)



router.post('/service/historique_tous_vehicule',authMiddleware,serviceControllers.getAllHistoriqueServiceClient)

router.post('/service/historique_vehicule',authMiddleware,serviceControllers.getHistoriqueServiceClientVehicule)

router.post('/facture/demande',authMiddleware,factureControllers.ajoutFacture)

router.get('/facture/generer/:id',authMiddleware,factureControllers.genererFacture)

router.get('/factures/:idClient',authMiddleware,factureControllers.getAllFactureByIdClient)


router.get('/articles',authMiddleware,articleControllers.getAllArticle)

// integrer le 02/04/25
router.delete('/rendez-vous/annulation/:rendezVousId',authMiddleware, rendezVousControllers.annulerRendezVous)

router.get('/taches/tous/:rendezVousId',authMiddleware,tacheControllers.getEtatTacheRendezVous)

// intégrée le 01/04/25
router.post('/rendez-vous/validation',authMiddleware,rendezVousControllers.validerRendezVous)

router.get('/vehicules/:utilisateurId',authMiddleware,vehiculeControllers.getVehicules);

router.get('/services',authMiddleware,serviceControllers.getAllService)

router.get('/rendez-vous/indisponible',authMiddleware,tacheControllers.getTacheDateIndisponible)

router.get('/rendez-vous/tous/:idClient',authMiddleware, rendezVousControllers.getAllRendezVousClient)

// integrée le 30/03/25
router.get('/notifications/:id_client',authMiddleware,notificationControllers.getNotificationsByIdClient)

router.put('/notification/etat/:id_notification',authMiddleware,notificationControllers.updateEtatNotification)

router.put('/notifications/etat/:clientId',authMiddleware,notificationControllers.updateAllEtatNotification)

router.post('/article-service',authMiddleware, articleControllers.createArticleServiceController);

module.exports = router;
