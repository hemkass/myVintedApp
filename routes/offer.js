const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

// import de ma fonction middleware
const myFunction = require("../middleWare");

const cloudinary = require("cloudinary").v2;

//import des modèles
const Offer = require("../models/offer");
const User = require("../models/user");

// poster une annonce
router.post("/offer/publish", myFunction.auth, async (req, res) => {
  try {
    console.log("je suis passée par la", req.fields);
    //1) verifier l'authentification via le middleware auth
    if (req.user) {
      console.log("conditions", req.fields);
      //2) créer le nouveau produit

      const newOffer = new Offer({
        product_name: req.fields.title,
        product_description: req.fields.description,
        product_price: req.fields.price,

        product_details: [
          req.fields.brand,
          req.fields.size,
          req.fields.color,
          req.fields.city,
        ],

        owner: req.user,
        //keys:req.fields.]
      });
      //Verifier l'ID
      //console.log(newOffer.owner);

      //3) Uploader l'image dans un fichier Vinted/offers/id de l'offre
      console.log("mon image", req.files);
      if (req.files.picture) {
        console.log("coucou");
        let pictureToUpload = req.files.picture.path;
        const result = await cloudinary.uploader.upload(pictureToUpload, {
          public_id: `vinted/offers/${newOffer._id}`,
          width: 400,
          height: 400,
          crop: "limit",
          effect: "improve",
        });

        //4) Ajouter mon image au produit
        newOffer.product_image = result.secure_url;
      }

      await newOffer.save();

      res.status(200).json({ newOffer });
    } else {
      res.status(401).json({ error: "Unauthorized" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//modifier ses annonces
router.post("/offer/update", myFunction.auth, async (req, res) => {
  try {
    if (req.user) {
      const isOffer = await Offer.findById({ _id: req.fields.id });

      if (isOffer)
        if (req.fields.product_name) {
          isOffer.product_name = req.fields.product_name;
        }
      if (req.fields.product_description) {
        isOffer.product_description = req.fields.product_description;
      }
      if (req.fields.product_price) {
        isOffer.product_price = req.fields.product_price;
      }

      if (req.fields.brand) {
        isOffer.product_details[0] = req.fields.brand;
      }

      if (req.fields.size) {
        isOffer.product_details[1] = req.fields.size;
      }
      if (req.fields.color) {
        isOffer.product_details[2] = req.fields.color;
      }
      if (req.fields.city) {
        isOffer.product_details[3] = req.fields.city;
      }

      if (req.files.picture) {
        //1) Supprimer l'ancienne photo
        cloudinary.api.delete_resources(isOffer.product_image);

        //2) upploader la nouvelle photo
        let newPictureToUpload = req.files.picture.path;

        const result = await cloudinary.uploader.upload(newPictureToUpload, {
          public_id: `vinted/offers/${isOffer._id}`,
          width: 400,
          height: 400,
          crop: "limit",
          effect: "improve",
        });

        isOffer.product_image = result.secure_url;
      }
      await isOffer.save();
      return res.json({
        message: `your offer ${isOffer.product_name} has been updated`,
      });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//supprimer une annonce
router.post("/offer/delete", myFunction.auth, async (req, res) => {
  try {
    if (req.user) {
      const isOffer = await Offer.findByIdAndDelete({ id: req.fields.id });
      if (isOffer)
        return res.json({
          message: `your offer ${isOffer.name} has been deleted`,
        });
      else {
        return res.status(428).json({ error: "No offer found" });
      }
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
