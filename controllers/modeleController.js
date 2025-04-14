const mongoose = require('mongoose');
const { getAllModele, addModele, deleteModele, updateModele } = require('../services/ModeleService');

exports.getModeles = async (req, res) => {
    try {
        const modeles = await getAllModele();
        res.status(200).json({ message: "Liste des modèles récupérée avec succès", data: modeles });
    } catch (error) {
        console.error("Erreur lors de la récupération des modèles :", error.message);
        res.status(500).json({ message: "Erreur serveur : " + error.message });
    }
};

exports.createModele = async (req, res) => {
    const { nom } = req.body;

    try {
        if (!nom || nom.trim() === '') {
            return res.status(400).json({ message: "Le nom du modèle est requis" });
        }

        const nouveauModele = await addModele(nom);
        res.status(201).json({ message: "Modèle ajouté avec succès", data: nouveauModele });
    } catch (error) {
        console.error("Erreur lors de l'ajout du modèle :", error.message);
        res.status(400).json({ message: "Erreur : " + error.message });
    }
};

exports.removeModele = async (req, res) => {
    const { id } = req.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "ID invalide" });
        }

        const deleted = await deleteModele(id);
        res.status(200).json({ message: "Modèle supprimé avec succès", data: deleted });
    } catch (error) {
        console.error("Erreur lors de la suppression du modèle :", error.message);
        res.status(400).json({ message: "Erreur : " + error.message });
    }
};

exports.updateModeleById = async (req, res) => {
    const { id } = req.params;
    const { nom } = req.body;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "ID invalide" });
        }

        if (!nom || nom.trim() === '') {
            return res.status(400).json({ message: "Le nom du modèle est requis" });
        }

        const updated = await updateModele(id, nom);
        res.status(200).json({ message: "Modèle mis à jour avec succès", data: updated });
    } catch (error) {
        console.error("Erreur lors de la mise à jour du modèle :", error.message);
        res.status(400).json({ message: "Erreur : " + error.message });
    }
};
