const mongoose = require("mongoose");
const { getDateSansDecalageHoraire } = require("../services/Utils");

const FactureSchema = new mongoose.Schema({
    id_client: { type: mongoose.Schema.Types.ObjectId, ref: "Utilisateur", required: true },
    id_vehicule: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicule", required: true },
    id_tache : {type : mongoose.Schema.Types.ObjectId, ref : "Tache", required : true},
    date: { type: Date, default: Date.now }, 
    prix_total: { type: Number, required : true, min : 0},
    services: [{ type: mongoose.Schema.Types.ObjectId, ref: "Service" }], 
    articles: [{
        id_article: { type: mongoose.Schema.Types.ObjectId, ref: "Article", required: true }, 
        nbr_article: { type: Number, required: true, min: 1 } 
    }]
});

FactureSchema.pre("save", function (next) {
    if (this.isNew || this.isModified("date")) {
        this.date = new Date(getDateSansDecalageHoraire(this.date)); 
    }
    next();
});

module.exports = mongoose.model('Facture',FactureSchema);
