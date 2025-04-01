const Utilisateur = require("../models/Utilisateur")

// Service pour récupérer les véhicules d'un utilisateur
const getVehiculesByUtilisateurId = async (utilisateurId) => {
    try {
        const utilisateur = await Utilisateur.findById(utilisateurId).populate('vehicules');  // Récupère les véhicules liés à l'utilisateur
        if (!utilisateur) {
            throw new Error('Utilisateur non trouvé');
        }
        return utilisateur.vehicules;  // Retourne les véhicules de l'utilisateur
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = {
    getVehiculesByUtilisateurId,
};