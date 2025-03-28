const { sendEmailNotification,updatEtatNotification,getNotificationsByIdClient } = require("../services/NotificationService");
const { getRendezVousProche } = require("../services/RendezVousService");


exports.getNotificationRendezVous = async (req,res) =>{
    try {
        const result = await sendEmailNotification("giorakotomalala@gmail.com","");
        res.status(201).json({ message: "Récuperation des notifications faite avec succès", data: result });
    } catch (error) {
        console.error("Erreur lors de la récupération des notifications:", error);

        // Renvoyer une réponse d'erreur générique
        res.status(500).json({ message: "Erreur lors de la récupération des notifications." });
    }
}

exports.updatEtatNotification = async (req,res) =>{
    try {
        const etat = req.body.etat;
        const id_notification = req.params.id_notification;
        if (!etat || !id_notification || etat == "") {
            return res.status(400).json({ message: "Tous les paramètres sont requis" });
        }
        const result = await updatEtatNotification(etat,id_notification);
        res.status(201).json({ message: "Le changement d'état a été faite avec succès", data: result });
    } catch (error) {
        console.error("Erreur lors du changement d'état de la notification:", error);    
        // Renvoyer une réponse d'erreur générique
        res.status(500).json({ message: "Erreur lors du changement d'état de la notification." });
    }
}

exports.getNotificationsByIdClient = async (req,res) => {
    try {
        const id_client = req.params.id_client;
        if (!id_client) {
            return res.status(400).json({ message: "Tous les paramètres sont requis" });
        }
        const result = await getNotificationsByIdClient(id_client);
        res.status(201).json({ message: `Récuperation des notifications du client ${id_client} ,faite avec succès`, data: result });
    } catch (error) {
        console.error("Erreur lors de la récupération des notifications:", error);    
        // Renvoyer une réponse d'erreur générique
        res.status(500).json({ message: "Erreur lors de la récupération des notifications." });
    }
}