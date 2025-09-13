const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
  },
  discountedPrice: {
    type: Number,
  },
  stock: {
    type: Number,
    required: true,
  },
  images: [
    {
      type: String,
      required: true,
    },
  ],
});

const Item = mongoose.model("item", itemSchema);
module.exports = Item;
