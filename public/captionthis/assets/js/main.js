var menuActive = false;
$("#toggleMenuButton").on("click", function (e) {
  e.preventDefault();
  menuActive = !menuActive;
  if (menuActive) {
    $("#menu").removeClass("mSlideUp");
    $("#menu").addClass("mSlideDown");
    document.getElementById("toggleMenuButton").innerHTML =
      '<i class="fas fa-caret-up"></i>';
    $(this).css("top", "-7%");
  } else {
    $("#menu").removeClass("mSlideDown");
    $("#menu").addClass("mSlideUp");
    document.getElementById("toggleMenuButton").innerHTML =
      '<i class="fas fa-caret-down"></i>';
    $(this).css("top", "100%");
  }
});

function updateScoreboard() {
  socket.emit("get players", roomID, function (pl) {
    var s = "";
    for (let i in pl) {
      let p = pl[i];
      s +=
        '<div class="row">' +
        '<div class="col-6"><h5>' +
        p.name +
        (p.id == nameID ? " (You)" : "") +
        "</h5></div>" +
        '<div class="col-6" id=\'sb-' +
        p.id +
        "'><h5>" +
        p.points +
        "</h5></div>" +
        "</div>";
    }
    document.getElementById("scoreboard").innerHTML = s;
  });
}

var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
var h = Math.max(
  document.documentElement.clientHeight,
  window.innerHeight || 0
);

var isMobile = false;
if (
  /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(
    navigator.userAgent
  ) ||
  /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
    navigator.userAgent.substr(0, 4)
  )
) {
  isMobile = true;
}

var canvas = new fabric.Canvas("meme_image");

$(document).on("mousedown touchstart", function (e) {
  if (
    !$(e.target).hasClass("upper-canvas") &&
    !$(e.target).hasClass("lower-canvas") &&
    !$(e.target).hasClass("canvas-container")
  ) {
    canvas.discardActiveObject().renderAll();
  }
});

if (!isMobile) {
  canvas.setWidth(500);
  canvas.setHeight(500);
} else {
  canvas.setWidth(300);
  canvas.setHeight(300);
}

canvas.calcOffset();

canvas.on("object:selected", function (o) {
  var activeObj = o.target;
  activeObj.set({ borderColor: "blue", cornerColor: "blue" });
  console.log(canvas.getObjects().indexOf(activeObj));
});

function trimWords(str) {
  let trimmedCaption = "";
  let words = str.split(" ");
  let sentenceLength = 0;

  let wWords = [...words];
  let longestLength = Math.max(...wWords.map((el) => el.length));

  const maxTrimLength = Math.max(isMobile ? 15 : 20, longestLength);

  for (let i in words) {
    let word = words[i];
    let nextWord = i == words.length - 1 ? "" : words[parseInt(i) + 1];
    sentenceLength += word.length;

    if (i != words.length - 1 && sentenceLength >= maxTrimLength) {
      sentenceLength = 0;
      trimmedCaption += word + "\n";
      continue;
    }
    if (sentenceLength < maxTrimLength) {
      if (nextWord.length + sentenceLength >= maxTrimLength) {
        trimmedCaption += word + "\n";
        sentenceLength = 0;
        continue;
      }
      trimmedCaption += word;
      trimmedCaption += " ";
      sentenceLength++;
      continue;
    }
    trimmedCaption += word;
  }
  return trimmedCaption;
}

function addText() {
  if ($("#captioninput").val() == "") return;

  let caption = $("#captioninput").val();
  canvas.add(
    new fabric.IText(trimWords(caption), {
      fontFamily: "Arial",
      stroke: "#d8d8d8",
      strokeWidth: isMobile ? 1 : 1.25,
      fontWeight: "bold",
      left: isMobile ? 50 : 100,
      top: isMobile ? 50 : 100,
      fontSize: isMobile ? 25 : 40,
      width: 100,
    })
  );
  $("#captioninput").val("");
}

function resetCanvas() {
  turnOffBubbles();
  canvas.clear();
  loadSelectedMemeImage();
}

//TODO upload the files to a server and server them from there

var selectedMemeImage;
var memeImageOptions = [];
function loadRandomMemeImage() {
  turnOffBubbles();
  $("#makingMemeCanvas").css("display", "none");
  $("#makingMemeOptions").css("display", "block");
  $("#memeImageOptions").html("");
  socket.emit("get meme id", roomID, function (id) {
    memeImageOptions = [...id];
    loadMemeImageOptions();
  });
}

