const Facture = require("../models/Facture");
const { getTotalArticle } = require("../services/Utils");
const { getAllServicesById } = require("./ServiceService");
const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");

async function ajoutFacture(vehiculeId, clientId, id_services, tabArticles) {
  let prixTotal = 0.0;
  let resultat = null;
  let res = null;
  try {
    const allServices = await getAllServicesById(id_services);
    allServices.forEach((service) => {
      prixTotal += service.prix;
    });
    const prixTotArticle = await getTotalArticle(tabArticles);
    const newFacture = new Facture({
      id_client: clientId,
      id_vehicule: vehiculeId,
      prix_total: prixTotal + prixTotArticle,
      services: id_services,
      articles:
        Array.isArray(tabArticles) && tabArticles.length > 0 ? tabArticles : [],
    });
    resultat = await newFacture.save();
    res = {
      data: newFacture,
      prix_tot_articles: prixTotArticle,
    };
    return res;
  } catch (error) {
    console.error("Erreur lors de la fabrication de facture :", error);
    throw error;
  }
}

async function getAllFactureByIdclient(clientId) {
  try {
    const factures = await Facture.find({ id_client: clientId })
    .populate("id_client")
    .populate("id_vehicule")
    .populate("services")
    .populate("articles.id_article");
    return factures;
  } catch (error) {
    console.error("Erreur lors de la récupération des factures :", error);
    throw error;
  }
}

//fonction pour creer le pdf
async function creerFacture(factureId) {
    try {
        const facture = await Facture.findById(factureId)
            .populate("id_client")
            .populate("id_vehicule")
            .populate("services")
            .populate("articles.id_article");

        if (!facture) throw new Error("Facture non trouvée");

        const doc = new PDFDocument({ margin: 50 });
        const fileName = `facture_${facture._id}.pdf`;
        const stream = fs.createWriteStream(fileName);
        doc.pipe(stream);

        // Charger un logo (facultatif)
        const logoPath = path.join(__dirname, "../public/logo.png");
        if (fs.existsSync(logoPath)) {
            doc.image(logoPath, 50, 45, { width: 100 });
        }

        // En-tête
        doc.fontSize(20).text("FACTURE", { align: "center" });
        doc.moveDown();

        // Infos Entreprise
        doc.fontSize(12).text("Garage Sergio & Dimby", { bold: true });
        doc.text("IVB Ambatomintsangana");
        doc.text("Téléphone: 0344173919");
        doc.moveDown();

        // Infos Client
        doc.fontSize(14).text(`Client : ${facture.id_client.nom || "N/A"}`);
        doc.text(`Email : ${facture.id_client.email || "Non renseigné"}`);
        doc.text(`Contact : ${facture.id_client.contact || "Non renseigné"}`);
        doc.moveDown();

        // Infos Véhicule
        doc.fontSize(14).text(`Véhicule : ${facture.id_vehicule.modele || "N/A"}`);
        doc.text(`Numéro : ${facture.id_vehicule.numero || "Non renseigné"}`);
        doc.moveDown();

        // Services fournis
        doc.fontSize(12).text("Services fournis :", { underline: true });
        doc.moveDown();

        const serviceTable = [];
        facture.services.forEach((service, index) => {
            serviceTable.push([
                `${index + 1}`,
                service.nom,
                `${service.duree}h`,
                `${service.prix} MGA`
            ]);
        });

        drawTable(doc, serviceTable, ["#", "Service", "Durée", "Prix (MGA)"]);
        doc.moveDown();

        // Articles achetés
        doc.fontSize(12).text("Articles achetés :", { underline: true });
        doc.moveDown();

        if (facture.articles.length > 0) {
            const articleTable = [];
            facture.articles.forEach((article, index) => {
                articleTable.push([
                    `${index + 1}`,
                    article.id_article.nom,
                    `${article.nbr_article}`,
                    `${article.id_article.prix} MGA`,
                    `${article.nbr_article * article.id_article.prix} MGA`
                ]);
            });

            drawTable(doc, articleTable, ["#", "Article", "Qté", "Prix Unitaire", "Total"]);
        } else {
            doc.text("Aucun article acheté.");
        }

        doc.moveDown();

        // Total
        doc.fontSize(16).text(`Total à payer : ${facture.prix_total} MGA`, { bold: true, align: "right" });

        // Espace pour signatures
        doc.moveDown().moveDown();
        doc.text("Signature du client :", 50, doc.y + 30);
        doc.moveDown().moveDown().moveDown();
        doc.moveTo(50, doc.y).lineTo(250, doc.y).stroke();

        doc.moveDown().moveDown();
        doc.text("Signature de l'entreprise :", 350, doc.y - 60);
        doc.moveDown().moveDown().moveDown();
        doc.moveTo(350, doc.y).lineTo(550, doc.y).stroke();

        doc.end();

        return { stream, fileName };
    } catch (error) {
        console.error("Erreur lors de la génération PDF de la facture :", error);
        throw error;
    }
}

// Fonction pour dessiner un tableau
function drawTable(doc, rows, headers) {
    const startX = 50;
    let startY = doc.y + 10;
    const colWidths = [30, 200, 50, 80, 80];

    doc.fontSize(12).text(headers.join(" | "), startX, startY);
    startY += 20;
    doc.moveTo(startX, startY - 5).lineTo(startX + 450, startY - 5).stroke();

    rows.forEach((row) => {
        doc.text(row.join(" | "), startX, startY);
        startY += 20;
    });

    doc.moveTo(startX, startY - 5).lineTo(startX + 450, startY - 5).stroke();
}

module.exports = { ajoutFacture, creerFacture, getAllFactureByIdclient };
