const express = require("express");
const cloudinary = require("cloudinary").v2;
const Offer = require("../models/Offer");
const User = require("../models/User");
const isAuthenticated = require("../middlewares/isAuthenticated");
const router = express.Router();

router.get("/offers", isAuthenticated, async (req, res) => {
  try {
    const title = req.query.title;
    const priceMin = req.query.priceMin;
    const priceMax = req.query.priceMax;
    const sort = parseInt(req.query.sort);
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);

    if (page && limit) {
      const offers = await Offer.find()
        .limit(limit)
        .skip((page - 1) * limit)
        .select("product_name _id");
      offers.owner = req.user;
      res.status(200).json(offers);
    }

    if (title) {
      console.log(`${title}`);
      const offers = await Offer.find({
        product_name: new RegExp(title, "i"),
      });
      res.status(200).json(offers);
    }
    if (title && priceMax) {
      const offers = await Offer.find(
        { product_name: title } && { product_price: { $lte: priceMax } }
      );
      res.status(200).json(offers);
    }
    if (priceMin && priceMax) {
      const offers = await Offer.find(
        {
          product_price: { $gte: priceMin },
        } && { product_price: { $lte: priceMax } }
      );
      res.status(200).json(offers);
    }

    if (sort) {
      const offers = await Offer.find().sort({ product_price: sort });
      res.status(200).json(offers);
    }

    if (title && sort) {
      const offers = await Offer.find({ product_name: title }).sort({
        product_price: sort,
      });
      res.status(200).json(offers);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
