var isLeaving = false;

socket.on("display current view", function (gamestart) {
  if (gamestart) {
    displayInfo();
  } else {
    displayWaitingRoom();
  }
});

socket.on("get room info", function (cb) {
  cb &&
    cb(roomID, nameID, "spyfall", function (res) {
      if (res) location.reload();
    });
});

window.onbeforeunload = function () {
  if (!isLeaving) socket.emit("delete player", roomID, nameID);
};

document.getElementById("rule-mode").onchange = function () {
  var mode = document.getElementById("rule-mode").value;
  if (mode == "traditional") {
    document.getElementById("rule-traditional").style.display = "block";
    document.getElementById("rule-leader").style.display = "none";
  } else if (mode == "leader") {
    document.getElementById("rule-leader").style.display = "block";
    document.getElementById("rule-traditional").style.display = "none";
  }
};

document.getElementById("waiting-rule-mode").onchange = function () {
  var mode = document.getElementById("waiting-rule-mode").value;
  if (mode == "traditional") {
    document.getElementById("waiting-rule-traditional").style.display = "block";
    document.getElementById("waiting-rule-leader").style.display = "none";
  } else if (mode == "leader") {
    document.getElementById("waiting-rule-leader").style.display = "block";
    document.getElementById("waiting-rule-traditional").style.display = "none";
  }
};

$("#start-join-roomid").on({
  keydown: function (e) {
    if (e.which === 32) return false;
  },
  change: function () {
    this.value = this.value.replace(/\s/g, "");
  },
});
$("#start-create-roomid").on({
  keydown: function (e) {
    if (e.which === 32) return false;
  },
  change: function () {
    this.value = this.value.replace(/\s/g, "");
  },
});

var WrulesActive = false;
$("#waiting-rules").on("click", function (e) {
  e.preventDefault();
  WrulesActive = true;
  if (WrulesActive) {
    document.getElementById("waiting-rule-display").style.display = "block";
  }
});

$("#waiting-close-rule-display").on("click", function (e) {
  e.preventDefault();
  WrulesActive = false;
  if (!WrulesActive) {
    document.getElementById("waiting-rule-display").style.display = "none";
  }
});

var rulesActive = false;
$("#rules").on("click", function (e) {
  e.preventDefault();
  rulesActive = true;
  if (rulesActive) {
    document.getElementById("rule-display").style.display = "block";
  }
});

$("#close-rule-display").on("click", function (e) {
  e.preventDefault();
  rulesActive = false;
  if (!rulesActive) {
    document.getElementById("rule-display").style.display = "none";
  }
});

var optionsActive = false;
$("#waiting-setting").on("click", function (e) {
  e.preventDefault();
  optionsActive = true;
  document.getElementById("waiting-options").style.display = "block";
});

$("#waiting-options-close").on("click", function (e) {
  e.preventDefault();
  optionsActive = false;
  document.getElementById("waiting-options").style.display = "none";
  document.getElementById("option-time").value = timeTimer;
  document.getElementById("option-mode").value = mode;
  document.getElementById("option-theme").value = theme;
});

$("#option-cancel-button").on("click", function (e) {
  e.preventDefault();
  optionsActive = false;
  document.getElementById("waiting-options").style.display = "none";
  document.getElementById("option-time").value = timeTimer;
  document.getElementById("option-mode").value = mode;
  document.getElementById("option-theme").value = theme;
});

$("#option-save-button").on("click", function (e) {
  e.preventDefault();
  var m = document.getElementById("option-mode").value;
  var t = document.getElementById("option-time").value;
  var th = document.getElementById("option-theme").value;

  socket.emit("update game mode", roomID, m, th, t);
  optionsActive = false;
  document.getElementById("waiting-options").style.display = "none";
});

var nameChangeActive = false;

$("#change-name-cancel-button").on("click", function (e) {
  e.preventDefault();
  nameChangeActive = false;
  document.getElementById("change-name").style.display = "none";
  document.getElementById("change-name-name").value = "";
});

$("#change-name-close").on("click", function (e) {
  e.preventDefault();
  nameChangeActive = false;
  document.getElementById("change-name").style.display = "none";
  document.getElementById("change-name-name").value = "";
});

$("#change-name-save-button").on("click", function (e) {
  e.preventDefault();
  var n = document.getElementById("change-name-name").value;
  document.getElementById("change-name-name").value = "";
  document.getElementById("change-name").style.display = "none";
  socket.emit("change player name", roomID, nameID, n);
});

document
  .getElementById("start-create-roomid")
  .addEventListener("input", function (evt) {
    document.getElementById("start-create-error").innerText = "";

    if (this.value.length != 4) {
      this.style.border = "2px solid red";
    } else {
      this.style.border = "1px solid #e5cbb7";
    }
  });
