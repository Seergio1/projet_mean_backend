const { get } = require("mongoose");
const { ajoutFacture, creerFacture, getAllFactureByIdclient } = require("../services/FactureService");
const fs = require("fs");

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
        console.error("Erreur lors de la fabrication de facture:", error.message);

        // Renvoyer une réponse d'erreur générique
        res.status(500).json({ message: "Erreur lors de la fabrication de facture: " + error.message });
    }
}




exports.getAllFactureByIdClient = async (req,res) =>{
    try {
        const id_client = req.params.idClient;
         // Vérification des données nécessaires
         if (!id_client) {
            return res.status(400).json({ message: "factureId est requis" });
        }
        const result = await getAllFactureByIdclient(id_client);
        res.status(201).json({ message: "Tous les factures de ce client ont été trouvées avec succès", data: result});
    } catch (error) {
        console.error("Erreur lors de la récuperation des factures de ce client:", error.message);

        // Renvoyer une réponse d'erreur générique
        res.status(500).json({ message: "Erreur lors de la récuperation des factures de ce client: "+error.message });
    }
}

exports.genererFacture = async (req, res) => {
    try {
      const factureId = req.params.id;
  
      if (!factureId) {
        return res.status(400).json({ message: "factureId est requis" });
      }
  
      const { stream, fileName } = await creerFacture(factureId);
  
      stream.on("finish", () => {
        res.download(fileName, () => {
          fs.unlinkSync(fileName); // Supprimer après téléchargement
        });
      });
    } catch (error) {
      console.error("Erreur lors de la fabrication de la facture :", error.message);
      res.status(500).json({ message: "Erreur lors de la fabrication de la facture : " + error.message });
    }
  };