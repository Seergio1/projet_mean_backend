const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const TacheSchema = new mongoose.Schema ({
    id_mecanicien: { type: mongoose.Schema.Types.ObjectId, ref : "Utilisateur", required: true},
    id_vehicule : String,
    // id_vehicule: { type: mongoose.Schema.Types.ObjectId, ref : "Vehicule", required: true},
    libelle: String,
    prix: Number,
    etat: Number,
    date: { type: Date, default: Date.now} 
});

module.exports = mongoose.model('Tache', TacheSchema);