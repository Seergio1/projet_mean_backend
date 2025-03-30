const { sendEmailNotification,updateEtatNotification,getNotificationsByIdClient,updateAllEtatNotification } = require("../services/NotificationService");


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

exports.updateEtatNotification = async (req,res) =>{
    try {
        const etat = req.body.etat;
        const id_notification = req.params.id_notification;
        
        if (etat === null || etat === undefined || !id_notification || etat === "") {
            return res.status(400).json({ message: "Tous les paramètres sont requis" });
        }
        const result = await updateEtatNotification(etat,id_notification);
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

exports.updateAllEtatNotification = async (req,res) =>{
    try {
        const id_client = req.params.clientId;
        
        if (!id_client) {
            return res.status(400).json({ message: "Tous les paramètres notification ont été requis" });
        }
        const result = await updateAllEtatNotification(id_client);
        res.status(201).json({ message: "Tous les notifications ont été lues", data: result });
    } catch (error) {
        console.error("Erreur lors du changement d'état des notifications:", error);    
        // Renvoyer une réponse d'erreur générique
        res.status(500).json({ message: "Erreur lors du changement d'état des notifications." });
    }
}