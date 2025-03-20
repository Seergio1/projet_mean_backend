const { getRendezVousProche } = require("../services/NotificationService");

exports.getNotificationRendezVous = async (req,res) =>{
    try {
        const result = await getRendezVousProche();
        res.status(201).json({ message: "Récuperation des notifications faite avec succès", data: result });
    } catch (error) {
        console.error("Erreur lors de la récupération des notifications:", error);

        // Renvoyer une réponse d'erreur générique
        res.status(500).json({ message: "Erreur lors de la récupération des notifications." });
    }
}