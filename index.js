require("dotenv").config();

const express = require("express");
const formidable = require("express-formidable");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;
const cors = require("cors");

const app = express();
app.use(cors());
app.use(formidable());

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

mongoose.connect("mongodb://localhost/vinted");

const userRoutes = require("./routes/user");
app.use(userRoutes);

const offerRoutes = require("./routes/offer");
app.use(offerRoutes);

const searshRoutes = require("./routes/searsh");
app.use(searshRoutes);

app.all("*", (req, res) => {
  res.json("All routes");
});

app.listen(process.env.PORT, () => {
  console.log("Server has started");
});
