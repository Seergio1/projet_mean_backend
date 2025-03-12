const mongoose = require('mongoose');

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI, {
 useNewUrlParser: true,
 useUnifiedTopology: true
}).then(() => console.log("MongoDB connecté"))
 .catch(err => console.log(err));

module.exports = mongoose;