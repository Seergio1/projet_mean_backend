require('dotenv').config();
const express = require('express');
const mongoose = require('./config/db');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());



 // Routes
// app.use('/articles', require('./routes/articleRoutes'));
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));