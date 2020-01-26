const express = require("express");
const router = express.Router();


//Get landing page
router.get("/", (req, res)=>{
  res.render("landing")
});

//Get DashBoard Page
router.get("/dashboard", (req, res) => {
  res.send("DashBoard");
})

module.exports = router;
