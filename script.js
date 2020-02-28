//--------------//
//    CharGen   //
//--------------//

// Declare Vars
var charStats = {};
var currentCharStats = {};
var nameArray = ["Runa", "Rune", "Sven", "Jules", "Guy", "Dude", "Silas", "Maya", "Birgitta", "Betty", "Rembrandt", "Reed", "Ken", "Amber", "Anne", "Rime"]
var statArea = document.getElementById("stats");
var charArea = document.getElementById("char");
var attempts = 5;
var gradeScore;

// Buttons
var gameBtn = document.getElementById("button");
var genBtn = document.getElementById("generate");
genBtn.innerHTML = "Generate! (" + attempts + ")";
var contBtn = document.getElementById("continue");
contBtn.style.display = "none";

// Random Function
function random(seed) {
    return Math.floor(Math.random() * Math.floor(seed));
};

// Generate Character Stats
function generate() {
    // Generate max stats
    charStats.Name = nameArray[random(14)];
    charStats.Life = 25 + random(25);
    charStats.Stam = 25 + random(25);
    charStats.Will = 25 + random(25);
    // Generate current stats
    currentCharStats.Life = charStats.Life;
    currentCharStats.Stam = charStats.Stam;
    currentCharStats.Will = charStats.Will;
    // Gives the character a score depending on the stats.
    gradeScore = charStats.Life + charStats.Stam + charStats.Will;
    if (gradeScore >= 120) {
        charStats.Grade = "S+"
    } else if (gradeScore >= 115) {
        charStats.Grade = "S"
    } else if (gradeScore >= 105) {
        charStats.Grade = "a"
    } else if (gradeScore >= 95) {
        charStats.Grade = "B"
    } else if (gradeScore >= 75) {
        charStats.Grade = "C"
    } 
    // Refreshes stat window
    showStats();
    displayChar();
    // Unhides start button
    gameBtn.style.display = "block";
    // Generate attempts left and hide button when out of attempts
    if (attempts > 1) {
        attempts--;
        genBtn.innerHTML = "Generate! (" + attempts + ")";
    } else if (attempts === 1) {
        genBtn.style.display = "none";
    };
};

// Refreshes stats window
function showStats () {
    statArea.style.fontSize = ".8rem";
    statArea.style.lineHeight = "1.4rem";
    statArea.innerHTML = "Name: " + charStats.Name + 
    "<br> Life: " + currentCharStats.Life + "/" + charStats.Life +
    "<br> Stam: " + currentCharStats.Stam + "/"+ charStats.Stam + 
    "<br> Will: " + currentCharStats.Will + "/" + charStats.Will + 
    "<br> Grade: " + charStats.Grade + 
    "<br> Depth: " + depth + 
    "<br> Score: " + score;
};

// Portrait
function displayChar () {
    let picker = random(3);
    charArea.style.fontSize = "1.6rem"
    charArea.style.lineHeight = "2.2rem"
    if (picker === 1) {
        charArea.innerHTML = "()_()<br>(^_^)<br>(v v)<br>(*)(*)o";
    } else if (picker === 2) {
        charArea.innerHTML = "()__()<br>(~__~)<br>(U**U)<br>(*)(*)o";
    } else {
        charArea.innerHTML = "()_()<br>(o_o)<br>(v v)P<br>(*)(*)";
    } 
};

//--------------//
//   GameCode   //
//--------------//

var gameBoard = document.getElementById("board");
var gameOver = document.getElementById("gameover");
var steps;
var depth = 0;
var score = 0;

gameOver.style.fontSize = "1.2rem"
gameOver.style.lineHeight = "1.6rem"

function initGame() {
    
    genBtn.style.display = "none";
    gameBtn.style.display = "none";
    contBtn.style.display = "block";
    initRound();
}

function initRound () {
    steps = 4 + Math.floor(currentCharStats.Stam/7);
}

function clearBoard () {
   gameBoard.innerHTML = "";
}

function difficulty () {
    return (1 + random(depth))
}

function stepEvent () {
    let event = random(14);
    if ( event > 6 ) {
        // Nothing happens
        eventText("nothing");
    } else if ( event === 6 || event === 5 ) {
        // Normal battle
        let lifeDmg = difficulty();
        eventText("battle", lifeDmg);
        currentCharStats.Life = currentCharStats.Life - lifeDmg;
    } else if ( event === 4 || event === 3 ) {
        // Negative will effect
        let willDmg = difficulty();
        eventText("will", willDmg);
        currentCharStats.Will = currentCharStats.Will - willDmg;
    } else if ( event === 2 ) {
        // Rest 
        eventText("rest");
        if (currentCharStats.Life < charStats.Life) {
            currentCharStats.Life = currentCharStats.Life + Math.floor((charStats.Life - currentCharStats.Life) / difficulty());
        }
        if (currentCharStats.Stam < charStats.Stam) {
            currentCharStats.Stam = currentCharStats.Stam + Math.floor((charStats.Stam - currentCharStats.Stam) / difficulty());
        }
        if (currentCharStats.Will < charStats.Will) {
            currentCharStats.Will = currentCharStats.Will + Math.floor((charStats.Will- currentCharStats.Will) / difficulty());
        }
    } else if ( event === 1 ) {
        // Skillup Max
        eventText("skill");
        charStats.Life = charStats.Life + random(3);
        charStats.Stam = charStats.Stam + random(3);
        charStats.Will = charStats.Will + random(3);
    } else if ( event === 0 ) {
        // Boss
        let lifeDmg = difficulty() * 2;
        eventText("boss", lifeDmg);
        currentCharStats.Life = currentCharStats.Life - lifeDmg;
    }
} 

