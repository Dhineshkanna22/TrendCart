const express = require("express");
const { addOrderToUser } = require("../controllers/orderController");

const router = express.Router();

router.post("/addOrder", addOrderToUser);

module.exports = router;
