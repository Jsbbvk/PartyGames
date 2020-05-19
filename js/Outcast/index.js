var categories = require("./categories.js");

class Room {
  constructor(roomid) {
    this.roomid = roomid;
    this.startingGame = false;
    this.gamestart = false;
    this.player = {};
    this.numPlayers = 0;
    this.playerIds = [];
    this.topic = "";
    this.fakeTopic = "";
    this.category = "";
    this.isRandom = true;
    this.outcastID = -1;
    this.prevTopics = [];
  }
  addPlayer(p) {
    this.player[p.id] = p;
  }
}

class Player {
  constructor(name, id, roomid, sk) {
    this.roomid = roomid;
    this.id = id;
    this.name = name;
    this.answerPartner = {
      id: -1,
      name: "",
      answer: "",
    }; // this it the person answering the question of the player
    this.questionPartner = {
      name: "",
      id: -1,
      answer: "",
    }; // this is the person asking the question to player
    this.socket = sk;
    this.question = "Waiting...";
    this.answer = "Waiting...";
    this.isOutcast = false;
    this.isReady = false;
  }
  getData() {
    return {
      id: this.id,
      name: this.name,
      answerPartner: {
        id: this.answerPartner.id,
        name: this.answerPartner.name,
        question: this.answerPartner.question,
        answer: this.answerPartner.answer,
        isOutcast: this.answerPartner.isOutcast,
      },
      questionPartner: {
        id: this.questionPartner.id,
        name: this.questionPartner.name,
        question: this.questionPartner.question,
        answer: this.questionPartner.answer,
        isOutcast: this.answerPartner.isOutcast,
      },
      question: this.question,
      answer: this.answer,
      isOutcast: this.isOutcast,
    };
  }
}

var rooms = {};

const reconnectUser = (roomid, id, io, socket, res) => {
  if (
    roomid == "" ||
    id == null ||
    rooms[roomid] == null ||
    rooms[roomid].player[id] == null
  ) {
    res && res(true);
    return;
  }

  socket.join(roomid);
  socket.emit("display current view", rooms[roomid].gamestart);
  init(io, socket);
};

