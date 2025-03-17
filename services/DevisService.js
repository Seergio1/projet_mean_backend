const Devis = require('../models/Devis');
const {getTotal} = require('../services/Utils')
const {getAllServicesById} = require('../services/ServiceService')

async function demandeDevis(vehiculeId,clientId,id_services){
        let prixTotal = 0.0;
        let dureeTotal = 0.0;
        let resultat = null;
    try {
        const allServices = getAllServicesById(id_services);
        allServices.array.forEach(service => {
            prixTotal = getTotal(service.duree);
            dureeTotal = getTotal(service.prix)
        });
        const newDevis = new Devis({
            id_client : clientId,
            id_vehicule: vehiculeId,
            prix: prixTotal,
            services:id_services
        });
        await newDevis.save();
        resultat = {
            devis : newDevis,
            duree_total : dureeTotal 
        }
        return resultat
        
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
            .sort({ date_demande: -1 });

        return devis;
    } catch (error) {
        console.error("Erreur lors de la récupération des devis :", error);
        throw error;
    }
};

// pour un vehicule du client
async function getHistoriqueDevisClientVehicule(id_client, id_vehicule) {
    try {
        const devis = await Devis.find({ id_client, id_vehicule })
            .populate("id_vehicule")
            .populate("services")
            .sort({ date_demande: -1 });

        return devis;
    } catch (error) {
        console.error("Erreur lors de la récupération des devis :", error);
        throw error;
    }
};

module.exports = {getAllHistoriqueDevisClient,getHistoriqueDevisClientVehicule};