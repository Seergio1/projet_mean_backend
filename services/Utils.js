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


// function getDateSansDecalageHoraire(date_initial){
//     const timezoneOffset = new Date().getTimezoneOffset(); // Décalage en minutes
    
//     return new Date(date_initial.getTime() - timezoneOffset * 60 * 1000);
// }

function getDateSansDecalageHoraire(date_initial) {
    return new Date(Date.UTC(
        date_initial.getFullYear(),
        date_initial.getMonth(),
        date_initial.getDate(),
        date_initial.getHours(),
        date_initial.getMinutes(),
        date_initial.getSeconds(),
        date_initial.getMilliseconds()
    ));
}

function checkHeureDeTravail(date) {
    if (!(date instanceof Date)) {
        throw new Error("La date séléctionnée n'est pas une date valide.");
    }

    const hour = date.getHours();
    const minutes = date.getMinutes();

    // Vérifier si l'heure est entre 8h-12h (sans inclure 12h) ou entre 13h-17h
    return ((hour >= 8 && hour < 12) || (hour >= 13 && hour < 17)) && !(hour === 12 && minutes === 0);
}
//à mettre dans rendezVous à service au cas ou
// async function trouverDatesDisponibles(dureeTotaleMinutes, dateSelectionnee) {
//   const dateActuelle = getDateSansDecalageHoraire(new Date(dateSelectionnee));
//   if (!Utils.checkHeureDeTravail(dateActuelle))
//     throw new Error("La date demandée n'est pas dans les horaires de travail");

//   // Chercher des créneaux disponibles dans les prochaines heures (exemple de 4 créneaux espacés de 1 heure y compris la date selectionnée sinon 3)
//   let datesDisponibles = [];
//   datesDisponibles.push({});
//   for (let i = 0; i <= 3; i++) {
//     let dateDebut = new Date(dateActuelle.getTime() + i * 60 * 60000); // ième créneau horaire
//     let dateFin = new Date(dateDebut.getTime() + dureeTotaleMinutes * 60000);

//     // Vérifier si le créneau est disponible
//     const disponible = await checkDateRdvValidite(dateDebut, dateFin);
//     if (disponible) {
//       datesDisponibles.push({ dateDebut, dateFin });
//     }
//   }

//   return datesDisponibles;
// }

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