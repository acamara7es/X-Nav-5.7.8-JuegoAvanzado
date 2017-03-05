var save_button = document.getElementById("save_button");
save_button.addEventListener("click", function(e) {
	localStorage.setItem("saved_princess", princessesCaught);
	localStorage.setItem("items", JSON.stringify(imgArray));
	localStorage.setItem("stones", JSON.stringify(stoneIdArray));
	localStorage.setItem("monster", JSON.stringify(monsterIdArray));
	localStorage.setItem("killed", killed);
	setVisibility(delete_button, true);
	setVisibility(load_button, true);
});

var load_button = document.getElementById("load_button");
setVisibility(load_button, localStorage.length !== 0);
load_button.addEventListener("click", function(e) {
	localStorage.setItem("load_saved_state", true);
	reload();
});

var delete_button = document.getElementById("delete_button");
setVisibility(delete_button, localStorage.length !== 0);
delete_button.addEventListener("click", function(e) {
	localStorage.clear();
	setVisibility(delete_button, false);
	setVisibility(load_button, false);
});

function load_state() {
	if (localStorage.getItem("saved_princess") !== null) {
		princessesCaught = localStorage.getItem("saved_princess");
	}
	if (localStorage.getItem("items") !== null) {
		var items = JSON.parse(localStorage.getItem("items"));
		var stones = [];
		var monsters = [];
		if (localStorage.getItem("stones") !== null) {
			stoneIdArray = [];
			stones = JSON.parse(localStorage.getItem("stones"));
		}
		if (localStorage.getItem("monster") !== null) {
			monsterIdArray = [];
			monsters = JSON.parse(localStorage.getItem("monster"));
		}
		imgArray[HERO].speed = items[HERO].speed;
		for (var i = 0; i < items.length; i++) {
			if (i in stones) {
				addStone();
			}
			if (i in monsters) {
				addMonster();
				imgArray[i].speed = items[i].speed;
			}
			imgArray[i].pos = items[i].pos;
		}
	}
	if (localStorage.getItem("killed") !== null) {
		killed = convertToBool(localStorage.getItem("killed"));
	}
}

function reload() {
	var div_cvs = document.getElementById("cvs");
	div_cvs.innerHTML = "";
	keysDown = {};
	game();
}

function setVisibility(button, visible) {
	if (visible) {
		button.classList.remove("invisible");
		button.classList.add("visible");
	} else {
		button.classList.remove("visible");
		button.classList.add("invisible");
	}
}
