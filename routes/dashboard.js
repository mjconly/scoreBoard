const express = require("express");
const router = express.Router();
const isAuthenticated = require("../auth").isAuthenticated;

//Used to retrieve team data from db
const Team = require("../models/Team");

//Get DashBoard Page
router.get("/home", isAuthenticated, (req, res) => {
  res.render("home", {
    name: req.user.name,
    navlink: req.path.slice(1)
  });
})

//Get myteams page
router.get("/myteams", isAuthenticated, (req, res) => {
  res.render("myteams", {
    name: req.user.name,
    navlink: req.path.slice(1)
  });
})


//Get addteam page
router.get("/addteam", isAuthenticated, (req, res) =>{
  Team.find({}, (err, teamData) => {
    if (err) throw err

    res.render("addteam", {
      name: req.user.name,
      navlink: req.path.slice(1),
      teamData: teamData
    })
  })
})


module.exports = router;
