const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const path = require("path");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const csv = require("csvtojson");
const bodyParser = require("body-parser");


//Path to csv data
teamDataPath = path.resolve(__dirname, ("./teamData/teams.csv"))

//Load Enviornment Variables
require("dotenv").config( { path: path.resolve(__dirname, 'config/.env') });
const PORT = process.env.PORT;
const DB = process.env.DB_URI;


//Initialize app
const app = express();

//get userPassport
require("./passport")(passport);

//Connect to DB and add team data if not already in db
mongoose.connect(DB, {useNewUrlParser: true}, (err, db) => {
  if (err){
    console.log(err);
  }
  else{
    //Check to see if team data is in db
    db.db.listCollections({name: "teams"})
      .next((err, collection) => {
        if (err){
          console.log(err);
        }
        else if (collection === null){
            //team data needs to be added to DB
            const teamData = csv().fromFile(teamDataPath)
              .then((teamData) => {
                const Team = require("./models/Team");
                Team.insertMany(teamData, (err, res) => {
                  if (err) throw err;
                  console.log(`${res.length} items added to teams collection`);
                })
              })
        }
        console.log("Connected to mongoDb Atlas...")
    })
  }
})

//body parser middle MiddleWare
//middleware for body parser - for url encoded
app.use(bodyParser.urlencoded({extended: false}))
//middleware for body parser - application/json
app.use(bodyParser.json())

//View Engine
app.use(expressLayouts);
app.set("view engine", "ejs");

//Static Files
app.use(express.static(path.join(__dirname, "public")));

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
app.use("/dashboard", require("./routes/dashboard"));

app.listen(PORT, console.log("Server listenting on port 3000"));
