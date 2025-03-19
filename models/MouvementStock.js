const mongoose = require("mongoose");

const MouvementStockSchema = new mongoose.Schema({
    id_Article: { type: mongoose.Schema.Types.ObjectId, ref: "Article", required: true},
    date: { type: Date, default: Date.now},
    entrer: { type: Number, default: 0},
    sortie: { type: Number, default: 0},
    prix: { type: Number, required: true},
    prix_total: { type: Number, required: true}
});

module.exports = mongoose.model('MouvementStock', MouvementStockSchema);