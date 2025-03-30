require('dotenv').config();
const express = require('express');
const mongoose = require('./config/db');
const cors = require('cors');
const socketIo = require("socket.io");
const cron = require("node-cron");

const authRoutes = require('./routes/auth')
const clientRoutes = require('./routes/client')
const mecanicienRoutes = require('./routes/mecanicien')
const managerRoutes = require('./routes/manager');
const RendezVous = require('./models/RendezVous')
const Notification = require('./models/Notification')
const { sendEmailNotification } = require('./services/NotificationService');
const { getDateSansDecalageHoraire } = require('./services/Utils');
const Vehicule = require('./models/Vehicule')
const Utils = require('./services/Utils');
const { refuserRendezVousAuto } = require('./services/RendezVousService');
const app = express();
const PORT = process.env.PORT || 5000;





// Middleware
app.use(cors());
app.use(express.json());





 // Routes
app.use('/api/auth', authRoutes);
app.use('/api/client', clientRoutes);
app.use('/api/mecanicien', mecanicienRoutes);
app.use('/api/manager', managerRoutes);


// Planification de l'envoi de la notification 24 heures avant le rendez-vous

cron.schedule('0 0 * * *', async () => { // chaque minuit
    
    try {
        await refuserRendezVousAuto();
        const now = getDateSansDecalageHoraire(new Date());

        // Récupérer tous les rendez-vous dont la date est dans 24 heures
        const rendezVous = await RendezVous.find({
            date: { $gte: now, $lte: new Date(now.getTime() + 24 * 60 * 60 * 1000) },  // 24 heures à partir de maintenant
            etat: 'accepté'
        }).populate('id_client');  // Récupérer les informations du client
        console.log(rendezVous);
        
        for (const rdv of rendezVous) {
            const client = rdv.id_client;

            // Envoyer l'email de notification
            // sendEmailNotification("giorakotomalala@gmail.com", rdv.date);
            sendEmailNotification(rdv.id_client.email,Utils.formatDate(rdv.date),"rappel");

            const notification = new Notification({
                titre: "Rappel de votre rendez-vous",
                message: `Vous avez un rendez vous le ${Utils.formatDate(rdv.date)}`,
                id_client: client._id,
                id_rendez_vous: rdv._id
            });
            await notification.save();
        }
    } catch (error) {
        console.error("Erreur lors de la planification des notifications :", error);
    }
});

app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));