const express = require("express");
const router = express.Router();
const Offer = require("../models/Offer");
const User = require("../models/User");
const cloudinary = require("cloudinary").v2;
const isAuthenticated = require("../middlewares/isAuthenticated");

router.post("/offer/publish", isAuthenticated, async (req, res) => {
  try {
    const { title, description, price, condition, city, brand, size, color } =
      req.fields;

    const newOffer = new Offer({
      product_name: title,
      product_description: description,
      product_price: price,
      product_details: [
        { Etat: condition },
        { Emplacement: city },
        { Marque: brand },
        { Taille: size },
        { Couleur: color },
      ],
      owner: req.user,
    });
    let pictureToUpload = req.files.picture.path;
    let result = await cloudinary.uploader.upload(pictureToUpload, {
      folder: `/vinted/offers/${newOffer._id}`,
    });
    newOffer.product_image = result;
    await newOffer.save();
    res.status(200).json(newOffer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/offer/update", isAuthenticated, async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      condition,
      city,
      brand,
      size,
      color,
      _id,
    } = req.fields;
    if (_id) {
      const offers = await Offer.findOne({ _id: _id });

      if (offers) {
        if (title) {
          offers.product_name = title;
        }
        if (description) {
          offers.product_description = description;
        }
        if (price) {
          offers.product_price = price;
        }
        if (condition && city && brand && size && color) {
          offers.product_details[0].Etat = condition;
          offers.product_details[1].Emplacement = city;
          offers.product_details[2].Marque = brand;
          offers.product_details[3].Taille = size;
          offers.product_details[4].Couleur = color;
        }
        if (req.files.picture.path) {
          let pictureToUpload = req.files.picture.path;
          let result = await cloudinary.uploader.upload(pictureToUpload, {
            folder: `/vinted/offers/${_id}`,
          });
          offers.product_image = result;
        }

        await offers.save();

        res.status(200).json(offers);
      } else {
        res.status(400).json("offre inexistante");
      }
    } else {
      res.status(400).json("renseigner id de l'offre");
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/offer/delete", isAuthenticated, async (req, res) => {
  try {
    if (req.fields._id) {
      const offers = await Offer.findById(req.fields._id);

      if (offers) {
        await Offer.findByIdAndDelete(req.fields._id);
        res.status(200).json("offer deleted");
      } else {
        res.status(400).json("offre inexistante");
      }
    } else {
      res.status(400).json("renseigner le id de l'offre à supprimer");
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/offer/:id", isAuthenticated, async (req, res) => {
  try {
    if (req.params.id) {
      const offers = await Offer.findOne({ _id: req.params.id });
      offers.owner = req.user;

      res.status(200).json(offers);
    } else {
      res.status(400).json({ messag: "spécifier id du produit" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
