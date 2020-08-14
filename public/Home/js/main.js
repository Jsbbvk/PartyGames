var cards = [
  {
    title: "Spyfall",
    img: "fa-user-secret",
    description: "Players must work together to find a spy amongst themselves.",
    players: "3",
    time: "5 mins",
    link: "https://spyfall.cf",
  },
  {
    title: "Outcast",
    img: "fa-hiking",
    description:
      "Players must find a player who is an outcast. Similar to Spyfall.",
    players: "3",
    time: "5 mins",
    link: "https://outcasted.cf",
  },
  {
    title: "Cardsforus",
    img: "fa-clone",
    description:
      "An unofficial fan project of the popular card game, <b>Cards Against Humanity</b>.",
    players: "3",
    time: "endless",
    link: "https://cardsforus.cf",
  },
  {
    title: "Caption This",
    img: "fa-grin-squint-tears",
    description:
      "Players compete with each other to create the funniest caption to a meme.",
    players: "3",
    time: "endless",
    link: "https://captionthis.cf",
  },
  {
    title: "Fakeout",
    img: "fa-theater-masks",
    description:
      "An unofficial fan project of the popular Jackbox Party Game, <b>Fibbage</b>.",
    players: "3",
    time: "endless",
    link: "https://fakeout.cf",
  },
  {
    title: "Matchpoint",
    img: "fa-user-friends",
    description:
      "An unofficial fan project of the popular Jackbox Party Game, <b>Quiplash</b>.",
    players: "3",
    time: "endless",
    link: "https://matchpoint.cf",
  },
];

function loadCards() {
  document.getElementById("game-list").innerHTML = "";
  cards.forEach(function (d, i) {
    var ch = document.createElement("DIV");
    ch.classList.add("col-6", "card-holder");

    var c = document.createElement("DIV");
    c.classList.add("card");

    var ct = document.createElement("H6");
    ct.classList.add("card-title", "mt-2");
    ct.innerText = d.title;
    c.appendChild(ct);

    var cimg = document.createElement("DIV");
    cimg.classList.add("card-image");
    var cIcon = document.createElement("I");
    cIcon.classList.add("fas", d.img);
    cimg.appendChild(cIcon);
    c.appendChild(cimg);

    var cdes = document.createElement("P");
    cdes.classList.add("card-description", "mt-2");
    cdes.innerHTML = d.description;
    c.appendChild(cdes);

    var cpl = document.createElement("P");
    cpl.classList.add("card-players");
    cpl.innerText = "> " + d.players + " ";
    var cplIcon = document.createElement("I");
    cplIcon.classList.add("fas", "fa-user-alt");
    cpl.appendChild(cplIcon);
    c.appendChild(cpl);

    var ct = document.createElement("P");
    ct.classList.add("card-time");
    ct.innerText = d.time + " ";
    var ctIcon = document.createElement("I");
    ctIcon.classList.add("fas", "fa-clock");
    ct.appendChild(ctIcon);
    c.appendChild(ct);

    ch.appendChild(c);
    document.getElementById("game-list").appendChild(ch);

    c.addEventListener("mousedown", function () {
      window.open(d.link, "_self");
    });
  });
}

loadCards();
