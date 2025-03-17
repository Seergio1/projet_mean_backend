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
const Vehicule = require('./models/Vehicule')
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

// // Mise à jour du cron pour enregistrer la notif en BD
// cron.schedule("0 9 * * *", async () => {
//     console.log("📢 Vérification des rendez-vous à notifier...");

//     const appointments = await getUpcomingAppointments();

//     for (const appointment of appointments) {
//         const client = appointment.id_client;
//         const message = "Votre rendez-vous est prévu dans 24h !";

//         await sendEmailNotification("giorakotomalala@gmail.com","Test mail","Le contenu de l'email")
//         await createNotification(client, appointment, message);
//     }

//     console.log(`✅ ${appointments.length} notifications envoyées.`);
// });

app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));