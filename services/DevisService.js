const Devis = require('../models/Devis');
const {getTotalArticle} = require('../services/Utils')
const {getAllServicesById} = require('../services/ServiceService')

async function demandeDevis(vehiculeId,clientId,id_services,tabArticles){
        let prixTotal = 0.0;
        let dureeTotal = 0.0;
        let resultat = null;
        let res = null
    try {
        const allServices = await getAllServicesById(id_services);
        allServices.forEach(service => {
            prixTotal += service.prix
            dureeTotal += service.duree
        });
        const prixTotArticle = await getTotalArticle(tabArticles);
        const newDevis = new Devis({
            id_client : clientId,   
            id_vehicule: vehiculeId,
            prix_total: prixTotal+prixTotArticle,
            duree_total:dureeTotal,
            services:id_services,
            articles:Array.isArray(tabArticles) && tabArticles.length > 0 ? tabArticles : []
        });
        resultat = await newDevis.save();
        res = {
            data:newDevis,
            prix_tot_articles:prixTotArticle
        }
        return res;
        
    } catch (error) {
        console.error("Erreur lors de la demande de devis :", error);
        throw error;
    }
}

// pour tous les vehicules du client
async function getAllHistoriqueDevisClient(id_client) {
    try {
        const devis = await Devis.find({ id_client })
            .populate("id_vehicule") 
            .populate("services") 
            .populate("articles.id_article")
            .sort({ date_demande: -1 });
        return devis;
    } catch (error) {
        console.error("Erreur lors de la récupération des devis de tous ces vehicule ,", error);
        throw error;
    }
};

// pour un vehicule du client
async function getHistoriqueDevisClientVehicule(id_client, id_vehicule) {
    try {
        const devis = await Devis.find({ id_client, id_vehicule })
            .populate("id_vehicule")
            .populate("services")
            .populate("articles.id_article")
            .sort({ date_demande: -1 });
        return devis;
    } catch (error) {
        console.error("Erreur lors de la récupération des devis de ce vehicule :", error);
        throw error;
    }
};

// avec pagination
// async function getAllHistoriqueDevisClient(id_client, page = 1, limit = 10) {
//     try {
//         const devis = await Devis.find({ id_client })
//             .populate("id_vehicule") 
//             .populate("services") 
//             .populate("articles.id_article")
//             .sort({ date_demande: -1 })
//             .skip((page - 1) * limit)
//             .limit(limit);
//         return devis;
//     } catch (error) {
//         console.error("Erreur lors de la récupération des devis de tous ces vehicule ,", error);
//         throw error;
//     }
// };
// async function getHistoriqueDevisClientVehicule(id_client, id_vehicule, page = 1, limit = 10) {
//     try {
//         const devis = await Devis.find({ id_client, id_vehicule })
//             .populate("id_vehicule")
//             .populate("services")
//             .populate("articles.id_article")
//             .sort({ date_demande: -1 })
//             .sort({ date_demande: -1 })
//             .skip((page - 1) * limit);
//         return devis;
//     } catch (error) {
//         console.error("Erreur lors de la récupération des devis de ce vehicule :", error);
//         throw error;
//     }
// };

module.exports = {getAllHistoriqueDevisClient,getHistoriqueDevisClientVehicule,demandeDevis};