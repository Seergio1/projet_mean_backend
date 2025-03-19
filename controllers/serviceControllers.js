const { getAllHistoriqueServiceClient, getHistoriqueServiceClientVehicule } = require("../services/ServiceService");

exports.getAllHistoriqueServiceClient = async (req,res) =>{
    try {
        const { id_client} = req.body;
         // Vérification des données nécessaires
         if (!id_client) {
            return res.status(400).json({ message: "Tous les champs sont requis" });
        }
        const result = await getAllHistoriqueServiceClient(id_client);
        res.status(201).json({ message: "Récupération de tous les historiques de devis pour ce client a été faite avec succès", data: result });
    } catch (error) {
        console.error("Erreur lors de la récupération de tous les historiques de devis pour ce client:", error);

        // Renvoyer une réponse d'erreur générique
        res.status(500).json({ message: "Erreur lors de la récupération de tous les historiques de devis pour ce client." });
    }
}

exports.getHistoriqueServiceClientVehicule = async (req,res) =>{
    try {
        const { id_client ,id_vehicule} = req.body;
         // Vérification des données nécessaires
         if (!id_client || !id_vehicule) {
            return res.status(400).json({ message: "Tous les champs sont requis" });
        }
        const result = await getHistoriqueServiceClientVehicule(id_client,id_vehicule);
        res.status(201).json({ message: "Récupération de tous les historiques de devis pour ce client a été faite avec succès", data: result });
    } catch (error) {
        console.error("Erreur lors de la récupération de tous les historiques de devis pour ce client:", error);

        // Renvoyer une réponse d'erreur générique
        res.status(500).json({ message: "Erreur lors de la récupération de tous les historiques de devis pour ce client." });
    }
}