const mongoose = require("mongoose");
const { getDateSansDecalageHoraire } = require("../services/Utils");

const MouvementStockSchema = new mongoose.Schema({
    id_Article: { type: mongoose.Schema.Types.ObjectId, ref: "Article", required: true},
    date: { type: Date, default: Date.now},
    entrer: { type: Number, default: 0},
    sortie: { type: Number, default: 0},
    prix: { type: Number, required: true},
    prix_total: { type: Number, required: true},
    seuil: { type: Number,default: 5, required: true}
});

MouvementStockSchema.pre("save", function (next) {
    if (this.isNew || this.isModified("date")) {
        this.date = new Date(getDateSansDecalageHoraire(this.date)); 
    }
    next();
});

module.exports = mongoose.model('MouvementStock', MouvementStockSchema);