const express = require('express');

const authMiddleware = require('../middlewares/auth');
const rendezVousControllers = require('../controllers/rendezVousControllers');
const commentaireControllers = require('../controllers/commentaireControllers');
const devisControllers = require('../controllers/DevisControllers')
const serviceControllers = require('../controllers/serviceControllers')
const factureControllers = require('../controllers/factureControllers')
const notificationControllers = require('../controllers/notificationControllers')


const router = express.Router();

router.get('/test_client', authMiddleware, (req, res) => {
    res.json({ message: 'Bienvenue sur la route client !' });
});


router.put('/commentaire', commentaireControllers.insertCommentaire);

router.get('/commentaires', commentaireControllers.findAllCommentaire);
router.post('/devis/demande',authMiddleware,devisControllers.demandeDevis) //
router.post('/rendez-vous/proposition',authMiddleware,rendezVousControllers.proposerRendezVous)

router.post('/rendez-vous/validation',authMiddleware,rendezVousControllers.validerRendezVous)

router.delete('/rendez-vous/annulation/:rendezVousId', rendezVousControllers.annulerRendezVous)

router.post('/devis/demande',authMiddleware,devisControllers.demandeDevis) 

router.post('/devis/historique_tous_vehicule',authMiddleware,devisControllers.getAllHistoriqueDevisClient)

router.post('/devis/historique_vehicule',authMiddleware,devisControllers.getHistoriqueDevisClientVehicule)

router.post('/service/historique_tous_vehicule',authMiddleware,serviceControllers.getAllHistoriqueServiceClient)

router.post('/service/historique_vehicule',authMiddleware,serviceControllers.getHistoriqueServiceClientVehicule)

router.post('/facture/demande',authMiddleware,factureControllers.ajoutFacture)

router.get('/facture/generer/:id',authMiddleware,factureControllers.genererFacture)

router.get('/factures/:idClient',authMiddleware,factureControllers.getAllFactureByIdClient)

router.get('/notifications/get',authMiddleware,notificationControllers.getNotificationRendezVous)



module.exports = router;
