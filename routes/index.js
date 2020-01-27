const express = require("express");
const router = express.Router();
// const isAuthenticated = require("../auth").isAuthenticated;

//Get landing page
router.get("/", (req, res)=>{
  res.render("landing");
});

// //Get DashBoard Page
// router.get("/dashboard", isAuthenticated, (req, res) => {
//   res.render("dashboard", {
//     name: req.user.name
//   });
// })

module.exports = router;
