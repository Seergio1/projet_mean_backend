const Article = require('../models/Article')
const ArticleService = require('../models/ArticleService')
const mongoose = require("mongoose");
async function getAllArticles() {
    try {
        const articles = await Article.find();
        if (articles.length === 0) {
            return { success: false, message: "Aucun article trouvé",data:[{}] };
        }
        return { success: true, message: "Rendez-vous annulé avec succès.", data: articles };
    } catch (error) {
        console.error("Erreur lors de la récupération de tous les articles :", error);
        throw error;
    }
}

async function getInfoServiceById(serviceId) {
    try {
        if (!mongoose.Types.ObjectId.isValid(serviceId)) {
            throw new Error("ID service invalide");
        }

        const infoArt = await ArticleService.find({ services: serviceId }).populate('id_article');

        // console.log("InfoArt récupéré:", infoArt);  // Vérification des données récupérées

        if (!infoArt || infoArt.length === 0) {
            return []; // Retourne un tableau vide au lieu d'afficher un log
        }

        return infoArt;
    } catch (error) {
        console.error("Erreur lors de la récupération des informations du service:", error);
        throw error;
    }
}
async function createArticleService(data) {
    try {
        // Créer un nouveau document dans la collection ArticleService
        const articleService = new ArticleService({
            id_article: data.id_article,
            services: data.services,
            nbr_article: data.nbr_article
        });

        // Sauvegarder dans la base de données
        const savedArticleService = await articleService.save();
        return savedArticleService;
    } catch (error) {
        console.error("Erreur lors de la création de l'ArticleService:", error);
        throw error; // Propager l'erreur pour gestion ultérieure
    }
}



module.exports = {getAllArticles,getInfoServiceById,createArticleService}