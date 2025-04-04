const Article = require('../models/Article');
const { getInfoServiceById } = require('./ArticleService');
// function getTotal(datas) {
//     return datas.reduce((total, data) => total + data, 0);
// }

 function getTotalArticle(articleInfo) {
    let prixTot = 0.0;
        if (articleInfo) { 
            for(const artInf of articleInfo){
                prixTot += artInf.id_article.prix * artInf.nbr_article; // Calcul du prix total pour chaque article (prix * quantité)
            }
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
        date = new Date(date);
        if (isNaN(date.getTime())) {
            throw new Error("La date sélectionnée n'est pas valide.");
        }
    }

    const hour = date.getHours();
    const minutes = date.getMinutes();
    // console.log(hour, minutes);
    

    return ((hour >= 8 && hour < 12) || (hour >= 13 && hour < 17)) && !(hour === 12 && minutes === 0);
}


/*
Si la tâche commence avant 17h mais finit après 17h

Si la tâche est coupée par la pause de midi (12h-13h)

Si la tâche dépasse l’heure de fermeture
*/
// function checkHeureDeTravail(dateDebut, dureeMinutes) {
//     const dateFin = new Date(dateDebut.getTime() + dureeMinutes * 60000);
    
//     const heureDebut = dateDebut.getHours();
//     const minuteDebut = dateDebut.getMinutes();
//     const heureFin = dateFin.getHours();
//     const minuteFin = dateFin.getMinutes();

//     // Vérifier que la tâche est bien dans les horaires de travail (8h-12h et 13h-17h)
//     const estDansHorairesTravail = 
//         (heureDebut >= 8 && heureDebut < 12) || (heureDebut >= 13 && heureDebut < 17);
//     const estFinDansHorairesTravail = 
//         (heureFin >= 8 && heureFin < 12) || (heureFin >= 13 && heureFin < 17);

//     if (!estDansHorairesTravail || !estFinDansHorairesTravail) {
//         return false; // Tâche hors des horaires de travail
//     }

//     // Vérifier que la tâche ne chevauche pas la pause midi (12h-13h)
//     const chevauchePauseMidi = (heureDebut < 12 && heureFin >= 12);
    
//     if (chevauchePauseMidi) {
//         return false;
//     }

//     return true; // La tâche est valide dans les horaires de travail
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