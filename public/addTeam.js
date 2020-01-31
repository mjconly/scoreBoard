
$( window ).on( "load", function() {
  //ajax post function for selection
  const ajaxPostTeam = (team) => {
    $(team).css("border", "1px transparent solid")
    let data = $(team).attr("alt");
    //ajax post request when a team is added by user to their dashboard
    $.ajax({
      type:'POST',
      url: "/dashboard/addteam/selection",
      dataType: "json",
      data: JSON.stringify({
        teamId: data
      }),
      contentType: "application/json",
    })
    .done((response) => {
      $(team).css({"border": "none", "opacity": ".4"})
    })
    .fail((response) => {
      $(team).css("border", "none")
      console.log("FAIL")
    })
  }


  //Loop over each team (nba, nfl, mlb, nhl) and make them addable to users
  //dashboard

  let idx = 1;
  $("#nba-select img").each(() => {
    let addable = document.getElementById("img" + idx++);
      $(addable).on("click", () =>{
        if ($(addable).attr("style").length === 0){
          ajaxPostTeam(addable)
        }
      })
  })

  $("#nfl-select img").each(() => {
    let addable = document.getElementById("img" + idx++);
      $(addable).on("click", () =>{
        if ($(addable).attr("style").length === 0){
          ajaxPostTeam(addable)
        }
      })
  })

})
