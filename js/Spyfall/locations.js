
var movieLocation = [
    {
        location: "Pandora",
        reference: "Avatar",
        roles: [
            "Military Soldier", 'Scientist', "Na'vi", "Trooper", "Pilot", "Miner",
            "Avatar Soldier", "Gunner", "Technician", "Avatar Chief"
        ]
    },
    {
        location: "The Matrix",
        reference: "Matrix",
        roles: [
            "Neo", "Morpheus", "Agent Smith", "Oracle", "The Architect",
            "Agent Jones", "Keymaker", "Seraph", "Trinity", "Cypher"
        ]
    },
    {
        location: "Ancient Temple",
        reference: "Indiana Jones",
        roles: [
            "Indiana Jones", "Cannibal", "Treasure Hunter", "Guide",
            "Archaeologist", "Mercenary", "Explorer", "Navigator", "Native", 'Pilot'
        ]
    },
    {
        location: "Middle Earth",
        reference: "Lord of the Rings",
        roles: [
            "Hobbit", "Ogre", "Cave Troll", "Wizard", "Elf King", "Dwarf",
            "Nazgûl", "Steward of Gondor", "King of Rohan", "Sauron"
        ]
    },
    {
        location: "Winterfell",
        reference: "Game of Thrones",
        roles: [
            "Bran Stark", "Northern Soldier", "Daenerys Targaryen", "Jon Snow", "Arya Stark",
            "Lord Varys", "White Walker", "Night King", "Tyrion Lannister", "Sansa Stark"
        ]
    },
    {
        location: "Continental Hotel",
        reference: "John Wick",
        roles: [
            "John Wick", "Assassin", "Hitman", "Arms Dealer", "Hotel Manager", "Viggo Tarasov",
            "Sofia", "Winston", "Bowery King", "Thug"
        ]
    },
    {
        location: "New York City",
        reference: "Avengers",
        roles:[
            "Iron Man", "Thor", "Thanos", "Ant Man", "Captain America", "Hulk",
            "Spiderman", "Nick Fury", "Draxx", "Peter Quill"
        ]
    },
    {
        location: "Paradise Falls",
        reference: "UP",
        roles: [
            "Russell", "Dug", "Carl Fredrickson", "Ellie Fredrickson", "Kevin",
            "Beta", "Gamma", "Alpha", "Charles Muntz", "Boy Scout"
        ]
    },
    {
        location: "Death Star",
        reference:"Star Wars",
        roles:[
            "Storm Trooper", "Darth Vader", "Emperor Palpatine", "Luke Skywalker",
            "Obi Wan Kenobi", "Leia", "Han Solo", "R2D2", "C3PO", "Boba Fett"
        ]
    },
    {
        location: "Hogwarts",
        reference: "Harry Potter",
        roles: [
            "Harry Potter", "Voldemort", "Snape", "Dumbledore", "Ronald Weasley",
            "Hermione Granger", "Sirius Black", "Hagrid", "Draco Malfoy", "Bellatrix Lestrange"
        ]
    },
    {
        location: "Jurassic Park",
        reference: "Jurassic Park",
        roles:[
            "T-Rex", "Spinosaurus", "Triceratops", "Raptor", "Stegosaurus", "Dinosaur Trainer",
            "Tourist", "Park Ranger", "Tour Guide", "Shop Owner"
        ]
    },
    {
        location: "Gotham City",
        reference: "Batman",
        roles:[
            "I'm Batman", "Joker", "Two Face", "Thug", "Harley Quinn", "Police Officer",
            "Bane", "Catwoman", "Robin", "Riddler"
        ]
    },
    {
        location: "Pride Lands",
        reference: "Lion King",
        roles:[
            "Simba", "Scar", "Mufasa", "Pumbaa", "Timon", "Nala", "Nazu", "Hyena",
            "Elephant", "Rafiki"
        ]
    },
    {
        location: "Titanic",
        reference: "Titanic",
        roles:[
            "Dishwasher", "Tourist", "First Class Passenger", "Cook", "Janitor",
            "Captain", "Iceberg", "Seaman", "Crewman", "Drowning Man"
        ]
    },
    {
        location: "Sydney Harbor",
        reference: "Finding Nemo",
        roles:[
            "Marlin", "Dory", "Nemo", "Squirt", "Seagull", "Gill", "Mr. Ray", "Destiny",
            "Gerald", "Darla"
        ]
    },
    {
        location: "Boxing Ring",
        reference: "Rocky",
        roles: [
            "Announcer", "Referee", "Rocky", "Apollo", "TV Commentator", "Interviewer",
            "Camera Man", "Underdog Boxer", "Gambler", "Spectator"
        ]
    },
    {
        location: "Los Angeles",
        reference: "Fast and Furious",
        roles:[
            "Gangster", "Hobbs", "Shaw", "Dominic Toretto", "Brian O'Conner", "Homeless Man",
            "Street Racer", "Mr. Nobody", "DJ", "Weapons Technician"
        ]
    },
    {
        location: "Amity Island",
        reference: "Jaws",
        roles:[
            "Shark", "Surfer", "Tourist", "Fisherman", "Unsuspecting Swimmer", "Sailor", "Scuba Diver",
            "Marine Biologist", "That BIG Shark", "Mayor"
        ]
    },
    {
        location: "Lou's Tavern",
        reference: "Fight Club",
        roles:[
            "Bartender", "Inspector", "Police Officer", "Bodyguard", "Detective", "Salesman",
            "Tyler", "Marla", "Fighter", "Boss"
        ]
    },
    {
        location: "Agrabah",
        reference: "Aladdin",
        roles:[
            "Genie", "Jasmine", "Aladdin", "Jafar", "Sultan", "Guard", "Magic Carpet",
            "Iago", "Abu", "Rajah"
        ]
    }

];


