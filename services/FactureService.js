const Facture = require("../models/Facture");
const { getTotalArticle } = require("../services/Utils");
const { getInfoServiceById } = require("./ArticleService");
const { getServiceById } = require("./ServiceService");
const path = require("path");
const fs = require("fs");
const ejs = require("ejs");
const { insertMouvementStock } = require("./StockService");

// const puppeteer = require("puppeteer-core");
const puppeteer = require("puppeteer");
// const chrome = require("chrome-aws-lambda");

// const isRender = !!process.env.AWS_LAMBDA_FUNCTION_VERSION;



/*
  serviceId + checkArticle = serviceEtArticle
  serviceEtArticle = [{}]
  serviceId = id du service
  checkArticle = boolean pour savoir hoe mividy art ao amintsika ilay olona na tsia
*/

async function ajoutFacture(vehiculeId, tacheId, clientId, serviceEtArticles) {
  let prixTotal = 0.0;
  let articleInfo = [];
  let tabIdServices = [];

  try {
    for (const serviceEtArticle of serviceEtArticles) {
      let id_service = serviceEtArticle.serviceId;
      let check_article = serviceEtArticle.checkArticle;

      const service = await getServiceById(id_service);

      if (!service)
        throw new Error(`Service introuvable pour ID : ${id_service}`);

      if (typeof service.prix !== "number" || isNaN(service.prix)) {
        throw new Error(`Le prix du service "${service.nom}" est invalide.`);
      }

      prixTotal += service.prix;

      if (check_article == 1) {
        const result = await getInfoServiceById(service._id);
        if (result) articleInfo.push(...result);
      }

      tabIdServices.push(id_service);
    }

    // prix total des articles raha nividy tao amintsika
    let prixTotArticle =
      articleInfo.length > 0 ? getTotalArticle(articleInfo) : 0.0;

    if (articleInfo.length > 0) {
      for (const artInf of articleInfo) {
        if (artInf.nbr_article > 0) {
          insertMouvementStock(-1, artInf.nbr_article, artInf.id_article);
        }
      }
    }

    const newFacture = new Facture({
      id_client: clientId,
      id_vehicule: vehiculeId,
      id_tache: tacheId,
      prix_total: prixTotal + prixTotArticle,
      services: tabIdServices,
      articles: articleInfo,
    });

    const resultat = await newFacture.save();
    return resultat;
  } catch (error) {
    console.error("Erreur lors de la création de facture :", error.message);
    throw error;
  }
}

async function getFactureByTacheId(tacheId) {
  try {
    const facture = await Facture.findOne({ id_tache: tacheId });
    if (!facture) throw new Error("Aucune facture trouvée");

    return facture._id;
  } catch (error) {
    console.error("Erreur lors de la récupération des factures :", error);
    throw error;
  }
}

async function miseAJourFacture(factureId, serviceEtArticles) {
  try {
    const facture = await Facture.findById(factureId);
    if (!facture) {
      throw new Error(`Facture ${factureId} est introuvable`);
    }

    let prixTotal = 0.0;
    let articleInfo = [];

    for (const serviceEtArticle of serviceEtArticles) {
      const service = await getServiceById(serviceEtArticle.serviceId);
      if (!service) {
        throw new Error(
          `Service introuvable pour ID : ${serviceEtArticle.serviceId}`
        );
      }

      if (typeof service.prix !== "number" || isNaN(service.prix)) {
        throw new Error(`Le prix du service ${service._id} est invalide`);
      }

      prixTotal += service.prix;

      if (serviceEtArticle.checkArticle === 1) {
        const result = await getInfoServiceById(serviceEtArticle.serviceId);
        if (result) {
          articleInfo.push(...result);
        }
      }
    }

    const tabIdServices = serviceEtArticles.map((s) => s.serviceId);

    const prixTotArticle =
      articleInfo.length > 0 ? getTotalArticle(articleInfo) : 0.0;
    const nouveauPrixTotal = prixTotal + prixTotArticle;

    await Facture.findByIdAndUpdate(facture._id, {
      prix_total: nouveauPrixTotal,
      articles: articleInfo,
      services: tabIdServices,
    });

    return await Facture.findById(facture._id); // renvoyer la version mise à jour
  } catch (error) {
    console.error("Erreur lors de la mise à jour des factures :", error);
    throw error;
  }
}

