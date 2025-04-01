const Notification = require('../models/Notification');
const nodemailer = require("nodemailer");
const RendezVous = require('../models/RendezVous')


// const mdp = "lxaj ityw irdi xrey"

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'sergiorajaohariniaina@gmail.com', 
    pass: process.env.MDP_MAIL   
  },
  tls: {
    rejectUnauthorized: false,
  }
});

// Fonction pour envoyer un e-mail
const sendEmailNotification = (to, dateRendezVous, type) => {
  const lienAnnulation = "http://localhost:4200/login";

  let subject, textContent, htmlContent;

  if (type === "rappel") {
      subject = "Rappel de votre rendez-vous";
      textContent = `Bonjour, vous avez un rendez-vous prévu le ${dateRendezVous}. 
                     Vous avez 24 heures pour annuler ce rendez-vous si nécessaire. 
                     Cliquez ici pour annuler : ${lienAnnulation}`;
      htmlContent = `<p>Bonjour, vous avez un rendez-vous prévu le <strong>${dateRendezVous}</strong>.</p>
                     <p>Vous avez 24 heures pour annuler ce rendez-vous si nécessaire. 
                     Cliquez <a href="${lienAnnulation}">ici pour annuler</a>.</p>`;
  } else if (type === "annulation") {
      subject = "Annulation de votre rendez-vous";
      textContent = `Bonjour, votre rendez-vous prévu le ${dateRendezVous} a été annulé.`;
      htmlContent = `<p>Bonjour, votre rendez-vous prévu le <strong>${dateRendezVous}</strong> a été annulé.</p>`;
  }

  const mailOptions = {
      from: 'sergiorajaohariniaina@gmail.com',
      to: to,
      subject: subject,
      text: textContent,
      html: htmlContent
  };

  transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
          console.log('❌ Erreur:', error);
      } else {
          console.log(`📧 Email de ${type} envoyé à ${to} :`, info.response);
      }
  });
};


async function updateEtatNotification(newEtat,notificationId) {
  try {
    const notification = await Notification.findById(notificationId);
    if (!notification) throw new Error("Notification introuvable");
    notification.lu = newEtat;
    await notification.save();
    return notification
  } catch (error) {
    throw new Error(error);
  }
}

async function updateAllEtatNotification(clientId) {
  try {
    const result = await Notification.updateMany(
      { id_client:clientId, lu: false },
      { $set: { lu: true } }   
    );
  
    
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function getNotificationsByIdClient(clientId) {
  try {
    const notifications = await Notification.find({
      id_client: clientId
    });
    if (!notifications) throw new Error("Notification(s) introuvable(s)");
    return notifications
  } catch (error) {
    throw new Error(error);
  }
}

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

module.exports = {sendEmailNotification,updateEtatNotification,getNotificationsByIdClient,updateAllEtatNotification};

