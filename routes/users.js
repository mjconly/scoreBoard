const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");

//User Model
const User = require("../models/User");

//Get Login Page
router.get("/login", (req, res) => {
  res.render("login")
});

//Get Register Page
router.get("/register", (req, res) => {
  res.render("register");
});


//Post Register
router.post("/register", (req, res) => {
  const {name, email, password, password_confirm} = req.body;
  let flags = [];

  //Check for blank fields
  if (!name || !email || !password || !password_confirm){
    flags.push("Please fill in all fields");
  }

  //Check for password confirmation
  if (password !== password_confirm){
    flags.push("Passwords do not match");
  }

  //Check for password length
  if (password.length < 6){
    flags.push("Password must be at least 6 characters long");
  }

  if (flags.length > 0){
    res.render("register", {
        flags,
        name,
        email,
        password,
        password_confirm
    });
  }
  else{
    User.findOne( {email: email})
      .then(user => {
        if (user){
          flags.push("Requested email is not available");
          res.render("register", {
            flags,
            name,
            email,
            password,
            password_confirm
          })
        }
        else {
          const newUser = new User({
            name,
            email,
            password
          });
          bcrypt.genSalt(10, (err, salt) =>
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              newUser.save()
                .then(user => {
                  req.flash("successMsg", "Registration Complete");
                  res.redirect("/users/login");
                })
                .catch(err => console.log(err));
            }))
        }
      });
  }
});

//Handle login
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true
  })(req, res, next);
});


module.exports = router;
