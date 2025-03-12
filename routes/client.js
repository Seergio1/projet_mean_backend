const express = require('express');

const authMiddleware = require('../middlewares/auth');


const router = express.Router();

router.get('/test_client', authMiddleware, (req, res) => {
    res.json({ message: 'Bienvenue sur la route client !' });
});




module.exports = router;
