const mongoose = require("mongoose");

const ArticleServiceSchema = new mongoose.Schema({
    id_article: { type: mongoose.Schema.Types.ObjectId, ref: "Article", required: true },
    services: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
    nbr_article: { type: Number, required: true, min:0 }  
});     

module.exports = mongoose.model("ArticleService", ArticleServiceSchema);