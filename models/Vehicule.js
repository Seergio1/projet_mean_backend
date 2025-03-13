const mongoose = require('mongoose');

const VehiculeSchema = new mongoose.Schema({
    modele : {type : String, required : true},
    numero : {type : String, required : true, unique: true }
});


module.exports = mongoose.model('Vehicule', VehiculeSchema);