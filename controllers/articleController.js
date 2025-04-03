const { getAllArticles,createArticleService } = require("../services/ArticleService");

exports.createArticleServiceController = async (req,res) => {
    try {
        const { id_article, services, nbr_article } = req.body;

        // Vérification des données nécessaires
        if (!id_article || !services || !nbr_article) {
            return res.status(400).json({ message: "Tous les champs sont requis." });
        }

        // Utiliser le service pour créer un nouvel ArticleService
        const newArticleService = await createArticleService({ id_article, services, nbr_article });

        // Répondre avec le document créé
        return res.status(201).json({ message: "ArticleService créé avec succès", data: newArticleService });
    } catch (error) {
        console.error("Erreur lors de la création de l'ArticleService:", error);
        return res.status(500).json({ message: "Erreur interne du serveur", data: error });
    }
}

exports.getAllArticle = async (req,res) => {
    try {
        const articles = await getAllArticles();
        if(!articles.success){
            res.status(500).json({ message: articles.message,data:articles.data});  
        }
        res.status(201).json({ message: articles.message, data: articles.data }); 
    } catch (error) {
        console.error("Erreur lors de la récuperation de tous les articles: ", error.message);
        res.status(500).json({ message: "Erreur lors de la récuperation de tous les articles :"+error.message });  
    }
}