const Utilisateur = require("../models/Utilisateur")
const Vehicule = require("../models/Vehicule")

// Service pour récupérer les véhicules d'un utilisateur
const getVehiculesByUtilisateurId = async (utilisateurId) => {
    try {
        const utilisateur = await Utilisateur.findById(utilisateurId).populate({
            path: 'vehicules',
            populate: { path: 'id_modele', select: 'nom' } // Pour avoir aussi les infos du modèle
        });
        if (!utilisateur) {
            throw new Error('Utilisateur non trouvé');
        }
        return utilisateur.vehicules;  // Retourne les véhicules de l'utilisateur
    } catch (error) {
        throw new Error(error.message);
    }
};

const addVehicule = async (vehicule) => {
    try {
        const newVehicule = await Vehicule.create(vehicule);
        return newVehicule;
    } catch (error) {
        throw new Error(error.message);
    }   
}

const addVehiculeToUtilisateur = async (utilisateurId, id_modele, numero, marque) => {
    try {
        const utilisateur = await Utilisateur.findById(utilisateurId);
        if (!utilisateur) {
            throw new Error('Utilisateur non rencontré');
        }
        const vehicule = await addVehicule({ id_modele, numero, marque });
        utilisateur.vehicules.push(vehicule._id);
        await utilisateur.save();
        return utilisateur;
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = {
    getVehiculesByUtilisateurId,
    addVehiculeToUtilisateur
};