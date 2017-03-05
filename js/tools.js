function addStone() {
	var index = imgArray.push(generateImage("images/stone.png")) - 1;
	stoneIdArray.push(index);
	generateAlarm(index);
}

function addMonster() {
	var index = imgArray.push(generateImage("images/monster.png")) - 1;
	monsterIdArray.push(index);
	imgArray[index].speed = 64;
	generateAlarm(index);
}

function canMove(obj) {
	if (!isInGame(obj)) {
		return false;
	}
	for (var stone in stoneIdArray) {
		if (seSolapan(obj, imgArray[stoneIdArray[stone]])) {
			return false;
		}
	}
	return true;
}

function completeSquare(obj) {
	var point = {
		"x": obj.pos.x + obj.imagen.width,
		"y": obj.pos.y + obj.imagen.height
	};
	return point;
}

function convertToBool(str) {
	if (str === "true") {
		return true;
	} else {
		return false;
	}
}

// Muestra un aviso emergente con el resumen de la partida
// y un botón para reiniciar el juego.
function gameOver() {
	alert("      Juego terminado\n\n\n" +
		"Has salvado " + princessesCaught +
		" princesas.\nPulsa Ok para volver a jugar");
	killed = true;
	reload();
}

function generateAlarm(index) {
	imgArray[index].imagen.onload = function() {
		imgArray[index].ready = true;
	};
}

function generateImage(src) {
	var img = {
		"ready": false,
		"imagen": new Image(),
		"pos": {
			"x": 0,
			"y": 0
		}
	};
	img.imagen.src = src;
	return img;
}

function generatePosition(obj) {
	var width = 32;
	var height = 32;
	if (obj.imagen.width !== 0) {
		width = obj.imagen.width;
	}
	if (obj.imagen.height !== 0) {
		height = obj.imagen.height;
	}
	obj.pos.x = Math.floor(32 + (Math.random() * (canvas.width - 64 - width)));
	obj.pos.y = Math.floor(32 + (Math.random() * (canvas.height - 64 - height)));
}

function getTypeOfItem(obj) {
	var src = obj.imagen.src;
	return src.split("/")[4].split(".")[0];
}

// Comprueba si han matado al héroe.
function isHeroKilled() {
	for (var i in monsterIdArray) {
		var monster = imgArray[monsterIdArray[i]];
		if (seSolapan(imgArray[HERO], monster)) {
			return true;
		}
	}
	return false;
}

function isInGame(obj) {
	if (obj.pos.y < canvas.height - 64 && obj.pos.y > 32 &&
		obj.pos.x < canvas.width - 64 && obj.pos.x > 32) {
		return true;
	} else {
		return false;
	}
}

function printScore(ctx, n) {
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Princesses caught: " + n, 32, 32);
}


function seSolapan(obj_a, obj_b) {
	var a1 = obj_a.pos;
	var a2 = completeSquare(obj_a);
	var b1 = obj_b.pos;
	var b2 = completeSquare(obj_b);
	if (((b1.y > a2.y) || (b2.y < a1.y)) || ((b1.x > a2.x) || (b2.x < a1.x))) {
		return false;
	} else {
		return true;
	}
}
