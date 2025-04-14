const Facture = require("../models/Facture");
const { getTotalArticle } = require("../services/Utils");
const { getInfoServiceById } = require("./ArticleService");
const { getServiceById } = require("./ServiceService");
const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");
const ejs = require("ejs");




/*
  serviceId + checkArticle = serviceEtArticle
  serviceEtArticle = [{}]
  serviceId = id du service
  checkArticle = boolean pour savoir hoe mividy art ao amintsika ilay olona na tsia
*/

async function ajoutFacture(vehiculeId, clientId, serviceEtArticles) {
  let prixTotal = 0.0;
  let articleInfo = [];
  let tabIdServices = []
 
  try {
    
    for(const serviceEtArticle of serviceEtArticles){
      let id_service = serviceEtArticle.serviceId
      let check_article = serviceEtArticle.checkArticle
      
    
      const service = await getServiceById(id_service);

      if (!service) throw new Error(`Service introuvable pour ID : ${id_service}`);

      if (typeof service.prix !== 'number' || isNaN(service.prix)) {
        throw new Error(`Le prix du service "${service.nom}" est invalide.`);
      }

      prixTotal += service.prix
      

      if (check_article == 1) {
        const result = await getInfoServiceById(service._id);
        if (result) articleInfo.push(...result);
      }

      tabIdServices.push(id_service)
    }
    
    // prix total des articles raha nividy tao amintsika
    let prixTotArticle = articleInfo.length > 0 ? getTotalArticle(articleInfo) : 0.0;

    const newFacture = new Facture({
      id_client: clientId,
      id_vehicule: vehiculeId,
      prix_total: prixTotal + prixTotArticle,
      services: tabIdServices,
      articles: articleInfo
    });

    
    const resultat = await newFacture.save();
    return resultat;

  } catch (error) {
    console.error("Erreur lors de la création de facture :", error.message);
    throw error;
  }
}


async function getAllFactureByIdclient(clientId) {
  try {
    const factures = await Facture.find({ id_client: clientId })
    .populate("id_client")
    .populate({
      path: "id_vehicule",
      populate: { path: "id_modele", select: "nom" }
    })
    .populate("services")
    .populate("articles.id_article");
    return factures;
  } catch (error) {
    console.error("Erreur lors de la récupération des factures :", error);
    throw error;
  }
}


async function creerFacturePDF(factureId) {
  const logoPath = path.join(__dirname, '../templates','logo.png');
  const logoBase64 = fs.readFileSync(logoPath, 'base64');
  try {
    const facture = await Facture.findById(factureId)
      .populate("id_client")
      .populate({
          path: "id_vehicule",
          populate: { path: "id_modele", select: "nom" }
      })
      .populate("services")
      .populate("articles.id_article");

    if (!facture) throw new Error("Facture non trouvée");

    const html = await ejs.renderFile(
      path.join(__dirname, "../templates", "facture.ejs"),
      {
        facture,
        totalService: getTotalServices(facture.services),
        totalArticles: getTotalArticles(facture.articles),
        totalGlobal: facture.prix_total,
        logoBase64
      }
    );

    // Vérifie que le dossier pdf existe
    const pdfDir = path.join(__dirname, "../pdf");
    if (!fs.existsSync(pdfDir)) {
      fs.mkdirSync(pdfDir, { recursive: true });
    }

    const outputPath = path.join(pdfDir, `facture_${facture._id}.pdf`);

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'] // utile en production
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    await page.pdf({ path: outputPath, format: "A4", printBackground: true, margin: {
      // top: '10mm',
      // bottom: '10mm',
      // left: '10mm',
      // right: '10mm'
    } });

    await browser.close();

    return { success: true, path: outputPath };
  } catch (error) {
    console.error("Erreur génération PDF :", error);
    throw error;
  }
}


// Fonctions auxiliaires
function getTotalServices(services) {
  return services.reduce((sum, s) => sum + (s.prix || 0), 0);
}

function getTotalArticles(articles) {
  return articles.reduce((sum, a) => sum + (a.id_article.prix * a.nbr_article), 0);
}

module.exports = { ajoutFacture, creerFacturePDF, getAllFactureByIdclient };
