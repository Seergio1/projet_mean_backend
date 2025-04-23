const mongoose = require("mongoose");

const CommentaireSchema = new mongoose.Schema({
    id_utilisateurs: { type: mongoose.Schema.Types.ObjectId, ref: "Utilisateur", required: true },
    libelle: { type: String, required: true },
    date: { type: Date, default: Date.now },
    etat: { type: Number, default: 0}
});

module.exports = mongoose.model('Commentaires', CommentaireSchema);