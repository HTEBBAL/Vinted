require("dotenv").config();

const mongoose = require("mongoose");
const express = require("express");
const formidableMiddleware = require("express-formidable");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "webimup",
  api_key: "476399429992834",
  api_secret: "UBT9U3vjJOtSwNfUVqYzVsmPs3g",
});

const app = express();

app.use(formidableMiddleware());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

const userRoutes = require("./routes/user");
app.use(userRoutes);
const offerRoutes = require("./routes/offer");
app.use(offerRoutes);
const offersRoutes = require("./routes/offers");
app.use(offersRoutes);

app.all("*", (req, res) => {
  res.status(404).json({ message: "Page not found" });
});

app.listen(process.env.PORT, () => {
  console.log("server has started");
});
