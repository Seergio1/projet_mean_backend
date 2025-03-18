const Facture = require('../models/Facture')

async function ajoutFacture(vehiculeId,clientId,id_services,tabArticles){
        let prixTotal = 0.0;
        let resultat = null;
    try {
        const allServices = getAllServicesById(id_services);
        allServices.array.forEach(service => {
            prixTotal = getTotal(service.duree);
        });
        const newFacture = new Facture({
            id_client : clientId,   
            id_vehicule: vehiculeId,
            prix_total: prixTotal,
            services:id_services,
            articles:Array.isArray(tabArticles) && tabArticles.length > 0 ? tabArticles : []
        });
        resultat = await newFacture.save();
       
        return resultat;
        
    } catch (error) {
        console.error("Erreur lors de la fabrication de facture :", error);
        throw error;
    }
}



module.exports = {ajoutFacture}