var generalLocation = [
    {
        location: "School",
        roles: ["Teacher", "Principal", "Lunch Lady",
            "Club President", "Class President", "Janitor", "Nurse",
            "Class Photographer", "Counselor", "Student"]
    },
    {
        location: "Tropical Island",
        roles: ["Coconut Farmer", "Truck Driver", "Surfer", "Shop Owner", "Tourist",
        "Tour Guide", "Smuggler", "Shark", "Turtle", "Boat Owner"]
    },
    {
        location: "Circus",
        roles: ["Juggler", "Fire Breather", "Acrobat", "Pickpocket", "Child", "Vendor",
        "Ring Master", "Clown", "Lion Tamer", "Weight Lifter"]
    },
    {
        location: "Prison",
        roles:["Guard", "Cook", "Warden", "Janitor", "Convict", "Security", "Visitor",
        "Gangster", "FBI Agent", "Nurse"]
    },
    {
        location: "Beach",
        roles:["Child", "Thief", "Police Officer", "Surfer", "Tourist"
        , "Shop Owner", "Street Vendor", "Boat Owner", "Shark", "Ice Cream Man"]
    },
    {
        location: "Bar",
        roles: ["Drunk Person", "Bartender", "Customer", "Undercover Cop", "Thug",
        "Bouncer", "Drug Dealer", "Singer", "Entertainer"]
    },
    {
      location: "Cargo Ship",
      roles: ["Pirate", "Mechanic", "Captain", "Navigator", "Crewman", "Cook", "Engineer",
              "Radioman", "Smuggler", "Worker"]
    },
    {
      location:"Airplane",
      roles:["First Class Passenger", "Pilot", "Flight Attendant", "Crying Baby",
            "Old Man", "Air Marshall", "Businessman", "Smuggler", "FBI Agent", "Passenger"]
    },
    {
      location: "Hotel",
      roles: ["Maid", "Manager", "Janitor", "Receptionist", "Room Service", "Bellboy", "Businessman", "Tourist"
            , "Cook", "Valet"]
    },
    {
      location: "Construction Site",
      roles: ["Welder", "Manager", "Bulldozer Driver", "Crane Operator", "Civilian"
            , "Electrician", "Worker", "Architect", "Engineer", "Truck Driver"]
    },
    {
      location: "Gas Station",
      roles: ["Biker", "Cyclist", "Cashier", "Customer", "Homeless Man", "Truck Driver",
            "Police Officer", "Drug Dealer", "Stray Dog", "Taxi Driver"]
    },
    {
      location: "Cloud",
      roles:["Care Bear", "Bird","Rainbow", "Carl Fredrickson", "Sun", "Zeus",
            "Superman", "Lightning", "Balloon", "Mary Poppins"]
    },
    {
      location: "Atlantis",
      roles:["Atlantean", "Aquaman", "Poseidon", "Mermaid", "Neptune", "Council Member",
            "Plankton", "Mermaid Man", "Scuba Diver", "Shark"]
    },
    {
      location: "Rainforest",
      roles:["Lemur Mort", "Jaguar", "Indiana Jones", "Native", "Cannibal", "Dora the Explorer",
            "Monkey", "Mosquito", "King Julien", "Skeleton"]
    },
    {
      location: "Suburb",
      roles:["Homeowner", "Real Estate Agent", "Dog", "Police Officer", "Parent",
            "Mayor", "City Council Member", "Garbage Truck Driver", "Gardener", "Drug Dealer"]
    },
    {
      location: "Space Station",
      roles:["Doctor", "Alien", "Astronaut", "Researcher", "Electrician", "Scientist",
            "Radioman", "Asteroid", "Engineer", "Pilot"]
    },
    {
      location: "Library",
      roles:["Bookworm", "Librarian", "Teenager", "Parent", "Child", "Mayor",
            "College Student", "Janitor", "Counselor", "Chess Tutor", "Tutor"]
    },
    {
      location: "Mariana Trench",
      roles:["Kraken", "Godzilla", "Megalodon", "Leviathan", "Jaws", "Moby Dick", "Sea Serpent",
            "Goblin Shark", "Angular Fish", "Gulper Eel", "Vampire Squid", "Dumbo Octopus"]
    },
    {
      location: "Train",
      roles:["Passenger", "Engineer", "Conductor", "Businessman", "First Class Passenger", "Stowaway", "Service Attendant",
            "Trainman", "Brakeman", "Crew Member"]
    },
    {
      location: "National Park",
      roles:["Park Ranger", "Tourist", "Hiker", "Camper", "Maintenance Worker",
            "Equipment Operator", "First Aid Personnel", "Vehicle Operator", "Park Guide", "Utility Operator"]
    },
    {
      location: "Ski Resort",
      roles:["Skier", "Lift Operator", "Ski Instructor", "Lodger", "First Aid Personnel", "Equipment Mechanic",
            "Ski Patroller", "Food Vendor", "Manager", "Snowboarder"]
    },
    {
      location: "Music Festival",
      roles:["Pop Star", "Dancer", "Audio Technician", "DJ", "Teenager", "Bartender",
            "Backup Singer", "Security", "Supervisor", "Limousine Driver"]
    }
];

