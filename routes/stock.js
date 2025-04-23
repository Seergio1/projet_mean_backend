const express = require("express");
const authMiddleware = require("../middlewares/auth");
const {managerMiddleware} = require("../middlewares/role");
const stockControllers = require('../controllers/stockControllers');

const router = express.Router();

router.get("/find", authMiddleware, managerMiddleware, stockControllers.getAllMouvementStock);