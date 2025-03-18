const Facture = require('../models/Facture')

const getAllServicesById = async (ids_services) => {
    try {
        const services = await Service.find({ _id: { $in: ids_services } });
        return services;
    } catch (error) {
        console.error("Erreur lors de la récupération des services :", error);
        throw error;
    }
};

// pour tous les vehicules du client
async function getAllHistoriqueServiceClient(id_client) {
    try {
        const devis = await Facture.find({ id_client })
            .populate("id_vehicule") 
            .populate("services") 
            .populate("articles.id_article")
            .sort({ date_demande: -1 });
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
            .sort({ date_demande: -1 });
        return devis;
    } catch (error) {
        console.error("Erreur lors de la récupération des historique des services de ce vehicule :", error);
        throw error;
    }
};

module.exports = {getAllHistoriqueServiceClient,getHistoriqueServiceClientVehicule,getAllServicesById};