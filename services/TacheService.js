function getDateFin(rendezVous){
    const allServices = rendezVous.services;
    
    let total = 0.0;
    allServices.forEach(service => {
            total += service.duree;  
    });
    return rendezVous.date.setMilliseconds(date.getMilliseconds() + minutesToAdd * 60 * 1000);
}


module.exports = {getDateFin};