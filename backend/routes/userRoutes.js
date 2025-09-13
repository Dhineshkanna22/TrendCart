const express = require("express");
const {
  registerUser,
  loginUser,
  getSingleUser,
  getAllUsers,
  deleteUser,
  addAdress,
} = require("../controllers/userController");

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/singleUser", getSingleUser);

router.get("/alluser", getAllUsers);

router.post("/deleteUser", deleteUser);

router.post("/addAdress", addAdress);

module.exports = router;
