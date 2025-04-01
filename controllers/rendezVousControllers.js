const {validerRendezVous, annulerRendezVous} = require('../services/RendezVousService');
const { getDateSansDecalageHoraire } = require('../services/Utils');


exports.validerRendezVous = async (req, res) => {
    try {
        const { clientId, vehiculeId, servicesIds,dateSelectionnee } = req.body;
        
        if (!clientId || !vehiculeId || !servicesIds || !dateSelectionnee) {
            return res.status(400).json({ message: "Tous les champs sont requis" });
        }
        if (servicesIds.length == 0) {
            return res.status(400).json({ message: "Veuillez choisir au moins un service" });
        }

        const selectedDate = new Date(dateSelectionnee);
        const currentDate = new Date();

        if (selectedDate < currentDate) {
            return res.status(400).json({ message: "La date sélectionnée est dans le passé. Veuillez choisir une date future." });
        }

        const result = await validerRendezVous(clientId, vehiculeId, servicesIds,dateSelectionnee);

        res.status(201).json({ message: "Rendez-vous valider avec succès", data: result });

    } catch (error) {
       
        console.error("Erreur lors de la validation de rendez-vous:", error.message);

        res.status(500).json({ message: "Erreur lors de la validation de rendez-vous: "+error.message });
    }
};

exports.annulerRendezVous = async (req, res) => {
    try {
        const { rendezVousId } = req.params; 

        const result = await annulerRendezVous(rendezVousId);

        res.status(200).json(result); 
    } catch (error) {
        console.error("Erreur lors de l'annulation du rendez-vous:", error);
        res.status(500).json({ message: "Erreur lors de l'annulation du rendez-vous." });
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
