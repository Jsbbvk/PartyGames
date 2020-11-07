var memeCategories = [
  "Parent Problems",
  "Suspicious Food",
  "That One Friend",
  "School is Hard",
  "Wacky Teachers",
  "Trendy Video Games",
  "Forbidden Politics",
  "Mood.",
  "Movies Season",
  "IRL",
  "Derpy Animals",
  "Overrated Celebrites",
  "Funny and Sad",
  "Dead Trends",
  "Out in Public",
  "Where in the World?",
  "Songs That Bop",
  "Long-lasting Historical Figures",
  "Unforgettable Events",
  "Something I Don't Know",
  "Expectations vs Reality",
  "Festive Holidays",
  "Cringe.",
  "Madlad",
  "#goals",
  "Flexin.",
  "#relatable",
  "Cultural Diversity 👌"
];

var numMemes = 1;

const fs = require("fs");
fs.readdir(__dirname + "/memes", (err, files) => {
  if (!err) numMemes = files.length;
});

const MAKING_MEME = 0;
const VOTING_MEME = 1;
const RESULTS = 2;

class Room {
  constructor(roomid) {
    this.roomid = roomid;
    this.startingGame = false;
    this.endingGame = false;
    this.gamestart = false;
    this.gamestate = MAKING_MEME;
    this.winnerID = [];
    this.loserID = [];
    this.player = {};
    this.playerIds = [];
    this.numPlayers = 0;

    this.memeid = [];
    this.prevMemeid = [];
    this.numMemeOptions = 8; //number of meme templates players can choose from
    this.category = "";
    this.playWithTopic = true;
    this.prevCategories = [];
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
    this.points = 0;
    this.imgurl = "";
    this.sentMeme = false;
    this.selectedMemeID = -1;
    this.numPlayerVotes = 0;
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
  socket.emit(
    "display current view",
    rooms[roomid].gamestart,
    rooms[roomid].gamestate
  );
  init(io, socket);
};

const init = (io, socket) => {
  socket.on("get total number of memes", function (cb) {
    cb && cb(numMemes);
  });

  socket.on("send finished meme", function (roomid, id, dataurl) {
    if (rooms[roomid] == null) return;
    rooms[roomid].player[id].imgurl = dataurl;
    rooms[roomid].player[id].sentMeme = true;

    socket.broadcast
      .to(roomid)
      .emit("playerAddedMeme", rooms[roomid].player[id]);
    if (allSentMeme(roomid)) {
      rooms[roomid].gamestate = VOTING_MEME;
      io.to(roomid).emit("displayVotingOption");
    }
  });

  function allSentMeme(roomid) {
    for (var i in rooms[roomid].player) {
      if (!rooms[roomid].player[i].sentMeme) return false;
    }
    return true;
  }

  function allReadyNextRound(roomid) {
    for (var i in rooms[roomid].player) {
      if (!rooms[roomid].player[i].nextRound) return false;
    }
    return true;
  }

  socket.on("selected best meme", function (roomid, id, sid) {
    if (rooms[roomid] == null) return;
    rooms[roomid].player[id].selectedMemeID = sid;
    var n = 0;
    for (let i in rooms[roomid].player) {
      let p = rooms[roomid].player[i];
      if (p.selectedMemeID != -1) n++;
    }
    socket.broadcast
      .to(roomid)
      .emit("player selected meme", n, rooms[roomid].playerIds.length);

    if (n == rooms[roomid].playerIds.length) {
      rooms[roomid].gamestate = RESULTS;
      rooms[roomid].winnerID = [];
      rooms[roomid].loserID = [];

      var pscores = {};
      for (var i = 0; i < rooms[roomid].playerIds.length; i++) {
        pscores[rooms[roomid].playerIds[i]] = 0;
      }
      for (let i in rooms[roomid].player) {
        let p = rooms[roomid].player[i];
        if (pscores[p.selectedMemeID] == null) pscores[p.selectedMemeID] = 0;
        pscores[p.selectedMemeID] = pscores[p.selectedMemeID] + 1;
      }

      var maxScore = -1;
      for (let id in pscores) {
        let voteVal = pscores[id];
        rooms[roomid].player[id].numPlayerVotes = voteVal;

        if (voteVal > maxScore) {
          rooms[roomid].winnerID = [parseInt(id)];
          maxScore = voteVal;
        } else if (voteVal == maxScore) {
          rooms[roomid].winnerID.push(parseInt(id));
        }
      }

      for (let id of rooms[roomid].playerIds) {
        if (!rooms[roomid].winnerID.includes(parseInt(id)))
          rooms[roomid].loserID.push(parseInt(id));
      }

      for (var i = 0; i < rooms[roomid].winnerID.length; i++) {
        rooms[roomid].player[rooms[roomid].winnerID[i]].points++;
      }

      io.to(roomid).emit("winner chosen");
    }
  });

  socket.on("get results", function (roomid, cb) {
    if (rooms[roomid] == null) return;
    cb &&
      cb(rooms[roomid].player, rooms[roomid].winnerID, rooms[roomid].loserID);
  });

  socket.on("get number of selected memes", function (roomid, cb) {
    if (rooms[roomid] == null) return;
    var n = 0;
    for (let i in rooms[roomid].player) {
      let p = rooms[roomid].player[i];
      if (p.selectedMemeID != -1) n++;
    }
    cb && cb(n, rooms[roomid].playerIds.length);
  });

  socket.on("ready for next round", function (roomid, id) {
    if (rooms[roomid] == null) return;
    rooms[roomid].player[id].nextRound = true;

    var n = 0;
    for (let i in rooms[roomid].player) {
      let p = rooms[roomid].player[i];
      if (p.nextRound) n++;
    }

    socket.broadcast
      .to(roomid)
      .emit("player ready next round", n, rooms[roomid].playerIds.length);

    if (allReadyNextRound(roomid)) {
      io.to(roomid).emit("start next round");
      resetRound(roomid);
    }
  });

  socket.on("get number ready for next round", function (roomid, cb) {
    if (rooms[roomid] == null) return;
    var c = 0;
    for (let i in rooms[roomid].player) {
      if (rooms[roomid].player[i].nextRound) c++;
    }
    cb && cb(c, rooms[roomid].playerIds.length);
  });

  socket.on("get meme id", function (roomid, cb) {
    if (rooms[roomid] == null) return;
    cb && cb(rooms[roomid].memeid);
  });

  socket.on("get category", function (roomid, cb) {
    if (rooms[roomid] == null) return;
    cb && cb(rooms[roomid].category);
  });

  function resetRound(roomid) {
    for (let i in rooms[roomid].player) {
      rooms[roomid].player[i].imgurl = "";
      rooms[roomid].player[i].nextRound = false;
      rooms[roomid].player[i].sentMeme = false;
      rooms[roomid].player[i].selectedMemeID = -1;
      rooms[roomid].player[i].numPlayerVotes = 0;
    }
    rooms[roomid].gamestate = MAKING_MEME;

    setNewMeme(roomid);
    if (rooms[roomid].playWithTopic) setRandomCategory(roomid);
  }

  function shuffle(arr) {
    for (var i = 0; i < arr.length; i++) {
      var t = arr[i];
      var n = parseInt(Math.random() * arr.length);
      arr[i] = arr[n];
      arr[n] = t;
    }
  }

  function resetPrevMemeIds(roomid) {
    let arr = [];
    for (let i = 1; i <= numMemes; i++) {
      arr.push(i);
    }
    shuffle(arr);
    rooms[roomid].prevMemeid = [...arr];
  }

  function setNewMeme(roomid) {
    rooms[roomid].memeid = [];
    while (rooms[roomid].memeid.length < rooms[roomid].numMemeOptions) {
      if (rooms[roomid].prevMemeid.length <= 0) resetPrevMemeIds(roomid);
      let id = rooms[roomid].prevMemeid.pop();
      rooms[roomid].memeid.push(id);
      if (Math.random() >= 0.6) rooms[roomid].prevMemeid.unshift(id);
    }
  }

  function setRandomCategory(roomid) {
    var c = "";
    var t = parseInt(Math.random() * memeCategories.length);
    for (var i = 0; i < rooms[roomid].prevCategories.length; i++) {
      if (rooms[roomid].prevCategories[i] != t) {
        t = parseInt(Math.random() * memeCategories.length);
        c = memeCategories[t];
      }
    }
    if (c == "") {
      rooms[roomid].prevCategories = [];
      t = parseInt(Math.random() * memeCategories.length);
      c = memeCategories[t];
    }
    rooms[roomid].prevCategories.push(t);
    rooms[roomid].category = c;
  }

  function resetRoom(roomid) {
    for (let i in rooms[roomid].player) {
      rooms[roomid].player[i].points = 0;
      rooms[roomid].player[i].imgurl = "";
      rooms[roomid].player[i].nextRound = false;
      rooms[roomid].player[i].sentMeme = false;
      rooms[roomid].player[i].selectedMemeID = -1;
      rooms[roomid].player[i].numPlayerVotes = 0;
    }
    rooms[roomid].gamestate = MAKING_MEME;
    resetPrevMemeIds(roomid);
    setNewMeme(roomid);
    if (rooms[roomid].playWithTopic) setRandomCategory(roomid);
  }

  socket.on("get players", function (roomid, cb) {
    if (rooms[roomid] == null) return;
    cb && cb(rooms[roomid].player);
    return;
  });

  socket.on("start game", function (roomid) {
    if (rooms[roomid] == null) return;
    if (rooms[roomid].playerIds.length < 3) return;
    if (rooms[roomid].startingGame) return;
    rooms[roomid].startingGame = true;
    rooms[roomid].endingGame = false;
    rooms[roomid].gamestart = true;
    resetRoom(roomid);

    io.to(roomid).emit("game start");
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

  socket.on("end game", function (roomid) {
    if (rooms[roomid] == null) return;
    if (rooms[roomid].endingGame) return;
    rooms[roomid].endGame = true;
    rooms[roomid].gamestart = false;
    rooms[roomid].startingGame = false;
    io.to(roomid).emit("game ended");
  });

  socket.on("change player name", function (roomid, id, n) {
    if (rooms[roomid] == null) return;
    rooms[roomid].player[id].name = n;
    io.to(roomid).emit("update players");
  });

  socket.on("get room option", function (roomid, cb) {
    if (rooms[roomid] == null) return;
    cb && cb(rooms[roomid].playWithTopic);
  });

  socket.on("update game option", function (roomid, p) {
    if (rooms[roomid] == null) return;
    rooms[roomid].playWithTopic = p;
    io.to(roomid).emit("update game option", p);
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
