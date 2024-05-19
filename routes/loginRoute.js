const express = require("express");
const { login, signup } = require("../controllers/loginController");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

module.exports = router;
