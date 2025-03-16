const mongoose = require("mongoose");


const DevisSchema = new mongoose.Schema({
    id_client: { type: mongoose.Schema.Types.ObjectId, ref: "Utilisateur", required: true },
    id_vehicule: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicule", required: true },
    date_demande: { type: Date, default: Date.now }, // Date de la demande de rendez-vous
    prix: { type: Number, required : true, min : 0},
    services: [{ type: mongoose.Schema.Types.ObjectId, ref: "Service" }] // Liste des services demandés
});

module = mongoose.model('Devis',DevisSchema);
