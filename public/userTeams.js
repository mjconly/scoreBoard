$(document).ready(() => {

  //ajax delete function for selected team
  const ajaxDeleteTeam = (dropable, teamList, leagueList) =>{
    let data = $(dropable).attr("alt");
    let pill = document.getElementById(leagueList + "Pill");
    $.ajax({
      type: "DELETE",
      url: "/dashboard/dropteam",
      dataType: "json",
      data: {
        teamId: data,
        leagueId: leagueList
      },
      constentType: "application/json",
    })
    .done((response) => {
      $(teamList).remove();
      let val = $(pill).html();
      $(pill).text(val - 1);
    })
    .fail((response) => {
      console.log("Could not remove request item");
    })
  }

  //loop over droppable items from and add onclick events to remove
  let idx = 1;
  $("ul > li").each(() => {
    let listItem = document.getElementById("listItem" + idx);

    if (typeof $(listItem).attr("id") !== "undefined"){
      let listImage = document.getElementById("subscribed" + idx);
      let listDrop = document.getElementById("dropTeam" + idx);
      $(listDrop).on("click", () => {
        let league = $(listItem).parent().attr("id");
        ajaxDeleteTeam(listImage, listItem, league);
      })

      idx++;
    }
  })

})
