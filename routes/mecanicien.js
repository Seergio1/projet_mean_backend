const express = require('express');
const authMiddleware = require('../middlewares/auth');
const {mecanicienMiddleware} = require('../middlewares/role')
const tacheControllers = require('../controllers/tacheControllers')
const rendezVousControllers = require('../controllers/rendezVousControllers') 
const factureControllers = require('../controllers/factureControllers')


const router = express.Router();

router.get('/test_mecanicien', authMiddleware, mecanicienMiddleware, (req, res) => {
    res.json({ message: 'Bienvenue sur la route mécanicien !' });
});

router.put('/tache/modification_etat/:tacheId', authMiddleware, mecanicienMiddleware, tacheControllers.updateEtatTache);

router.get('/taches/:mecanicienId', authMiddleware, mecanicienMiddleware, tacheControllers.getAllTacheMecanicien);

router.get('/rendez-vous/:rendezVousId', authMiddleware, mecanicienMiddleware, rendezVousControllers.getRendezVousById);

router.post('/facture/demande',authMiddleware,mecanicienMiddleware,factureControllers.ajoutFacture)

router.get('/facture/pdf/:id',authMiddleware,mecanicienMiddleware,factureControllers.genererFacture)

router.put('/facture/mise_a_jour/:factureId',authMiddleware,mecanicienMiddleware,factureControllers.miseAJourFacture)

router.get('/factures/:idClient',authMiddleware,mecanicienMiddleware,factureControllers.getAllFactureByIdClient)

router.put('/facture/modification_etat_facture/:id_tache', authMiddleware, mecanicienMiddleware, tacheControllers.updateFactureTacheEtatRoute);

router.get('/facture/tache/:tacheId', authMiddleware, mecanicienMiddleware, factureControllers.getFactureByTache);


module.exports = router;
