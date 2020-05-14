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

app.use("/assets", express.static("assets"));
app.use(express.static(path.join(__dirname, "/public")));

io.on("connection", function (socket) {
  //console.log("a user connected");

  socket.on("reset rooms", function (pass) {
    if (pass !== "admin_reset") return;
    spyfall.reset();
    cardsforus.reset();
    outcast.reset();
    captionthis.reset();
    matchpoint.reset();
    fakeout.reset();
  });

  socket.on("init game", function (game) {
    switch (game) {
      case "spyfall":
        spyfall.init(io, socket);
        break;
      case "cardsforus":
        cardsforus.init(io, socket);
        break;
      case "outcast":
        outcast.init(io, socket);
        break;
      case "captionthis":
        captionthis.init(io, socket);
        break;
      case "matchpoint":
        matchpoint.init(io, socket);
        break;
      case "fakeout":
        fakeout.init(io, socket);
        break;
    }
  });
});

http.listen(8000, function () {
  console.log("listening on *:8000");
});