function loadMemeImageOptions() {
  turnOffBubbles();
  $("#makingMemeCanvas").css("display", "none");
  $("#makingMemeOptions").css("display", "block");
  $("#memeImageOptions").html("");
  selectedMemeImage = -1;
  for (let imgId of memeImageOptions) {
    var d1 = document.createElement("DIV");
    d1.classList.add("my-5");

    var img = document.createElement("IMG");
    img.setAttribute("id", "fMemeOption" + imgId);
    img.setAttribute("memeId", imgId);
    img.classList.add("img-fluid");
    img.classList.add("memeImageOption");
    img.classList.add("chooseableMemeOption");
    img.src = "/memes/" + imgId + ".jpg";

    d1.appendChild(img);
    document.getElementById("memeImageOptions").appendChild(d1);
  }

  setSelectableMemeOptions();

  $("#chooseMemeOptionButton").off();
  $("#chooseMemeOptionButton").on("click tap", function (e) {
    e.preventDefault();
    if (selectedMemeImage == -1) return;
    $("#chooseMemeOptionButton").off();
    $(".memeImageOption").off();

    $("#makingMemeOptions").fadeOut(400, function () {
      loadSelectedMemeImage();
      $("#makingMemeCanvas").fadeIn(400);
    });
  });
  $("#chooseMemeOptionButton").fadeIn(400);
}

function setSelectableMemeOptions() {
  $(".memeImageOption").on("click tap", function (e) {
    e.preventDefault();

    if (!$(this).hasClass("selectedMemeOption")) {
      $(".memeImageOption").each(function (i, obj) {
        obj.classList.remove("selectedMemeOption");
      });

      $(this).addClass("selectedMemeOption");
      selectedMemeImage = $(this).attr("memeId");

      $("#chooseMemeOptionButton").css("background-color", "#bdffbd");
      $("#chooseMemeOptionButton").text("Confirm");
    } else {
      $(this).removeClass("selectedMemeOption");

      $("#chooseMemeOptionButton").css("background-color", "white");
      $("#chooseMemeOptionButton").text("Select Template");

      selectedMemeImage = -1;
    }
  });
}

function loadSelectedMemeImage() {
  turnOffBubbles();
  fabric.Image.fromURL("/memes/" + selectedMemeImage + ".jpg", function (oImg) {
    oImg.set({
      left: isMobile ? 2 : 5,
      top: isMobile ? 2 : 5,
      scaleY: canvas.height / (oImg.height + 20),
      scaleX: canvas.width / (oImg.width + 20),
      selectable: false,
    });
    oImg.setCoords();
    canvas.clear();
    canvas.add(oImg);
  });
}

function displayMakingMeme() {
  gstate = makingMeme;
  votedForMeme = false;
  selectedMemeID = -1;
  turnOffBubbles();
  updateScoreboard();
  loadRandomMemeImage();
  $("#votingForMeme, #resultsDisplay").css("display", "none");
  $("#makingMemeCanvas").css("display", "none");
  $("#makingMemeOptions").css("display", "block");

  document.getElementById("votingMemes").innerHTML = "";

  if (!playWithTopic) $("#categoryText").css("display", "none");
  socket.emit("get category", roomID, function (cat) {
    document.getElementById("category").innerText = cat;

    $("#makingMeme").fadeIn(800);
  });
}

var gstate = 1;
const makingMeme = 1;
const waitingForMeme = 2;
const votingMeme = 3;
const resultsDisplay = 4;

function startRound() {
  displayMakingMeme();
}

var canvasURL = "";
function sendMemeImage() {
  canvasURL = document.getElementById("meme_image").toDataURL();
  makingMemeToPlayerMemes();
  socket.emit("send finished meme", roomID, nameID, canvasURL);
}

function makingMemeToPlayerMemes() {
  $("#makingMeme").fadeOut(800, function () {
    canvas.clear();

    document.getElementById("playerFinishedMeme").src = canvasURL;
    $("#votingMemeTitle").text("Waiting for players...");

    $("#chooseMemeButton").css("background-color", "white");
    $("#chooseMemeButton").text("Select Meme");
    document.getElementById("votingMemes").innerHTML = "";
    $("#chooseMemeButton").css("display", "none");

    displayPlayerMemes();
    $("#votingForMeme").fadeIn(800);
  });
}

function shuffle(arr) {
  for (var i = 0; i < arr.length; i++) {
    var t = arr[i];
    var n = parseInt(Math.random() * arr.length);
    arr[i] = arr[n];
    arr[n] = t;
  }
}

