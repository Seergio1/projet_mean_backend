const Utilisateur = require("../models/Utilisateur");
const Service = require("../models/Service");
const Tache = require("../models/Tache");
const Utils = require("../services/Utils");
const { getDateFin } = require("../services/TacheService");
const { getDateSansDecalageHoraire } = require("./Utils");
const RendezVous = require("../models/RendezVous");
const Notification = require("../models/Notification")
const { sendEmailNotification } = require("./NotificationService");
const { get } = require("mongoose");


/**
 * Vérifie si une plage horaire est disponible en fonction des rendez-vous existants
 */
async function checkDateRdvValidite(dateDebut, dateFin) {
  const conflit = await Tache.findOne({
      etat: { $in: ["en attente", "en cours"] },
      $or: [
          { date_debut: { $lte: dateDebut }, date_fin: { $gte: dateDebut } },
          { date_debut: { $lte: dateFin }, date_fin: { $gte: dateFin } },
          { date_debut: { $gte: dateDebut }, date_fin: { $lte: dateFin } },
      ],
  });

  return !conflit; // Retourne `true` si aucune tâche en conflit n'existe
}


// Fonction pour trouver un mécanicien disponible pour la plage horaire
async function trouverMecanicienDisponible(dateDebut, dateFin) {
  const mecanicien = await Utilisateur.findOne({
    role: "mecanicien",
    _id: {
      $nin: await Tache.distinct("id_mecanicien", {
        etat: { $ne: "terminée" },
        $or: [
          { date_debut: { $lte: dateDebut }, date_fin: { $gte: dateDebut } },
          { date_debut: { $lte: dateFin }, date_fin: { $gte: dateFin } },
          { date_debut: { $gte: dateDebut }, date_fin: { $lte: dateFin } },
        ],
      }),
    },
  });

  return mecanicien;
}

// Fonction pour valider le rendez-vous après que le client ait choisi une date
async function validerRendezVous(
  clientId,
  vehiculeId,
  servicesIds,
  dateSelectionnee
) {
  try {
    // console.log(new Date(dateSelectionnee));
    const client = await Utilisateur.findOne({
      _id: clientId,
      vehicules: vehiculeId,
    });
    if (!client || client.role !== "client") {
      throw new Error("Client non trouvé ou rôle incorrect");
    }

    // Récupérer les services choisis par le client
    const services = await Service.find({ _id: { $in: servicesIds } });
    if (services.length !== servicesIds.length) {
      throw new Error("Certains services spécifiés sont invalides");
    }
    // Calcul de la durée totale des services
    const dureeTotaleMinutes = services.reduce((total, service) => total + service.duree,0);
    const prixTotale = services.reduce((total, service) => total + service.prix,0);
   
    const dateDebut = new Date(dateSelectionnee);
    
    
    
    if (!Utils.checkHeureDeTravail(dateDebut)) throw new Error("La date selectionnée n'est pas dans nos horaires de travail");
    
    

    const dateFin = new Date(dateDebut.getTime() + dureeTotaleMinutes * 60000); // Ajout en minutes

    if (!Utils.checkHeureDeTravail(dateFin)) throw new Error("La date de fin de tâche calculée n'est pas dans nos horaires de travail");


    
    const dateDebutFinal = getDateSansDecalageHoraire(dateDebut);
    const dateFinFinal = getDateSansDecalageHoraire(dateFin);

    // Vérifier la disponibilité du créneau sélectionné
    const disponible = await checkDateRdvValidite(dateDebutFinal, dateFinFinal);
    if (!disponible) {
      throw new Error("Ce créneau horaire est déjà occupé.");
    }

    

    // Trouver un mécanicien disponible
    const mecanicienDisponible = await trouverMecanicienDisponible(
      dateDebutFinal,
      dateFinFinal
    );
    if (!mecanicienDisponible) {
      throw new Error("Aucun mécanicien disponible pour cette plage horaire.");
    }

    // Création du rendez-vous
    const rendezVous = new RendezVous({
      id_client: clientId,
      id_vehicule: vehiculeId,
      date: dateDebutFinal,
      services: servicesIds, // Liste des services demandés
      etat: "accepté", // L'état initial est 'en attente'
    });
    console.log(rendezVous);
    
    await rendezVous.save();
    // Création de la tâche pour le mécanicien
    const tache = new Tache({
      id_mecanicien: mecanicienDisponible._id,
      id_vehicule: vehiculeId,
      libelle: "Déscription tâche",
      prix: prixTotale,
      id_rendez_vous: rendezVous._id,
      date_debut: dateDebutFinal,
      date_fin: dateFinFinal,
      etat: "en attente",
    });
    console.log(tache);
    
    await tache.save();

    console.log(
      "Rendez-vous validé et tâche créée avec le mécanicien :",
      mecanicienDisponible.nom
    );
    return rendezVous; // Retourne le rendez-vous créé
  } catch (error) {
    throw new Error(error.message);
  }
}