module.exports = {
  getRandomRoles : function(m, t, l, numPlayers) {
    var a = shuffle(l.roles);
    if (m=="traditional") {
        a[parseInt(Math.random()*numPlayers)] = "Spy";
    } else if (m=="leader") {
        var sIdx = parseInt(Math.random()*numPlayers);
        var mIdx = 0;
        do {
            mIdx = parseInt(Math.random()*numPlayers);
        } while(mIdx == sIdx);
        a[sIdx] = "Spy";
        a[mIdx] = "Leader";
    }
    return a;
  },
  getRandomLocation: function(t, pL, callback) {
    var a;
    switch(t) {
        case "general":
            a = generalLocation.slice();
            break;
        case "movie":
            a = movieLocation.slice();
            break;
    }
    if (pL==null || !Array.isArray(pL)) {
      callback && callback(a[parseInt(Math.random()*a.length)]);
      return;
    }

    for (var j = 0; j < a.length; j++) {
      if (pL.indexOf(a[j].location) != -1 && Math.random() < 0.86) {
        a.splice(j, 1);
        j--;
      }
    }
    var s = "";
    for (var j = 0; j < a.length; j++) {
      s += a[j].location + " ";
    }
    callback && callback(a[parseInt(Math.random()*a.length)]);

    return;
  }
};


function shuffle(a) {
    var b = a.slice();
    for (var i = 0; i < b.length; i++) {
        var c = b[i];
        var randIdx = parseInt(Math.random()*b.length);
        b[i] = b[randIdx];
        b[randIdx] = c;
    }
    return b;
}



function containsAllElements(a1, a2) {
    for (var i = 0; i < a1.length; i++) {
        if (!a2.includes(a1[i]))return false;
    }
    return true;
}

function getLocationInfo(theme, name) {
    switch(theme) {
        case "general":
            return generalLocation[getIndexOfLocation(generalLocation, name)];
        case "movie":
            return movieLocation[getIndexOfLocation(movieLocation, name)];
    }
}

function getIndexOfLocation(arr, name) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].location == name) {
            return i;
        }
    }
    return -1;
}


Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};
