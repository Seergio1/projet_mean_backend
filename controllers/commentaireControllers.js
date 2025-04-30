const commentaireService = require('../services/CommentaireService');

exports.insertCommentaire = async (req, res) => {
    try {
        console.log('insertion commentaire')

        const {id_utilisateur ,libelle} = req.body;

        const newCommentaire = await commentaireService.insertCommentaire(id_utilisateur, libelle);
        res.status(201).json({ message: "insertion commentaire avec succes", data: newCommentaire });

    } catch (error) {
        console.error("erreur insert commentaire controllers", error);

        res.status(500).json({ message: "erreur insertion commentaire", error});
    }
}

exports.findAllCommentaire = async (req, res) => {
    try {
        const commentaires = await commentaireService.findAllCommentaire();
        res.status(201).json({ message: "find all commentaire avec succes", data: commentaires });

    } catch (error) {
        console.error("erreur find all commentaire controllers", error);

        res.status(500).json({ message: "erreur find all commentaire", error});
    }
}

exports.findCommentaireByClient = async (req,res) => {
    try {
        const id_client = req.params.id_client;
        const commentaires = await commentaireService.findCommentaireByIdUtilisateur(id_client);
        res.status(201).json({ message: "find commentaire by client avec succes", data: commentaires });
    } catch (error) {
        console.error("erreur findCommentaireByClient controllers", error);

        res.status(500).json({ message: "erreur findCommentaireByClient", error});
    }
}