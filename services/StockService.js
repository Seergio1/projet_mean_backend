const Article = require("../models/Article");
const MouvementStock = require("../models/MouvementStock");
const mongoose = require('mongoose');

async function getAllMouvementStock() {
    let resultat = null;
    try {
        resultat = MouvementStock.find().populate('id_Article');

        return resultat;
    } catch (error) {
        console.error("Erreur lors de la demandes des mouvements de stock", error);
        throw error;
    }
}

async function insertMouvementStock(type, nombre, id_Article) {
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
                entrer : nombre, 
                sortie : undefined, 
                prix : prix, 
                prix_total : prix_total
            });
        } else {
            console.log("insertion sortie de stock");
            
            const details = await getStockAvecDetailsByArticle(id_Article);
            console.log(details);
            let difference = details.totalEntrer - details.totalSortie;
            console.log(difference);
            let reste = difference - nombre;
            if (reste < 0) throw new Error("nombre en stock insuffisant");

            newMouvementStock = new MouvementStock({
                id_Article : art._id, 
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

async function getStockArticle(id_Article) {
    try {
        console.log(id_Article);
        const result = await MouvementStock.aggregate([
            {
                $match: { id_Article: new mongoose.Types.ObjectId(id_Article) } // Filtrer par id_Article
            },
            {
                $group: {
                    _id: "$id_Article",
                    totalEntrer: { $sum: "$entrer" },
                    totalSortie: { $sum: "$sortie" }
                }
            }
        ]);

        console.log(result);

        return result.length > 0 ? result[0] : {_id: id_Article, totalEntrer: 0, totalSortie: 0 }; // Retourne l'objet ou null si pas de données
    } catch (error) {
        console.error("Erreur lors du calcul du stock pour un article :", error);
        throw error;
    } 
}

const getStockAvecDetails = async (nomArticle) => {
    try {
        const result = await Article.aggregate([
            {
                $match: { nom: { $regex: new RegExp(nomArticle, "i") } } // Sélectionner l'article
            },
            {
                $lookup: {
                    from: "mouvementstocks", // Assurez-vous que le nom est correct
                    localField: "_id",
                    foreignField: "id_Article",
                    as: "mouvements"
                }
            },
            {
                $unwind: { path: "$mouvements", preserveNullAndEmptyArrays: true } // Gérer les articles sans mouvements
            },
            {
                $group: {
                    _id: "$_id",
                    nom: { $first: "$nom" }, // Garder le nom de l'article
                    totalEntrer: { $sum: { $ifNull: ["$mouvements.entrer", 0] } },
                    totalSortie: { $sum: { $ifNull: ["$mouvements.sortie", 0] } }
                }
            }
        ]).sort({ totalSortie: -1 });

        // return result.length ? result[0] : { _id: id_Article, totalEntrer: 0, totalSortie: 0 };
        return result.length ? result : [];
    } catch (error) {
        console.error("Erreur:", error);
        throw error;
    }
};

const getStockAvecDetailsByArticle = async (id_Article) => {
    try {
        const result = await Article.aggregate([
            {
                $match: { _id: new mongoose.Types.ObjectId(id_Article) } // Sélectionner l'article
            },
            {
                $lookup: {
                    from: "mouvementstocks", // Assurez-vous que le nom est correct
                    localField: "_id",
                    foreignField: "id_Article",
                    as: "mouvements"
                }
            },
            {
                $unwind: { path: "$mouvements", preserveNullAndEmptyArrays: true } // Gérer les articles sans mouvements
            },
            {
                $group: {
                    _id: "$_id",
                    nom: { $first: "$nom" }, // Garder le nom de l'article
                    totalEntrer: { $sum: { $ifNull: ["$mouvements.entrer", 0] } },
                    totalSortie: { $sum: { $ifNull: ["$mouvements.sortie", 0] } }
                }
            }
        ]);

        return result.length ? result[0] : { _id: id_Article, totalEntrer: 0, totalSortie: 0 };
    } catch (error) {
        console.error("Erreur:", error);
        throw error;
    }
};

const getTotalDepenseArtice = async () => {
    try {
        const result = await MouvementStock.aggregate([
            {
                $group: {
                    _id: null,
                    totalPrixTotal: { $sum: '$prix_total'}
                }
            }
        ]);

        const total = result.length > 0 ? result[0].totalPrixTotal : 0;

        return total;

    } catch (error) {
        console.error("Erreur lors du calcul de la somme des prix_total :", error);
        throw error;
    }
}


// avoir le stock actuel pour le notification
const getStockActuel = async (nbr_min) => {
    try {
      const result = await MouvementStock.aggregate([
        {
          $group: {
            _id: '$id_Article',
            stock: { $sum: { $subtract: ['$entrer', '$sortie'] } }
          }
        },
        {
          $lookup: {
            from: 'articles',
            localField: '_id',
            foreignField: '_id',
            as: 'article'
          }
        },
        {
          $unwind: '$article'
        },
        {
          $match: {
            stock: { $lt: nbr_min }
          }
        },
        {
          $project: {
            _id: 0,
            article: 1,
            stock: 1
          }
        }
      ]);
      return result;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };



module.exports = {getTotalDepenseArtice, getAllMouvementStock, insertMouvementStock, getStockArticle, getStockAvecDetails, getStockAvecDetailsByArticle,getStockActuel};                        