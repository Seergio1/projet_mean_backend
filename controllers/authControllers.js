const Utilisateur = require('../models/Utilisateur');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
    try {
        const { nom, email, contact, password } = req.body;
        const user = new Utilisateur({ nom, email, contact, password });
        await user.save();
        res.status(201).json({ message: 'Utilisateur créé !',user : {id: user._id, nom: user.nom, email: user.email, role: user.role } });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la création de l'utilisateur "});
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await Utilisateur.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Utilisateur introuvable' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Mot de passe incorrect' });

        // Création du Token
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token, user: { id: user._id, nom: user.nom, email: user.email, role: user.role } });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors du login' });
    }
};
