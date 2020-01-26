const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const path = require("path");

//Load Enviornment Variables
require("dotenv").config( { path: path.resolve(__dirname, 'config/.env') });
const PORT = process.env.PORT;
const DB = process.env.DB_URI;


//Initialize app
const app = express();


//Connect to DB
mongoose.connect(DB, { useNewUrlParser: true })
  .then(() => console.log("Connected to MongoDB Atlas..."))
  .catch(err => console.log(err));

//View Engine
app.use(expressLayouts);
app.set("view engine", "ejs");

//Static Files
app.use(express.static("public"));

//Routes
app.use("/", require("./routes/index"));
app.use("/users", require("./routes/users"));


app.listen(PORT, console.log("Server listenting on port 3000"));
