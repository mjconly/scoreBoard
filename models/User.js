const mongoose = require("mongoose");
const Team = require("./Team");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type:String,
    required: true
  },
  nbateams:{
    type: [Team.schema]
  },
  nflteams:{
    type: [Team.schema]
  },
  mlbteams:{
    type: [Team.schema]
  },
  nhlteams:{
    type: [Team.schema]
  },
  pinnedteams:{
    type: [Team.schema]
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
