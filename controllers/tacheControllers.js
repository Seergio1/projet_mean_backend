const {updateEtatTache,getTacheDateIndisponible,getAllTacheMecanicien, getEtatTacheRendezVous,updateFactureTacheEtat,getAllTache} = require('../services/TacheService')
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

exports.updateFactureTacheEtatRoute = async (req, res) => {
    try {
      const { newEtat } = req.body;
      const id_tache = req.params.id_tache;
      
      if (!id_tache || newEtat == undefined || newEtat == null) {
        return res.status(400).json({ message: "Tous les champs sont requis" });
      }
      const result = await updateFactureTacheEtat(id_tache, newEtat);        
      res.status(201).json({ message: "Etat de la facture de cette tâche a été modifié avec succès", data: result });
    } catch (error) {
      console.error("Erreur lors du changement de l'etat de la facture de cette tâche:", error);
  
      // Renvoyer une réponse d'erreur générique
      res.status(500).json({ message: "Erreur lors du changement de l'etat de la facture de cette tâche." });
    }
  };

exports.getAllTacheMecanicien = async (req,res) =>{
    try {
        const mecanicienId = req.params.mecanicienId;
        if (!mecanicienId) {
            return res.status(400).json({ message: "L'Id du mécanicien doit être fournise" });
        }
        const result = await getAllTacheMecanicien(mecanicienId);

        res.status(201).json({ message: "Les tâches du mécanicien ont été recuperées avec succès", data: result });
    } catch (error) {
        console.error("Erreur lors de la recupération des tâche du mécanicien:", error);

        res.status(500).json({ message: "Erreur lors de la recupération des tâche du mécanicien." });
    }
}

exports.getAllTaches = async (req,res) =>{
    try {
        const result = await getAllTache();

        res.status(201).json({ message: "Tous les tâches ont été recuperées avec succès", data: result });
    } catch (error) {
        console.error("Erreur lors de la recupération de tous les tâches:", error);

        res.status(500).json({ message: "Erreur lors de la recupération de tous les tâches." });
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

exports.getEtatTacheRendezVous = async (req, res) => {
    try {
        const { rendezVousId } = req.params; // Récupération de l'ID du rendez-vous depuis l'URL
        // console.log(rendezVousId);
        
        if (!rendezVousId) {
            return res.status(400).json({ message: "L'ID du rendez-vous est requis." });
        }

        const tache = await getEtatTacheRendezVous(rendezVousId);

        if (tache==null) {
            return res.status(404).json({ message: "Aucune tâche associée à ce rendez-vous." });
        }

        // console.log(tache);
        


        res.status(200).json({ tache });
    } catch (error) {
        console.error("Erreur lors de la récupération de l'état de la tâche :", error);
        res.status(500).json({ message: "Erreur lors de la récupération de l'état de la tâche." });
    }
};