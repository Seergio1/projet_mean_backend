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

router.post('/facture/demande',authMiddleware,factureControllers.ajoutFacture)

router.get('/facture/pdf/:id',authMiddleware,factureControllers.genererFacture)

router.put('/facture/mise_a_jour/:factureId',authMiddleware,factureControllers.miseAJourFacture)

router.get('/factures/:idClient',authMiddleware,factureControllers.getAllFactureByIdClient)


module.exports = router;
