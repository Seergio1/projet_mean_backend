const Notification = require('../models/Notification');
const nodemailer = require("nodemailer");
const RendezVous = require('../models/RendezVous')

// Crée un transporteur SMTP avec ton mot de passe d'application
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'sergiorajaohariniaina@gmail.com', // Ton adresse e-mail Gmail
    pass: 'lxaj ityw irdi xrey'     // Le mot de passe d'application généré
  }
});

// Fonction pour récupérer les rendez-vous dans les prochaines 24h
const getRendezVousProche = async () => {
    try {
        const now = new Date();
        const next24h = new Date();
        next24h.setHours(now.getHours() + 24);

        const appointments = await RendezVous.find({
            date: { $gte: now, $lte: next24h },
            etat: "accepté"
        }).populate("id_client");

        return appointments;
    } catch (error) {
        console.error("❌ Erreur lors de la récupération des rendez-vous:", error);
        return [];
    }
};

// Fonction pour envoyer un e-mail
const sendEmailNotification = (to, subject, text) => {
// Envoi d'un e-mail
const mailOptions = {
    from: 'sergiorajaohariniaina@gmail.com',
    to: to,
    subject: subject,
    text: text
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
const sendSocketNotification = (clientId, message) => {
    io.emit(`notification-${clientId}`, { message });
};

// Fonction pour enregistrer une notification en BD et l'envoyer via WebSocket
const createNotification = async (client, appointment, message) => {
    try {
        const notification = new Notification({
            message,
            userId: client._id,
            rendezVousId: appointment._id
        });

        await notification.save(); // Sauvegarde en BD
        sendSocketNotification(client._id, message); // Envoie via WebSocket

        console.log(`🔔 Notification enregistrée pour ${client.nom}`);
    } catch (error) {
        console.error("❌ Erreur d'enregistrement de la notification:", error);
    }
};

module.exports = {getRendezVousProche};

