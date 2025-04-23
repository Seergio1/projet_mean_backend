const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UtilisateurSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    contact: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['client', 'mecanicien', 'manager'], default: 'client' },
    vehicules: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Vehicule' }] 
});

// Hachage du mot de passe avant sauvegarde
UtilisateurSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

module.exports = mongoose.model('Utilisateur', UtilisateurSchema);

