$(document).ready(() => {
  //keep all intervals in this array so they can be stopped
  const intervals = [];
  let parser = new DOMParser();
  let c = 0;

  //parse nba data from cbssports
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

  //initial get request to buid match cards
  $.get("https://www.cbssports.com/nba/scoreboard/?_=" + new Date().getTime(), (response) => {
    let parsed = parser.parseFromString(response, "text/html");
    const nodes = parsed.getElementsByClassName("in-progress-table");

    let matches = parseHTMLCBSSports(nodes);



    $.ajax({
      type:"POST",
      url: "/dashboard/load",
      dataType: "json",
      data: JSON.stringify(
        {matchArray: matches}
      ),
      contentType: "application/json",
    })
    .done((response) => {
      let nbaSet = new Set();
      for (match of response){
        nbaSet.add(match.name0);
        nbaSet.add(match.name1);
        $("#nbaBuild").append(
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
        if (intervals.length > 0){
          window.clearInterval(intervals.pop());
        }

        //add iterval to list -- the last response will be the only interval running
        intervals.push(
        window.setInterval(() => {
          $.get("https://www.cbssports.com/nba/scoreboard/?_=" + new Date().getTime(), (response) => {
            let parsed = parser.parseFromString(response, "text/html");
            const nodes = parsed.getElementsByClassName("in-progress-table");

            let matches = parseHTMLCBSSports(nodes);

            for (match of matches) {
              if (nbaSet.has(match.name0) || nbaSet.has(match.name1)){
                $(`#${match.name0}`).html(match.score0);
                $(`#${match.name1}`).html(match.score1);
                $(`#${match.name0[0]}${match.name1[0]}time`).text(c);
                c += 1;
              }
            }
          })
        }, 60000)
      ) //end of push

      })
    .fail(() => {
      $("#nbaBuild").append(
        `<li class="list-group-item d-flex justify-content-between align-items-center text-muted mb-3">
            None of your teams are playing today
        </li>`
      )
    })
  })
})
