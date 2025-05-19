require('dotenv').config();
const express = require('express');
const mongoose = require('./config/db');
const cors = require('cors');
// const socketIo = require("socket.io");
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
const Tache = require('./models/Tache');
const stockService = require('./services/StockService');
const app = express();
const PORT = process.env.PORT || 5000;
process.env.PUPPETEER_CACHE_DIR = '/tmp/puppeteer-cache';


const allowedOrigins = [
    'http://192.168.0.36:5000',
    'https://m1p12mean-sergio-dimby.vercel.app'
];

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());





 // Routes
app.use('/api/auth', authRoutes);
app.use('/api/client', clientRoutes);
app.use('/api/mecanicien', mecanicienRoutes);
app.use('/api/manager', managerRoutes);


// Planification de l'envoi de la notification 24 heures avant le rendez-vous

cron.schedule('0 0 * * *', async () => { // chaque minuit
    
    try {
        const seuil = 5; 
        await refuserRendezVousAuto();
        const now = getDateSansDecalageHoraire(new Date());
        
        // Récupérer tous les rendez-vous dont la date est dans 24 heures
        const rendezVous = await RendezVous.find({
            date: { $gte: now, $lte: getDateSansDecalageHoraire(new Date(now.getTime() + 24 * 60 * 60 * 1000) )},  // 24 heures à partir de maintenant
            etat: 'accepté'
        }).populate('id_client'); 
        
        for (const rdv of rendezVous) {
            const client = rdv.id_client;
            const tacheInvalide = await Tache.find({
                id_rendez_vous:rdv._id,
                etat: ["en attente"]
            })
            
            if (tacheInvalide.length > 0) {
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

        }

        // notification stock
        const id_manager = await Utils.getIdManager();
        const articleStock = await stockService.getStockActuel(seuil);
        if (articleStock.length > 0) {
            const notification = new Notification({
                titre: "Stock bas",
                message: `Le stock de certains articles devraient être revu : ${articleStock.map(art => `${art.article.nom} (${art.stock})`).join(", ")}`,
                id_client: id_manager
            });
            await notification.save();
            // articleStock.forEach(async art => {
            //     sendEmailNotification("giorakotomalala@gmail.com", art.date);
            // })
        }
        

    } catch (error) {
        console.error("Erreur lors de la planification des notifications :", error);
    }
});

app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));