
var bubbleMaxSize = 100;
var bubbleMinSize = 20;

var bubbleInterval = setInterval(makeBubbles,2000);

$(window).on("blur focus", function(e) {
    var prevType = $(this).data("prevType");

    if (prevType != e.type) {
        switch (e.type) {
            case "blur":
                clearInterval(bubbleInterval);
                break;
            case "focus":
                if ($('#bubbleAnimation').css('display')=='block') {
                  $('#bubbleAnimation').fadeOut(400, function() {
                      document.getElementById("bubbleAnimation").innerHTML = "";
                      bubbleInterval = setInterval(makeBubbles, 2000);
                      $('#bubbleAnimation').fadeIn(400);
                  });
                }
                break;
        }
    }

    $(this).data("prevType", e.type);
});

function makeBubbles() {
    for (var i = 0; i < parseInt(Math.random()*3+1); i++) {
        var bubble = document.createElement("IMG");
        bubble.src = "../assets/img/memes/" + memeImages[parseInt(Math.random() * memeImages.length)];
        var ss = (parseInt(Math.random() * (bubbleMaxSize - bubbleMinSize) + bubbleMinSize));
        bubble.style.width = ss + "px";
        bubble.style.height = ss + "px";
        bubble.style.left = (parseInt(Math.random() * (60) + 20)) + "%";
        bubble.style.bottom = "-100px";

        bubble.style.animationDuration = parseInt(Math.random()*20+10) + "s";

        bubble.classList.add("bubble");
        bubble.addEventListener("webkitAnimationEnd", function () {
            document.getElementById("bubbleAnimation").removeChild(this);
        });
        bubble.addEventListener("animationend", function () {
            document.getElementById("bubbleAnimation").removeChild(this);
        });

        document.getElementById("bubbleAnimation").appendChild(bubble);
    }
}