document
  .getElementById("start-join-roomid")
  .addEventListener("input", function (evt) {
    document.getElementById("start-join-error").innerText = "";

    if (this.value.length != 4) {
      this.style.border = "2px solid red";
    } else {
      this.style.border = "1px solid #e5cbb7";
    }
  });
document
  .getElementById("start-create-name")
  .addEventListener("input", function (evt) {
    if (this.value.length == 0) {
      this.style.border = "2px solid red";
    } else {
      this.style.border = "1px solid #e5cbb7";
    }
  });
document
  .getElementById("start-join-name")
  .addEventListener("input", function (evt) {
    if (this.value.length == 0) {
      this.style.border = "2px solid red";
    } else {
      this.style.border = "1px solid #e5cbb7";
    }
  });

function joinGameDisplay() {
  $("#start-join-game-button").unbind().click(joinGame);

  rulesActive = false;
  document.getElementById("rule-display").style.display = "none";

  document.getElementById("start-buttons").style.display = "none";
  document.getElementById("start-join-display").style.display = "block";
}

function createGameDisplay() {
  rulesActive = false;
  document.getElementById("rule-display").style.display = "none";

  document.getElementById("start-buttons").style.display = "none";
  document.getElementById("start-create-display").style.display = "block";
}

function backToStart() {
  document.getElementById("start-join-display").style.display = "none";
  document.getElementById("start-create-display").style.display = "none";
  document.getElementById("start-join-roomid").value = "";
  document.getElementById("start-join-name").value = "";
  document.getElementById("start-create-roomid").value = "";
  document.getElementById("start-create-name").value = "";
  document.getElementById("start-buttons").style.display = "flex";
  joining = false;
}

$("#start-join").click(joinGameDisplay);
$("#start-create").click(createGameDisplay);
$(".start-back-button").click(backToStart);

var name = "";
var theme = "general";
var mode = "traditional";
var timeTimer = 8;

function joinGame() {
  $("#start-join-game-button").off("click");
  setTimeout(function () {
    $("#start-join-game-button").on("click", joinGame);
  }, 2000);

  var room = document.getElementById("start-join-roomid").value;
  var n = document.getElementById("start-join-name").value;
  if (room.length < 4) {
    document.getElementById("start-join-roomid").style.border = "2px solid red";
    return;
  } else if (n.length == 0) {
    document.getElementById("start-join-name").style.border = "2px solid red";
    return;
  }

  name = n;
  socket.emit("join room", room, n, function (res, numP) {
    if (res == "null") {
      //room does not exist
      document.getElementById("start-join-error").innerText =
        "Room does not exist";
      document.getElementById("start-join-roomid").style.border =
        "2px solid red";
    } else if (res == "started") {
      //game in session
      document.getElementById("start-join-error").innerText = "Game in session";
      document.getElementById("start-join-roomid").style.border =
        "2px solid red";
    } else if (res == "full") {
      //game full
      document.getElementById("start-join-error").innerText = "Room full";
      document.getElementById("start-join-roomid").style.border =
        "2px solid red";
    } else if (res == "success") {
      //joined successfully
      document.getElementById("start-join-roomid").value = "";
      document.getElementById("start-join-name").value = "";
      document.getElementById("start-join-display").style.display = "none";
      document.getElementById("start").style.display = "none";
      nameID = numP;
      roomID = room;
      numPlayers = numP;

      displayWaitingRoom();
    }
  });
}

function createGame() {
  $("#start-create-game-button").off("click");
  setTimeout(function () {
    $("#start-create-game-button").on("click", createGame);
  }, 2000);
  var room = document.getElementById("start-create-roomid").value;
  var n = document.getElementById("start-create-name").value;
  if (room.length < 4) {
    document.getElementById("start-create-roomid").style.border =
      "2px solid red";
    return;
  } else if (n.length == 0) {
    document.getElementById("start-create-name").style.border = "2px solid red";
    return;
  }
  name = n;
  socket.emit("create room", room, n, function (res) {
    if (res == "taken") {
      //room code already taken
      document.getElementById("start-create-error").innerText =
        "Room code taken";
      document.getElementById("start-create-roomid").style.border =
        "2px solid red";
    } else if (res == "success") {
      document.getElementById("start-create-roomid").value = "";
      document.getElementById("start-create-name").value = "";
      document.getElementById("start-create-display").style.display = "none";
      document.getElementById("start").style.display = "none";
      nameID = 1;
      roomID = room;
      console.log(nameID + " " + roomID);
      displayWaitingRoom();
    }
  });
}

