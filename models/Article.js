const mongoose = require("mongoose");


const ArticlesSchema = new mongoose.Schema({
    nom: { type: String, required : true,},
    prix: {type: Number, required: true, min:0}
});

module.exports = mongoose.model('Article',ArticlesSchema);