const {updateEtatTache} = require('../services/TacheService')
exports.updateEtatTache = async (req,res) =>{
    try {
        const {mecanicienId,newEtat} = req.body;
        const tacheId = req.params.tacheId;
        if (!mecanicienId || !tacheId) {
            return res.status(400).json({ message: "Tous les champs sont requis" });
        }
        const result = await updateEtatTache(tacheId,newEtat);

        res.status(201).json({ message: "Etat de la tâche a été modifié avec succès", data: result });
    } catch (error) {
        console.error("Erreur lors du changement d'etat de tâche:", error);

        // Renvoyer une réponse d'erreur générique
        res.status(500).json({ message: "Erreur lors du changement d'etat de tâche." });
    }
}