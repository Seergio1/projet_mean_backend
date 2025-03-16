const getAllServicesById = async (ids_services) => {
    try {
        const services = await Service.find({ _id: { $in: ids_services } });
        return services;
    } catch (error) {
        console.error("Erreur lors de la récupération des services :", error);
        throw error;
    }
};

module.exports = {getAllServicesById};