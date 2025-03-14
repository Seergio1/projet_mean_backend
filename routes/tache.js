const express = require('express');
const Tache = require('../models/Tache');
const authMiddleware = require('../middlewares/auth');
const {mecanicienMiddleware} = require('../middlewares/role');

const router = express.Router();

router.get('/taches', authMiddleware, mecanicienMiddleware, async (req, res) => {
    try {
        const idUtilisateur = req.user.id;
        console.log(idUtilisateur);
        const taches = await Tache.find ({ id_mecanicien: idUtilisateur });

        res.status(200).json(taches);
    } catch (error) {
        res.status(500).json({ message:"taches non trouver", error });
    }
});

router.put('/tache', authMiddleware, mecanicienMiddleware, async (req, res) => {
    try {
        const id_mecanicien = req.user.id;
        const { id_vehicule, libelle, prix, etat } = req.body;

        const tache = new Tache({ id_mecanicien, id_vehicule, libelle, prix, etat});
        await tache.save();

        res.status(201).json({ message : 'tache cree !', tache : tache});
    } catch (error) {
        res.status(500).json({ message: "erreur enregistrement tache", error});
    }
});

module.exports = router;