const init = (io, socket) => {
  socket.on("join room", function (roomid, name, callback) {
    if (rooms[roomid] == null) {
      callback && callback("null", 0);
      return;
    }
    if (rooms[roomid].gamestart) {
      callback && callback("started", 0);
      return;
    }
    if (rooms[roomid].player.length > 10) {
      callback && callback("full", 0);
      return;
    }

    socket.join(roomid);
    rooms[roomid].addPlayer(
      new Player(name, ++rooms[roomid].numPlayers, roomid, socket)
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
    ro.addPlayer(new Player(name, 1, roomid, socket));
    rooms[roomid] = ro;
    rooms[roomid].numPlayers = 1;
    rooms[roomid].playerIds.push(1);

    socket.join(roomid);
    callback && callback("success");
  });

  socket.on("change player name", function (roomid, id, n) {
    if (rooms[roomid] == null) return;
    rooms[roomid].player[id].name = n;
    io.to(roomid).emit("update players");
  });

  socket.on("update game category", function (roomid, p) {
    if (rooms[roomid] == null) return;
    rooms[roomid].category = p;
    if (p == "Random") rooms[roomid].isRandom = true;
    else rooms[roomid].isRandom = false;
    io.to(roomid).emit("update game category", p);
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
    var r = [];
    for (let i in rooms[roomid].player) {
      r.push(rooms[roomid].player[i].getData());
    }
    cb && cb(r);
  });

  socket.on("get room info", function (roomid, cb) {
    if (rooms[roomid] == null) return;
    cb &&
      cb({
        category: rooms[roomid].category,
        topic: rooms[roomid].topic,
        fakeTopic: rooms[roomid].fakeTopic,
        gamestart: rooms[roomid].gamestart,
        outcastID: rooms[roomid].outcastID,
      });
  });

  socket.on("get player info", function (roomid, id, cb) {
    if (rooms[roomid] == null || rooms[roomid].player[id] == null) return;
    cb && cb(rooms[roomid].player[id].getData());
  });

  socket.on("set question", (roomid, id, q, cb) => {
    if (rooms[roomid] == null) return;
    rooms[roomid].player[id].question = q;
    rooms[roomid].player[id].answerPartner.socket.emit("question asked", q);
    io.to(roomid).emit("player asked", {
      id: id,
      name: rooms[roomid].player[id].name,
      question: q,
    });
    cb && cb();
  });

  socket.on("set answer", function (roomid, id, a, cb) {
    if (rooms[roomid] == null) return;
    rooms[roomid].player[id].answer = a;
    io.to(roomid).emit("player answered", {
      id: id,
      name: rooms[roomid].player[id].name,
      answer: a,
    });
    var pFinish = true;
    for (let i in rooms[roomid].player) {
      if (rooms[roomid].player[i].answer == "Waiting...") pFinish = false;
    }
    if (pFinish) io.to(roomid).emit("players finished");
    cb && cb();
  });

  socket.on("start game", function (roomid) {
    if (rooms[roomid] == null) return;
    if (rooms[roomid].playerIds.length < 3) return;
    if (rooms[roomid].startingGame) return;

    rooms[roomid].startingGame = true;
    rooms[roomid].gamestart = true;

    //choose random category and topic
    var randId = [];
    for (let i in rooms[roomid].player) {
      randId.push(i);
    }
    for (var i = 0; i < randId.length; i++) {
      var a = randId[i];
      var rN = parseInt(Math.random() * randId.length);
      randId[i] = randId[rN];
      randId[rN] = a;
    }

    for (var i = 0; i < randId.length; i++) {
      var n = randId[i];
      var n2;
      if (i == randId.length - 1) n2 = randId[0];
      else n2 = randId[i + 1];
      rooms[roomid].player[n].answerPartner = rooms[roomid].player[n2];
      rooms[roomid].player[n2].questionPartner = rooms[roomid].player[n];
    }

    // for (var i in rooms[roomid].player) {
    //   let p = rooms[roomid].player[i];
    //   console.log(
    //     "ID: " +
    //       p.id +
    //       " Q: " +
    //       p.questionPartner.id +
    //       " A: " +
    //       p.answerPartner.id
    //   );
    // }

    for (let b in rooms[roomid].player) {
      rooms[roomid].player[b].isOutcast = false;
    }
    var aN =
      rooms[roomid].playerIds[
        parseInt(Math.random() * rooms[roomid].playerIds.length)
      ];
    rooms[roomid].outcastID = aN;
    rooms[roomid].player[aN].isOutcast = true;

    var acat;
    if (rooms[roomid].isRandom) {
      acat = categories.getRandomCategory(rooms[roomid].prevTopics);
    } else {
      acat = categories.getCategory(rooms[roomid].category);
    }
    rooms[roomid].fakeTopic = acat.fakeTopic;
    rooms[roomid].topic = acat.topic;
    rooms[roomid].category = acat.category;
    rooms[roomid].prevTopics = acat.topic;
    io.to(roomid).emit("game start");
  });

  socket.on("end game", function (roomid) {
    if (rooms[roomid] == null) return;
    rooms[roomid].gamestart = false;
    rooms[roomid].startingGame = false;
    for (let i in rooms[roomid].player) {
      rooms[roomid].player[i].isReady = false;
      rooms[roomid].player[i].question = "Waiting...";
      rooms[roomid].player[i].answer = "Waiting...";
      rooms[roomid].player[i].isOutcast = false;
    }
    io.to(roomid).emit("game ended");
  });

  socket.on("ready for display players", function (roomid, id, cb) {
    if (rooms[roomid] == null) return;
    rooms[roomid].player[id].isReady = true;
    var a = true;
    var c = 0;
    for (var i in rooms[roomid].player) {
      if (rooms[roomid].player[i].isReady == false) a = false;
      else c++;
    }
    io.to(roomid).emit(
      "change num player ready",
      c,
      rooms[roomid].playerIds.length
    );
    if (a) io.to(roomid).emit("display players");
  });

  socket.on("ready display players", function (roomid, cb) {
    if (rooms[roomid] == null) return;
    var a = true;
    for (var i in rooms[roomid].player) {
      if (rooms[roomid].player[i].isReady == false) a = false;
    }
    cb && cb(a);
  });
};

module.exports = {
  init,
  reconnectUser,
  rooms,
  reset: function () {
    rooms = {};
  },
};
