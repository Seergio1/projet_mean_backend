const mongoose = require("mongoose");

const TacheSchema = new mongoose.Schema({
    id_mecanicien: { type: mongoose.Schema.Types.ObjectId, ref: "Utilisateur", required: true },
    id_vehicule: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicule", required: true },
    id_rendez_vous : { type: mongoose.Schema.Types.ObjectId, ref: "RendezVous", required: true },
    libelle: { type: String, required: true}, 
    prix: { type: Number, required: true ,min:0}, 
    etat: { type: String, enum: ["en attente", "en cours", "terminée"], default: "en attente" }, // Statut de la tâche
    date_debut: { type: Date, required: true }, 
    date_fin: { type: Date, required: true },
    facture : {type : Boolean, default : false}
});

module.exports = mongoose.model("Tache", TacheSchema);