var votedForMeme = false;
function displayPlayerMemes() {
  clearInterval(bubbleInterval);

  gstate = waitingForMeme;
  socket.emit("get players", roomID, function (players) {
    var pfinish = true;

    var pl = [];
    for (let i in players) {
      pl.push(players[i]);
    }
    shuffle(pl);
    document.getElementById("votingMemes").innerHTML = "";
    pl.forEach(function (p) {
      if (p.id != nameID) {
        var d1 = document.createElement("DIV");
        d1.classList.add("my-5");

        var img = document.createElement("IMG");
        img.setAttribute("id", "fMeme" + p.id);
        img.setAttribute("memeId", p.id);
        img.classList.add("img-fluid");
        img.classList.add("memeImage");
        img.classList.add("chooseableMeme");
        if (p.imgurl != "") {
          img.src = p.imgurl;
        } else pfinish = false;

        d1.appendChild(img);

        document.getElementById("votingMemes").appendChild(d1);
      } else {
        document
          .getElementById("playerFinishedMeme")
          .setAttribute("memeId", p.id);
      }
    });

    if (pfinish) {
      $("#votingMemeTitle").fadeOut(400, function () {
        $("#votingMemeTitle").text("Vote for the best meme");
        $("#votingMemeTitle").fadeIn(400);
      });
      setupUserSelectMeme();
    }
  });

  socket.removeAllListeners("playerAddedMeme");
  socket.removeAllListeners("displayVotingOption");

  socket.on("playerAddedMeme", function (p) {
    $("#fMeme" + p.id).fadeOut(800, function () {
      document.getElementById("fMeme" + p.id).src = p.imgurl;
      $("#fMeme" + p.id).fadeIn(800);
    });
  });

  socket.on("displayVotingOption", function () {
    $("#votingMemeTitle").fadeOut(400, function () {
      $("#chooseMemeButton").css("background-color", "white");
      $("#chooseMemeButton").text("Select Meme");
      $("#votingMemeTitle").text("Vote for the best meme");
      $("#votingMemeTitle").fadeIn(400);

      setupUserSelectMeme();
    });
  });
}

var selectedMemeID = -1;
function setupUserSelectMeme() {
  gstate = votingMeme;
  socket.removeAllListeners("displayVotingOption");
  socket.removeAllListeners("playerAddedMeme");

  if (votedForMeme) {
    socket.emit("get number of selected memes", roomID, function (n, t) {
      $("#chooseMemeButton").css("background-color", "#0fc61f");
      $("#chooseMemeButton").text("Ready " + n + "/" + t);
      $("#fMeme" + selectedMemeID).addClass("selectedMeme");
      $("#chooseMemeButton").fadeIn(400);
    });
  } else {
    $("#chooseMemeButton").off();
    $("#chooseMemeButton").on("click tap", function (e) {
      e.preventDefault();
      if (selectedMemeID == -1) return;
      $("#chooseMemeButton").off();
      $(".memeImage").off();
      votedForMeme = true;
      socket.emit("selected best meme", roomID, nameID, selectedMemeID);

      socket.on("player selected meme", function (n, t) {
        $("#chooseMemeButton").css("background-color", "#0fc61f");
        $("#chooseMemeButton").text("Ready " + n + "/" + t);
      });

      socket.emit("get number of selected memes", roomID, function (n, t) {
        $("#chooseMemeButton").css("background-color", "#0fc61f");
        $("#chooseMemeButton").text("Ready " + n + "/" + t);
      });

      socket.on("winner chosen", function () {
        $("#votingForMeme").fadeOut(800, function () {
          socket.removeAllListeners("player selected meme");
          readyNextRound = false;
          displayResults();
          votedForMeme = false;
        });
      });
    });
    $("#chooseMemeButton").fadeIn(400);
    $(".memeImage").on("click tap", function (e) {
      e.preventDefault();
      if ($(this).attr("id") == "playerFinishedMeme") return;

      if (!$(this).hasClass("selectedMeme")) {
        $(".memeImage").each(function (i, obj) {
          obj.classList.remove("selectedMeme");
        });

        $(this).addClass("selectedMeme");
        selectedMemeID = $(this).attr("memeId");

        $("#chooseMemeButton").css("background-color", "#bdffbd");
        $("#chooseMemeButton").text("Confirm");
      } else {
        $(this).removeClass("selectedMeme");

        $("#chooseMemeButton").css("background-color", "white");
        $("#chooseMemeButton").text("Select Meme");

        selectedMemeID = -1;
      }
    });
  }
}

