const mongoose = require('mongoose');

const MecanicienSchema = new mongoose.Schema({
    nom : {type : String, required : true},
    duree : {type : Number, required : true },
    prix : {type : Number, required : true, min : 0}
});


const Service = mongoose.model('Service', ServiceSchema);

module.exports = Service;