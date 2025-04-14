const mongoose = require('mongoose');

const ModeleSchema = new mongoose.Schema({
    nom : {type : String, required : true}
});



module.exports = mongoose.model('Modele', ModeleSchema);