const express = require("express");
const router = express.Router();


//Get Login Page
router.get("/login", (req, res) => {
  res.render("login");
});

//Get Register Page
router.get("/register", (req, res) => {
  res.render("register");
});


module.exports = router;
