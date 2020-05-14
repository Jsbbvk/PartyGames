var locationScript = require("./locations.js");

var roomDB = {};

class Room {
  constructor(roomid) {
    this.roomid = roomid;
    this.firstplayer = 1;
    this.startingGame = false;
    this.gamestart = false;
    this.mode = "traditional";
    this.location = "";
    this.starttime = {
      hour: 0,
      min: 0,
      sec: 0,
    };
    this.theme = "general";
    this.time = 8;
    this.player = {};
    this.numPlayers = 0;
    this.playerIds = [];
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
    this.role = "";
  }
}

const init = (io, socket) => {
  function startG(roomid, mode, theme, timestamp, prevLocations) {
    if (roomDB[roomid] == null) return;
    var minP = 2;
    switch (mode) {
      case "traditional":
        minP = 3;
        break;
      case "leader":
        minP = 4;
        break;
    }
    if (roomDB[roomid].playerIds.length < minP) return;
    if (roomDB[roomid].startingGame) return;
    roomDB[roomid].startingGame = true;

    var le = roomDB[roomid].playerIds.length;
    roomDB[roomid].firstplayer =
      roomDB[roomid].playerIds[parseInt(Math.random() * le)];

    roomDB[roomid].starttime = {
      hour: timestamp.hour,
      min: timestamp.min,
      sec: timestamp.sec,
    };
    roomDB[roomid].gamestart = true;

    locationScript.getRandomLocation(theme, prevLocations, function (l) {
      //console.log(l.location);
      var newRoles = locationScript.getRandomRoles(mode, theme, l, le);
      roomDB[roomid].location = l.location;

      for (let id in roomDB[roomid].player) {
        let role = newRoles.splice(0, 1);
        roomDB[roomid].player[id].role = role;
      }
      io.to(roomid).emit("start game");
    });
  }

  socket.emit("get room id", function (id) {
    if (id != "") {
      if (roomDB[id] != null) {
        socket.join(id);
        socket.emit("display current view", roomDB[id].gamestart);
      }
    }
  });

  // socket.on("disconnect", function () {
  //   console.log("SPYFALL: user disconnected");
  // });

  socket.on("join room", function (roomid, name, callback) {
    if (roomDB[roomid] == null) {
      callback && callback("null", 0);
      return;
    }
    if (roomDB[roomid].gamestart) {
      callback && callback("started", 0);
      return;
    }
    if (roomDB[roomid].playerIds.length > 10) {
      callback && callback("full", 0);
      return;
    }

    socket.join(roomid);
    //console.log("Connected");
    roomDB[roomid].addPlayer(
      new Player(name, ++roomDB[roomid].numPlayers, roomid)
    );
    roomDB[roomid].playerIds.push(roomDB[roomid].numPlayers);

    callback && callback("success", roomDB[roomid].numPlayers);
    io.to(roomid).emit("update players");
  });

  socket.on("create room", function (roomid, name, callback) {
    if (roomDB[roomid] != null) {
      callback && callback("taken");
      return;
    }

    var ro = new Room(roomid);
    ro.addPlayer(new Player(name, 1, roomid));
    roomDB[roomid] = ro;
    roomDB[roomid].numPlayers = 1;
    roomDB[roomid].playerIds.push(1);

    //console.log("Created Room!");
    socket.join(roomid);
    callback && callback("success");
  });

  socket.on("get players", function (roomid, callback) {
    if (roomDB[roomid] == null) return;
    callback && callback(roomDB[roomid].player);
    return;
  });

  socket.on("delete player", function (roomid, id, callback) {
    if (roomDB[roomid] == null) return;

    delete roomDB[roomid].player[id];
    roomDB[roomid].playerIds.splice(
      roomDB[roomid].playerIds.indexOf(parseInt(id)),
      1
    );
    if (isEmpty(roomDB[roomid].player)) {
      delete roomDB[roomid];
      callback && callback();
      return;
    }

    io.to(roomid).emit("player leave", roomDB[roomid].gamestart, id);
    callback && callback();
  });

  function isEmpty(obj) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) return false;
    }
    return true;
  }

  socket.on("get room data", function (roomid, callback) {
    if (roomDB[roomid] == null) return;
    var r = roomDB[roomid];
    callback &&
      callback({
        mode: r.mode,
        time: r.time,
        theme: r.theme,
        firstplayer: r.firstplayer,
        starttime: r.starttime,
        location: r.location,
      });
  });

  socket.on("start game", startG);

  socket.on("change player name", function (roomid, id, n) {
    if (roomDB[roomid] == null) return;
    roomDB[roomid].player[id].name = n;
    io.to(roomid).emit("update players");
  });

  socket.on("update game mode", function (roomid, mode, theme, time) {
    if (roomDB[roomid] == null) return;
    roomDB[roomid].mode = mode;
    roomDB[roomid].theme = theme;
    roomDB[roomid].time = time;
    io.to(roomid).emit("update game mode", {
      m: mode,
      t: time,
      th: theme,
    });
  });

  socket.on("get location", function (roomid, callback) {
    if (roomDB[roomid] == null) return;
    callback && callback(roomDB[roomid].location);
  });

  socket.on("get leader", function (roomid, callback) {
    if (roomDB[roomid] == null) return;

    var pl = roomDB[roomid].player;
    for (let i in pl) {
      let p = pl[i];
      if (p.role == "Leader") {
        callback && callback(p.name);
        return;
      }
    }
  });

  socket.on("get player info", function (roomid, id, callback) {
    if (roomDB[roomid] == null) return;

    callback && callback(roomDB[roomid].player[id]);
  });

  socket.on("end game", function (roomid) {
    if (roomDB[roomid] == null) return;

    roomDB[roomid].gamestart = false;
    roomDB[roomid].startingGame = false;
    io.to(roomid).emit("game ended");
  });
};

module.exports = {
  init,
  roomDB,
  reset: function () {
    roomDB = {};
  },
};
