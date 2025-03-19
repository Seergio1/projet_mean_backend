const { ajoutFacture } = require("../services/FactureService");


exports.ajoutFacture = async (req,res) =>{
    try {
        const { clientId, tabArticles, id_services, vehiculeId } = req.body;
         // Vérification des données nécessaires
         if (!clientId || !id_services || !vehiculeId || id_services.length === 0) {
            return res.status(400).json({ message: "Tous les champs sont requis" });
        }
        const result = await ajoutFacture(vehiculeId,clientId,id_services,tabArticles);
        res.status(201).json({ message: "Fabrication de facture faite avec succès", data: result });
    } catch (error) {
        console.error("Erreur lors de la fabrication de facture:", error);

        // Renvoyer une réponse d'erreur générique
        res.status(500).json({ message: "Erreur lors de la fabrication de facture." });
    }
}