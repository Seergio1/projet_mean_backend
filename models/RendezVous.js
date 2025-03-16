const mongoose = require("mongoose");
// const moment = require("moment-timezone");

const RendezVousSchema = new mongoose.Schema({
    id_client: { type: mongoose.Schema.Types.ObjectId, ref: "Utilisateur", required: true },
    date: { type: Date, required: true }, // Date du rendez-vous validé
    date_demande: { type: Date, default: Date.now }, // Date de la demande de rendez-vous
    etat: { type: String, enum: ["en attente", "accepté", "refusé"], default: "en attente" },
    id_mecanicien: { type: mongoose.Schema.Types.ObjectId, ref: "Utilisateur", required: false }, 
    services: [{ type: mongoose.Schema.Types.ObjectId, ref: "Service" }] // Liste des services demandés
});



RendezVousSchema.pre("save", function (next) {
    const localTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone; // Récupère le fuseau horaire local
    console.log("Fuseau horaire détecté :", localTimezone);

    if (this.date) {
        this.date = new Date(new Date(this.date).toLocaleString("en-US", { timeZone: localTimezone }));
    }

    if (this.date_demande) {
        this.date_demande = new Date(new Date(this.date_demande).toLocaleString("en-US", { timeZone: localTimezone }));
    }

    next();
});



module.exports = mongoose.model("RendezVous", RendezVousSchema);
