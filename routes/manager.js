const express = require('express');
const Utilisateur = require('../models/Utilisateur');
const authMiddleware = require('../middlewares/auth');
const {managerMiddleware} = require('../middlewares/role');
const rendezVousControllers = require('../controllers/rendezVousControllers')

const router = express.Router();

// Modifier le rôle d'un utilisateur (seulement accessible aux admins)
router.put('/update-role/:id', authMiddleware, managerMiddleware, async (req, res) => {
    try {
        const { role } = req.body;
        const allowedRoles = ['client', 'mecanicien', 'manager'];

        if (!allowedRoles.includes(role)) {
            return res.status(400).json({ message: 'Rôle invalide' });
        }

        const user = await Utilisateur.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'Utilisateur introuvable' });

        user.role = role;
        await user.save();

        res.json({ message: 'Rôle mis à jour avec succès', user });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

router.put('/rendez-vous/valider/:rendezVousId', authMiddleware, managerMiddleware, rendezVousControllers.validerRendezVous);

module.exports = router;

