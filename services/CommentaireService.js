const Commentaires = require("../models/Commentaires");
const mongoose = require('mongoose');

async function insertCommentaire(id_utilisateur, libelle) {
    try {
        const newCommentaire = new Commentaires({ 
            id_utilisateurs: id_utilisateur,
            libelle: libelle,
            date: undefined,
            etat: 0
        });

        const insertedCommentaire = newCommentaire.save();
        return insertedCommentaire;
    } catch (error) {
        console.error("erreur dans insertion commentaire", error);

        throw error;
    }
}

async function findAllCommentaire() {
    try {
        const commentaires = Commentaires.find()
        .sort({ date: -1 })
        .populate({
            path: "id_utilisateurs", 
            select: "nom contact email"
        });
        return commentaires;
    } catch (error) {
        console.error("erreur dans find all commentaire", error);

        throw error;
    }
}async function findCommentaireByIdUtilisateur(id_client) {
    try {
        const commentaires = Commentaires.find({id_utilisateurs: id_client}).sort({ date: -1 });
        return commentaires;
    } catch (error) {
        console.error("erreur dans findCommentaireByIdUtilisateur", error);
        throw error;
    }
}



module.exports = {insertCommentaire, findAllCommentaire, findCommentaireByIdUtilisateur};