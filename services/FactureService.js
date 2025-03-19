const Facture = require('../models/Facture')
const {getTotalArticle} = require('../services/Utils');
const { getAllServicesById } = require('./ServiceService');

async function ajoutFacture(vehiculeId,clientId,id_services,tabArticles){
        let prixTotal = 0.0;
        let resultat = null;
        let res = null
    try {
        const allServices = await getAllServicesById(id_services);
        allServices.forEach(service => {
            prixTotal += service.prix;
        });
        const prixTotArticle = await getTotalArticle(tabArticles);
        const newFacture = new Facture({
            id_client : clientId,   
            id_vehicule: vehiculeId,
            prix_total: prixTotal+prixTotArticle,
            services:id_services,
            articles:Array.isArray(tabArticles) && tabArticles.length > 0 ? tabArticles : []
        });
        resultat = await newFacture.save();
        res = {
            data:newFacture,
            prix_tot_articles:prixTotArticle
        }
        return res;
    } catch (error) {
        console.error("Erreur lors de la fabrication de facture :", error);
        throw error;
    }
}

async function creerFacture(id_facture){
    try {
        
    } catch (error) {
        console.error("Erreur lors de la création pdf de la facture :", error);
        throw error;
    }
}



module.exports = {ajoutFacture,creerFacture}