var readyNextRound = false;
function displayResults() {
  gstate = resultsDisplay;
  socket.emit("get results", roomID, function (pl, w, l) {
    document.getElementById("resultsMemes").innerHTML = "";

    w.forEach(function (id) {
      var p = pl[id];

      var d1 = document.createElement("DIV");
      d1.classList.add("my-5");
      var n = document.createElement("H2");
      n.innerText = p.name + (nameID == id ? " (You)" : "");
      d1.appendChild(n);

      var fpContainer = document.createElement("DIV");
      fpContainer.classList.add("flip-container");

      var fp = document.createElement("DIV");
      fp.classList.add("flipper");

      var fr = document.createElement("DIV");
      fr.classList.add("front");

      var img = document.createElement("IMG");
      img.classList.add("img-fluid");
      img.classList.add("memeImageResult");
      img.classList.add("memeWinner");
      img.src = p.imgurl;
      fr.appendChild(img);

      var bc = document.createElement("DIV");
      bc.classList.add("back");

      var vts = document.createElement("H1");
      vts.classList.add("text-center");
      vts.innerText = "Votes: " + p.numPlayerVotes;
      bc.appendChild(vts);

      fp.appendChild(fr);
      fp.appendChild(bc);

      fpContainer.appendChild(fp);
      d1.appendChild(fpContainer);
      document.getElementById("resultsMemes").appendChild(d1);
    });

    l.forEach(function (id) {
      var p = pl[id];

      var d1 = document.createElement("DIV");
      d1.classList.add("my-5");
      var n = document.createElement("H2");
      n.innerText = p.name + (nameID == id ? " (You)" : "");
      d1.appendChild(n);

      var fpContainer = document.createElement("DIV");
      fpContainer.classList.add("flip-container");

      var fp = document.createElement("DIV");
      fp.classList.add("flipper");

      var fr = document.createElement("DIV");
      fr.classList.add("front");

      var img = document.createElement("IMG");
      img.classList.add("img-fluid");
      img.classList.add("memeImageResult");
      img.src = p.imgurl;
      fr.appendChild(img);

      var bc = document.createElement("DIV");
      bc.classList.add("back");

      var vts = document.createElement("H1");
      vts.classList.add("text-center");
      vts.innerText = "Votes: " + p.numPlayerVotes;
      bc.appendChild(vts);

      fp.appendChild(fr);
      fp.appendChild(bc);

      fpContainer.appendChild(fp);
      d1.appendChild(fpContainer);
      document.getElementById("resultsMemes").appendChild(d1);
    });

    $(".flip-container").on("click tap", function () {
      $(this).toggleClass("flip");
    });

    $("#resultsDisplay").fadeIn(800);

    if (readyNextRound) {
      socket.emit("get number ready for next round", roomID, function (n, t) {
        $("#nextRoundButton").css("background-color", "#0fc61f");
        $("#nextRoundButton").text("Ready " + (n == 0 ? t : n) + "/" + t);
        $("#nextRoundButton").fadeIn(800);
      });
    } else {
      $("#nextRoundButton").css("background-color", "#bdffbd");
      $("#nextRoundButton").text("Next Round");

      $("#nextRoundButton").off();
      $("#nextRoundButton").on("click tap", function (e) {
        e.preventDefault();
        $("#nextRoundButton").off();
        readyNextRound = true;
        socket.emit("ready for next round", roomID, nameID);

        socket.on("player ready next round", function (n, t) {
          $("#nextRoundButton").css("background-color", "#0fc61f");
          $("#nextRoundButton").text("Ready " + n + "/" + t);
        });

        socket.emit("get number ready for next round", roomID, function (n, t) {
          $("#nextRoundButton").css("background-color", "#0fc61f");
          $("#nextRoundButton").text("Ready " + (n == 0 ? t : n) + "/" + t);
        });

        socket.on("start next round", function () {
          resetAll();
          fadeInto("", displayMakingMeme);
        });
      });
      $("#nextRoundButton").fadeIn(800);
    }
  });
}

function resetAll() {
  socket.removeAllListeners("player ready next round");
  socket.removeAllListeners("start next round");
  socket.removeAllListeners("displayVotingOption");
  socket.removeAllListeners("playerAddedMeme");
  socket.removeAllListeners("player selected meme");

  selectedMemeID = -1;
}

function fadeInto(id, cb) {
  $("#playing").fadeOut(400, function () {
    $("#makingMeme").css("display", "none");
    $("#votingForMeme").css("display", "none");
    $("#resultsDisplay").css("display", "none");

    $("#playing").fadeIn(400, function () {
      if (id == "making") {
        $("#makingMeme").fadeIn(400, cb);
      } else if (id == "voting") {
        $("#votingForMeme").fadeIn(400, cb);
      } else if (id == "results") {
        $("#resultsDisplay").fadeIn(400, cb);
      } else {
        cb && cb();
      }
    });
  });
}
