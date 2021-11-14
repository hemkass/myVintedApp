const mongoose = require("mongoose");

const Offer = mongoose.model("Offer", {
  product_name: { type: String, max: 10000 },
  product_description: { type: String, maxLength: 500 },
  product_price: { type: Number },
  product_details: { type: mongoose.Schema.Types.Mixed, default: {} },
  category: Array,
  product_image: { type: mongoose.Schema.Types.Mixed, default: {} },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  //keys: { type: Array },
  categories: { type: Object },
});

module.exports = Offer;
