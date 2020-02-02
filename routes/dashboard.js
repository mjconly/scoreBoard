const express = require("express");
const router = express.Router();
const isAuthenticated = require("../auth").isAuthenticated;

//Used to retrieve team data from db
const Team = require("../models/Team");


//Get DashBoard Page
router.get("/home", isAuthenticated, (req, res) => {
  res.render("home", {
    name: req.user.name,
    navlink: req.path.slice(1),
  });
})


//Load DashBoard
router.post("/load", isAuthenticated, (req, res) => {
  let nbaSet = new Set();
  for (team of req.user.nbateams){
    nbaSet.add(team.name);
  }

  let nbaMap = new Map();

  Team.find({})
    .exec((err, items) => {
      if (err) throw err;

      for (team of items){
        nbaMap.set(team.name, team.logo);
      }

      let response = [];

      for (match of req.body.matchArray){
        if (nbaSet.has(match.name0) || nbaSet.has(match.name1)){
          match.name0 = nbaMap.get(match.name0);
          match.name1 = nbaMap.get(match.name1);
          response.push(match);
        }
      }

      if (response.length > 0){
        res.json(response);
      }
      else{
        res.sendStatus(400);
      }

    })
})

//Get myteams page
router.get("/myteams", isAuthenticated, (req, res) => {
  res.render("myteams", {
    name: req.user.name,
    navlink: req.path.slice(1),
    nbaSubs: req.user.nbateams,
    nflSubs: req.user.nflteams,
    mlbSubs: req.user.mlbteams,
    nhlSubs: req.user.nhlteams
  });
})


//Get addteam page
router.get("/addteam", isAuthenticated, (req, res) =>{
  Team.find({}, (err, teamData) => {
    if (err) throw err

    res.render("addteam", {
      name: req.user.name,
      navlink: req.path.slice(1),
      teamData: teamData,
      nbaSubs: req.user.nbateams,
      nflSubs: req.user.nflteams,
      mlbSubs: req.user.mlbteams,
      nhlSubs: req.user.nhlteams
    })
  })
})

//Post route add team to user DashBoard
router.post("/addteam/selection", isAuthenticated, (req, res) => {
  let selectID = req.body.teamId;
  Team.findById(selectID, (err, team) => {
    if (err) throw err;

    let league = team.league.toLowerCase() + "teams";

    let i = 0;
    let found = false;
    while (i < req.user[league].length && !found){
      found = req.user[league][i].name === team.name;
      i += 1;
    }

    if (found){
      console.log("Failed to add team, already exists it user " + league);
      res.sendStatus(400);
    }
    else {
      req.user[league].push(team);
      req.user.save()
        .then(() => {
          console.log(`Added ${team.city}  ${team.name} to user dashboard`)
          res.json({success : "Updated Successfully", status : 200})
        })
        .catch(err => console.log(err));
      }
    })
})


//Delete route drop team from user subscription
router.delete("/dropteam", isAuthenticated, (req, res) => {
    let dropID = req.body.teamId;
    let league = req.body.leagueId + "teams";

    Team.findById(dropID, (err, team) => {
      if (err) throw err;

      if (req.user[league].map((objTeam) => {return objTeam.name}).indexOf(team.name) === -1){
        console.log("Team was not found in user's list");
        res.sendStatus(400);
      }
      else{
      req.user[league].pull(team);
      req.user.save()
        .then(() => {
          console.log(`Removed ${team.name} from user`);
          res.json({success: "Updated Successfully", status: 200})
        })
        .catch(err => console.log(err));
      }
    })
})


module.exports = router;
