const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema({
    nom: { type: String, required: true},
    prix: { type: Number, required: true}
});

module.exports = mongoose.model("Article", ArticleSchema);