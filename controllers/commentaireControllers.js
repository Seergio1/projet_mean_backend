const commentaireService = require('../services/CommentaireService');

exports.insertCommentaire = async (req, res) => {
    try {
        const {id_utilisateurs, libelle} = req.body;

        const newCommentaire = await commentaireService.insertCommentaire(id_utilisateurs, libelle);
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