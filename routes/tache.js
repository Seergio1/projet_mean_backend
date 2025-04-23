const express = require('express');
const Tache = require('../models/Tache');
const authMiddleware = require('../middlewares/auth');
const {mecanicienMiddleware} = require('../middlewares/role');

const router = express.Router();

// get liste taches by id_mecanicien
router.get('/taches', authMiddleware, mecanicienMiddleware, async (req, res) => {
    try {
        const idUtilisateur = req.user.id;
        console.log(idUtilisateur);
        const taches = await Tache.find ({ $and : [
            { id_mecanicien: idUtilisateur },
            { etat : { $gte : 0 } } // $lte 
        ]
    });

        res.status(200).json(taches);
    } catch (error) {
        res.status(500).json({ message:"taches non trouver", error });
    }
});

// assigner un nouveau tache
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

// update tache
router.put('/:id', authMiddleware, mecanicienMiddleware, async (req, res) => {
    try {
        const updateTache = await Tache.findByIdAndUpdate(req.params.id, req.body, { new: true});
        res.status(201).json(updateTache);
    } catch (error) {
        res.status(500).json({ message: "erreur update tache", error});
    } 
});

const sommeDurer = (services) => {
    let durer = 0;
    services.forEach((service) => {
        durer += service.durer;
    });

    return durer;
};

module.exports = {router, sommeDurer};