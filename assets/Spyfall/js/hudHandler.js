

function startTimer() {
    if(startTime==null || startTime==undefined) return;
    var date = new Date();
    var hour = date.getHours();
    var min = date.getMinutes();
    var sec = date.getSeconds();



    var secondsPassed = (hour-startTime.hour)*3600+(min-startTime.min)*60+(sec-startTime.sec);

    if (secondsPassed >= time*60) {

        document.getElementById("hud-time-text").innerText = "0:00";
        clearInterval(timerInterval);
	return;
    }

    var ss = parseInt(Math.floor(secondsPassed%60));
    var sss = (60 - ((ss==0)?60:ss));
    document.getElementById("hud-time-text").innerText = ""+parseInt(time - secondsPassed/60)
        + ":"+ ((sss<10)?"0"+sss:sss);
}

var timerInterval;
