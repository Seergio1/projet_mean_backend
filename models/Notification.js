const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
    message: { type: String, required: true },
    id_client: { type: mongoose.Schema.Types.ObjectId, ref: "Utilisateur", required: true },
    id_rendez_vous: { type: mongoose.Schema.Types.ObjectId, ref: "RendezVous", required: true },
    date: { type: Date, default: Date.now },
    lu: { type: Boolean, default: false } // Permet de marquer la notification comme lue
});

module.exports = mongoose.model("Notification", NotificationSchema);
