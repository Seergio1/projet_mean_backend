const RendezVous = require("../models/RendezVous");
const Utilisateur = require("../models/Utilisateur");
const Service = require("../models/Service");
const Tache = require("../models/Tache");
const { getDateFin } = require("../services/TacheService");

async function prendreRendezVous(clientId, date, vehiculeId, servicesIds) {
  try {
    // Vérification si l'utilisateur est un client
    // const client = await Utilisateur.findById(clientId);
    const client = await Utilisateur.findOne({
      _id: clientId,
      vehicules: vehiculeId
    })

    if (!client || client.role !== "client") {
      throw new Error("Client non trouvé ou rôle incorrect");
    }

    // Vérifier si les services existent
    const services = await Service.find({ _id: { $in: servicesIds } });
    if (services.length !== servicesIds.length) {
      throw new Error("Certains services spécifiés sont invalides");
    }

    // Création du rendez-vous
    const rendezVous = new RendezVous({
      id_client: clientId,
      id_vehicule: vehiculeId,
      date: date,
      services: servicesIds, // Liste des services demandés
      etat: "en attente", // L'état initial est 'en attente'
    });

    await rendezVous.save();
    return rendezVous; // Retourne le rendez-vous créé
  } catch (error) {
    throw new Error(error.message);
  }
}

// pour eviter qu'un meca n'est pas déja associé à une tache pour la date de ce rendez vous
async function estMecanicienDisponiblePourTache(id_mecanicien, date_rdv) {
  date_rdv = new Date(date_rdv);
  const conflit = await Tache.findOne({
    id_mecanicien: id_mecanicien,
    etat: { $in: ["en attente", "en cours"] },
    date_debut: { $lte: date_rdv },
    date_fin: { $gte: date_rdv },
  });
  // console.log("Vérification de disponibilité :", { id_mecanicien, date_rdv, conflit });
  return !conflit; // Retourne `true` si aucune tâche en conflit n'existe
}

async function validerRendezVous(managerId, rendezVousId, mecanicienId) {
 
    // Vérification si l'utilisateur est un manager
    const manager = await Utilisateur.findById(managerId);
    if (!manager || manager.role !== "manager") {
      throw new Error("Manager non trouvé ou rôle incorrect");
    }

    // Vérification et assignation du mécanicien
    const mecanicien = await Utilisateur.findById(mecanicienId);
    if (!mecanicien || mecanicien.role !== "mecanicien") {
      throw new Error("Mécanicien non valide ou non trouvé");
    }

    // Vérification si le rendez-vous existe
    const rendezVous = await RendezVous.findById(rendezVousId).populate(
      "services"
    );
    if (!rendezVous) {
      throw new Error("Rendez-vous non trouvé");
    }
    
    let tache = null;
    const disponible = await estMecanicienDisponiblePourTache(mecanicien._id, rendezVous.date);
    
    
    if (disponible) {
      rendezVous.id_mecanicien = mecanicien._id;

      // Validation : Changer l'état à "accepté" et assigner un mécanicien
      rendezVous.etat = "accepté";
      console.log(rendezVous.date);
      await rendezVous.save();
      
      // Création de la tâche
      tache = new Tache({
        id_mecanicien: mecanicien._id,
        id_vehicule: rendezVous.id_vehicule,
        id_rendez_vous: rendezVous._id,
        libelle: "Travail à réaliser sur le véhicule "+rendezVous.id_vehicule, // Description de la tâche, tu peux personnaliser
        prix: rendezVous.services.reduce(
          (total, service) => total + service.prix,
          0
        ), // Calcul du prix à partir des services
        etat: "en attente", // L'état initial de la tâche
        date_debut: rendezVous.date, // Date du rendez-vous pour la tâche
        date_fin: getDateFin(rendezVous),
      });
      
      console.log(rendezVous.date);
      
      console.log(getDateFin(rendezVous));
      

      // Enregistrer les modifications dans le rendez-vous
      
      
      // Sauvegarder la tâche
      await tache.save();
      return { rendezVous, tache }; // Retourner le rendez-vous et la tâche créée
    }else{
      throw new Error("Ce mécanicien est déjà associé à une tâche");
    }

    
  
}

module.exports = { prendreRendezVous, validerRendezVous };
