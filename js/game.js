// Original game from:
// http://www.lostdecadegames.com/how-to-make-a-simple-html5-canvas-game/
// Slight modifications by Gregorio Robles <grex@gsyc.urjc.es>
// to meet the criteria of a canvas class for DAT @ Univ. Rey Juan Carlos

var direccionFijada;
var imgArray, stoneIdArray, monsterIdArray;
var killed, saved_state;
var then, princessesCaught;

var BG = 0; // Background image ID
var HERO = 1; // Hero image ID
var PRINCESS = 2; // Princess image ID

function moveHeroe(modifier) {
	var hero = imgArray[HERO];
	if (38 in keysDown) { // Player holding up
		hero.pos.y -= hero.speed * modifier;
	}
	if (40 in keysDown) { // Player holding down
		hero.pos.y += hero.speed * modifier;
	}
	if (37 in keysDown) { // Player holding left
		hero.pos.x -= hero.speed * modifier;
	}
	if (39 in keysDown) { // Player holding right
		hero.pos.x += hero.speed * modifier;
	}
	if (!canMove(hero)) {
		hero.pos.x = prevPos.x;
		hero.pos.y = prevPos.y;
	}
}

function moveMonsters(modifier) {
	for (var i in monsterIdArray) {
		var monster = imgArray[monsterIdArray[i]];
		if (direccionFijada === 0) {
			monster.move = Math.floor(Math.random() * 4);
		}
		var oldPos = {};
		oldPos.x = monster.pos.x;
		oldPos.y = monster.pos.y;
		if (monster.move === 0) { // monster go down
			monster.pos.y += monster.speed * modifier;
		}
		if (monster.move === 1) { // monster go up
			monster.pos.y -= monster.speed * modifier;
		}
		if (monster.move === 2) { // monster go left
			monster.pos.x -= monster.speed * modifier;
		}
		if (monster.move === 3) { // monster go right
			monster.pos.x += monster.speed * modifier;
		}
		if (!canMove(monster)) {
			monster.pos.x = oldPos.x;
			monster.pos.y = oldPos.y;
		}
	}
	direccionFijada = (direccionFijada + 1) % 30;
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
	for (var i in imgArray) {
		if (i == HERO) {
			imgArray[HERO].pos.x = canvas.width / 2 - 16;
			imgArray[HERO].pos.y = canvas.height / 2 - 16;
		} else if (i > HERO) {
			var count = 0;
			while (count < imgArray.length - 2) {
				generatePosition(imgArray[i]);
				for (var j = 1; j < i; j++) {
					if (!seSolapan(imgArray[i], imgArray[j])) {
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
	if (isHeroKilled()) {
		gameOver();
	}
	// Are they touching?
	if (seSolapan(imgArray[HERO], imgArray[PRINCESS])) {
		++princessesCaught;
		if (princessesCaught % 3 == 2) {
			addStone();
			for (var i in monsterIdArray) {
				imgArray[monsterIdArray[i]].speed *= 1.3;
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
	for (var i in imgArray) {
		if (imgArray[i].ready) {
			ctx.drawImage(imgArray[i].imagen, imgArray[i].pos.x, imgArray[i].pos.y);
		}
	}
	// Score
	printScore(ctx, princessesCaught);
}
//Almacena la posición anterior del héroe por si choca con algo restaurarla.
var prevPos = {};

// The main game loop
var main = function() {
	if (!killed) {
		var now = Date.now();
		var delta = now - then;
		update(delta / 1000);
		prevPos.x = imgArray[HERO].pos.x;
		prevPos.y = imgArray[HERO].pos.y;
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
	stoneIdArray = [];
	monsterIdArray = [];
	killed = false;
	saved_state = false;

	// Background image
	imgArray[BG] = generateImage("images/background.png");
	generateAlarm(BG);

	// HERO image
	imgArray[HERO] = generateImage("images/hero.png");
	generateAlarm(HERO);

	// princess image
	imgArray[PRINCESS] = generateImage("images/princess.png");
	generateAlarm(PRINCESS);

	// Game objects
	imgArray[HERO].speed = 256; // movement in pixels per second
	princessesCaught = 0;

	if (localStorage.getItem("load_saved_state") !== null) {
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
