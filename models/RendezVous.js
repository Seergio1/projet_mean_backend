const mongoose = require("mongoose");
const { getDateSansDecalageHoraire } = require("../services/Utils");
// const moment = require("moment-timezone");

const RendezVousSchema = new mongoose.Schema({
    id_client: { type: mongoose.Schema.Types.ObjectId, ref: "Utilisateur", required: true },
    id_vehicule: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicule", required: true },
    date: { type: Date, required: true }, // Date du rendez-vous validé
    date_demande: { type: Date, default: Date.now }, // Date de la demande de rendez-vous
    etat: { type: String, enum: ["en attente", "accepté", "annulé"], default: "en attente" },
    id_mecanicien: { type: mongoose.Schema.Types.ObjectId, ref: "Utilisateur", required: false }, 
    services: [{ type: mongoose.Schema.Types.ObjectId, ref: "Service" }] // Liste des services demandés
});



RendezVousSchema.pre("save", function (next) {
    if (this.isNew || this.isModified("date")) {
        this.date = new Date(getDateSansDecalageHoraire(this.date)); 
    }
    if (this.isNew || this.isModified("date_demande")) {
        this.date_demande = new Date(getDateSansDecalageHoraire(this.date_demande)); 
    }
    next();
});

//il faut mettre ca dans angular pour eviter les decalage horaire sur les dates qui ne sont pas Date.now à l'enregistrement
// const dateRdv = new Date(utcDate);
// console.log(dateRdv.toLocaleString("fr-FR", { timeZone: "Africa/Nairobi" }));





module.exports = mongoose.model("RendezVous", RendezVousSchema);
