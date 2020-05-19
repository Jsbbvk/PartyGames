var express = require("express");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var path = require("path");

var captionthis = require("../../js/CaptionThis/index");

app.use("/assets", express.static(path.join(__dirname, "/assets")));
app.use(
  "/memes",
  express.static(path.join(__dirname, "../../js/CaptionThis/memes"))
);

app.get("/", function (req, res) {
  res.sendFile("index.html", { root: __dirname });
});

io.on("connection", function (socket) {
  socket.emit("get room info", function (roomid, id, gameName, res) {
    captionthis.reconnectUser(roomid, id, io, socket, res);
  });

  socket.on("init game", function (game) {
    if (game === "captionthis") {
      captionthis.init(io, socket);
    }
  });
});

http.listen(8000, function () {
  console.log("listening on *:8000");
});
