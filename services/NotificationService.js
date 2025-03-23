const Notification = require('../models/Notification');
const nodemailer = require("nodemailer");
const RendezVous = require('../models/RendezVous')

const mdp = "lxaj ityw irdi xrey"

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'sergiorajaohariniaina@gmail.com', 
    pass: mdp     
  }
});

// Fonction pour envoyer un e-mail
const sendEmailNotification = (to) => {
// Envoi d'un e-mail
const mailOptions = {
    from: 'sergiorajaohariniaina@gmail.com',
    to: to,
    subject: 'Rappel de votre rendez-vous',
    text: `Bonjour, vous avez un rendez-vous prévu le ${dateRendezVous}. 
                   Vous avez 24 heures pour annuler ce rendez-vous si nécessaire. 
                   Cliquez ici pour annuler : ${lienAnnulation}`,
            html: `<p>Bonjour, vous avez un rendez-vous prévu le <strong>${dateRendezVous}</strong>.</p>
                   <p>Vous avez 24 heures pour annuler ce rendez-vous si nécessaire. 
                   Cliquez <a href="${lienAnnulation}">ici pour annuler</a>.</p>`
  };
  
  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log('Erreur:', error);
    } else {
      console.log('Email envoyé:', info.response);
    }
  });
};

// const io = socketIo(server, {
//     cors: {
//         origin: "http://localhost:4200", // URL de ton application Angular
//         methods: ["GET", "POST"]
//     }
// });

// Fonction pour envoyer une notification en temps réel via WebSocket
// const sendSocketNotification = (clientId, message) => {
//     io.emit(`notification-${clientId}`, { message });
// };

// // Fonction pour enregistrer une notification en BD et l'envoyer via WebSocket
// const createNotification = async (client, appointment, message) => {
//     try {
//         const notification = new Notification({
//             message,
//             userId: client._id,
//             rendezVousId: appointment._id
//         });

//         await notification.save(); // Sauvegarde en BD
//         sendSocketNotification(client._id, message); // Envoie via WebSocket

//         console.log(`🔔 Notification enregistrée pour ${client.nom}`);
//     } catch (error) {
//         console.error("❌ Erreur d'enregistrement de la notification:", error);
//     }
// };

module.exports = {sendEmailNotification};

