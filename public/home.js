$(document).ready(() => {



  let parser = new DOMParser();
  $.get("https://www.cbssports.com/nba/scoreboard/?_=" + new Date().getTime(), (response) => {
    let parsed = parser.parseFromString(response, "text/html");


    const nodes = parsed.getElementsByClassName("in-progress-table");

    let c = 0;
    let rowBody;
    let matches = [];
    for (node of nodes){
      let match = {};
      let pos = 0;
      rowBody = node.childNodes[1].childNodes[1];
      for (team of rowBody.children){
        match[`name${pos}`] = $(team.children[0]).find(".team")[0].innerHTML;
        match[`score${pos}`] = team.children[team.children.length - 1].innerHTML;
        pos += 1;
      }
      match["time"] = node.parentNode.children[0].childNodes[1].innerHTML;
      matches.push(match);
      c += 1;
    }



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
      for (match of response){
        $("#nbaBuild").append(
          `<div class="match-card">
            <div class="team-line">
                <img src="${match.name0}">
                <h4>${match.score0}</h4>
            </div>
            <div class="team-line">
              <img src="${match.name1}">
              <h4>${match.score1}</h4>
            </div>
            <div class="team-line-time">
              <h5>${match.time}</h5>
            </div>
          </div>`
        )
      }
    })
    .fail(() => console.log("FAIL"))
  })



})
