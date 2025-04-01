const { getVehiculesByUtilisateurId } = require('../services/VehiculeService');

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
