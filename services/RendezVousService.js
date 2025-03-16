const RendezVous = require('../models/RendezVous');
const Utilisateur = require('../models/Utilisateur');
const Service = require('../models/Service');
const Tache = require('../models/Tache');
const {getDateFin} = require('../services/TacheService')


async function prendreRendezVous(clientId, date, servicesIds) {
    try {
      // Vérification si l'utilisateur est un client
      const client = await Utilisateur.findById(clientId);
      if (!client || client.role !== 'client') {
        throw new Error("Client non trouvé ou rôle incorrect");
      }
  
      // Vérifier si les services existent
      const services = await Service.find({ '_id': { $in: servicesIds } });
      if (services.length !== servicesIds.length) {
        throw new Error("Certains services spécifiés sont invalides");
      }
  
      // Création du rendez-vous
      const rendezVous = new RendezVous({
        id_client: clientId,
        date: date,
        services: servicesIds,  // Liste des services demandés
        etat: 'en attente', // L'état initial est 'en attente'
      });
  
      await rendezVous.save();
      return rendezVous; // Retourne le rendez-vous créé
    } catch (error) {
      throw new Error("Erreur lors de la prise du rendez-vous: " + error.message);
    }
  }

  async function validerRendezVous(managerId, rendezVousId, mecanicienId) {
    try {
      // Vérification si l'utilisateur est un manager
      const manager = await Utilisateur.findById(managerId);
      if (!manager || manager.role !== 'manager') {
        throw new Error("Manager non trouvé ou rôle incorrect");
      }
  
      // Vérification si le rendez-vous existe
      const rendezVous = await RendezVous.findById(rendezVousId).populate('services');
      if (!rendezVous) {
        throw new Error("Rendez-vous non trouvé");
      }
  
      // Validation : Changer l'état à "accepté" et assigner un mécanicien
      rendezVous.etat = "accepté";
  
      // Vérification et assignation du mécanicien
      const mecanicien = await Utilisateur.findById(mecanicienId);
      if (!mecanicien || mecanicien.role !== 'mecanicien') {
        throw new Error("Mécanicien non valide ou non trouvé");
      }
  
      rendezVous.id_mecanicien = mecanicien._id;
      
      // Enregistrer les modifications dans le rendez-vous
      await rendezVous.save();
  
      // Récupérer le véhicule du client à partir du modèle Utilisateur
      const client = await Utilisateur.findById(rendezVous.id_client).populate('vehicules');
      if (!client || client.vehicules.length === 0) {
        throw new Error("Aucun véhicule trouvé pour ce client");
      }
  
      // On prend ici le premier véhicule du client (tu peux personnaliser cette logique si nécessaire)
      const vehicule = client.vehicules[0]; 
      
      // Création de la tâche
      const tache = new Tache({
        id_mecanicien: mecanicien._id,
        id_vehicule: vehicule._id,
        libelle: "Travail à réaliser sur le véhicule", // Description de la tâche, tu peux personnaliser
        prix: rendezVous.services.reduce((total, service) => total + service.prix, 0), // Calcul du prix à partir des services
        etat: 'en attente', // L'état initial de la tâche
        date_debut: rendezVous.date, // Date du rendez-vous pour la tâche
        date_fin : getDateFin(rendezVous)
      });
  
      // Sauvegarder la tâche
      await tache.save();
  
      return { rendezVous, tache }; // Retourner le rendez-vous et la tâche créée
    } catch (error) {
      throw new Error("Erreur lors de la validation du rendez-vous: " + error.message);
    }
  }

  module.exports = {prendreRendezVous,validerRendezVous};