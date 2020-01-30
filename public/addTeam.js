// require("jsdom").env("", function(err, window) {
//     if (err) {
//         console.error(err);
//         return;
//     }
//
//     //Get bling notation
//     var $ = require("jquery")(window);
//
//
//
//
// });

$( window ).on( "load", function() {


  //Loop over each team (nba, nfl, mlb, nhl) and make them addable to users
  //dashboard

  let idx = 1;
  $("#nba-select img").each(() => {
    let addable = document.getElementById("img" + idx++);
    $(addable).on("click", () =>{
      let data = $(addable).attr("alt");
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
        console.log("PASS");
      })
      .fail((response) => {
        console.log("FAIL")
      })
    })
  })

  $("#nfl-select img").each(() => {
    let addable = document.getElementById("img" + idx++);
    $(addable).on("click", () =>{
      let data = $(addable).attr("alt");
    })
  })

})
