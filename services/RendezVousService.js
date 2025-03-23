const RendezVous = require("../models/RendezVous");
const Utilisateur = require("../models/Utilisateur");
const Service = require("../models/Service");
const Tache = require("../models/Tache");
const Utils = require("../services/Utils");
const { getDateFin } = require("../services/TacheService");
const { getDateSansDecalageHoraire } = require("./Utils");

// Fonction principale pour proposer des créneaux disponibles après le choix des services
async function proposerRendezVous(clientId, servicesIds,dateSelectionnee) {
  try {
    // Vérifier que le client existe et a le bon rôle
    const client = await Utilisateur.findOne({ _id: clientId, role: "client" });
    if (!client) {
      throw new Error("Client non trouvé");
    }

    // Récupérer les services choisis par le client
    const services = await Service.find({ _id: { $in: servicesIds } });
    if (services.length !== servicesIds.length) {
      throw new Error("Certains services spécifiés sont invalides");
    }

    // Calcul de la durée totale des services
    const dureeTotaleMinutes = services.reduce((total, service) => total + service.duree, 0);
    console.log("Durée totale des services :", dureeTotaleMinutes, "minutes");

    // Générer une liste de créneaux horaires disponibles
    const datesDisponibles = await trouverDatesDisponibles(dureeTotaleMinutes,dateSelectionnee);
    if (datesDisponibles.length === 0) {
      throw new Error("Aucun créneau disponible pour ces services.");
    }

    // Retourner les dates disponibles au client
    return { message: "Voici les créneaux disponibles", datesDisponibles };

  } catch (error) {
    throw new Error(error.message);
  }
}

// Fonction pour générer les créneaux horaires disponibles
async function trouverDatesDisponibles(dureeTotaleMinutes,dateSelectionnee) {
  const dateActuelle = getDateSansDecalageHoraire(new Date(dateSelectionnee));
  if(!Utils.checkHeureDeTravail(dateActuelle)) throw new Error("La date demandée n'est pas dans les horaires de travail")

  // Chercher des créneaux disponibles dans les prochaines heures (exemple de 3 créneaux espacés de 1 heure)
  let datesDisponibles = [];
  datesDisponibles.push({})
  for (let i = 0; i <= 3; i++) {
    let dateDebut = new Date(dateActuelle.getTime() + i * 60 * 60000); // ième créneau horaire
    let dateFin = new Date(dateDebut.getTime() + dureeTotaleMinutes * 60000);

    // Vérifier si le créneau est disponible
    const disponible = await checkDateRdvValidite(dateDebut, dateFin);
    if (disponible) {
      datesDisponibles.push({ dateDebut, dateFin });
    }
  }

  return datesDisponibles;
}

