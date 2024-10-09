const express = require("express");

const router = express.Router();
const { registerUser, loginUser } = require("../controllers/authController");

router.post("/login", loginUser);
router.post("/register", registerUser);

module.exports = router;
