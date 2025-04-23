const path = require("path");
const { ajoutFacture, creerFacturePDF, getAllFactureByIdclient } = require("../services/FactureService");
const fs = require("fs");

exports.ajoutFacture = async (req, res) => {
  try {
    const { vehiculeId, clientId, serviceEtArticles } = req.body;

    // Vérification des champs requis
    if (!vehiculeId || !clientId || !Array.isArray(serviceEtArticles) || serviceEtArticles.length === 0) {
      return res.status(400).json({ message: "Tous les paramètres sont requis (vehiculeId, clientId, serviceEtArticles non vide)" });
    }

    const result = await ajoutFacture(vehiculeId, clientId, serviceEtArticles);
    res.status(201).json({ message: "Création de facture faite avec succès", data: result });

  } catch (error) {
    console.error("Erreur lors de la création de facture:", error.message);
    res.status(500).json({ message: "Erreur lors de la création de facture: " + error.message });
  }
};


exports.getAllFactureByIdClient = async (req, res) => {
  try {
    const id_client = req.params.idClient;

    if (!id_client) {
      return res.status(400).json({ message: "idClient est requis" });
    }

    const result = await getAllFactureByIdclient(id_client);
    res.status(200).json({ message: "Toutes les factures du client ont été récupérées avec succès", data: result });

  } catch (error) {
    console.error("Erreur lors de la récupération des factures du client:", error.message);
    res.status(500).json({ message: "Erreur lors de la récupération des factures du client: " + error.message });
  }
};

exports.genererFacture = async (req, res) => {
  try {
    const factureId = req.params.id;

    if (!factureId) {
      return res.status(400).json({ message: "factureId est requis" });
    }

    const { path: filePath } = await creerFacturePDF(factureId);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "Le fichier PDF n'a pas été généré" });
    }

    res.download(filePath, `facture_${factureId}.pdf`, (err) => {
      if (err) {
        console.error("Erreur lors du téléchargement :", err);
      }

      // Supprimer le fichier PDF après téléchargement
      fs.unlink(filePath, (unlinkErr) => {
        if (unlinkErr) {
          console.error("Erreur lors de la suppression du fichier :", unlinkErr);
        }
      });
    });

  } catch (error) {
    console.error("Erreur lors de la fabrication de la facture :", error.message);
    res.status(500).json({ message: "Erreur serveur : " + error.message });
  }
};