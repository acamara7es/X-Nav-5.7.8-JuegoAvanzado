// Original game from:
// http://www.lostdecadegames.com/how-to-make-a-simple-html5-canvas-game/
// Slight modifications by Gregorio Robles <grex@gsyc.urjc.es>
// to meet the criteria of a canvas class for DAT @ Univ. Rey Juan Carlos

//Declaramos aquí las variables para que sean globales.
var canvas, ctx;
var direccionFijada;
var imgArray, stoneArray, monsterArray;
var killed, saved_state;
var then, princessesCaught;

const BG = 0; // Background image ID
const HERO = 1; // HERO image ID
const PRINCESS = 2; // princess image ID

// Muestra un aviso emergente con el resumen de la partida
// y un botón para reiniciar el juego.
function gameOver() {
    alert("      Juego terminado\n\n\n" +
        "Has salvado " + princessesCaught +
        " princesas.\nPulsa Ok para volver a jugar");
    killed = true;
    reload()
}

// Comprueba si han matado al héroe.
function heroKilled() {
    for (i in monsterArray) {
        var monster = monsterArray[i];
        if (seSolapan(generateCoor(imgArray[HERO]),
                completaCuadrado(imgArray[HERO]),
                generateCoor(imgArray[monster]),
                completaCuadrado(imgArray[monster]))) {
            return true;
        }
    }
    return false;
}

function moveHeroe(modifier) {
    if (38 in keysDown && imgArray[HERO].y > 32) { // Player holding up
        imgArray[HERO].y -= imgArray[HERO].speed * modifier;
        if (!puedeAvanzar(HERO, 3)) {
            imgArray[HERO].y = prevPos.y;
        }
    }
    if (40 in keysDown && imgArray[HERO].y < canvas.height - 64) { // Player holding down
        imgArray[HERO].y += imgArray[HERO].speed * modifier;
        if (!puedeAvanzar(HERO, 1)) {
            imgArray[HERO].y = prevPos.y;
        }
    }
    if (37 in keysDown && imgArray[HERO].x > 32) { // Player holding left
        imgArray[HERO].x -= imgArray[HERO].speed * modifier;
        if (!puedeAvanzar(HERO, 2)) {
            imgArray[HERO].x = prevPos.x;
        }
    }
    if (39 in keysDown && imgArray[HERO].x < canvas.width - 64) { // Player holding right
        imgArray[HERO].x += imgArray[HERO].speed * modifier;
        if (!puedeAvanzar(HERO, 4)) {
            imgArray[HERO].x = prevPos.x;
        }
    }
}

function moveMonsters(modifier) {
    if (direccionFijada == 0) {
        for (i in monsterArray) {
            imgArray[monsterArray[i]].move = Math.floor(Math.random() * 4);
        }
    }
    direccionFijada = (direccionFijada + 1) % 20;
    for (i in monsterArray) {
        var monster = imgArray[monsterArray[i]];
        var oldPos = generateCoor(monster);
        if (monster.move == 1 && monster.y > 32) { // moving up
            monster.y -= monster.speed * modifier;
            if (!puedeAvanzar(monsterArray[i], 3)) {
                monster.y = oldPos.y;
            }
        }
        if (monster.move == 0 && monster.y < canvas.height - 64) { // Player holding down
            monster.y += monster.speed * modifier;
            if (!puedeAvanzar(monsterArray[i], 1)) {
                monster.y = oldPos.y;
            }
        }
        if (monster.move == 2 && monster.x > 32) { // Player holding left
            monster.x -= monster.speed * modifier;
            if (!puedeAvanzar(monsterArray[i], 2)) {
                monster.x = oldPos.x;
            }
        }
        if (monster.move == 3 && monster.x < canvas.width - 64) { // Player holding right
            monster.x += monster.speed * modifier;
            if (!puedeAvanzar(monsterArray[i], 4)) {
                monster.x = oldPos.x;
            }
        }
    }
}