async function getAllRendezVousClient(clientId){
  try {
    const rendezVous = await RendezVous.find({id_client:clientId})
    .populate("id_vehicule")
    .populate("id_mecanicien")
    .populate("services")
    if (!rendezVous) {
      throw new Error("Aucun rendez vous trouvé")
    }
    return rendezVous;
  } catch (error) {
    console.log(`Erreur lors de la recupération des rendez du client ${clientId}`,error.message);
    throw new Error(error)
  }
}

async function annulerRendezVous(rendezVousId, type) {
  try {
    // Trouver le rendez-vous par son ID
    const rendezVous = await RendezVous.findById(rendezVousId);
    
    if (!rendezVous) {
      console.log("Rendez-vous non trouvé.");
      return { success: false, message: "Rendez-vous non trouvé." };
    }

    // Supprimer la tâche associée à ce rendez-vous
    const tache = await Tache.findOneAndDelete({
      id_rendez_vous: rendezVousId,
      etat: "en attente"
    });

    if (!tache) {
      console.log("Les tâches associées à ce rendez-vous sont en cours ou sont déjà terminées.");
      return { success: false, message: "Les tâches associées à ce rendez-vous sont en cours ou sont déjà terminées." };
    } else {
      console.log("Tâche associée supprimée.");
      // Changer l'état du rendez-vous à "annulé" ou "accepté"
      rendezVous.etat = type;
      await rendezVous.save();
      console.log("Rendez-vous annulé avec succès.", rendezVous);
    }

    return { success: true, message: "Rendez-vous annulé avec succès." };
  } catch (error) {
    console.error("Erreur lors de l'annulation du rendez-vous:", error);
    return { success: false, message: "Erreur lors de l'annulation du rendez-vous." };
  }
}

// Fonction pour récupérer les rendez-vous dans les prochaines 24h
async function getRendezVousProche() {
  try {
    const now = new Date();
    const next24h = new Date();
    next24h.setHours(now.getHours() + 24);

    const appointments = await RendezVous.find({
      date: { $gte: now, $lte: next24h },
      etat: "accepté",
    }).populate("id_client");

    return appointments;
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des rendez-vous:", error);
    return [];
  }
}

async function refuserRendezVousAuto() {
  try {
      const now = getDateSansDecalageHoraire(new Date());

      // Récupérer tous les RDV non confirmés et dont la date est passée
      const rendezVous = await RendezVous.find({
          date: { $lt: now }, // RDV déjà passé
          etat: "accepté" // RDV accepté mais non confirmé
      }).populate('id_client');

      for (const rdv of rendezVous) {
          // Vérifier si une tâche en attente existe
          const tachesEnAttente = await Tache.find({ 
              id_rendez_vous: rdv._id, 
              etat: "en attente" 
          });

          if (tachesEnAttente.length === 0) { // Si AUCUNE tâche en attente, on peut annuler
              const annulation = await annulerRendezVous(rdv._id, "annulé");

              if (annulation.success) {
                  sendEmailNotification(rdv.id_client.email, Utils.formatDate(rdv.date), "annulation");

                  const notification = new Notification({
                      titre: "Annulation de votre rendez-vous",
                      message: `Votre rendez-vous prévu le ${Utils.formatDate(rdv.date)} a été annulé.`,
                      id_client: rdv.id_client,
                      id_rendez_vous: rdv._id
                  });

                  await notification.save();
                  console.log(`✅ Annulation automatique du RDV ID: ${rdv._id}`);
              }
          } else {
              console.log(`🔵 RDV ID: ${rdv._id} maintenu (Tâche en attente trouvée)`);
          }
      }
  } catch (error) {
      console.error("❌ Erreur dans l'annulation automatique :", error);
  }
}

module.exports = {
  validerRendezVous,
  getRendezVousProche,
  annulerRendezVous,
  refuserRendezVousAuto,
  getAllRendezVousClient
};
