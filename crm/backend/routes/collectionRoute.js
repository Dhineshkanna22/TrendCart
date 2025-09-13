const express = require("express");
const {
  createNewCollection,
  removeCollection,
  getAllCollection,
  getSingleCollection,
} = require("../controllers/collectionController");

const router = express.Router();

router.post("/newCollection", createNewCollection);

router.delete("/removeCollection/:collectionID", removeCollection);

router.get("/allCollection", getAllCollection);

router.post("/singleCollection", getSingleCollection);

module.exports = router;
