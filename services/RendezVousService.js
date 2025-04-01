const Utilisateur = require("../models/Utilisateur");
const Service = require("../models/Service");
const Tache = require("../models/Tache");
const Utils = require("../services/Utils");
const { getDateFin } = require("../services/TacheService");
const { getDateSansDecalageHoraire } = require("./Utils");
const RendezVous = require("../models/RendezVous");
const Notification = require("../models/Notification")
const { sendEmailNotification } = require("./NotificationService");


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
    const dateDebut = getDateSansDecalageHoraire(new Date(dateSelectionnee));

    if (!Utils.checkHeureDeTravail(dateDebut)) throw new Error("La date de début demandée n'est pas dans les horaires de travail");

    const dateFin = new Date(dateDebut.getTime() + dureeTotaleMinutes * 60000); // Ajout en minutes

    if (!Utils.checkHeureDeTravail(dateFin)) throw new Error("La date de fin calculée n'est pas dans les horaires de travail");

    // Vérifier la disponibilité du créneau sélectionné
    const disponible = await checkDateRdvValidite(dateDebut, dateFin);
    if (!disponible) {
      throw new Error("Ce créneau horaire est déjà occupé.");
    }

    // Trouver un mécanicien disponible
    const mecanicienDisponible = await trouverMecanicienDisponible(
      dateDebut,
      dateFin
    );
    if (!mecanicienDisponible) {
      throw new Error("Aucun mécanicien disponible pour cette plage horaire.");
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
    // Création de la tâche pour le mécanicien
    const tache = new Tache({
      id_mecanicien: mecanicienDisponible._id,
      id_vehicule: vehiculeId,
      libelle: "Déscription tâche",
      prix: prixTotale,
      id_rendez_vous: rendezVous._id,
      date_debut: dateDebut,
      date_fin: dateFin,
      etat: "en attente",
    });

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

async function annulerRendezVous(rendezVousId) {
  try {
    // Trouver le rendez-vous par son ID
    const rendezVous = await RendezVous.findById(rendezVousId);
      
    if (!rendezVous) {
      console.log("Rendez-vous non trouvé.");
      return false;
    }

    // Supprimer la tâche associée à ce rendez-vous
    const tache = await Tache.findOneAndDelete({
      id_rendez_vous: rendezVousId,
      etat: "en attente"
    });

    if (!tache) {
      // throw new Error("Aucune tâche associée à ce rendez-vous");
      console.log("Aucune tâche associée à ce rendez-vous");
      return false;
    } else {
      console.log("Tâche associée supprimée.");
      // Changer l'état du rendez-vous à "annulé"
      rendezVous.etat = "annulé";
      await rendezVous.save();
      // Retourner le résultat ou une confirmation
      console.log("Rendez-vous annulé avec succès.",rendezVous);
    }

    
    return true;
  } catch (error) {
    console.error("Erreur lors de l'annulation du rendez-vous:", error);
    // throw new Error("Erreur lors de l'annulation du rendez-vous.");
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
    const today = new Date();
    let annulation = false;
    today.setUTCHours(0, 0, 0, 0);
    const rendezVous = await RendezVous.find({
      etat: { $in: ["en attente", "accepté"] },
    }).populate('id_client');

    console.log("aujourd'hui ", today);
    for (const rdv of rendezVous) {

      const rdvDate = new Date(rdv.date);
      rdvDate.setUTCHours(0, 0, 0, 0);

      if (rdv.date < today) {
        annulation = await annulerRendezVous(rdv);
        if(annulation){
          sendEmailNotification(rdv.id_client.email, Utils.formatDate(rdv.date), "annulation");
          const notification = new Notification({
                          titre: "Annulation de votre rendez-vous",
                          message: `Votre rendez vous du ${Utils.formatDate(rdv.date)} a été annulé`,
                          id_client: rdv.id_client,
                          id_rendez_vous: rdv._id
                      });
          await notification.save();
          console.log(`Annulation du rendez-vous ID: ${rdv._id} (Date: ${rdv.date})`);
        }
      } else {
        console.log(`Rendez-vous encore valide ID: ${rdv._id} (Date: ${rdv.date})`);
      }
    }
  } catch (error) {
    throw new Error(error);
  }
}

module.exports = {
  validerRendezVous,
  getRendezVousProche,
  annulerRendezVous,
  refuserRendezVousAuto
};
