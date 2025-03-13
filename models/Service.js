const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
    nom : {type : String, required : true},
    duree : {type : Number, required : true },
    prix : {type : Number, required : true, min : 0}
});



module.exports = mongoose.model('Service', ServiceSchema);