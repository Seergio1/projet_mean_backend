const {prendreRendezVous,validerRendezVous} = require('../services/RendezVousService');

exports.prendreRendezVous = async (req, res) => {
    try {
        // Récupérer les données envoyées dans le corps de la requête
        const { clientId, date, servicesIds } = req.body;

        // Vérification des données nécessaires
        if (!clientId || !date || !servicesIds || servicesIds.length === 0) {
            return res.status(400).json({ message: "Tous les champs sont requis" });
        }

        // Appeler le service pour prendre un rendez-vous
        const result = await prendreRendezVous(clientId, date, servicesIds);

        // Si tout se passe bien, renvoyer une réponse avec succès
        res.status(201).json({ message: "Rendez-vous pris avec succès", data: result });

    } catch (error) {
       
        console.error("Erreur lors de la prise de rendez-vous:", error);

        // Renvoyer une réponse d'erreur générique
        res.status(500).json({ message: "Erreur lors de la prise de rendez-vous." });
    }
};

exports.validerRendezVous = async (req, res) => {
    try {
        // Récupérer les données envoyées dans le corps de la requête
        const { managerId, mecanicienId } = req.body;
        const rendezVousId = req.param.rendezVousId

        // Vérification des données nécessaires
        if (!mecanicienId || !managerId || !rendezVousId) {
            return res.status(400).json({ message: "Tous les champs sont requis" });
        }

        // Appeler le service pour prendre un rendez-vous
        const result = await validerRendezVous(managerId, rendezVousId, mecanicienId);

        // Si tout se passe bien, renvoyer une réponse avec succès
        res.status(201).json({ message: "Rendez-vous valider avec succès", data: result });

    } catch (error) {
       
        console.error("Erreur lors de la validation de rendez-vous:", error);

        // Renvoyer une réponse d'erreur générique
        res.status(500).json({ message: "Erreur lors de la validation de rendez-vous." });
    }
};