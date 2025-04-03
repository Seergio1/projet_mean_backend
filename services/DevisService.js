const Devis = require('../models/Devis');
const {getTotalArticle} = require('../services/Utils')
const {getAllServicesById} = require('../services/ServiceService');
const { getInfoServiceById } = require('./ArticleService');


async function demandeDevis(vehiculeId, clientId, servicesIds, artCheck) {
    let prixTotal = 0.0;
    let dureeTotal = 0.0;
    let prixTotArticle = 0.0;
    let articleInfo = [];

    try {
        // Récupération des services en fonction de leurs ID
        const allServices = await getAllServicesById(servicesIds);

        // Parcourir les services et calculer prixTotal et dureeTotal
        for (const service of allServices) {
            if (typeof service.prix !== 'number' || isNaN(service.prix)) {
                throw new Error(`Le prix du service "${service.nom}" est invalide.`);
            }
            prixTotal += service.prix;
            dureeTotal += service.duree;

            // Si artCheck est activé, récupérer les informations des articles liés au service
            if (artCheck == 1) {
                const result = await getInfoServiceById(service._id);
                articleInfo.push(...result); // Ajouter les articles récupérés
            }
        }
        
        
        // Calcul du prix total des articles si artCheck est activé
        if (artCheck == 1) {
            prixTotArticle = getTotalArticle(articleInfo);
        }

        // Création du devis avec les informations calculées
        const newDevis = new Devis({
            id_client: clientId,
            id_vehicule: vehiculeId,
            prix_total: prixTotal + prixTotArticle, // Prix total des services + des articles
            duree_total: dureeTotal,               // Durée totale des services
            services: servicesIds,                 // Liste des services sélectionnés
            articles: articleInfo.length > 0 ? articleInfo : [] // Liste des articles sélectionnés
        });
        // console.log(prixTotal,prixTotArticle);
        // console.log(articleInfo);
        

        // Sauvegarde du devis dans la base de données
        const resultat = await newDevis.save();
        return resultat;

        // Préparation de la réponse avec les données du devis et du prix total des articles
        // return {
        //     // data: resultat,
        //     // prix_tot_articles: prixTotArticle
        // };
        // return {}
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