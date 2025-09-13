const express = require("express");
const {
  addNewItem,
  removeItem,
  getSingleItem,
} = require("../controllers/itemController");

const router = express.Router();

router.post("/newItem", addNewItem);

router.post("/removeItem", removeItem);

router.post("/singleItem", getSingleItem);

module.exports = router;
