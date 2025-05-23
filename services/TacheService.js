const RendezVous = require("../models/RendezVous");
const Tache = require("../models/Tache");
const { getDateSansDecalageHoraire, getDateFin_ } = require("./Utils");
const mongoose = require("mongoose");
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

async function getTacheDateIndisponible() {
    try {
        const taches = await Tache.find({
            etat: { $in: ["en attente", "en cours"] },
        }).populate('id_rendez_vous');
        const datesIndisponibles = taches.map(tache => ({
            dateDebut: tache.date_debut,  
            dateFin: tache.date_fin       
        }));
        // if(datesIndisponibles.length == 0) throw new Error("Aucune date indisponible trouvée");
        return datesIndisponibles;
    } catch (error) {
        throw new Error(error)
    }
}

async function getEtatTacheRendezVous(rendezVousId) {
    try {
        const rendezVousObjectId = new mongoose.Types.ObjectId(rendezVousId);
        const tache = await Tache.findOne({
            id_rendez_vous:rendezVousObjectId
        });

        if (!tache) return null; // Aucune tâche trouvée
        console.log(tache);
        
        return tache; // Retourne l'état de la tâche
    } catch (error) {
        console.error("Erreur lors de la récupération de l'état de la tâche :", error);
        return null;
    }
}


async function getAllTacheMecanicien(mecanicienId){
    try {
        const taches = await Tache.find({
            id_mecanicien : mecanicienId
        })
        .populate({
            path: "id_rendez_vous",
            populate: { path: "id_client", select: "nom" }
        })
        .populate({
            path: "id_vehicule",
            populate: { path: "id_modele", select: "nom" }
          });
        if(taches.length == 0) throw new Error("Aucune tâche trouvée");
        return taches;
    } catch (error) {
        throw new Error(error)
    }
}

async function getAllTache() {
    try {
        const taches = await Tache.find()
        .populate("id_mecanicien")
        .populate({
            path: "id_rendez_vous",
            populate: { path: "id_client", select: "nom" }
        })
        .populate({
            path: "id_vehicule",
            populate: { path: "id_modele", select: "nom" }
          });
          if(taches.length == 0) throw new Error("Aucune tâche trouvée");
          return taches;
    } catch (error) {
        throw new Error(error)
    }
}

async function updateEtatTache(id_tache,newEtat,libelle = "Déscription tâche") {
    try {
        console.log(newEtat,id_tache);
        
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


async function updateFactureTacheEtat(id_tache,newEtat) {
    try {
        const tache = await Tache.findById(id_tache);
        if (!tache) throw new Error("Tâche introuvable");
        tache.facture = newEtat;
        await tache.save();
        return tache;
    } catch (error) {
        throw new Error(error)
    }
}



module.exports = {getDateFin,updateEtatTache,getAllTacheMecanicien,getAllTache,updateFactureTacheEtat,getTacheDateIndisponible,getEtatTacheRendezVous};