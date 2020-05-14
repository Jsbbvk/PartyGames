var questionManager = require("./questions.js");

class Room {
  constructor(roomid) {
    this.roomid = roomid;
    this.startingGame = false;
    this.endingGame = false;
    this.gamestart = false;
    this.gamestate = -1;
    this.player = {};
    this.numPlayers = 0;
    this.playerIds = [];

    this.question = "";
    this.answer = "";
  }
  addPlayer(p) {
    this.player[p.id] = p;
  }
}

class Player {
  constructor(name, id, roomid) {
    this.roomid = roomid;
    this.id = id;
    this.name = name;
    this.isready = false;
    this.nextRound = false;
    this.continue1 = false;
    this.points = 0;
    this.lie = "";
    this.submittedlie = false;
    this.answerID = -1;
    this.lieID = -1;
    this.selectedAnswer = false;
    this.selectedBestLie = false;
  }
}

const CREATING_LIE = 0;
const CHOOSING_ANSWER = 1;
const ANSWER_RESULTS = 2;
const CHOOSING_BEST_LIE = 3;
const BEST_LIE_RESULTS = 4;

var rooms = {};

const init = (io, socket) => {
  socket.emit("get room id", function (id) {
    if (id != "") {
      if (rooms[id] != null) {
        socket.join(id);
        socket.emit(
          "display current view",
          rooms[id].gamestart,
          rooms[id].gamestate
        );
      }
    }
  });

  function setupRoom(roomid) {
    var qq = questionManager.getRandomQuestion();
    rooms[roomid].question = qq.question;
    rooms[roomid].answer =
      qq.answer[parseInt(qq.answer.length * Math.random())];
    rooms[roomid].gamestate = CREATING_LIE;
  }

  socket.on("submit lie", function (roomid, nameid, lie) {
    if (rooms[roomid] == null) return;
    rooms[roomid].player[nameid].lie = lie;
    rooms[roomid].player[nameid].submittedlie = true;

    var c = 0;
    for (let i in rooms[roomid].player) {
      let p = rooms[roomid].player[i];
      if (p.submittedlie) c++;
    }
    io.to(roomid).emit("submitted lie", c, rooms[roomid].playerIds.length);

    if (c == rooms[roomid].playerIds.length)
      rooms[roomid].gamestate = CHOOSING_ANSWER;
  });

  socket.on("player continue 1", function (roomid, id) {
    if (rooms[roomid] == null) return;

    rooms[roomid].player[id].continue1 = true;
    var c = 0;
    for (let i in rooms[roomid].player) {
      let p = rooms[roomid].player[i];
      if (p.continue1) c++;
    }
    io.to(roomid).emit("player continue 1", c, rooms[roomid].playerIds.length);
    if (c == rooms[roomid].playerIds.length)
      rooms[roomid].gamestate = CHOOSING_BEST_LIE;
  });

  function resetRound(roomid) {
    for (let i in rooms[roomid].player) {
      rooms[roomid].player[i].isready = false;
      rooms[roomid].player[i].nextRound = false;
      rooms[roomid].player[i].continue1 = false;
      rooms[roomid].player[i].submittedlie = false;
      rooms[roomid].player[i].selectedAnswer = false;
      rooms[roomid].player[i].selectedBestLie = false;
      rooms[roomid].player[i].lie = "";
      rooms[roomid].player[i].answerID = -1;
      rooms[roomid].player[i].lieID = -1;
    }
    setupRoom(roomid);
  }

  socket.on("player next round", function (roomid, id) {
    if (rooms[roomid] == null) return;

    rooms[roomid].player[id].nextRound = true;
    var c = 0;
    for (let i in rooms[roomid].player) {
      let p = rooms[roomid].player[i];
      if (p.nextRound) c++;
    }
    io.to(roomid).emit("player next round", c, rooms[roomid].playerIds.length);

    if (c == rooms[roomid].playerIds.length) resetRound(roomid);
  });

  socket.on("player selected answer", function (roomid, nameid, aid) {
    if (rooms[roomid] == null) return;

    rooms[roomid].player[nameid].answerID = aid;
    rooms[roomid].player[nameid].selectedAnswer = true;
    var c = 0;
    for (let i in rooms[roomid].player) {
      let p = rooms[roomid].player[i];
      if (p.selectedAnswer) c++;
    }
    io.to(roomid).emit(
      "player selected answer",
      c,
      rooms[roomid].playerIds.length
    );

    if (c == rooms[roomid].playerIds.length) {
      calculateResults(roomid);
      rooms[roomid].gamestate = ANSWER_RESULTS;
    }
  });

  socket.on("player selected lie", function (roomid, nameid, lid) {
    if (rooms[roomid] == null) return;

    rooms[roomid].player[nameid].lieID = lid;
    rooms[roomid].player[nameid].selectedBestLie = true;
    var c = 0;
    for (let i in rooms[roomid].player) {
      let p = rooms[roomid].player[i];
      if (p.selectedBestLie) c++;
    }
    io.to(roomid).emit(
      "player selected lie",
      c,
      rooms[roomid].playerIds.length
    );

    if (c == rooms[roomid].playerIds.length) {
      calculateBestLie(roomid);
      rooms[roomid].gamestate = BEST_LIE_RESULTS;
    }
  });

  function calculateBestLie(roomid) {
    var pp = [];
    for (let i = 0; i < rooms[roomid].playerIds.length; i++)
      pp[rooms[roomid].playerIds[i]] = 0;

    for (let i in rooms[roomid].player) {
      var ppp = rooms[roomid].player[i];
      pp[ppp.lieID] = pp[ppp.lieID] + 1;
    }

    var mx = -1;
    var pM = [];
    for (let i of pp) {
      if (pp[i] > mx) {
        mx = pp[i];
        pM = [];
        pM.push(i);
      } else if (pp[i] == mx) {
        pM.push(i);
      }
    }

    for (var i = 0; i < pM.length; i++) {
      rooms[roomid].player[pM[i]].points =
        rooms[roomid].player[pM[i]].points + 2;
    }
  }

  function calculateResults(roomid) {
    for (let i in rooms[roomid].player) {
      var p = rooms[roomid].player[i];
      if (p.answerID == 0)
        rooms[roomid].player[i].points = rooms[roomid].player[i].points + 2;
      else
        rooms[roomid].player[p.answerID].points =
          rooms[roomid].player[p.answerID].points + 1;
    }
  }

  socket.on("end game", function (roomid) {
    if (rooms[roomid] == null) return;
    if (rooms[roomid].endingGame) return;
    rooms[roomid].endGame = true;
    rooms[roomid].gamestart = false;
    rooms[roomid].startingGame = false;
    io.to(roomid).emit("game ended");
  });

  socket.on("start game", function (roomid) {
    if (rooms[roomid] == null) return;
    if (rooms[roomid].playerIds.length < 3) return;
    if (rooms[roomid].startingGame) return;
    rooms[roomid].startingGame = true;
    rooms[roomid].endingGame = false;
    rooms[roomid].gamestart = true;

    for (let i in rooms[roomid].player) {
      rooms[roomid].player[i].points = 0;
    }

    resetRound(roomid);

    io.to(roomid).emit("game start");
  });

  socket.on("get players", function (roomid, cb) {
    if (rooms[roomid] == null) return;
    cb && cb(rooms[roomid].player);
    return;
  });

  socket.on("get room info", function (roomid, cb) {
    if (rooms[roomid] == null) return;
    cb && cb(rooms[roomid]);
    return;
  });

  socket.on("join room", function (roomid, name, callback) {
    if (rooms[roomid] == null) {
      callback && callback("null", 0);
      return;
    }
    if (rooms[roomid].gamestart) {
      callback && callback("started", 0);
      return;
    }
    if (rooms[roomid].player.length > 30) {
      callback && callback("full", 0);
      return;
    }

    socket.join(roomid);
    rooms[roomid].addPlayer(
      new Player(name, ++rooms[roomid].numPlayers, roomid)
    );
    rooms[roomid].playerIds.push(rooms[roomid].numPlayers);
    callback && callback("success", rooms[roomid].numPlayers);
    io.to(roomid).emit("update players");
  });

  socket.on("create room", function (roomid, name, callback) {
    if (rooms[roomid] != null) {
      callback && callback("taken");
      return;
    }

    var ro = new Room(roomid);
    ro.addPlayer(new Player(name, 1, roomid));
    rooms[roomid] = ro;
    rooms[roomid].numPlayers = 1;
    rooms[roomid].playerIds.push(1);
    socket.join(roomid);
    callback && callback("success");
  });

  socket.on("delete player", function (roomid, id, callback) {
    if (rooms[roomid] == null) return;

    delete rooms[roomid].player[id];
    rooms[roomid].playerIds.splice(
      rooms[roomid].playerIds.indexOf(parseInt(id)),
      1
    );
    if (isEmpty(rooms[roomid].player)) {
      delete rooms[roomid];
      callback && callback();
      return;
    }

    io.to(roomid).emit("player leave", rooms[roomid].gamestart, id);
    callback && callback();
  });

  socket.on("change player name", function (roomid, id, n) {
    if (rooms[roomid] == null) return;
    rooms[roomid].player[id].name = n;
    io.to(roomid).emit("update players");
  });

  function isEmpty(obj) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) return false;
    }
    return true;
  }
};

module.exports = {
  init,
  rooms,
  reset: function () {
    rooms = {};
  },
};
