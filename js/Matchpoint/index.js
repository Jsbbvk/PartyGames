var questionManager = require("./questions.js");

const CREATING = 0;
const WAITING = 1;
const VOTING = 2;
const RESULTS = 3;

class Room {
  constructor(roomid) {
    this.roomid = roomid;
    this.startingGame = false;
    this.endingGame = false;
    this.gamestart = false;
    this.gamestate = -1;
    this.player = {};
    this.playerIds = [];
    this.numPlayers = 0;

    this.prompts = [];
    this.currentPrompt = 0;
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

    this.points = 0;
    this.prompts = [];
    this.answers = [];

    this.selectedID = -1;
    this.selectedAnswer = false;

    this.continue = false;
  }
  addPrompt(p) {
    if (this.prompts.length >= 2) return;
    this.prompts.push(p);
  }
  addAnswer(p) {
    if (this.answers.length >= 2) return;
    this.answers.push(p);
  }
}

class Prompt {
  constructor() {
    this.prompt = "";
    this.player = [];
  }
  addPlayer(p) {
    if (this.player.length >= 2) return;
    this.player.push(p);
  }
}

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

  socket.on("player continue", function (roomid, id) {
    if (rooms[roomid] == null) return;

    rooms[roomid].player[id].continue = true;
    var c = 0;
    for (let i in rooms[roomid].player) {
      let p = rooms[roomid].player[i];
      if (p.continue) c++;
    }
    if (c == rooms[roomid].playerIds.length) {
      if (rooms[roomid].currentPrompt == rooms[roomid].prompts.length - 1) {
        //start over
        resetRound(roomid);
        setupPlayerPrompts(roomid);
        io.to(roomid).emit(
          "player continue",
          c,
          rooms[roomid].playerIds.length,
          true
        );
      } else {
        io.to(roomid).emit(
          "player continue",
          c,
          rooms[roomid].playerIds.length,
          false
        );
        nextPromptResult(roomid);
      }
    } else io.to(roomid).emit("player continue", c, rooms[roomid].playerIds.length, false);
  });

  function resetRound(roomid) {
    rooms[roomid].currentPrompt = 0;
    rooms[roomid].gamestate = CREATING;
    for (let i in rooms[roomid].player) {
      rooms[roomid].player[i].continue = false;
      rooms[roomid].player[i].selectedAnswer = false;
      rooms[roomid].player[i].selectedID = -1;
      rooms[roomid].player[i].answers = [];
      rooms[roomid].player[i].prompts = [];
    }
  }

  function nextPromptResult(roomid) {
    rooms[roomid].currentPrompt = rooms[roomid].currentPrompt + 1;

    for (let i in rooms[roomid].player) {
      rooms[roomid].player[i].continue = false;
      rooms[roomid].player[i].selectedAnswer = false;
      rooms[roomid].player[i].selectedID = -1;
    }
  }

  socket.on("player selected answer", function (roomid, id, aid) {
    if (rooms[roomid] == null) return;
    rooms[roomid].player[id].selectedID = aid;
    rooms[roomid].player[id].selectedAnswer = true;

    var c = 0;
    for (let i in rooms[roomid].player) {
      if (rooms[roomid].player[i].selectedAnswer) c++;
    }

    io.to(roomid).emit(
      "player selected answer",
      c,
      rooms[roomid].playerIds.length
    );

    if (c == rooms[roomid].playerIds.length) {
      calculatePoints(roomid);
      rooms[roomid].gamestate = RESULTS;
    }
  });

  function calculatePoints(roomid) {
    var pp = [];
    for (let i = 0; i < rooms[roomid].playerIds.length; i++)
      pp[rooms[roomid].playerIds[i]] = 0;

    for (let i in rooms[roomid].player) {
      var ppp = rooms[roomid].player[i];
      if (ppp.selectedID == -1) continue;
      pp[ppp.selectedID] = pp[ppp.selectedID] + 1;
    }

    var mx = -1;
    var pM = [];
    for (let i in pp) {
      if (pp[i] > mx) {
        mx = pp[i];
        pM = [];
        pM.push(i);
      } else if (pp[i] == mx) {
        pM.push(i);
      }
    }

    for (let i = 0; i < pM.length; i++) {
      rooms[roomid].player[pM[i]].points =
        rooms[roomid].player[pM[i]].points + (pM.length === 1 ? 2 : 1);
    }
  }

  socket.on("answered prompt", function (roomid, id, ans) {
    if (rooms[roomid] == null) return;
    rooms[roomid].player[id].addAnswer(ans);

    var fin = getNumPromptsFinished(roomid);
    io.to(roomid).emit(
      "player answered question",
      fin,
      rooms[roomid].playerIds.length
    );

    if (fin == rooms[roomid].playerIds.length) {
      rooms[roomid].gamestate = VOTING;
    }
  });

  socket.on("get prompt info", function (roomid, cb) {
    if (rooms[roomid] == null) return;
    var pr = rooms[roomid].prompts[rooms[roomid].currentPrompt];
    cb && cb(pr);
  });

  socket.on("get num finished prompts", function (roomid, cb) {
    if (rooms[roomid] == null) return;
    cb && cb(getNumPromptsFinished(roomid), rooms[roomid].playerIds.length);
  });

  function getNumPromptsFinished(roomid) {
    var c = 0;
    for (let i in rooms[roomid].player) {
      let p = rooms[roomid].player[i];
      if (p.answers.length == 2) c++;
    }
    return c;
  }

  function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = a[i];
      a[i] = a[j];
      a[j] = x;
    }
    return a;
  }

  function setupPlayerPrompts(roomid) {
    var randN = [];
    for (let i in rooms[roomid].player) {
      rooms[roomid].player[i].prompts = [];
      randN.push(i);
    }
    rooms[roomid].prompts = [];
    shuffle(randN);
    shuffle(randN);

    for (let i = 0; i < randN.length; i++) {
      var prmpt = questionManager.getRandomPrompt();

      rooms[roomid].player[randN[i]].addPrompt(prmpt);
      if (i === randN.length - 1) {
        rooms[roomid].player[randN[0]].addPrompt(prmpt);
      } else {
        rooms[roomid].player[randN[parseInt(i) + 1]].addPrompt(prmpt);
      }

      var p = new Prompt();
      p.prompt = prmpt;
      p.addPlayer(rooms[roomid].player[randN[i]]);
      if (i === randN.length - 1) {
        p.addPlayer(rooms[roomid].player[randN[0]]);
      } else {
        p.addPlayer(rooms[roomid].player[randN[parseInt(i) + 1]]);
      }

      rooms[roomid].prompts.push(p);
    }
  }

  socket.on("get player prompts", function (roomid, id, cb) {
    if (rooms[roomid] == null) return;
    cb && cb(rooms[roomid].player[id].prompts);
  });

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
    setupPlayerPrompts(roomid);

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

  function isEmpty(obj) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) return false;
    }
    return true;
  }

  socket.on("change player name", function (roomid, id, n) {
    if (rooms[roomid] == null) return;
    rooms[roomid].player[id].name = n;
    io.to(roomid).emit("update players");
  });
};

module.exports = {
  init,
  rooms,
  reset: function () {
    rooms = {};
  },
};
