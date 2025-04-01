const {updateEtatTache,getTacheDateIndisponible,getAllTacheMecanicien} = require('../services/TacheService')
exports.updateEtatTache = async (req,res) =>{
    try {
        const {mecanicienId,newEtat,libelle} = req.body;
        const tacheId = req.params.tacheId;
        if (!mecanicienId || !tacheId) {
            return res.status(400).json({ message: "Tous les champs sont requis" });
        }
        const result = await updateEtatTache(tacheId,newEtat,libelle);

        res.status(201).json({ message: "Etat de la tâche a été modifié avec succès", data: result });
    } catch (error) {
        console.error("Erreur lors du changement d'etat de tâche:", error);

        // Renvoyer une réponse d'erreur générique
        res.status(500).json({ message: "Erreur lors du changement d'etat de tâche." });
    }
}

exports.getAllTacheMecanicien = async (req,res) =>{
    try {
        const mecanicienId = req.params.tacheId;
        if (!mecanicienId) {
            return res.status(400).json({ message: "L'Id du mécanicien doit être fournise" });
        }
        const result = await getAllTacheMecanicien(mecanicienId);

        res.status(201).json({ message: "Les tâches du mécanicien ont été recuperées avec succès", data: result });
    } catch (error) {
        console.error("Erreur lors de la recupération des tâche du mécanicien:", error);

        // Renvoyer une réponse d'erreur générique
        res.status(500).json({ message: "Erreur lors de la recupération des tâche du mécanicien." });
    }
}

exports.getTacheDateIndisponible = async (req,res) =>{
    try {
       
        const result = await getTacheDateIndisponible()

        res.status(201).json({ message: "Les dates indisponibles ont été recuperées avec succès", data: result });
    } catch (error) {
        console.error("Erreur lors de la recupération des dates indisponibles:", error);

        // Renvoyer une réponse d'erreur générique
        res.status(500).json({ message: "Erreur lors de la recupération des dates indisponibles." });
    }
}