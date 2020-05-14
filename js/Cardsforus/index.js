var qCard = require("./qCard.js");

const CHOOSING_CARD = 0;
const WAITING_ROOM = 1;
const WINNER_DISPLAY = 2;

class Room {
  constructor(roomid) {
    this.roomid = roomid;
    this.startingGame = false;
    this.gamestart = false;
    this.winner = {
      name: "",
      id: 0,
      cid: 0,
    };
    this.cardczar = 1;
    this.player = {};
    this.playerIds = [];
    this.numPlayers = 0;

    this.qcid = -1;
    this.cardpack = "traditional";
    this.gamestate = CHOOSING_CARD;
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
    this.cid = -1;
    this.points = 0;
    this.isready = false;
    this.nextRound = false;
  }
}

var rooms = {};

function init(io, socket) {
  socket.emit("get room id", function (id) {
    if (id != "") {
      if (rooms[id] != null) {
        socket.join(id);
        socket.emit("display current view", rooms[id].gamestart);
      }
    }
  });

  // socket.on("disconnect", function () {
  //   console.log('user disconnected');
  // });

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

  socket.on("start game", function (roomid) {
    if (rooms[roomid] == null) return;
    if (rooms[roomid].playerIds.length < 3) return;
    if (rooms[roomid].startingGame) return;
    rooms[roomid].startingGame = true;
    rooms[roomid].gamestate = CHOOSING_CARD;
    rooms[roomid].gamestart = true;

    for (let i in rooms[roomid].player) {
      rooms[roomid].player[i].points = 0;
    }

    rooms[roomid].cardczar =
      rooms[roomid].playerIds[
        parseInt(rooms[roomid].playerIds.length * Math.random())
      ];
    qCard.initQCard(rooms[roomid].cardpack);
    rooms[roomid].qcid = qCard.getRandomCID();
    io.to(roomid).emit("game start");
  });

  socket.on("get card czar", function (roomid, cb) {
    if (rooms[roomid] == null) return;
    cb && cb(rooms[roomid].player[rooms[roomid].cardczar]);
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

  socket.on("get players", function (roomid, cb) {
    if (rooms[roomid] == null) return;
    cb && cb(rooms[roomid].player);
    return;
  });

  socket.on("get winner", function (roomid, cb) {
    if (rooms[roomid] == null) return;
    cb && cb(rooms[roomid].player[rooms[roomid].winner.id]);
  });

  socket.on("get areCardsChosen", function (roomid, cb) {
    if (rooms[roomid] == null) return;
    var a = true;
    for (var i in rooms[roomid].player) {
      let p = rooms[roomid].player[i];
      if (p.id != rooms[roomid].cardczar && p.cid == -1) {
        a = false;
      } else if (p.id != rooms[roomid].cardczar && p.isready == false)
        a = false;
    }
    cb && cb(a);
  });

  socket.on("get game state", function (roomid, cb) {
    if (rooms[roomid] == null) return;
    cb &&
      cb(
        rooms[roomid].gamestate,
        rooms[roomid].cardczar,
        rooms[roomid].playerIds.length
      );
  });

  socket.on("set game state", function (roomid, state) {
    if (rooms[roomid] == null) return;
    rooms[roomid].gamestate = state;
  });

  socket.on("next round", function (roomid, cb) {
    if (rooms[roomid] == null) return;
    //reset everything
    rooms[roomid].cardczar = rooms[roomid].winner.id;

    for (let i in rooms[roomid].player) {
      rooms[roomid].player[i].cid = -1;
      rooms[roomid].player[i].isready = false;
      rooms[roomid].player[i].nextRound = false;
    }

    rooms[roomid].qcid = qCard.getRandomCID();
    rooms[roomid].gamestate = CHOOSING_CARD;
    io.to(roomid).emit("start next round");
    cb && cb();
  });

  socket.on("set winner", function (roomid, w, cb) {
    if (rooms[roomid] == null) return;
    rooms[roomid].winner = w;
    rooms[roomid].player[w.id].points = rooms[roomid].player[w.id].points + 1;
    io.to(roomid).emit("winner chosen", rooms[roomid].player[w.id]);
    cb && cb();
  });

  socket.on("player select", function (roomid, id, cid, cb) {
    if (rooms[roomid] == null) return;
    rooms[roomid].player[id].cid = cid;
    io.to(roomid).emit("card added", rooms[roomid].player[id]);
    cb && cb();
  });

  socket.on("get white cards", function (roomid, cb) {
    if (rooms[roomid] == null) return;

    var c = qCard.getCardsFromPack("white", rooms[roomid].cardpack);
    cb && cb(c);
  });

  socket.on("set player ready", function (roomid, id) {
    if (rooms[roomid] == null) return;
    rooms[roomid].player[id].isready = true;
    var a = true;
    for (let i in rooms[roomid].player) {
      let p = rooms[roomid].player[i];
      if (p.id != rooms[roomid].cardczar && p.cid == -1) {
        a = false;
      } else if (p.id != rooms[roomid].cardczar && p.isready == false)
        a = false;
    }
    if (a) io.to(roomid).emit("card czar ready");
  });

  socket.on("can card czar choose", function (roomid, cb) {
    if (rooms[roomid] == null) return;
    var a = true;
    for (let i in rooms[roomid].player) {
      let p = rooms[roomid].player[i];
      if (p.id != rooms[roomid].cardczar && p.cid == -1) {
        a = false;
      } else if (p.id != rooms[roomid].cardczar && p.isready == false)
        a = false;
    }
    cb && cb(a);
  });

  socket.on("set player next round", function (roomid, id) {
    if (rooms[roomid] == null) return;
    rooms[roomid].player[id].nextRound = true;

    var a = true;
    var c = 0;
    for (let i in rooms[roomid].player) {
      let p = rooms[roomid].player[i];
      if (!p.nextRound) a = false;
      else c++;
    }
    io.to(roomid).emit(
      "next round addition",
      c,
      rooms[roomid].playerIds.length
    );
    if (a) io.to(roomid).emit("ready for next round");
  });

  socket.on("get room pack", function (roomid, cb) {
    if (rooms[roomid] == null) return;
    cb && cb(rooms[roomid].cardpack);
  });

  socket.on("update game pack", function (roomid, p) {
    if (rooms[roomid] == null) return;
    rooms[roomid].cardpack = p;
    io.to(roomid).emit("update game pack", p);
  });

  socket.on("change player name", function (roomid, id, n) {
    if (rooms[roomid] == null) return;
    rooms[roomid].player[id].name = n;
    io.to(roomid).emit("update players");
  });

  socket.on("get question card", function (roomid, cb) {
    if (rooms[roomid] == null) return;
    cb && cb(qCard.getCardById(rooms[roomid].qcid));
  });

  socket.on("end game", function (roomid) {
    if (rooms[roomid] == null) return;
    rooms[roomid].gamestart = false;
    rooms[roomid].startingGame = false;

    for (let i in rooms[roomid].player) {
      rooms[roomid].player[i].cid = -1;
      rooms[roomid].player[i].isready = false;
      rooms[roomid].player[i].nextRound = false;
    }

    io.to(roomid).emit("game ended");
  });
}

module.exports = {
  init,
  rooms,
  reset: function () {
    rooms = {};
  },
};
