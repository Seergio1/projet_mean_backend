const express = require('express');

const authMiddleware = require('../middlewares/auth');
const rendezVousControllers = require('../controllers/rendezVousControllers');
const commentaireControllers = require('../controllers/commentaireControllers');


const router = express.Router();

router.get('/test_client', authMiddleware, (req, res) => {
    res.json({ message: 'Bienvenue sur la route client !' });
});

router.post('/rendez-vous/prise',authMiddleware,rendezVousControllers.prendreRendezVous)

router.put('/commentaire', commentaireControllers.insertCommentaire);

router.get('/commentaires', commentaireControllers.findAllCommentaire);

module.exports = router;