function gameLoop () {
    // Lower character grade results in a higher score
    score = Math.floor((depth * depth) * (1 + (150 - gradeScore)/100));
    showStats();
    if (currentCharStats.Life > 0 && currentCharStats.Stam > 0 && currentCharStats.Will > 0) {
        if (steps > 1) {
            steps--;
            stepEvent();
        } else if (steps === 1) {
            var par = document.createElement("p");
            var node = document.createTextNode("The caverns grow darker as the shadows encroach...");
            par.appendChild(node);
            gameBoard.appendChild(par);
            contBtn.innerHTML = "Push on further into the darkness...";
            steps--;
        } else if (steps === 0) {
            currentCharStats.Stam = currentCharStats.Stam - difficulty();
            depth++;
            contBtn.innerHTML = "Continue...";
            initRound();
            clearBoard();
            var par = document.createElement("p");
            var node = document.createTextNode("Down, down into the abyss they wander...");
            par.appendChild(node);
            gameBoard.appendChild(par);
        }
    } else if (currentCharStats.Life <= 0) {
        eventText("death");
        contBtn.style.display = "none";
    } else if (currentCharStats.Stam <= 0) {
        eventText("fatigue");
        contBtn.style.display = "none";
    } else if (currentCharStats.Will <= 0) {
        eventText("insanity");
        contBtn.style.display = "none";
    }
}

function eventText(text, value) {
    if (text === "nothing") {
        let ambient = random(4);
        var par = document.createElement("p");
        if (ambient === 3) {
        var node = document.createTextNode(charStats.Name + " strolls down the path at a good pace, nervously humming to themselves. Faint noises can be heard of creatures scuttling in the distance.");
        }
        if (ambient === 2) {
            var node = document.createTextNode("The soft packed dirt makes little noise as " + charStats.Name + " carefully tread down the path. Their watchful eyes gleaming in the darkness.");
        }
        if (ambient === 1) {
            var node = document.createTextNode("The road forks ahead, " + charStats.Name + " ponders a moment then walks down the left path, attracted by a soft breeze.");
        }
        if (ambient === 0) {
            var node = document.createTextNode("As " + charStats.Name + " turns a corner they hear a loud growl infront of them. They swiftly scuttle onto a sidepath.");
        }
        par.appendChild(node);
        gameBoard.appendChild(par);
    }
    if (text === "battle") {
        var par = document.createElement("p");
        var node = document.createTextNode("A tiny rabid creature ambushes " + charStats.Name + " from the shadows! It deals " + value + " damage.");
        par.appendChild(node);
        gameBoard.appendChild(par);
    }
    if (text === "will") {
        var par = document.createElement("p");
        var node = document.createTextNode("A large rock dislodges itself from the ceiling and falls to the floor with a loud smack! The ordeal greatly startles " + charStats.Name + " and deals " + value + " will-damage.");
        par.appendChild(node);
        gameBoard.appendChild(par);
    }
    if (text === "boss") {
        var par = document.createElement("p");
        var node = document.createTextNode("A large creature corners " + charStats.Name + "! It slashes with vicious looking claws, dealing " + value + " damage.");
        par.appendChild(node);
        gameBoard.appendChild(par);
    }
    if (text === "rest") {
        var par = document.createElement("p");
        var node = document.createTextNode(charStats.Name + " comes across a narrow outcropping, providing ample protection from predators and allowing a moments respite. " + charStats.Name + " recovers slightly from a peacful nap.");
        par.appendChild(node);
        gameBoard.appendChild(par);
    }
    if (text === "skill") {
        var par = document.createElement("p");
        var node = document.createTextNode(charStats.Name + " reflects on past experiences. Their attributes might have been increased slightly.");
        par.appendChild(node);
        gameBoard.appendChild(par);
    }
    if (text === "death") {
        clearBoard();
        gameOver.innerHTML = charStats.Name + " drew their last breath and succumbed to the darkness..." + 
        "<br><br>They reached level " + depth + " of the rabbithole." + 
        "<br><br>Their final score was: " + score + ".";
    }
    if (text === "fatigue") {
        clearBoard();
        gameOver.innerHTML = charStats.Name + " grew fatigued and turned back to their home..." + 
        "<br><br>They reached level " + depth + " of the rabbithole." + 
        "<br><br>Their final score was: " + score + ".";
    }

    if (text === "insanity") {
        clearBoard();
        gameOver.innerHTML = "insanity claimed " + charStats.Name + "..." + 
        "<br><br>They reached level " + depth + " of the rabbithole." + 
        "<br><br>Their final score was: " + score + ".";
    }
}