function displayWaitingRoom() {
  document.getElementById("screen").style.display = "none";
  toggleInfo("hidden");
  clearInterval(timerInterval);
  spyRole = "";
  spyLocation = "";
  socket.removeAllListeners("game ended");
  socket.removeAllListeners("start game");
  socket.removeAllListeners("update game mode");
  socket.removeAllListeners("update players");
  socket.removeAllListeners("set players");
  socket.removeAllListeners("add players");

  $("#startButton").unbind().click(startGame);
  $("#leaveButton").unbind().click(leaveGame);
  state = WAITING;
  optionsActive = false;
  document.getElementById("waiting-options").style.display = "none";

  document.getElementById("waiting-room").style.display = "block";
  document.getElementById("wait-roomCode").innerText = roomID;
  document.getElementById("waiting-player-list").innerHTML = "";

  socket.emit("get room data", roomID, function (r) {
    document.getElementById("option-mode").value = r.mode;
    document.getElementById("option-time").value = r.time;
    document.getElementById("option-theme").value = r.theme;
    mode = r.mode;
    timeTimer = r.time;
    theme = r.theme;
  });

  socket.emit("get players", roomID, function (p) {
    displayPlayersInWaiting(p);
  });
  socket.on("update players", function () {
    socket.emit("get players", roomID, function (p) {
      displayPlayersInWaiting(p);
    });
  });

  socket.on("update game mode", function (data) {
    mode = data.m;
    timeTimer = data.t;
    theme = data.th;
    document.getElementById("option-time").value = data.t;
    document.getElementById("option-mode").value = data.m;
    document.getElementById("option-theme").value = data.th;
  });

  socket.on("start game", function () {
    displayInfo();
  });
}

function displayPlayersInWaiting(p) {
  var s = "";
  for (let i in p) {
    let pl = p[i];
    if (nameID == pl.id) {
      s +=
        '<li class="col-12 waiting-player">' +
        pl.name +
        " (You)" +
        '<span class="editName">' +
        '<i class="fas fa-pencil-alt" data-id=\'' +
        pl.id +
        "'></i></span></li>";
    } else {
      s +=
        '<li class="col-12 waiting-player">' +
        pl.name +
        '<span class="editName">' +
        '<i class="fas fa-times deleteP" data-id=\'' +
        pl.id +
        "'></i></span></li>";
    }
  }
  document.getElementById("waiting-player-list").innerHTML = s;

  $(".deleteP").on("click", function (e) {
    e.preventDefault();
    socket.emit("delete player", roomID, $(this).attr("data-id"), function (
      res
    ) {
      if ($(this).attr("data-id") == nameID) {
        isLeaving = true;
        location.reload();
      }
    });
  });

  $(".fa-pencil-alt").on("click", function (e) {
    e.preventDefault();
    nameChangeActive = true;
    document.getElementById("change-name").style.display = "block";
  });
}

$("#start-create-game-button").click(createGame);

function disable() {}

socket.on("player leave", function (gamestart, id) {
  if (gamestart) {
    //playing
    displayPlayers();
  } else {
    //waiting

    if (id == nameID) {
      isLeaving = true;
      location.reload();
    } else {
      socket.emit("get players", roomID, function (p) {
        console.log(p);
        displayPlayersInWaiting(p);
      });
    }
  }
});

function startGame(e) {
  e.preventDefault();
  $("#startButton").off("click");

  setTimeout(function () {
    $("#startButton").on("click", startGame);
  }, 2000);
  var a = new Date();
  var arr = JSON.parse(sessionStorage.getItem("locations"));
  if (arr == null || !Array.isArray(arr)) {
    socket.emit(
      "start game",
      roomID,
      mode,
      theme,
      { hour: a.getHours(), min: a.getMinutes(), sec: a.getSeconds() },
      null
    );
    return;
  }
  var nArr;
  if (theme == "general") nArr = generalLocation.slice();
  else if (theme == "movie") nArr = movieLocation.slice();

  var c = 0;
  for (var i = 0; i < nArr.length; i++) {
    if (arr.includes(nArr[i].location)) c++;
  }
  if (c == nArr.length) {
    for (var j = 0; j < nArr.length; j++) {
      if (arr.includes(nArr[j].location)) {
        arr.splice(arr.indexOf(nArr[j].location), 1);
      }
    }
    sessionStorage.setItem("locations", JSON.stringify(nArr));
  }
  socket.emit(
    "start game",
    roomID,
    mode,
    theme,
    { hour: a.getHours(), min: a.getMinutes(), sec: a.getSeconds() },
    arr
  );
}

function leaveGame(e) {
  console.log("leaving");
  e.preventDefault();
  document.getElementById("waiting-room").style.display = "none";
  document.getElementById("start").style.display = "block";
  document.getElementById("start-buttons").style.display = "flex";
  socket.removeAllListeners("start game");
  socket.removeAllListeners("update game mode");
  socket.removeAllListeners("update players");
  socket.removeAllListeners("set players");
  socket.removeAllListeners("add players");
  $("#leaveButton").off("click");
  socket.emit("delete player", roomID, nameID, function () {
    isLeaving = true;
    location.reload();
  });
}
