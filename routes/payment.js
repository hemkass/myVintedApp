const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

router.post("/payment", async (req, res) => {
  try {
    //Etape 1 : recevoir le token dans mon back : console.log(req.fields);

    //Etape 2 : le renvoyer à l'API stripe pour vérif :
    const response = await stripe.charges.create({
      amount: req.fields.product_Price * 100, // en centimes
      currency: "eur",
      description: req.fields.product_Description,
      source: req.fields.stripeToken,
    });

    if (response.status === "succeeded") {
      //console.log("par la", response.status);
      res.status(200).json({ message: "Paiement validé" });
    } else {
      //console.log("par ici", response.status);
      res.status(400).json({ message: "An error occured" });
    }
  } catch (error) {
    res.status(400).json({ message: "An error occured" });
  }
});

module.exports = router;
