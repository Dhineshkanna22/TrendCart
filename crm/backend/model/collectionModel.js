const mongoose = require("mongoose");

const collectionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    items: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "item",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const collection = mongoose.model("collection", collectionSchema);
module.exports = collection;
