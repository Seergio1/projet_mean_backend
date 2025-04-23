const { getVehiculesByUtilisateurId, addVehiculeToUtilisateur } = require('../services/VehiculeService');
const mongoose = require('mongoose');
exports.getVehicules = async (req, res) => {
    const { utilisateurId } = req.params; 

    try {
        if (!utilisateurId) {
            return res.status(400).json({ message: "Tous les champs sont requis" });
        }
        const vehicules = await getVehiculesByUtilisateurId(utilisateurId);  
        res.status(201).json({ message: "Recupération des vehicules de ce client", data: vehicules }); 
    } catch (error) {
        console.error("Erreur lors de la récuperation des vehicules de ce client: ", error.message);
        res.status(500).json({ message: "Erreur lors de la récuperation des vehicules de ce client :"+error.message });  
    }
};

exports.addVehiculeToUtilisateur = async (req, res) => {
    const {utilisateurId, id_modele, numero, marque} = req.body
    try {
        if (!utilisateurId || !id_modele || !numero || !marque) {
            return res.status(400).json({
                message: "Tous les champs sont requis",
                data: { utilisateurId, id_modele, numero, marque }
            });
        }
        if (!mongoose.Types.ObjectId.isValid(utilisateurId) || !mongoose.Types.ObjectId.isValid(id_modele)) {
            return res.status(400).json({ message: "ID utilisateur ou ID modele invalide" ,data:{utilisateurId,id_modele}});
        }
        const utilisateur = await addVehiculeToUtilisateur(utilisateurId,id_modele,numero,marque)
        res.status(201).json({ message: "Vehicule ajouté avec succès pour ce client", data: utilisateur }); 
    } catch (error) {
        console.error("Erreur lors de l'ajout du vehicule de ce client: ", error.message);
        res.status(500).json({ message: "Erreur lors de la récuperation des vehicules de ce client :"+error.message });  
    }
}

