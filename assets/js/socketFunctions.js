
const  MAKING_MEME = 0;
const VOTING_MEME = 1;
const RESULTS = 2;
var isLeaving = false;

socket.on('get room id', function(cb){
    cb&&cb(roomID);
});

window.onpagehide = function() {
    if (!isLeaving) socket.emit('delete player', roomID, nameID);
};

function leave(e) {
    e.preventDefault();
    socket.emit('delete player', roomID, nameID, function() {
        isLeaving = true;
        location.reload();
    });
}

function endGame(e) {
    e.preventDefault();
    socket.emit('end game', roomID);
}

$("#end-game-button").unbind().on("click tap", endGame);
$("#leave-game-button").unbind().on('click tap', leave);

socket.on('game ended', function() {
    backToWaitingRoom(function() {
      displayPrevScore = true;
      displayWaitingRoom();
    });
});

socket.on('display current view', function(gamestart, gamestate) {
    if (!gamestart) {
        //go to main menu
        backToWaitingRoom(function() {
            displayPrevScore=true;
            displayWaitingRoom();
        });
    } else {
        if (gamestate == MAKING_MEME) {
            if (gstate == resultsDisplay) {
                //display making meme
                gstate = makingMeme;
                updateScoreboard();
                loadRandomMemeImage();
                socket.emit('get category', roomID, function(cat){
                    $('#screen').fadeOut(400, function() {
                        document.getElementById("category").innerText = cat;
                        $('#votingForMeme, #resultsDisplay, #bubbleAnimation').css('display', 'none');
                        $('#makingMeme').css('display','block');
                        $('#screen').fadeIn(400);
                    });
                });
            } else if (gstate == waitingForMeme) {
                //refresh waiting display
                $('#screen').fadeOut(400, function() {
                    $('#makingMeme, #resultsDisplay, #bubbleAnimation').css('display','none');
                    $('#votingForMeme').css('display','block');

                    document.getElementById("playerFinishedMeme").src = canvasURL;
                    $('#votingMemeTitle').text("Waiting for players...");

                    $('#chooseMemeButton').css('background-color', 'white');
                    $("#chooseMemeButton").text("Select Meme");
                    document.getElementById("votingMemes").innerHTML = "";
                    $('#chooseMemeButton').css('display','none');
                    displayPlayerMemes();
                    $('#screen').fadeIn(400);
                });
            }
        } else if (gamestate== VOTING_MEME) {
            //display voting display
            $('#screen').fadeOut(400, function() {
                $('#makingMeme, #resultsDisplay, #bubbleAnimation').css('display','none');
                $('#votingForMeme').css('display','block');

                document.getElementById("playerFinishedMeme").src = canvasURL;
                $('#votingMemeTitle').text("Waiting for players...");

                $('#chooseMemeButton').css('background-color', 'white');
                $("#chooseMemeButton").text("Select Meme");
                document.getElementById("votingMemes").innerHTML = "";
                $('#chooseMemeButton').css('display','none');
                displayPlayerMemes();
                $('#screen').fadeIn(400);
            });
        } else if (gamestate == RESULTS) {
            //display results display
            $('#screen').fadeOut(400, function(){
                $('#makingMeme, #votingForMeme, #bubbleAnimation').css('display','none');
                $('#resultsDisplay').css('display','block');

                displayResults();
                $('#screen').fadeIn(400);
            });
        }
    }
});

var resetting = false;
socket.on('player leave', function(gamestart, id) {
    if (gamestart && !resetting) {
        //playing
        if (nameID > id) nameID--;
        resetting = true;

        backToWaitingRoom(function() {
            $('#playerLeaveNotification').fadeIn(1500, function() {
                socket.emit('end game', roomID);
            }).fadeOut(400, function() {
                resetting = false;
                displayPrevScore=true;
                displayWaitingRoom();
            });
        });

    } else {
        //waiting
        if (id==nameID) {
            isLeaving = true;
            location.reload();
        } else {
            if (nameID > id) nameID--;
            socket.emit("get players", roomID, function(p){
                displayPlayersInWaiting(p);
            });
        }
    }
});
