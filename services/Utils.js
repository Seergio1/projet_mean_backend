const Article = require('../models/Article')
// function getTotal(datas) {
//     return datas.reduce((total, data) => total + data, 0);
// }

async function getTotalArticle(datas) {
    let prixTot = 0.0; 
    for (const data of datas) {
        let article = await Article.findById(data.id_article); 
        prixTot += article.prix * data.nbr_article; 
    }
    return prixTot;
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

function checkHeureDeTravail(date) {
    if (!(date instanceof Date)) {
        throw new Error("La date séléctionnée n'est pas une date valide.");
    }

    const hour = date.getHours();
    const minutes = date.getMinutes();

    // Vérifier si l'heure est entre 8h-12h ou 13h-17h
    return (hour >= 8 && hour < 12) || (hour >= 13 && hour < 17);
};

function formatDate(dateString) {
    const date = new Date(dateString); // Convertit la date en objet Date
  
    return new Intl.DateTimeFormat('fr-FR', {
      weekday: 'long',  // Jour en lettres (ex: samedi)
      day: '2-digit',   // Jour en chiffres (ex: 29)
      month: 'long',    // Mois en lettres (ex: mars)
      hour: '2-digit',  // Heure (ex: 13)
      minute: '2-digit', // Minutes (ex: 00)
      timeZone: 'UTC',  // Force l'affichage en UTC
    }).format(date);
  }

module.exports = {getDateSansDecalageHoraire,getDateFin_,getTotalArticle,checkHeureDeTravail,formatDate};