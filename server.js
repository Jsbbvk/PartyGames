
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);


app.use('/assets', express.static('assets'));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/public/index.html');
});

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
  "#Goals",
  "Flexin."
];


//TODO Keep this UPDATED
var numMemes = 33;


const  MAKING_MEME = 0;
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
        this.player = [];
        this.memeid = 0;
        this.prevMemeid = [];
        this.category = "";
        this.playWithTopic = true;
        this.prevCategories = [];
    }
    addPlayer(p) {this.player.push(p);}
    getPlayerById(id) {
        for (var p of this.player) {
            if (p.id == id) return p;
        }
        return null;
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

io.on('connection', function(socket) {
    console.log("connected");

    socket.emit('get room id', function(id){
        if (id!="") {
            if (rooms[id] != null) {
                socket.join(id);
                socket.emit('display current view', rooms[id].gamestart, rooms[id].gamestate);
            }
        }
    });

    socket.on('send finished meme', function(roomid, id, dataurl) {
      if (rooms[roomid]==null)return;
      rooms[roomid].player[id-1].imgurl = dataurl;
      rooms[roomid].player[id-1].sentMeme = true;

      socket.broadcast.to(roomid).emit("playerAddedMeme", rooms[roomid].player[id-1]);
      if (allSentMeme(roomid)) {
          rooms[roomid].gamestate = VOTING_MEME;
        io.to(roomid).emit("displayVotingOption");
      }
    });

    function allSentMeme(roomid) {
      for (var i = 0; i < rooms[roomid].player.length; i++) {
        if (!rooms[roomid].player[i].sentMeme)return false;
      }
      return true;
    }

    function allReadyNextRound(roomid) {
        for (var i = 0; i < rooms[roomid].player.length; i++) {
            if (!rooms[roomid].player[i].nextRound)return false;
        }
        return true;
    }

    socket.on('selected best meme', function(roomid, id, sid) {
      if (rooms[roomid]==null)return;
      rooms[roomid].player[id-1].selectedMemeID = sid;
        var n = 0;
        rooms[roomid].player.forEach(function(p) {
            if (p.selectedMemeID!=-1)n++;
        });
        socket.broadcast.to(roomid).emit("player selected meme", n, rooms[roomid].player.length);

        if (n==rooms[roomid].player.length) {
            rooms[roomid].gamestate = RESULTS;
            rooms[roomid].winnerID = [];
            rooms[roomid].loserID = [];

            var pscores = [];
            for (var i = 0; i < rooms[roomid].player.length; i++) {
                pscores[i] = 0;
            }
            rooms[roomid].player.forEach(function(p) {
                if (pscores[p.selectedMemeID-1]==null) pscores[p.selectedMemeID-1]=0;
                pscores[p.selectedMemeID-1] = pscores[p.selectedMemeID-1]+1;
            });

            var maxScore = -1;
            for (var i1 = 0; i1 < pscores.length; i1++){
                rooms[roomid].player[i1].numPlayerVotes = pscores[i1];

                if (pscores[i1] > maxScore) {
                    rooms[roomid].winnerID = [i1];
                    maxScore = pscores[i1];
                } else if (pscores[i1]==maxScore) {
                    rooms[roomid].winnerID.push(i1);
                }
            }
            for (var i2 = 0; i2 < rooms[roomid].player.length; i2++) {
                if (!rooms[roomid].winnerID.includes(i2)) rooms[roomid].loserID.push(i2);
            }

            for (var i = 0; i < rooms[roomid].winnerID.length; i++) {
                rooms[roomid].player[rooms[roomid].winnerID[i]].points = rooms[roomid].player[rooms[roomid].winnerID[i]].points +1;
                rooms[roomid].winnerID[i] = rooms[roomid].winnerID[i]+1;
            }
            for (var i = 0; i < rooms[roomid].loserID.length; i++) {
                rooms[roomid].loserID[i] = rooms[roomid].loserID[i]+1;
            }

            io.to(roomid).emit('winner chosen');
        }
    });

    socket.on('get results', function(roomid, cb){
        if (rooms[roomid]==null)return;
        cb&&cb(rooms[roomid].player, rooms[roomid].winnerID, rooms[roomid].loserID);
    });

    socket.on('get number of selected memes', function(roomid, cb) {
      if (rooms[roomid]==null)return;
      var n = 0;
      rooms[roomid].player.forEach(function(p) {
        if (p.selectedMemeID!=-1)n++;
      });
      cb&&cb(n, rooms[roomid].player.length);
    });

    socket.on('ready for next round', function(roomid, id) {
        if (rooms[roomid]==null)return;
        rooms[roomid].player[id-1].nextRound = true;

        var n = 0;
        rooms[roomid].player.forEach(function(p) {
            if (p.nextRound)n++;
        });
        socket.broadcast.to(roomid).emit("player ready next round", n, rooms[roomid].player.length);

        if (allReadyNextRound(roomid)) {
            io.to(roomid).emit('start next round');
            resetRound(roomid);
        }
    });

    socket.on('get number ready for next round', function(roomid, cb) {
       if (rooms[roomid]==null)return;
       var c = 0;
        for (var i = 0; i < rooms[roomid].player.length; i++) {
            if (rooms[roomid].player[i].nextRound)c++;
        }
        cb&&cb(c, rooms[roomid].player.length);
    });

    socket.on('get meme id', function(roomid, cb) {
      if (rooms[roomid]==null)return;
      cb&&cb(rooms[roomid].memeid);
    });

    socket.on('get category', function(roomid, cb) {
      if (rooms[roomid]==null)return;
      cb&&cb(rooms[roomid].category);
    });

    function resetRound(roomid) {
        for (var i = 0; i < rooms[roomid].player.length; i++) {
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

    function setNewMeme(roomid) {
      var c = -1;
      var t = parseInt(Math.random()*numMemes);
      for (var i = 0; i < rooms[roomid].prevMemeid.length; i++) {
        if (rooms[roomid].prevMemeid[i] != t) {
          t = parseInt(Math.random()*numMemes);
          c = t;
        }
      }
      if (c==-1) {
        rooms[roomid].prevMemeid = [];
        c = parseInt(Math.random()*numMemes);
      }
      rooms[roomid].prevMemeid.push(c);
      rooms[roomid].memeid = c;
    }

    function setRandomCategory(roomid) {
      var c = "";
      var t = parseInt(Math.random()*memeCategories.length);
      for (var i = 0; i < rooms[roomid].prevCategories.length; i++) {
        if (rooms[roomid].prevCategories[i] != t) {
          t = parseInt(Math.random()*memeCategories.length);
          c = memeCategories[t];
        }
      }
      if (c=="") {
        rooms[roomid].prevCategories = [];
        t = parseInt(Math.random()*memeCategories.length);
        c = memeCategories[t];
      }
      rooms[roomid].prevCategories.push(t);
      rooms[roomid].category = c;
    }

    function resetRoom(roomid) {
      for (var i = 0; i < rooms[roomid].player.length; i++) {
        rooms[roomid].player[i].points = 0;
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

    socket.on('get players', function(roomid, cb) {
        if (rooms[roomid]==null) return;
        cb&&cb(rooms[roomid].player);
        return;
    });

    socket.on('start game', function(roomid) {
        if (rooms[roomid]==null)return;
        if (rooms[roomid].player.length < 3) return;
        if (rooms[roomid].startingGame) return;
        rooms[roomid].startingGame = true;
        rooms[roomid].endingGame = false;
        rooms[roomid].gamestart = true;
        resetRoom(roomid);

        io.to(roomid).emit('game start');
    });

    socket.on('join room', function(roomid, name, callback){
     if (rooms[roomid]==null) {
         callback&&callback("null", 0);
         return;
     }
     if (rooms[roomid].gamestart) {
         callback&&callback("started", 0);
         return;
     }
     if (rooms[roomid].player.length > 30) {
         callback&&callback("full", 0);
         return;
     }

     var numPlayers = rooms[roomid].player.length+1;
     socket.join(roomid);
     rooms[roomid].addPlayer(new Player(name, numPlayers, roomid));
     callback&&callback("success", numPlayers);
     io.to(roomid).emit("update players");
    });

    socket.on('create room', function(roomid, name, callback) {

     if (rooms[roomid]!=null) {
         callback&&callback("taken");
         return;
     }

     var ro = new Room(roomid);
     ro.addPlayer(new Player(name, 1, roomid));
     rooms[roomid] = ro;
     socket.join(roomid);
     callback && callback("success");
    });

    socket.on('delete player', function(roomid, id, callback) {
     if (rooms[roomid]==null) return;
     var pl = rooms[roomid].player.slice();
      if (pl.length ==1) {
       delete rooms[roomid];
       callback && callback();
       return;
     }

     for (var i = id; i < pl.length; i++) {
         rooms[roomid].player[i-1].name = pl[i].name;
         rooms[roomid].player[i-1].id = pl[i].id-1;
         rooms[roomid].player[i-1].points = pl[i].points;
     }
     rooms[roomid].player.splice(pl.length-1, 1);
     io.to(roomid).emit('player leave', rooms[roomid].gamestart, id);
     callback && callback();
    });

    socket.on('end game', function(roomid) {
       if (rooms[roomid]==null)return;
       if(rooms[roomid].endingGame)return;
       rooms[roomid].endGame = true;
       rooms[roomid].gamestart = false;
       rooms[roomid].startingGame = false;
       io.to(roomid).emit('game ended');
    });


    socket.on('change player name', function(roomid, id, n) {
        if (rooms[roomid]==null) return;
        rooms[roomid].player[id-1].name = n;
        io.to(roomid).emit("update players");
    });

    socket.on('get room option', function(roomid, cb) {
        if (rooms[roomid]==null)return;
        cb&&cb(rooms[roomid].playWithTopic);
    });

    socket.on('update game option', function(roomid, p) {
        if (rooms[roomid]==null)return;
        rooms[roomid].playWithTopic = p;
        io.to(roomid).emit('update game option', p);
    });


    socket.on('display rooms', function(callback) {
        var c = 0;
        for (var i in rooms) {
            console.log("*******");
            console.log(i);
            c++;
        }
        console.log("*******");
        console.log("Total Number of Rooms: " +c);
        callback&&callback(rooms);
        return;
    });
});

http.listen(8000, function(){
    console.log('listening on *:8000');
});
