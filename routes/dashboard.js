const express = require("express");
const router = express.Router();
const isAuthenticated = require("../auth").isAuthenticated;

//Get DashBoard Page
router.get("/home", isAuthenticated, (req, res) => {
  res.render("home", {
    name: req.user.name
  });
})

//Get myteams page
router.get("/myteams", isAuthenticated, (req, res) => {
  res.render("myteams", {
    name: req.user.name
  });
})


//Get addteam page
router.get("/addteam", isAuthenticated, (req, res) =>{
  res.render("addteam", {
    name: req.user.name
  })
})


module.exports = router;