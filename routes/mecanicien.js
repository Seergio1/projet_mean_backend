const express = require('express');
const authMiddleware = require('../middlewares/auth');
const {mecanicienMiddleware} = require('../middlewares/role')
const tacheControllers = require('../controllers/tacheControllers')


const router = express.Router();

router.get('/test_mecanicien', authMiddleware, mecanicienMiddleware, (req, res) => {
    res.json({ message: 'Bienvenue sur la route mécanicien !' });
});

router.put('/tache/modification_etat/:tacheId', authMiddleware, mecanicienMiddleware, tacheControllers.updateEtatTache);




module.exports = router;
