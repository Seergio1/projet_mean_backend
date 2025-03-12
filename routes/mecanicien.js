const express = require('express');
// const Utilisateur = require('../models/Utilisateur');
const authMiddleware = require('../middlewares/auth');
// const managerMiddleware = require('../middlewares/role');
const mecanicienMiddleware = require('../middlewares/role')

const router = express.Router();

router.get('/test_mecanicien', authMiddleware, mecanicienMiddleware, (req, res) => {
    res.json({ message: 'Bienvenue sur la route mécanicien !' });
});




module.exports = router;
