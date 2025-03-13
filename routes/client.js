const express = require('express');

const authMiddleware = require('../middlewares/auth');
const rendezVousControllers = require('../controllers/rendezVousControllers')


const router = express.Router();

router.get('/test_client', authMiddleware, (req, res) => {
    res.json({ message: 'Bienvenue sur la route client !' });
});

router.post('/rendez-vous/prise',authMiddleware,rendezVousControllers.prendreRendezVous)




module.exports = router;
