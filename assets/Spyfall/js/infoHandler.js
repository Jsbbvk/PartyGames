
var infoVisible = true;

$("#info-container").dblclick(function(e) {
  e.preventDefault();
    hideInfo();
    document.getElementById("info-help-pc").innerText = (infoVisible)?"Space to hide":"Space to show";
});


var lastTap = 0;
$("#info-container").on("touchend", function(e) {
    var currentTime = new Date().getTime();
    var tapLength = currentTime - lastTap;

    e.preventDefault();
    lastTap = currentTime;
    if(tapLength < 500 && tapLength > 0){
        //Double Tap/Click
        hideInfo();
    }
});


function spaceDown(e) {
    if (e.code != "Space") return;
    e.preventDefault();
    hideInfo();
    document.getElementById("info-help-pc").innerText = (infoVisible)?"Space to hide":"Space to show";
}

function hideInfo() {
    infoVisible = !infoVisible;

    document.getElementById("spy-roleS").innerText = (infoVisible)?"Your role: ":"Hidden";
    document.getElementById("spy-role").innerText = (infoVisible)?spyRole:"";
    if (spyRole != "Spy" && spyRole!="Leader") document.getElementById("spy-location").innerHTML =
        (infoVisible)?"Location: <b>"+spyLocation+"</b>": "";
    if (mode=="leader" && spyRole != "Spy" && spyRole!="Leader") document.getElementById("spy-leader").innerHTML = (infoVisible)?"Leader: <b>"+spyLeader+"</b>":"";
    if (theme=="movie" && spyRole != "Spy" && spyRole!="Leader") document.getElementById("spy-M-ref").innerHTML = (infoVisible)?"Movie: <b>"+getReferenceFromMovie(spyLocation)+"</b>":"";
    document.getElementById("info-container").style.opacity = (infoVisible)?"1":"0.5";
    document.getElementById("info-help").innerText = (infoVisible)?"Double click to hide":"Double click to show";
}

function toggleInfo(state) {
    if (state=="hidden") {
        infoVisible = false;
        document.getElementById("spy-roleS").innerText = (infoVisible)?"Your role: ":"Hidden";
        document.getElementById("spy-role").innerText = (infoVisible)?spyRole:"";
        if (spyRole != "Spy" && spyRole!="Leader") document.getElementById("spy-location").innerHTML =
            (infoVisible)?"Location: <b>"+spyLocation+"</b>": "";
        if (mode=="leader") document.getElementById("spy-leader").innerHTML = "";
        if (mode=="movie") document.getElementById("spy-leader").innerHTML = "";
        document.getElementById("info-container").style.opacity = (infoVisible)?"1":"0.5";
        document.getElementById("info-help").innerText = (infoVisible)?"Double click to hide":"Double click to show";
    } else if (state=="visible") {
        infoVisible = true;
        document.getElementById("spy-roleS").innerText = (infoVisible)?"Your role: ":"Hidden";
        document.getElementById("spy-role").innerText = (infoVisible)?spyRole:"";
        if (spyRole != "Spy" && spyRole!="Leader") document.getElementById("spy-location").innerHTML =
            (infoVisible)?"Location: <b>"+spyLocation+"</b>": "";
        if (mode=="leader" && spyRole != "Spy" && spyRole!="Leader") document.getElementById("spy-leader").innerHTML = "Leader: <b>"+spyLeader+"</b>";
        if (theme=="movie" && spyRole != "Spy" && spyRole!="Leader") document.getElementById("spy-M-ref").innerHTML = (infoVisible)?"Movie: <b>"+getReferenceFromMovie(spyLocation)+"</b>":"";
        document.getElementById("info-container").style.opacity = (infoVisible)?"1":"0.5";
        document.getElementById("info-help").innerText = (infoVisible)?"Double click to hide":"Double click to show";
    }
}
