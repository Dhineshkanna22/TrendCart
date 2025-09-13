const express = require("express");
const {
  addItem,
  removeItem,
  updateQuantity,
} = require("../controllers/cartController");

const router = express.Router();

router.post("/addItem", addItem);

router.post("/removeItem", removeItem);

router.post("/updateQuantity", updateQuantity);

module.exports = router;
