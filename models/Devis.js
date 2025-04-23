const mongoose = require("mongoose");
const { getDateSansDecalageHoraire } = require("../services/Utils");

const DevisSchema = new mongoose.Schema({
    id_client: { type: mongoose.Schema.Types.ObjectId, ref: "Utilisateur", required: true },
    id_vehicule: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicule", required: true },
    date_demande: { type: Date, default: Date.now }, // Date de la demande de rendez-vous
    prix_total: { type: Number, required : true, min : 0},
    duree_total: {type: Number, required: true, min:0},
    services: [{ type: mongoose.Schema.Types.ObjectId, ref: "Service" }], // Liste des services demandés
    articles: [{
        id_article: { type: mongoose.Schema.Types.ObjectId, ref: "Article", required: true }, 
        nbr_article: { type: Number, required: true, min: 1 } 
    }]
});

DevisSchema.pre("save", function (next) {
    if (this.isNew || this.isModified("date_demande")) {
        this.date_demande = new Date(getDateSansDecalageHoraire(this.date_demande)); // Même logique pour date_demande
    }
    next();
});

module.exports = mongoose.model('Devis',DevisSchema);
