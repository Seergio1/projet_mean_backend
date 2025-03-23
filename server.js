require('dotenv').config();
const express = require('express');
const mongoose = require('./config/db');
const cors = require('cors');
const socketIo = require("socket.io");
const cron = require("node-cron");

const authRoutes = require('./routes/auth')
const clientRoutes = require('./routes/client')
const mecanicienRoutes = require('./routes/mecanicien')
const managerRoutes = require('./routes/manager')
// const Vehicule = require('./models/Vehicule')
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
// cron.schedule('0 0 * * *', async () => {
//     try {
//         const now = new Date();

//         // Récupérer tous les rendez-vous dont la date est dans 24 heures
//         const rendezVous = await RendezVous.find({
//             date: { $gte: now, $lte: new Date(now.getTime() + 24 * 60 * 60 * 1000) },  // 24 heures à partir de maintenant
//             etat: 'accepté'
//         }).populate('id_client');  // Récupérer les informations du client

//         for (const rdv of rendezVous) {
//             const client = rdv.id_client;

//             // Envoyer l'email de notification
//             await envoyerNotificationEmail(client.email, rdv.date);
//         }
//     } catch (error) {
//         console.error("❌ Erreur lors de la planification des notifications :", error);
//     }
// });

app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));