function puedeAvanzar(moving, side) {
    var a1 = generateCoor(imgArray[moving]);
    var a2 = completaCuadrado(imgArray[moving]);
    for (i in stoneArray) {
        var b1 = generateCoor(imgArray[stoneArray[i]]);
        var b2 = completaCuadrado(imgArray[stoneArray[i]]);
        if (seSolapan(a1, a2, b1, b2)) {
            return false;
        }
    }
    return true;
}

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function(e) {
    keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function(e) {
    delete keysDown[e.keyCode];
}, false);

// Reset the game when the player catches a princess
var reset = function() {
    for (i in imgArray) {
        if (i == HERO) {
            imgArray[HERO].x = canvas.width / 2 - 16;
            imgArray[HERO].y = canvas.height / 2 - 16;
        } else if (i > HERO) {
            var count = 0;
            while (count < imgArray.length - 2) {
                var pos = generatePosition(imgArray[i]);
                imgArray[i].x = pos.x;
                imgArray[i].y = pos.y;
                for (var j = 1; j < i; j++) {
                    if (!seSolapan(generateCoor(imgArray[i]),
                            completaCuadrado(imgArray[i]),
                            generateCoor(imgArray[j]),
                            completaCuadrado(imgArray[j]))) {
                        count++;
                    } else {
                        count = 0;
                    }
                }
            }
        }
    }
};

// Update game objects
var update = function(modifier) {
    moveHeroe(modifier);
    moveMonsters(modifier);
    if (heroKilled()) {
        gameOver();
    }
    // Are they touching?
    if (imgArray[HERO].x <= (imgArray[PRINCESS].x + 16) &&
        imgArray[PRINCESS].x <= (imgArray[HERO].x + 16) &&
        imgArray[HERO].y <= (imgArray[PRINCESS].y + 16) &&
        imgArray[PRINCESS].y <= (imgArray[HERO].y + 32)
    ) {
        ++princessesCaught;
        if (princessesCaught % 3 == 2) {
            addStone();
            for (i in monsterArray) {
                imgArray[monsterArray[i]].speed *= 1.3;
            }
        }
        if (princessesCaught % 6 == 5) {
            addMonster();
        }
        reset();
    }
};

// Draw everything
function render() {
    for (i in imgArray) {
        if (imgArray[i].ready) {
            ctx.drawImage(imgArray[i].imagen, imgArray[i].x, imgArray[i].y);
        }
    }
    // Score
    ctx.fillStyle = "rgb(250, 250, 250)";
    ctx.font = "24px Helvetica";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("Princesses caught: " + princessesCaught, 32, 32);
};
//Almacena la posición anterior del héroe por si choca con algo restaurarla.
var prevPos = {};

// The main game loop
var main = function() {
    if (!killed) {
        var now = Date.now();
        var delta = now - then;
        update(delta / 1000);
        prevPos.x = imgArray[HERO].x;
        prevPos.y = imgArray[HERO].y;
        render();
        then = now;
    }
};

function game() {
    // Create the canvas
    canvas = document.createElement("canvas");
    ctx = canvas.getContext("2d");
    canvas.width = 512;
    canvas.height = 480;
    document.getElementById("cvs").appendChild(canvas);
    direccionFijada = 0;
    imgArray = [];
    stoneArray = [];
    monsterArray = [];
    killed = false;
    saved_state = false;

    // Background image
    imgArray[BG] = generateImage("images/background.png");
    generateAlarm(BG);

    // HERO image
    imgArray[HERO] = generateImage("images/hero.png")
    generateAlarm(HERO);

    // princess image
    imgArray[PRINCESS] = generateImage("images/princess.png")
    generateAlarm(PRINCESS);

    // Game objects
    imgArray[HERO].speed = 256; // movement in pixels per second
    princessesCaught = 0;

    if (localStorage.getItem("load_saved_state") != null) {
        saved_state = convertToBool(localStorage.getItem("load_saved_state"));
        localStorage.setItem("load_saved_state", false);
    }
    if (saved_state) {
        load_state();
		saved_state = false;
    } else {
        reset();
    }
    then = Date.now();
    //The setInterval() method will wait a specified number of milliseconds, and then execute a specified function, and it will continue to execute the function, once at every given time-interval.
    //Syntax: setInterval("javascript function",milliseconds);
    setInterval(main, 1); // Execute as fast as possible
}
game();
