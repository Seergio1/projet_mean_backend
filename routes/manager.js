const express = require('express');
const Utilisateur = require('../models/Utilisateur');
const authMiddleware = require('../middlewares/auth');
const {managerMiddleware} = require('../middlewares/role');
const rendezVousControllers = require('../controllers/rendezVousControllers')
const stockControllers = require('../controllers/stockControllers');
const commentaireControllers = require('../controllers/commentaireControllers');

const modeleControllers = require('../controllers/modeleController')

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

        res.json({ message: 'Rôle mis à jour avec succès', data: user });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

router.get('/profil', authMiddleware, managerMiddleware, async (req, res) => {
    try {
        const profil = await Utilisateur.find();

        res.json({ message: 'liste des utilisateurs', data: profil});

    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

router.put('/rendez-vous/valider/:rendezVousId', authMiddleware, managerMiddleware, rendezVousControllers.validerRendezVous);

router.get('/mouvement-stock', authMiddleware, managerMiddleware, stockControllers.getAllMouvementStock);

router.put('/insert-mvmt', authMiddleware, managerMiddleware, stockControllers.insertMouvementStock);

router.get("/article", authMiddleware, managerMiddleware, stockControllers.getMouvementArticle);

router.get("/article-depense", authMiddleware, managerMiddleware, stockControllers.getTotalDepenseArticle);

router.post('/modele/ajout',authMiddleware,modeleControllers.createModele)

router.put('/modele/update/:id',authMiddleware,modeleControllers.updateModeleById)

router.delete('/modele/delete/:id',authMiddleware,modeleControllers.removeModele)

router.get('/commentaires', commentaireControllers.findAllCommentaire);

 
module.exports = router;

