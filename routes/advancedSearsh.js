const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const cloudinary = require("cloudinary").v2;

//import des modèles
const Offer = require("../models/offer");
const User = require("../models/user");

router.get("/AdvancedSearsh", async (req, res) => {
  try {
    let filters = {};
    // if (req.fields.categories){filters.categories=new Reg}
    if (req.fields.title) {
      filters.product_name = new RegExp(req.fields.title, "i");
    }
    if (req.fields.priceMax) {
      filters.product_price = { $lte: Number(req.fields.priceMax) };
    }
    if (req.fields.priceMin) {
      if (filters.product_price) {
        filters.product_price.$gte = Number(req.fields.priceMin);
      } else {
        filters.product_price = { $gte: Number(req.fields.priceMin) };
      }
    }

    let sort = {};

    if (req.fields.sort === "price-desc") {
      sort = { product_price: -1 };
    } else if (req.fields.sort === "price-asc") {
      sort = { product_price: 1 };
    }

    if (!req.fields.page) {
      req.fields.page = 1;
    }

    const limit = 2;
    const offers = await Offer.find(filters)
      .sort(sort)
      .select("product_name product_price ")
      .limit(limit)
      .skip(limit * (Number(req.fields.page) - 1));

    res.json(offers);
  } catch (error) {
    res.json({ error: { message: error.message } });
  }
});

// Route qui permmet de récupérer les informations d'une offre en fonction de son id
router.get("/offer/:id", async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id).populate({
      path: "owner",
      select: "account.username account.phone account.avatar",
    });
    res.json(offer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
