const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const cloudinary = require("cloudinary").v2;

//import des modèles
const Offer = require("../models/offer");
const User = require("../models/user");

router.get("/offers", async (req, res) => {
  try {
    let filters = {};
    if (req.query.categories) {
      filters.categories = new RegExp(req.query.categories, "i");
    }
    if (req.query.title) {
      filters.product_name = new RegExp(req.query.title, "i");
    }
    if (req.query.priceMax) {
      filters.product_price = { $lte: Number(req.query.priceMax) };
    }
    if (req.query.priceMin) {
      if (filters.product_price) {
        filters.product_price.$gte = Number(req.query.priceMin);
      } else {
        filters.product_price = { $gte: Number(req.query.priceMin) };
      }
    }

    let sort = {};

    if (req.query.sort === "price-desc") {
      sort = { product_price: -1 };
    } else {
      sort = { product_price: 1 };
    }

    let page = 1;
    if (req.query.page) {
      page = Number(req.query.page);
    }

    // Par défaut on fixe la limite à 10
    let limit = 20;
    if (req.query.limit) {
      limit = Number(req.query.limit);
    }
    console.log(filters);
    const offers = await Offer.find(filters)
      .sort(sort)
      .limit(limit)
      .skip((page - 1) * limit);

    const count = await Offer.countDocuments(filters);

    res.json({ count: count, offers: offers });
  } catch (error) {
    res.json({ error: { message: error.message } });
  }
});

// Route qui permmet de récupérer tous les produits

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