async function getIdLastFacture() {
  try {
    const lastFacture = await Facture.findOne().sort({ date: -1 });
    if (!lastFacture) {
      throw new Error("Aucune facture trouvée");
    }
    return lastFacture._id;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération de l'id de la dernière facture :",
      error
    );
    throw error;
  }
}

async function getAllFactureByIdclient(clientId) {
  try {
    const factures = await Facture.find({ id_client: clientId })
      .populate("id_client")
      .populate({
        path: "id_vehicule",
        populate: { path: "id_modele", select: "nom" },
      })
      .populate("services")
      .populate("articles.id_article");
    return factures;
  } catch (error) {
    console.error("Erreur lors de la récupération des factures :", error);
    throw error;
  }
}

// async function creerFacturePDF(factureId) {
//   const logoPath = path.join(__dirname, "../templates", "logo.png");
//   const logoBase64 = fs.readFileSync(logoPath, "base64");
//   try {
//     const facture = await Facture.findById(factureId)
//       .populate("id_client")
//       .populate({
//         path: "id_vehicule",
//         populate: { path: "id_modele", select: "nom" },
//       })
//       .populate("services")
//       .populate("articles.id_article");

//     if (!facture) throw new Error("Facture non trouvée");

//     const html = await ejs.renderFile(
//       path.join(__dirname, "../templates", "facture.ejs"),
//       {
//         facture,
//         totalService: getTotalServices(facture.services),
//         totalArticles: getTotalArticles(facture.articles),
//         totalGlobal: facture.prix_total,
//         logoBase64,
//       }
//     );

//     // Vérifie que le dossier pdf existe
//     const pdfDir = path.join(__dirname, "../pdf");
//     if (!fs.existsSync(pdfDir)) {
//       fs.mkdirSync(pdfDir, { recursive: true });
//     }

//     const outputPath = path.join(pdfDir, `facture_${facture._id}.pdf`);

//     const browser = await puppeteer.launch({
//       headless: true,
//       args: ["--no-sandbox", "--disable-setuid-sandbox"], // utile en production
//     });
// //     const browser = await puppeteer.launch(
// //   isRender
// //     ? {
// //         args: chrome.args,
// //         executablePath: await chrome.executablePath,
// //         headless: chrome.headless,
// //       }
// //     : {
// //         headless: true,
// //         args: ["--no-sandbox", "--disable-setuid-sandbox"],
// //       }
// // );

//     const page = await browser.newPage();
//     await page.setContent(html, { waitUntil: "networkidle0" });
//     await page.pdf({
//       path: outputPath,
//       format: "A4",
//       printBackground: true,
//       margin: {
//         // top: '10mm',
//         // bottom: '10mm',
//         // left: '10mm',
//         // right: '10mm'
//       },
//     });

//     await browser.close();

//     return { success: true, path: outputPath };
//   } catch (error) {
//     console.error("Erreur génération PDF :", error);
//     throw error;
//   }
// }

// Fonctions auxiliaires


async function creerFacturePDF(factureId) {
  try {
    const logoPath = path.join(__dirname, "../templates", "logo.png");
    const logoBase64 = fs.readFileSync(logoPath, "base64");

    const facture = await Facture.findById(factureId)
      .populate("id_client")
      .populate({
        path: "id_vehicule",
        populate: { path: "id_modele", select: "nom" },
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
        logoBase64,
      }
    );

    const pdfDir = path.join(__dirname, "../pdf");
    if (!fs.existsSync(pdfDir)) {
      fs.mkdirSync(pdfDir, { recursive: true });
    }

    const outputPath = path.join(pdfDir, `facture_${facture._id}.pdf`);

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    await page.pdf({
      path: outputPath,
      format: "A4",
      printBackground: true,
    });

    await browser.close();

    return { success: true, path: outputPath };
  } catch (error) {
    console.error("Erreur génération PDF :", error);
    throw error;
  }
}

function getTotalServices(services) {
  return services.reduce((sum, s) => sum + (s.prix || 0), 0);
}

function getTotalArticles(articles) {
  return articles.reduce(
    (sum, a) => sum + a.id_article.prix * a.nbr_article,
    0
  );
}

module.exports = {
  ajoutFacture,
  miseAJourFacture,
  getIdLastFacture,
  creerFacturePDF,
  getAllFactureByIdclient,
  getFactureByTacheId,
};
