require('dotenv').config();
const express = require('express');
const mongoose = require('./config/db');
const cors = require('cors');

const authRoutes = require('./routes/auth')
const clientRoutes = require('./routes/client')
const mecanicienRoutes = require('./routes/mecanicien')
const managerRoutes = require('./routes/manager')

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

app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));