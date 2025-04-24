const {validerRendezVous, annulerRendezVous,getAllRendezVousClient,getRendezVousById} = require('../services/RendezVousService');
const { getDateSansDecalageHoraire } = require('../services/Utils');
const mongoose = require("mongoose");

exports.validerRendezVous = async (req, res) => {
    try {
        const { clientId, vehiculeId, servicesIds,dateSelectionnee } = req.body;
        
        if (!clientId || !vehiculeId || !servicesIds || !dateSelectionnee) {
            return res.status(400).json({ message: "Tous les champs sont requis" });
        }
        if (servicesIds.length == 0) {
            return res.status(400).json({ message: "Veuillez choisir au moins un service" });
        }
        
        

        const selectedDate = getDateSansDecalageHoraire(new Date(dateSelectionnee));
        const currentDate = getDateSansDecalageHoraire(new Date());
        

        if (selectedDate < currentDate) {
            return res.status(400).json({ message: "La date sélectionnée est dans le passé. Veuillez choisir une date future." , data: {dateSelectionnee: selectedDate, dateActuelle: currentDate} });
        }

        const result = await validerRendezVous(clientId, vehiculeId, servicesIds,dateSelectionnee);

        res.status(201).json({ message: "Rendez-vous valider avec succès", data: result });

    } catch (error) {
       
        console.error("Erreur lors de la validation de rendez-vous:", error.message);

        res.status(500).json({ message: error.message });
    }
};

exports.getAllRendezVousClient = async (req,res) => {
    try {
        const { idClient } = req.params;
        if (!idClient ) {
            return res.status(400).json({ message: "L'id du client est requis" });
        }
        const result = await getAllRendezVousClient(idClient);
        res.status(201).json({ message: "Les rendez vous ont été récupérés avec succès", data: result });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.annulerRendezVous = async (req, res) => {
    try {
        const { rendezVousId } = req.params; 
        const {etat} = req.body;
        if (!rendezVousId ) {
            return res.status(400).json({ message: "L'id du rendez vous est requis" });
        }
        const result = await annulerRendezVous(rendezVousId,etat);

        if (result && result.message) {
            // Retourner le message et définir le statut HTTP en fonction de success
            return res.status(result.success ? 200 : 400).json({ message: result.message });
          } else {
            // En cas de réponse invalide de la fonction annulerRendezVous
            return res.status(500).json({ message: "Réponse invalide de la fonction d'annulation." });
          }
    } catch (error) {
        console.error("Erreur lors de l'annulation du rendez-vous:", error);
        res.status(500).json({ message: "Erreur lors de l'annulation du rendez-vous." });
    }
};

exports.getRendezVousById = async (req, res) => {
    try {
        const { rendezVousId } = req.params;
        if (!rendezVousId) {
            return res.status(400).json({ message: "L'id du rendez-vous est requis." });
        }
       
        const rendezVous = await getRendezVousById(rendezVousId);
        res.status(200).json({ message: "Le rendez vous a été récupérés avec succès", data: rendezVous });
    } catch (error) {
        console.error("Erreur lors de la récupération du rendez-vous:", error);
        res.status(500).json({ message: "Erreur lors de la récupération du rendez-vous." });
    }
};


// exports.refuserRendezVousAuto = async (req,res) => {
//     try {
//         const result = await refuserRendezVousAuto();
//         res.status(201).json({ message: "Rendez vous auto succès", data: result });
//     } catch (error) {
//         console.error("Erreur lors du rendez vous auto succès:", error);

//         // Renvoyer une réponse d'erreur générique
//         res.status(500).json({ message: "Erreur lors du rendez vous auto succès." });
//     }
// }
