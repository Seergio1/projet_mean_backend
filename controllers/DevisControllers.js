const { demandeDevis, getAllHistoriqueDevisClient, getHistoriqueDevisClientVehicule } = require("../services/DevisService");

exports.demandeDevis = async (req, res) => {
    try {
        // Récupération des données de la requête
        const { clientId, servicesIds, vehiculeId, artCheck } = req.body;
        
        // Vérification des données nécessaires
        if (!clientId || !servicesIds || !vehiculeId || servicesIds.length === 0 || artCheck === undefined) {
            return res.status(400).json({ message: "Tous les champs sont requis" });
        }

        // Appel de la fonction demandeDevis avec les données récupérées
        const result = await demandeDevis(vehiculeId, clientId, servicesIds, artCheck);

        // Réponse en cas de succès
        res.status(201).json({ message: "Demande de devis faite avec succès", data: result });
    } catch (error) {
        console.error("Erreur lors de la demande de devis:", error);

        // Réponse en cas d'erreur
        res.status(500).json({ message: "Erreur lors de la demande de devis", data: [{}] });
    }
};


exports.getAllHistoriqueDevisClient = async (req,res) =>{
    try {
        const { id_client} = req.body;
         // Vérification des données nécessaires
         if (!id_client) {
            return res.status(400).json({ message: "Tous les champs sont requis" });
        }
        const result = await getAllHistoriqueDevisClient(id_client);
        res.status(201).json({ message: "Récupération de tous les historiques de devis pour ce client a été faite avec succès", data: result });
    } catch (error) {
        console.error("Erreur lors de la récupération de tous les historiques de devis pour ce client:", error);

        // Renvoyer une réponse d'erreur générique
        res.status(500).json({ message: "Erreur lors de la récupération de tous les historiques de devis pour ce client.",data: [{}] });
    }
}

exports.getHistoriqueDevisClientVehicule = async (req,res) =>{
    try {
        const { id_client ,id_vehicule} = req.body;
         // Vérification des données nécessaires
         if (!id_client || !id_vehicule) {
            return res.status(400).json({ message: "Tous les champs sont requis" });
        }
        const result = await getHistoriqueDevisClientVehicule(id_client,id_vehicule);
        res.status(201).json({ message: "Récupération de tous les historiques de devis pour ce client a été faite avec succès", data: result });
    } catch (error) {
        console.error("Erreur lors de la récupération de tous les historiques de devis pour ce client:", error);

        // Renvoyer une réponse d'erreur générique
        res.status(500).json({ message: "Erreur lors de la récupération de tous les historiques de devis pour ce client." });
    }
}