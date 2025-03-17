const Article = require("../models/Article");
const MouvementStock = require("../models/MouvementStock");

async function getAllMouvementStock() {
    let resultat = null;
    try {
        resultat = MouvementStock.find();

        return resultat;
    } catch (error) {
        console.error("Erreur lors de la demandes des mouvements de stock", error);
        throw error;
    }
}

async function insertMouvementStock(type, nombre, date, id_Article) {
    let prix_total = 0;
    let prix = 0;
    try {
        if ( nombre < 0) throw new Error("nombre invalid pour l'insertion de mouvement de stock");
        const art = await Article.findById(id_Article);

        prix = art.prix;
        prix_total = prix * nombre;

        let newMouvementStock = null;
        // console.log(prix);
        // console.log(prix_total);

        if (type == 0) {
            console.log("insertion entrer de stock");
            newMouvementStock = new MouvementStock({
                id_Article : art._id, 
                date : date || undefined, 
                entrer : nombre, 
                sortie : undefined, 
                prix : prix, 
                prix_total : prix_total
            });
        } else {
            console.log("insertion sortie de stock");
            newMouvementStock = new MouvementStock({
                id_Article : art._id, 
                date : date || undefined, 
                entrer : undefined, 
                sortie : nombre, 
                prix : prix, 
                prix_total : prix_total
            });
        }

        const mvmtSave = newMouvementStock.save();
        return mvmtSave;

    } catch (error) {
        console.error("Erreur lors de l'insertion mouvement de stock", error);

        throw error;
        
    }
}

module.exports = {getAllMouvementStock, insertMouvementStock};