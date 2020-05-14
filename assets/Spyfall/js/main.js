//TODO make room info be passed from server to all clients (so everyone has same room)

var spyRole = "";
var spyLocation = "";
var spyLeader = "";

var roomID = "";
var nameID = ""; // this will be the player's number (each player is numbered based on when they join the game)

const WAITING = 1;
const PLAYING = 2;
var state = 0;

function endGame() {
  socket.emit("end game", roomID);
  document.removeEventListener("keydown", spaceDown);
}

function leaveGame() {
  socket.emit("delete player", roomID, nameID, function () {
    isLeaving = true;
    location.reload();
  });
}

var firstplayer = 1;
var theme = "";
var mode = "";
var numPlayers = 0;

var startTime;
var time = 8; //in minutes

function displayInfo() {
  $("#end-game-button").unbind().on("click", endGame);
  $("#leave-game-button").unbind().on("click", leaveGame);

  optionsActive = false;
  state = PLAYING;
  document.getElementById("waiting-options").style.display = "none";
  WrulesActive = false;
  document.getElementById("waiting-rule-display").style.display = "none";
  document.getElementById("waiting-room").style.display = "none";
  document.getElementById("screen").style.display = "block";
  document.getElementById("screen").style.display = "block";
  socket.removeAllListeners("start game");
  socket.removeAllListeners("update game mode");
  socket.removeAllListeners("update players");
  socket.removeAllListeners("set players");
  socket.removeAllListeners("add players");

  socket.removeAllListeners("game ended");

  clearInterval(timerInterval);
  timerInterval = setInterval(startTimer, 200);

  document.getElementById("spy-role").innerText = "";
  document.getElementById("spy-location").innerText = "";
  document.getElementById("spy-leader").innerText = "";
  document.getElementById("spy-M-ref").innerText = "";
  document.getElementById("locations-display-row").innerHTML = "";
  document.getElementById("hud-players").innerHTML = "";
  document.addEventListener("keydown", spaceDown);

  socket.emit("get room data", roomID, function (r) {
    theme = r.theme;
    mode = r.mode;
    time = r.time;
    startTime = r.starttime;
    firstplayer = r.firstplayer;
    spyLocation = r.location;
    //console.log(spyLocation);
    displayPlayers();
    displayLocations();
  });

  socket.on("game ended", function () {
    displayWaitingRoom();
  });
}

function displayLocations() {
  socket.emit("get location", roomID, function (l) {
    spyLocation = l;
    var locArr = JSON.parse(sessionStorage.getItem("locations"));
    if (locArr == null || !Array.isArray(locArr)) {
      sessionStorage.setItem("locations", JSON.stringify([spyLocation]));
    } else {
      if (!locArr.includes(spyLocation)) {
        locArr.push(spyLocation);
        sessionStorage.setItem("locations", JSON.stringify(locArr));
      }
    }

    new Promise((resolve) => {
      if (mode == "leader") {
        socket.emit("get leader", roomID, function (l) {
          resolve(l);
        });
      } else resolve("");
    }).then((res) => {
      spyLeader = res;

      socket.emit("get player info", roomID, nameID, function (p) {
        spyRole = p.role;
        document.getElementById("spy-role").innerText = spyRole;

        toggleInfo("hidden");
        var s = "";
        if (theme == "general") {
          for (var loc of generalLocation) {
            s +=
              '<div class="col-6 locationC">' +
              "<div>" +
              loc.location +
              "</div></div>";
          }
        } else if (theme == "movie") {
          for (var loc of movieLocation) {
            s +=
              "<div class=\"col-6 locationC\" style='height:auto;'>" +
              "<div style='height:auto;'><b>" +
              loc.location +
              "</b><br>" +
              loc.reference +
              "</div></div>";
          }
        }
        document.getElementById("locations-display-row").innerHTML = s;
        $(".locationC").on("click", function (e) {
          e.preventDefault();
          $(this).hasClass("strikethrough")
            ? $(this).removeClass("strikethrough")
            : $(this).addClass("strikethrough");
        });
      });
    });
  });
}

function displayPlayers() {
  socket.emit("get players", roomID, function (pl) {
    var s = "";
    //console.log("id: " + nameID + " fp: " + firstplayer);
    for (let i in pl) {
      let p = pl[i];
      //console.log(p.id);
      if (nameID == p.id) {
        if (firstplayer == p.id) {
          s +=
            '<div class="col-md-6 col-sm-12 player">' +
            "<div><p class='firstDisplay'>First</p>" +
            p.name +
            " (You)" +
            "</div></div>";
        } else
          s +=
            '<div class="col-md-6 col-sm-12 player">' +
            "<div>" +
            p.name +
            " (You)" +
            "</div></div>";
      } else if (firstplayer == p.id) {
        s +=
          '<div class="col-md-6 col-sm-12 player">' +
          "<div><p class='firstDisplay'>First</p>" +
          p.name +
          "</div></div>";
      } else {
        s +=
          '<div class="col-md-6 col-sm-12 player">' +
          "<div>" +
          p.name +
          "</div></div>";
      }
    }
    document.getElementById("hud-players").innerHTML = s;
    $(".player").on("click", function (e) {
      e.preventDefault();
      $(this).hasClass("strikethrough")
        ? $(this).removeClass("strikethrough")
        : $(this).addClass("strikethrough");
    });
  });
}
