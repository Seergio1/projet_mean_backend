const mongoose = require("mongoose");

const TacheSchema = new mongoose.Schema({
    id_mecanicien: { type: mongoose.Schema.Types.ObjectId, ref: "Mecanicien", required: true },
    id_vehicule: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicule", required: true },
    libelle: { type: String, required: true }, // Description de la tâche
    prix: { type: Number, required: true }, // Coût de la tâche
    etat: { type: String, enum: ["en attente", "en cours", "terminée"], default: "en attente" }, // Statut de la tâche
    date: { type: Date, required: true } // Date prévue pour la tâche
});

module.exports = mongoose.model("Tache", TacheSchema);
