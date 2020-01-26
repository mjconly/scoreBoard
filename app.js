const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const path = require("path");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");

//Load Enviornment Variables
require("dotenv").config( { path: path.resolve(__dirname, 'config/.env') });
const PORT = process.env.PORT;
const DB = process.env.DB_URI;


//Initialize app
const app = express();

//get userPassport
require("./passport")(passport);

//Connect to DB
mongoose.connect(DB, { useNewUrlParser: true })
  .then(() => console.log("Connected to MongoDB Atlas..."))
  .catch(err => console.log(err));

//View Engine
app.use(expressLayouts);
app.set("view engine", "ejs");

//Static Files
app.use(express.static("public"));

//BodyParser
app.use(express.urlencoded( {extended: false} ));

//Express session
app.use(session({
  secret: "secret",
  resave: true,
  saveUninitialized: true
}));

//Passport MiddleWare
app.use(passport.initialize());
app.use(passport.session());

//Connect Flash
app.use(flash());

//Add Global Flash Variables
app.use((req, res, next) => {
  res.locals.successMsg = req.flash("successMsg");
  res.locals.errorMsg = req.flash("errorMsg");
  res.locals.error = req.flash("error");
  next();
})

//Routes
app.use("/", require("./routes/index"));
app.use("/users", require("./routes/users"));


app.listen(PORT, console.log("Server listenting on port 3000"));
