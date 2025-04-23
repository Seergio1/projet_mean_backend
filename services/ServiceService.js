const Facture = require('../models/Facture')
const Service = require('../models/Service')
const getAllServicesById = async (ids_services) => {
    try {
        const services = await Service.find({ _id: { $in: ids_services } });
        return services;
    } catch (error) {
        console.error("Erreur lors de la récupération des services :", error);
        throw error;
    }
};

const getServiceById = async (id_service) => {
    try {
        const service = await Service.findOne({ _id: id_service });
        return service;
    } catch (error) {
        console.error("Erreur lors de la récupération du service :", error);
        throw error;
    }
};



const getAllServices = async () => {
    try {
        const services = await Service.find();
        return services;
    } catch (error) {
        console.error("Erreur lors de la récupération de tous les services :", error);
        throw error;
    }
};

// pour tous les vehicules du client
async function getAllHistoriqueServiceClient(id_client) {
    try {
        const devis = await Facture.find({ id_client })
            .populate({
                path: "id_vehicule",
                populate: { path: "id_modele", select: "nom" }
            })
            .populate("services") 
            .populate("articles.id_article")
            .sort({ date: -1 });
        return devis;
    } catch (error) {
        console.error("Erreur lors de la récupération des historique des services de tous ces vehicule ,", error);
        throw error;
    }
};


// pour un vehicule du client
async function getHistoriqueServiceClientVehicule(id_client, id_vehicule) {
    try {
        const devis = await Facture.find({ id_client, id_vehicule })
            .populate("id_vehicule")
            .populate("services")
            .populate("articles.id_article")
            .sort({ date: -1 });
        return devis;
    } catch (error) {
        console.error("Erreur lors de la récupération des historique des services de ce vehicule :", error);
        throw error;
    }
};

//avec pagination
// async function getAllHistoriqueServiceClient(id_client, page = 1, limit = 10) {
//     try {
//         const devis = await Facture.find({ id_client })
//             .populate("id_vehicule")
//             .populate("services")
//             .populate("articles.id_article")
//             .sort({ date: -1 })
//             .skip((page - 1) * limit)
//             .limit(limit);
//         return devis;
//     } catch (error) {
//         console.error("Erreur lors de la récupération des historiques des services pour ce client :", error);
//         throw error;
//     }
// };

// async function getHistoriqueServiceClientVehicule(id_client, id_vehicule, page = 1, limit = 10) {
//     try {
//         const devis = await Facture.find({ id_client, id_vehicule })
//             .populate("id_vehicule")
//             .populate("services")
//             .populate("articles.id_article")
//             .sort({ date: -1 })
//             .skip((page - 1) * limit)
//             .limit(limit);
//         return devis;
//     } catch (error) {
//         console.error("Erreur lors de la récupération des historique des services de ce vehicule :", error);
//         throw error;
//     }
// };

module.exports = {getAllHistoriqueServiceClient,getHistoriqueServiceClientVehicule,getAllServicesById,getAllServices,getServiceById};