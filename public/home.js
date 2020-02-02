$(document).ready(() => {
  //keep all intervals in this array so they can be stopped
  const nbaIntervals = [];
  const nflIntervals = [];
  const mlbIntervals = [];
  const nhlIntervals = [];
  let parser = new DOMParser();

  //parse data from cbssports
  const parseHTMLCBSSports = (nodes) => {
    let rowBody;
    let matches = [];
    for (node of nodes){
      let match = {};
      let pos = 0;
      rowBody = node.childNodes[1].childNodes[1];
      for (team of rowBody.children){
        match[`name${pos}`] = $(team.children[0]).find(".team")[0].innerHTML;
        match[`score${pos}`] = team.children[team.children.length - 1].innerHTML;
        match[`logo${pos}`] = "";
        pos += 1;
      }
      match["time"] = node.parentNode.children[0].childNodes[1].innerHTML;
      matches.push(match);
    }
    return matches;
  }

  //function will make 4 calls to cbs sports for nba, nfl, mlb and nhl data
  const populate = (league) => {
    $.get(`https://www.cbssports.com/${league}/scoreboard/?_=` + new Date().getTime(), (response) => {
      let parsed = parser.parseFromString(response, "text/html");
      const nodes = parsed.getElementsByClassName("in-progress-table");

      let matches = parseHTMLCBSSports(nodes);

      $.ajax({
        type:"POST",
        url: "/dashboard/load",
        dataType: "json",
        data: JSON.stringify({
          matchArray: matches,
          league: league
        }),
        contentType: "application/json",
      })
      .done((response) => {
        let leagueSet = new Set();
        for (match of response){
          leagueSet.add(match.name0);
          leagueSet.add(match.name1);
          $(`#${league}Build`).append(
            `<div class="match-card">
              <div class="team-line">
                  <img src="${match.logo0}">
                  <h4 id="${match.name0}">${match.score0}</h4>
              </div>
              <div class="team-line">
                <img src="${match.logo1}">
                <h4 id="${match.name1}">${match.score1}</h4>
              </div>
              <div class="team-line-time">
                <h5 id="${match.name0[0]}${match.name1[0]}time">${match.time}</h5>
              </div>
            </div>`
          )
        }
          //take interval off and kill it since reponse from post is singleton for each
          setOneInterval(league, leagueSet);
        })
      .fail(() => {
        $(`#${league}Build`).append(
          `<li class="list-group-item d-flex justify-content-between align-items-center text-muted mb-3">
              None of your teams are playing today
          </li>`
        )
      })
    })
  } //end of populate function

  //ensures only one window interval is running per league
  const setOneInterval = (league, leagueSet) => {
    switch(league){
      case "nba":
        if (nbaIntervals.length > 0){
          window.clearInterval(nbaIntervals.pop());
        }
        nbaIntervals.push(customeInterval(league, leagueSet));
        break;
      case "nfl":
        if (nflIntervals.length > 0){
          window.clearInterval(nflIntervals.pop());
        }
        nflIntervals.push(customeInterval(league, leagueSet));
      break;
      case "mlb":
        if (mlbIntervals.length > 0){
          window.clearInterval(mlbIntervals.pop());
        }
        mlbIntervals.push(customeInterval(league, leagueSet));
        break;
      case "nhl":
        if (nhlIntervals.length > 0){
          window.clearInterval(nhlIntervals.pop());
        }
        nhlIntervals.push(customeInterval(league, leagueSet));
        break;
    }
  }


  //sets interval to get league scoreboard from cbssports
  const customeInterval = (league, leagueSet) => {
    window.setInterval(() => {
      $.get(`https://www.cbssports.com/${league}/scoreboard/?_=` + new Date().getTime(), (response) => {
        let parsed = parser.parseFromString(response, "text/html");
        const nodes = parsed.getElementsByClassName("in-progress-table");

        let matches = parseHTMLCBSSports(nodes);

        for (match of matches) {
          if (leagueSet.has(match.name0) || leagueSet.has(match.name1)){
            $(`#${match.name0}`).html(match.score0);
            $(`#${match.name1}`).html(match.score1);
            $(`#${match.name0[0]}${match.name1[0]}time`).html(match.time);
          }
        }
      })
    }, 10000)
  }

  //loop over populate function passing in league param
  populate("nba");
  populate("nfl");
  populate("mlb");
  populate("nhl");

})
