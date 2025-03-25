const RendezVous = require("../models/RendezVous");
const Tache = require("../models/Tache");
const { getDateSansDecalageHoraire, getDateFin_ } = require("./Utils");

function getDateFin(rendezVous){
    const allServices = rendezVous.services;
    let total = 0.0;
    allServices.forEach(service => {
            total += service.duree;  
            
    });

    // Créer une nouvelle date pour éviter de modifier l'original
    let dateFin = new Date(rendezVous.date);
    // console.log(total);
    
    // console.log(dateFin);
    dateFin.setMilliseconds(dateFin.getMilliseconds() + total * 60 * 1000);
    
    return dateFin;
}

async function getAllTacheMecanicien(mecanicienId){
    try {
        const taches = await Tache.find({
            id_mecanicien : mecanicienId
        }).populate("id_rendez_vous");
        if(taches.length == 0) throw new Error("Aucune tâche trouvée");
        return taches;
    } catch (error) {
        throw new Error(error)
    }
}

async function updateEtatTache(id_tache,newEtat,libelle = "Déscription tâche") {
    try {
        const tache = await Tache.findById(id_tache);
        if (!tache) throw new Error("Tâche introuvable");
        const rdv = await RendezVous.findById(tache.id_rendez_vous).populate("services");
        if (!rdv) throw new Error("Rendez vous introuvable");
        
        const date_now = getDateSansDecalageHoraire(new Date(Date.now()));
        const date_fin = getDateFin_(rdv,date_now);
        
        tache.etat = newEtat;
        tache.date_debut = date_now;
        tache.date_fin = date_fin;
        tache.libelle = libelle;
    
        await tache.save();

    } catch (error) {
        throw new Error(error)
    }
    
}



module.exports = {getDateFin,updateEtatTache,getAllTacheMecanicien};