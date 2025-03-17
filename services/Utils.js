function getTotal(datas) {
    return datas.reduce((total, data) => total + data, 0);
}

function getDateFin_(rendezVous,date_){
    const allServices = rendezVous.services;
    
    let total = 0.0;
    allServices.forEach(service => {
            total += service.duree;  
    });

    // Créer une nouvelle date pour éviter de modifier l'original
    let dateFin = new Date(date_);
    console.log(total);
    
    // console.log(dateFin);
    dateFin.setMilliseconds(dateFin.getMilliseconds() + total * 60 * 1000);
    
    
    return dateFin;
}

function getDateSansDecalageHoraire(date_initial){
    const timezoneOffset = new Date().getTimezoneOffset(); // Décalage en minutes
    
    return new Date(date_initial.getTime() - timezoneOffset * 60 * 1000);
}

module.exports = {getTotal,getDateSansDecalageHoraire,getDateFin_};