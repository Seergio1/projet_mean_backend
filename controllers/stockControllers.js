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

exports.insertMouvementStock = async (req, res) => {
    try {
        const {type, nombre, date, id_Article} = req.body;

        const save = await stockService.insertMouvementStock(type, nombre, date, id_Article);

        res.status(201).json({ message: "insertion mouvement stock succes", data : save});

    } catch (error) {
        console.error("erreur insert mouvement stock", error);

        res.status(500).json({ message: "erreur insert Mouvement Stock", error});
    }
};

exports.getMouvementArticle = async (req, res) => {
    try {
        const {id_Article} = req.body;

        const mouvementArticle = await stockService.getStockAvecDetails(id_Article);

        res.status(201).json({ message: "get mouvement article succes", data : mouvementArticle});

    } catch (error) {
        console.error("erreur insert mouvement stock", error);

        res.status(500).json({ message: "get mouvement article Stock", error});
    }
};