const mongoose = require('mongoose');

const VehiculeSchema = new mongoose.Schema({
    id_modele: { type: mongoose.Schema.Types.ObjectId, ref: "Modele", required: true },
    numero : {type : String, required : true, unique: true },
    marque : {type : String, required : true }
});


module.exports = mongoose.model('Vehicule', VehiculeSchema);