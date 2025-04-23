const Modele = require("../models/Modele");

const getAllModele = async () => {
    try {
        const modeles = await Modele.find();
        if (!modeles || modeles.length === 0) {
            throw new Error('Aucun modèle de véhicule trouvé.');
        }
        return modeles;
    } catch (error) {
        throw new Error(`Erreur lors de la récupération des modèles : ${error.message}`);
    }
};

const addModele = async (nom_modele) => {
    try {
        if (!nom_modele || nom_modele.trim() === '') {
            throw new Error("Le nom du modèle est requis.");
        }

        // Vérifie s'il existe déjà un modèle avec le même nom
        const existing = await Modele.findOne({ nom: nom_modele.trim() });
        if (existing) {
            throw new Error("Un modèle avec ce nom existe déjà.");
        }

        const modele = await Modele.create({ nom: nom_modele.trim() });
        return modele;
    } catch (error) {
        throw new Error(`Erreur lors de l'ajout du modèle : ${error.message}`);
    }
};

const deleteModele = async (id_modele) => {
    try {
        const deleted = await Modele.findByIdAndDelete(id_modele);
        if (!deleted) {
            throw new Error(`Aucun modèle trouvé avec l'ID : ${id_modele}`);
        }
        return deleted;
    } catch (error) {
        throw new Error(`Erreur lors de la suppression du modèle : ${error.message}`);
    }
};

const updateModele = async (id_modele, nom_modele) => {
    try {
        if (!nom_modele || nom_modele.trim() === '') {
            throw new Error("Le nom du modèle est requis.");
        }

        const modele = await Modele.findByIdAndUpdate(
            id_modele,
            { nom: nom_modele.trim() },
            { new: true, runValidators: true }
        );

        if (!modele) {
            throw new Error(`Modèle de véhicule non trouvé avec l'ID : ${id_modele}`);
        }

        return modele;
    } catch (error) {
        throw new Error(`Erreur lors de la mise à jour du modèle : ${error.message}`);
    }
};

module.exports = {
    getAllModele,
    addModele,
    deleteModele,
    updateModele
};
