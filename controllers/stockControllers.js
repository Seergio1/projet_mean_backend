const stockService = require("../services/StockService");

exports.getAllMouvementStock = async (req, res) => {
    try {
        const mouvementStocks = await stockService.getAllMouvementStock();

        res.status(201).json({ message: "get all mouvement succes", data: mouvementStocks});

    } catch (error) {
        console.error("erreur get all mouvement stock", error);

        res.status(500).json({ message: "errour get All Mouvement Stock", error});
    }
};

exports.getAllMouvementStockByArticle = async (req, res) => {
    try {
        const id_article = req.params.id_article;

        const mouvementStocks = await stockService.getAllMouvementStockByArticle(id_article);

        res.status(201).json({ message: "get all mouvement succes", data: mouvementStocks});

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error});
    }
};

exports.insertMouvementStock = async (req, res) => {
    try {
        const {type, nombre, id_Article} = req.body;

        const save = await stockService.insertMouvementStock(type, nombre, id_Article);

        res.status(201).json({ message: "insertion mouvement stock succes", data : save});

    } catch (error) {
        console.error("erreur insert mouvement stock", error);

        res.status(500).json({ message: "erreur insert Mouvement Stock", error});
    }
};

exports.getMouvementArticle = async (req, res) => {
    try {
        const nomArticle = req.query.nomArticle;

        // console.log("nom de la'rticle"+ nomArticle);

        const mouvementArticle = await stockService.getStockAvecDetails(nomArticle);

        res.status(201).json({ message: "get mouvement article succes", data : mouvementArticle});

    } catch (error) {
        console.error("erreur insert mouvement stock", error);

        res.status(500).json({ message: "get mouvement article Stock", error});
    }
};

exports.getTotalDepenseArticle = async (req, res) => {
    try {
        const total = await stockService.getTotalDepenseArtice();

        res.status(201).json({ message: "get total depense article succes", data : total});

    } catch (error) {
        console.error("erreur get total depense article", error);

        res.status(500).json({ message: "erreur get total depense article", error});
    }
};