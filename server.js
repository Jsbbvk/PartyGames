var express = require("express");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var path = require("path");

var spyfall = require("./js/Spyfall/index");
var cardsforus = require("./js/Cardsforus/index");
var outcast = require("./js/Outcast/index");
var captionthis = require("./js/CaptionThis/index");
var matchpoint = require("./js/Matchpoint/index");
var fakeout = require("./js/Fakeout/index");

app.use(express.static(path.join(__dirname, "/public")));
app.use(
  "/memes",
  express.static(path.join(__dirname, "./js/CaptionThis/memes"))
);

function getCorrespondingGame(gameName) {
  switch (gameName) {
    case "spyfall":
      return spyfall;
    case "cardsforus":
      return cardsforus;
    case "outcast":
      return outcast;
    case "captionthis":
      return captionthis;
    case "matchpoint":
      return matchpoint;
    case "fakeout":
      return fakeout;
    default:
      return null;
  }
}

io.on("connection", function (socket) {
  //console.log("a user connected");

  socket.emit("get room info", function (roomid, id, gameName, res) {
    let game = getCorrespondingGame(gameName);
    if (game == null) res && res(true);
    game.reconnectUser(roomid, id, io, socket, res);
  });

  socket.on("reset rooms", function (pass) {
    if (pass !== "admin_reset") return;
    spyfall.reset();
    cardsforus.reset();
    outcast.reset();
    captionthis.reset();
    matchpoint.reset();
    fakeout.reset();
  });

  socket.on("init game", function (gameName) {
    let game = getCorrespondingGame(gameName);
    game.init(io, socket);
  });
});

http.listen(8000, function () {
  console.log("listening on *:8000");
});
