const mongoose = require("mongoose");

const TeamSchema = new mongoose.Schema({
  league: {
    type: String
  },
  city: {
    type: String
  },
  name: {
    type: String
  },
  logo: {
    type: String
  }
})

const Team = mongoose.model("Team", TeamSchema);

module.exports = Team;