// Fonction pour vérifier si une date est déjà occupée par un autre rendez-vous ou tâche
async function checkDateRdvValidite(dateDebut, dateFin) {
  const conflit = await Tache.findOne({
    etat: { $in: ["en attente", "en cours"] },
    $or: [
      { date_debut: { $lte: dateDebut }, date_fin: { $gte: dateDebut } }, // Début du RDV dans une tâche existante
      { date_debut: { $lte: dateFin }, date_fin: { $gte: dateFin } }, // Fin du RDV dans une tâche existante
      { date_debut: { $gte: dateDebut }, date_fin: { $lte: dateFin } }, // Une tâche existante est complètement incluse dans le RDV
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
async function validerRendezVous(clientId, vehiculeId, servicesIds, dateSelectionnee) {
  try {
    const client = await Utilisateur.findOne({ _id: clientId, vehicules: vehiculeId });
    if (!client || client.role !== "client") {
      throw new Error("Client non trouvé ou rôle incorrect");
    }

    // Récupérer les services choisis par le client
    const services = await Service.find({ _id: { $in: servicesIds } });
    if (services.length !== servicesIds.length) {
      throw new Error("Certains services spécifiés sont invalides");
    }



    // Calcul de la durée totale des services
    const dureeTotaleMinutes = services.reduce((total, service) => total + service.duree, 0);
    const prixTotale = services.reduce((total, service) => total + service.prix, 0);
    const dateDebut = getDateSansDecalageHoraire(new Date(dateSelectionnee));
    if(!Utils.checkHeureDeTravail(dateDebut)) throw new Error("La date demandée n'est pas dans les horaires de travail")
    const dateFin = new Date(dateDebut.getTime() + dureeTotaleMinutes * 60000); // Ajout en minutes

    // Vérifier la disponibilité du créneau sélectionné
    const disponible = await checkDateRdvValidite(dateDebut, dateFin);
    if (!disponible) {
      throw new Error("Ce créneau horaire est déjà occupé.");
    }

    // Trouver un mécanicien disponible
    const mecanicienDisponible = await trouverMecanicienDisponible(dateDebut, dateFin);
    if (!mecanicienDisponible) {
      throw new Error("Aucun mécanicien disponible pour cette plage horaire.");
    }

    // Création du rendez-vous
    const rendezVous = new RendezVous({
      id_client: clientId,
      id_vehicule: vehiculeId,
      date: dateDebut,
      date_fin: dateFin,
      services: servicesIds,
      etat: "accepté", // Validation automatique du rendez-vous
      id_mecanicien: mecanicienDisponible._id, // Assignation d'un mécanicien
    });

    await rendezVous.save();

    // Création de la tâche pour le mécanicien
    const tache = new Tache({
      id_mecanicien: mecanicienDisponible._id,
      id_vehicule:vehiculeId,
      libelle:"Déscription tâche",
      prix: prixTotale,
      id_rendez_vous: rendezVous._id,
      date_debut: dateDebut,
      date_fin: dateFin,
      etat: "en attente",
    });

    await tache.save();

    console.log("Rendez-vous validé et tâche créée avec le mécanicien :", mecanicienDisponible.nom);

    return rendezVous; // Retourne le rendez-vous créé

  } catch (error) {
    throw new Error(error.message);
  }
}

async function annulerRendezVous (rendezVousId) {
  try {
      // Trouver le rendez-vous par son ID
      const rendezVous = await RendezVous.findById(rendezVousId);
      const checkTacheTerminer = await Tache.findOne({
        id_rendez_vous: rendezVousId, 
        etat: "terminée"              
    });
      if(checkTacheTerminer) throw new Error("Les tâches associées à ce rendez vous sont déjà terminées");
      
      if (!rendezVous) {
          throw new Error("Rendez-vous non trouvé.");
      }

      // Changer l'état du rendez-vous à "annulé"
      rendezVous.etat = "annulé";
      await rendezVous.save();
      

      // Supprimer la tâche associée à ce rendez-vous
      const tache = await Tache.findOneAndDelete({ id_rendez_vous: rendezVousId });

      if (!tache) {
          console.log("Aucune tâche associée à ce rendez-vous.");
      } else {
          console.log("Tâche associée supprimée.");
      }

      // Retourner le résultat ou une confirmation
      return {
          message: "Rendez-vous annulé avec succès.",
          rendezVous,
          tache,
      };
  } catch (error) {
      console.error("Erreur lors de l'annulation du rendez-vous:", error);
      throw new Error("Erreur lors de l'annulation du rendez-vous.");
  }
};

// Fonction pour récupérer les rendez-vous dans les prochaines 24h
async function getRendezVousProche() {
  try {
      const now = new Date();
      const next24h = new Date();
      next24h.setHours(now.getHours() + 24);

      const appointments = await RendezVous.find({
          date: { $gte: now, $lte: next24h },
          etat: "accepté"
      }).populate("id_client");

      return appointments;
  } catch (error) {
      console.error("❌ Erreur lors de la récupération des rendez-vous:", error);
      return [];
  }
};

// async function prendreRendezVous(clientId, date, vehiculeId, servicesIds) {
//   try {
//     // Vérification si l'utilisateur est un client
//     // const client = await Utilisateur.findById(clientId);
//     const client = await Utilisateur.findOne({
//       _id: clientId,
//       vehicules: vehiculeId,
//     });

//     if (!client || client.role !== "client") {
//       throw new Error("Client non trouvé ou rôle incorrect");
//     }

//     // Vérifier si les services existent
//     const services = await Service.find({ _id: { $in: servicesIds } });
//     if (services.length !== servicesIds.length) {
//       throw new Error("Certains services spécifiés sont invalides");
//     }

//     // check disponibilité date
//     const disponible = await checkDateRdvValidite(date);

//     const rendezVous = new RendezVous({
//       id_client: clientId,
//       id_vehicule: vehiculeId,
//       date: date,
//       services: servicesIds, // Liste des services demandés
//       etat: "en attente", // L'état initial est 'en attente'
//     });

//     if(disponible){
//       await rendezVous.save();

//     }

    

    

    
//     return rendezVous; // Retourne le rendez-vous créé
//   } catch (error) {
//     throw new Error(error.message);
//   }
// }

// pour eviter qu'un meca n'est pas déja associé à une tache pour la date de ce rendez vous
// async function estMecanicienDisponiblePourTache(id_mecanicien, date_rdv) {
//   date_rdv = new Date(date_rdv);
//   const conflit = await Tache.findOne({
//     id_mecanicien: id_mecanicien,
//     etat: { $in: ["en attente", "en cours"] },
//     date_debut: { $lte: date_rdv },
//     date_fin: { $gte: date_rdv },
//   });
//   // console.log("Vérification de disponibilité :", { id_mecanicien, date_rdv, conflit });
//   return !conflit; // Retourne `true` si aucune tâche en conflit n'existe
// }

// async function validerRendezVousManuel(managerId, rendezVousId, mecanicienId, etat) {
//   try {
//     // Vérification du rôle manager
//     const manager = await Utilisateur.findById(managerId);
//     if (!manager || manager.role !== "manager") {
//       throw new Error("Manager non trouvé ou rôle incorrect");
//     }

//     // Vérification du rôle mécanicien
//     const mecanicien = await Utilisateur.findById(mecanicienId);
//     if (!mecanicien || mecanicien.role !== "mecanicien") {
//       throw new Error("Mécanicien non valide ou non trouvé");
//     }

//     // Vérification si le rendez-vous existe
//     const rendezVous = await RendezVous.findById(rendezVousId).populate("services");
//     if (!rendezVous) {
//       throw new Error("Rendez-vous non trouvé");
//     }

//     let tache = null;
//     const dateRdv = new Date(rendezVous.date); // S'assurer que la date est bien une instance Date
//     const disponible = await estMecanicienDisponiblePourTache(mecanicien._id, dateRdv);

//     if (!disponible) {
//       throw new Error("Ce mécanicien est déjà associé à une tâche");
//     }

//     // Assignation du mécanicien et mise à jour du rendez-vous
//     rendezVous.id_mecanicien = mecanicien._id;
//     rendezVous.etat = etat;

//     // Création de la tâche
//     tache = new Tache({
//       id_mecanicien: mecanicien._id,
//       id_vehicule: rendezVous.id_vehicule,
//       id_rendez_vous: rendezVous._id,
//       libelle: `Travail à réaliser sur le véhicule ${rendezVous.id_vehicule}`, 
//       prix: (rendezVous.services || []).reduce((total, service) => total + service.prix, 0), 
//       etat: "en attente",
//       date_debut: dateRdv,
//       date_fin: getDateFin(rendezVous),
//     });

//     // Sauvegarde des modifications
//     await tache.save(); // Enregistre la tâche d'abord
//     await rendezVous.save(); // Ensuite, met à jour le rendez-vous

//     return { rendezVous, tache }; // Retourner le rendez-vous et la tâche créée

//   } catch (error) {
//     console.error("Erreur lors de la validation du rendez-vous :", error);
//     throw error; // Relancer l'erreur pour gestion en amont
//   }
// }

async function refuserRendezVousAuto() {
  try {
    const today = new Date();
    today.setUTCHours(9, 0, 0, 0);
    const rendezVous = await RendezVous.find({
      // date: {$gte: today},
      etat: { $in: ["en attente", "accepté"] },
    });
    
    console.log("aujourd'hui ",today);
    for (let index = 0; index < rendezVous.length; index++) {
      const rdv = rendezVous[index];
      if (rdv.date < today) {
        
        console.log("date rendez vous ",rdv.date);
        console.log("Rendez vous valide", rdv);
      } else if(rdv.date >= today) {
        console.log("date rendez vous ",rdv.date);
        console.log("Rendez vous invalide", rdv);
        // annulation rendez vous
        // await annulerRendezVous(rendezVous);
      }
    }

    // if (rendezVousInvalide.length <= 0) {
    //   console.log("📅 Aucun rendez vous");
    // } else {
    //   console.log("📅 Rendez-vous après aujourd'hui à 9h00 ");
    // }

    // return rendezVousInvalide;
  } catch (error) {
    throw new Error(error);
  }
}

module.exports = {
  proposerRendezVous,
  validerRendezVous,
  getRendezVousProche,
  annulerRendezVous,
  refuserRendezVousAuto
};
