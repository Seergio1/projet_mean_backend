const mongoose = require("mongoose");

const RendezVousSchema = new mongoose.Schema({
    id_client: { type: mongoose.Schema.Types.ObjectId, ref: "Utilisateur", required: true },
    date: { type: Date, required: true }, // Date du rendez-vous validé
    date_demande: { type: Date, default: Date.now }, // Date de la demande de rendez-vous
    etat: { type: String, enum: ["en attente", "accepté", "refusé"], default: "en attente" },
    id_mecanicien: { type: mongoose.Schema.Types.ObjectId, ref: "Utilisateur", required: false }, 
    services: [{ type: mongoose.Schema.Types.ObjectId, ref: "Service" }] // Liste des services demandés
});

module.exports = mongoose.model("RendezVous", RendezVousSchema);
